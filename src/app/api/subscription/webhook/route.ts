import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { mapSubscriptionStatus } from "@/lib/cashfree";

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
        console.warn("Subscription webhook signature mismatch — rejecting");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.type ?? "";
    const subscriptionId: string | undefined =
      event.data?.subscription_details?.subscription_id;

    if (!subscriptionId) {
      return NextResponse.json({ received: true });
    }

    if (eventType === "SUBSCRIPTION_STATUS_CHANGED") {
      const cfStatus = event.data.subscription_details.subscription_status as string;
      await db
        .update(subscription)
        .set({ status: mapSubscriptionStatus(cfStatus), updatedAt: new Date() })
        .where(eq(subscription.subscriptionId, subscriptionId));
    } else if (eventType === "SUBSCRIPTION_PAYMENT_SUCCESS") {
      await db
        .update(subscription)
        .set({ status: "active", updatedAt: new Date() })
        .where(eq(subscription.subscriptionId, subscriptionId));
    } else if (eventType === "SUBSCRIPTION_PAYMENT_FAILED") {
      // Individual recurring charge failed — subscription itself may still be active,
      // status transitions (e.g. to ON_HOLD) arrive separately via SUBSCRIPTION_STATUS_CHANGED
      console.warn("Subscription payment failed:", subscriptionId);
    }

    // Always return 200 — prevents Cashfree from retrying indefinitely
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Subscription webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
