import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";

export async function POST(request: NextRequest) {
  try {
    // Admin-only: only authenticated users can initiate refunds
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, refundAmount, reason } = await request.json() as {
      orderId: string;       // our internal UUID
      refundAmount: number;
      reason?: string;
    };

    if (!orderId || !refundAmount || refundAmount <= 0) {
      return NextResponse.json(
        { error: "orderId and a positive refundAmount are required" },
        { status: 400 },
      );
    }

    // ── Look up the order ──────────────────────────────────────────────────
    const [dbOrder] = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);

    if (!dbOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (dbOrder.paymentStatus !== "paid") {
      return NextResponse.json(
        { error: "Only paid orders can be refunded" },
        { status: 400 },
      );
    }
    if (!dbOrder.cashfreeOrderId) {
      return NextResponse.json(
        { error: "No Cashfree order ID on record" },
        { status: 400 },
      );
    }

    if (Number(refundAmount) > Number(dbOrder.totalAmount)) {
      return NextResponse.json(
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
      return NextResponse.json(
        { error: cfData.message || "Refund request failed" },
        { status: cfRes.status },
      );
    }

    // ── Mark order refunded ────────────────────────────────────────────────
    await db
      .update(order)
      .set({ paymentStatus: "refunded", updatedAt: new Date() })
      .where(eq(order.id, orderId));

    return NextResponse.json({
      success: true,
      refundId,
      cfRefundId: cfData.cf_refund_id ?? null,
      status: cfData.refund_status ?? "PENDING",
    });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
