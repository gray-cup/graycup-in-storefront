import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders, mapOrderStatus } from "@/lib/cashfree";

export async function GET(request: NextRequest) {
  const cashfreeOrderId = new URL(request.url).searchParams.get("order_id");

  if (!cashfreeOrderId) {
    return NextResponse.json({ error: "order_id is required" }, { status: 400 });
  }

  try {
    // ── 1. Fetch order status ──────────────────────────────────────────────
    const orderRes = await fetch(`${CF_BASE}/orders/${cashfreeOrderId}`, {
      headers: cfHeaders(),
      cache: "no-store",
    });
    const cfOrder = await orderRes.json();

    if (!orderRes.ok) {
      return NextResponse.json(
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

    // ── 3. Update our order record ────────────────────────────────────────
    const [updated] = await db
      .update(order)
      .set({
        paymentStatus,
        ...(cfPaymentId && { cashfreePaymentId: cfPaymentId }),
        updatedAt: new Date(),
      })
      .where(eq(order.cashfreeOrderId, cashfreeOrderId))
      .returning();

    return NextResponse.json({
      status: paymentStatus,
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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
