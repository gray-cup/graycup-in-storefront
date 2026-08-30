import { order } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders, mapOrderStatus } from "@/lib/cashfree";
import { finalizeCouponUsage } from "@/lib/coupons";
import type { Route } from "./+types/payment.verify";

export async function loader({ request, context }: Route.LoaderArgs) {
  const d1 = getD1Db(context.get(cloudflareContext).env.DB);
  const cashfreeOrderId = new URL(request.url).searchParams.get("order_id");

  if (!cashfreeOrderId) {
    return Response.json({ error: "order_id is required" }, { status: 400 });
  }

  try {
    // ── 1. Fetch order status ──────────────────────────────────────────────
    const orderRes = await fetch(`${CF_BASE}/orders/${cashfreeOrderId}`, {
      headers: cfHeaders(),
      cache: "no-store",
    });
    const cfOrder = await orderRes.json();

    if (!orderRes.ok) {
      return Response.json(
        { error: cfOrder.message || "Failed to fetch order from Cashfree" },
        { status: 400 },
      );
    }

    const paymentStatus = mapOrderStatus(cfOrder.order_status);

    // ── 2. Fetch individual payments to get cf_payment_id ─────────────────
    // Only do this when the order is in a terminal paid state to avoid extra calls
    let cfPaymentId: string | null = null;

    if (paymentStatus === "paid") {
      const paymentsRes = await fetch(
        `${CF_BASE}/orders/${cashfreeOrderId}/payments`,
        { headers: cfHeaders(), cache: "no-store" },
      );
      if (paymentsRes.ok) {
        const payments: Array<{ cf_payment_id?: number | string; payment_status?: string }> =
          await paymentsRes.json();
        const successPayment = payments.find((p) => p.payment_status === "SUCCESS");
        cfPaymentId = successPayment?.cf_payment_id?.toString() ?? null;
      }
    }

    // ── 3. Guard against an amount mismatch before trusting "paid" ────────
    // Same check as the webhook: our totalAmount is server-derived, so if
    // Cashfree settled a different amount, hold for review instead of paid.
    let effectiveStatus: string = paymentStatus;
    let mismatchNote: string | undefined;
    if (paymentStatus === "paid") {
      const [existing] = await d1
        .select({ total: order.totalAmount })
        .from(order)
        .where(eq(order.cashfreeOrderId, cashfreeOrderId))
        .limit(1);
      const paidAmount = Number(cfOrder.order_amount);
      const expected = existing ? Number(existing.total) : NaN;
      if (
        existing &&
        !(Number.isFinite(paidAmount) && Math.abs(paidAmount - expected) <= 1)
      ) {
        console.error(
          `Payment verify amount mismatch for ${cashfreeOrderId}: paid ${paidAmount}, expected ${expected}`,
        );
        effectiveStatus = "review";
        mismatchNote = `AMOUNT MISMATCH: paid ${paidAmount}, expected ${expected}`;
      }
    }

    // ── 4. Update our order record ────────────────────────────────────────
    const [updated] = await d1
      .update(order)
      .set({
        paymentStatus: effectiveStatus,
        ...(cfPaymentId && { cashfreePaymentId: cfPaymentId }),
        ...(mismatchNote && { notes: mismatchNote }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(order.cashfreeOrderId, cashfreeOrderId))
      .returning();

    if (effectiveStatus === "paid") {
      await finalizeCouponUsage(d1, cashfreeOrderId);
    }

    return Response.json({
      status: effectiveStatus,
      orderId: updated?.id ?? null,
      cashfreeOrderId,
      amount: cfOrder.order_amount,
      customerName: updated?.customerName ?? null,
      customerEmail: updated?.customerEmail ?? null,
      addressSnapshot: updated?.addressSnapshot ?? null,
      itemCount: Array.isArray(updated?.items) ? (updated.items as unknown[]).length : null,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
