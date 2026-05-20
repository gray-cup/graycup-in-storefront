import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

// Cashfree webhook event types
const PAID_EVENTS = new Set(["PAYMENT_SUCCESS_WEBHOOK"]);
const FAILED_EVENTS = new Set(["PAYMENT_FAILED_WEBHOOK"]);
const DROPPED_EVENTS = new Set(["PAYMENT_USER_DROPPED_WEBHOOK"]);

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get("x-webhook-timestamp");
    const receivedSig = request.headers.get("x-webhook-signature");

    // Raw body must be used for signature — parsed body invalidates HMAC
    const rawBody = await request.text();

    // ── Verify signature ───────────────────────────────────────────────────
    if (timestamp && receivedSig && process.env.CASHFREE_CLIENT_SECRET) {
      const expectedSig = crypto
        .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
        .update(timestamp + rawBody)
        .digest("base64");

      if (expectedSig !== receivedSig) {
        console.warn("Webhook signature mismatch — rejecting");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.type ?? "";
    const cfOrderId: string | undefined = event.data?.order?.order_id;

    if (!cfOrderId) {
      return NextResponse.json({ received: true });
    }

    if (PAID_EVENTS.has(eventType)) {
      await db
        .update(order)
        .set({
          paymentStatus: "paid",
          cashfreePaymentId: event.data?.payment?.cf_payment_id?.toString() ?? null,
          updatedAt: new Date(),
        })
        .where(eq(order.cashfreeOrderId, cfOrderId));
    } else if (FAILED_EVENTS.has(eventType)) {
      await db
        .update(order)
        .set({ paymentStatus: "failed", updatedAt: new Date() })
        .where(eq(order.cashfreeOrderId, cfOrderId));
    } else if (DROPPED_EVENTS.has(eventType)) {
      // User abandoned — keep pending so they can retry without a new order
      await db
        .update(order)
        .set({ paymentStatus: "pending", updatedAt: new Date() })
        .where(eq(order.cashfreeOrderId, cfOrderId));
    }

    // Always return 200 — prevents Cashfree from retrying indefinitely
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
