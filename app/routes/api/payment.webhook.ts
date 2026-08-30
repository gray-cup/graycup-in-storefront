import { order } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";

// Cashfree can settle a payment a rupee or two off due to rounding; anything
// beyond this gap means the client-driven order amount was tampered with.
const AMOUNT_TOLERANCE = 1;
import crypto from "crypto";
import { finalizeCouponUsage } from "@/lib/coupons";
import type { Route } from "./+types/payment.webhook";

// Cashfree webhook event types
const PAID_EVENTS = new Set(["PAYMENT_SUCCESS_WEBHOOK"]);
const FAILED_EVENTS = new Set(["PAYMENT_FAILED_WEBHOOK"]);
const DROPPED_EVENTS = new Set(["PAYMENT_USER_DROPPED_WEBHOOK"]);

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
        console.warn("Webhook signature mismatch - rejecting");
        return Response.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.type ?? "";
    const cfOrderId: string | undefined = event.data?.order?.order_id;

    if (!cfOrderId) {
      return Response.json({ received: true });
    }

    if (PAID_EVENTS.has(eventType)) {
      // Verify the amount actually paid matches what we recorded for the order.
      // The order amount is derived server-side (see repriceCartItems), so a
      // mismatch here means either a Cashfree data issue or tampering - either
      // way, hold the order for manual review instead of marking it paid.
      const [existing] = await d1
        .select({ total: order.totalAmount })
        .from(order)
        .where(eq(order.cashfreeOrderId, cfOrderId))
        .limit(1);

      const paidAmount = Number(
        event.data?.payment?.payment_amount ?? event.data?.order?.order_amount ?? NaN,
      );
      const expected = existing ? Number(existing.total) : NaN;
      const amountOk =
        Number.isFinite(paidAmount) &&
        Number.isFinite(expected) &&
        Math.abs(paidAmount - expected) <= AMOUNT_TOLERANCE;

      if (existing && !amountOk) {
        console.error(
          `Payment amount mismatch for ${cfOrderId}: paid ${paidAmount}, expected ${expected}`,
        );
        await d1
          .update(order)
          .set({
            paymentStatus: "review",
            cashfreePaymentId: event.data?.payment?.cf_payment_id?.toString() ?? null,
            notes: `AMOUNT MISMATCH: paid ${paidAmount}, expected ${expected}`,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(order.cashfreeOrderId, cfOrderId));
      } else {
        await d1
          .update(order)
          .set({
            paymentStatus: "paid",
            cashfreePaymentId: event.data?.payment?.cf_payment_id?.toString() ?? null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(order.cashfreeOrderId, cfOrderId));
        await finalizeCouponUsage(d1, cfOrderId);
      }
    } else if (FAILED_EVENTS.has(eventType)) {
      await d1
        .update(order)
        .set({ paymentStatus: "failed", updatedAt: new Date().toISOString() })
        .where(eq(order.cashfreeOrderId, cfOrderId));
    } else if (DROPPED_EVENTS.has(eventType)) {
      // User abandoned - keep pending so they can retry without a new order
      await d1
        .update(order)
        .set({ paymentStatus: "pending", updatedAt: new Date().toISOString() })
        .where(eq(order.cashfreeOrderId, cfOrderId));
    }

    // Always return 200 - prevents Cashfree from retrying indefinitely
    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ received: true });
  }
}
