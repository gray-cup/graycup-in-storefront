import { subscription } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { mapSubscriptionStatus } from "@/lib/cashfree";
import type { Route } from "./+types/subscription.webhook";

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    const timestamp = request.headers.get("x-webhook-timestamp");
    const receivedSig = request.headers.get("x-webhook-signature");

    // Raw body must be used for signature - parsed body invalidates HMAC
    const rawBody = await request.text();

    // ── Verify signature ───────────────────────────────────────────────────
    if (timestamp && receivedSig && process.env.CASHFREE_CLIENT_SECRET) {
      const expectedSig = crypto
        .createHmac("sha256", process.env.CASHFREE_CLIENT_SECRET)
        .update(timestamp + rawBody)
        .digest("base64");

      if (expectedSig !== receivedSig) {
        console.warn("Subscription webhook signature mismatch - rejecting");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.type ?? "";
    const subscriptionId: string | undefined =
      event.data?.subscription_details?.subscription_id;

    if (!subscriptionId) {
      return Response.json({ received: true });
    }

    if (eventType === "SUBSCRIPTION_STATUS_CHANGED") {
      const cfStatus = event.data.subscription_details.subscription_status as string;
      await d1
        .update(subscription)
        .set({ status: mapSubscriptionStatus(cfStatus), updatedAt: new Date().toISOString() })
        .where(eq(subscription.subscriptionId, subscriptionId));
    } else if (eventType === "SUBSCRIPTION_PAYMENT_SUCCESS") {
      await d1
        .update(subscription)
        .set({ status: "active", updatedAt: new Date().toISOString() })
        .where(eq(subscription.subscriptionId, subscriptionId));
    } else if (eventType === "SUBSCRIPTION_PAYMENT_FAILED") {
      // Individual recurring charge failed - subscription itself may still be active,
      // status transitions (e.g. to ON_HOLD) arrive separately via SUBSCRIPTION_STATUS_CHANGED
      console.warn("Subscription payment failed:", subscriptionId);
    }

    // Always return 200 - prevents Cashfree from retrying indefinitely
    return Response.json({ received: true });
  } catch (error) {
    console.error("Subscription webhook error:", error);
    return Response.json({ received: true });
  }
}
