import { auth } from "@/lib/auth";
import { order } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";
import type { Route } from "./+types/payment.refund";

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    // Admin-only: only authenticated users can initiate refunds
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, refundAmount, reason } = await request.json() as {
      orderId: string;       // our internal UUID
      refundAmount: number;
      reason?: string;
    };

    if (!orderId || !refundAmount || refundAmount <= 0) {
      return Response.json(
        { error: "orderId and a positive refundAmount are required" },
        { status: 400 },
      );
    }

    // ── Look up the order ──────────────────────────────────────────────────
    const [dbOrder] = await d1
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!dbOrder) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }
    if (dbOrder.paymentStatus !== "paid") {
      return Response.json(
        { error: "Only paid orders can be refunded" },
        { status: 400 },
      );
    }
    if (!dbOrder.cashfreeOrderId) {
      return Response.json(
        { error: "No Cashfree order ID on record" },
        { status: 400 },
      );
    }

    if (Number(refundAmount) > Number(dbOrder.totalAmount)) {
      return Response.json(
        { error: "Refund amount exceeds order total" },
        { status: 400 },
      );
    }

    // ── Submit refund to Cashfree ──────────────────────────────────────────
    const refundId = `rf_${dbOrder.cashfreeOrderId}_${Date.now()}`;

    const cfRes = await fetch(
      `${CF_BASE}/orders/${dbOrder.cashfreeOrderId}/refunds`,
      {
        method: "POST",
        headers: cfHeaders(),
        body: JSON.stringify({
          refund_amount: refundAmount,
          refund_id: refundId,
          ...(reason && { refund_note: reason }),
        }),
      },
    );

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error("Cashfree refund error:", cfData);
      return Response.json(
        { error: cfData.message || "Refund request failed" },
        { status: cfRes.status },
      );
    }

    // ── Mark order refunded ────────────────────────────────────────────────
    await d1
      .update(order)
      .set({ paymentStatus: "refunded", updatedAt: new Date().toISOString() })
      .where(eq(order.id, orderId));

    return Response.json({
      success: true,
      refundId,
      cfRefundId: cfData.cf_refund_id ?? null,
      status: cfData.refund_status ?? "PENDING",
    });
  } catch (error) {
    console.error("Refund error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
