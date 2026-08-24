import { and, eq } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { coupons, order, type Coupon } from "@/lib/schema.d1";
import type { d1Schema } from "@/lib/db.d1";

type D1Db = DrizzleD1Database<typeof d1Schema>;

export interface CouponValidation {
  valid: boolean;
  error?: string;
  discountAmount: number;
  coupon?: Coupon;
}

/**
 * Server is the sole authority on coupon validity and discount amount.
 * Callers pass only a code + the server-computed subtotal; the discount
 * returned here is what must be trusted - never accept a discount value
 * from the client.
 */
export async function validateCoupon(db: D1Db, rawCode: string | undefined | null, subtotal: number): Promise<CouponValidation> {
  if (!rawCode || !rawCode.trim()) {
    return { valid: false, error: "No coupon code provided", discountAmount: 0 };
  }
  const code = rawCode.trim().toUpperCase();

  const rows = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  if (!rows.length) {
    return { valid: false, error: "Invalid coupon code", discountAmount: 0 };
  }
  const c = rows[0];

  if (!c.active) {
    return { valid: false, error: "This coupon is no longer active", discountAmount: 0 };
  }
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) {
    return { valid: false, error: "This coupon has expired", discountAmount: 0 };
  }
  if (c.usageLimit !== null && c.usedCount >= c.usageLimit) {
    return { valid: false, error: "This coupon has reached its usage limit", discountAmount: 0 };
  }
  if (c.minOrderAmount !== null && subtotal < c.minOrderAmount) {
    return { valid: false, error: `Minimum order amount for this coupon is ₹${c.minOrderAmount}`, discountAmount: 0 };
  }

  let discountAmount = 0;
  if (c.discountType === "FIXED" && c.discountAmount != null) {
    discountAmount = c.discountAmount;
  } else if (c.discountPercent != null) {
    discountAmount = Math.round((subtotal * c.discountPercent) / 100);
  }
  if (c.maxDiscountAmount !== null) {
    discountAmount = Math.min(discountAmount, c.maxDiscountAmount);
  }
  discountAmount = Math.min(discountAmount, subtotal);

  return { valid: true, discountAmount, coupon: c };
}

/**
 * Increments usedCount for a coupon exactly once per order. Callers must
 * guard with the order's own couponUsageCounted flag so retried webhooks /
 * verify-poll races never double-count a redemption.
 */
export async function incrementCouponUsage(db: D1Db, code: string): Promise<void> {
  const normalized = code.trim().toUpperCase();
  const rows = await db.select().from(coupons).where(eq(coupons.code, normalized)).limit(1);
  if (!rows.length) return;
  await db
    .update(coupons)
    .set({ usedCount: rows[0].usedCount + 1 })
    .where(eq(coupons.code, normalized));
}

/**
 * Called after a Cashfree order is confirmed paid (from both the webhook and
 * the /payment/verify poll, since either can win the race to mark it paid).
 * The guarded UPDATE (coupon_usage_counted = false) ensures at most one of
 * those callers ever flips the flag and increments usage for a given order.
 */
export async function finalizeCouponUsage(db: D1Db, cashfreeOrderId: string): Promise<void> {
  const [claimed] = await db
    .update(order)
    .set({ couponUsageCounted: true })
    .where(and(eq(order.cashfreeOrderId, cashfreeOrderId), eq(order.couponUsageCounted, false)))
    .returning();

  if (claimed?.couponCode) {
    await incrementCouponUsage(db, claimed.couponCode);
  }
}
