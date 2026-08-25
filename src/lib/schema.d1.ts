import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ─── Orders, coupons and subscriptions ─────────────────────────────────────
//
// These live in Cloudflare D1 (the "graycup-orders" database, shared with
// orders-graycup), not the Neon retail Postgres DB - unlike user/session/
// account/address in ./schema.ts. userId is a soft reference to
// user.id (Postgres); D1 can't enforce a cross-database FK.
//
// Table shapes MUST mirror orders-graycup's lib/db/schema.d1.ts copy exactly -
// both point at the same physical D1 tables.

export const order = sqliteTable("storefront_order", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id"),
  addressSnapshot: text("address_snapshot", { mode: "json" }).notNull(),
  items: text("items", { mode: "json" }).notNull(),
  subtotal: real("subtotal").notNull(),
  deliveryCharge: real("delivery_charge").notNull().default(0),
  totalAmount: real("total_amount").notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  cashfreeOrderId: text("cashfree_order_id").unique(),
  cashfreePaymentId: text("cashfree_payment_id"),
  gstNumber: text("gst_number"),
  customerName: text("customer_name").notNull().default(""),
  customerEmail: text("customer_email").notNull().default(""),
  customerPhone: text("customer_phone").notNull().default(""),
  delhiveryTrackingId: text("delhivery_tracking_id"),
  isFulfilled: integer("is_fulfilled", { mode: "boolean" }).notNull().default(false),
  carrier: text("carrier"),
  shadowfaxRequestId: text("shadowfax_request_id"),
  delhiveryPickupDate: text("delhivery_pickup_date"),
  dispatchStatus: text("dispatch_status"),
  notes: text("notes"),
  couponCode: text("coupon_code"),
  discountAmount: real("discount_amount").notNull().default(0),
  couponUsageCounted: integer("coupon_usage_counted", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const coupons = sqliteTable("storefront_coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull().default("PERCENTAGE"),
  discountAmount: integer("discount_amount"),
  discountPercent: real("discount_percent"),
  maxDiscountAmount: integer("max_discount_amount"),
  minOrderAmount: integer("min_order_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const subscription = sqliteTable("storefront_subscription", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id"),
  subscriptionId: text("subscription_id").notNull().unique(),
  cfSubscriptionId: text("cf_subscription_id"),
  status: text("status").notNull().default("pending"),
  planDetails: text("plan_details", { mode: "json" }).notNull(),
  customerName: text("customer_name").notNull().default(""),
  customerEmail: text("customer_email").notNull().default(""),
  customerPhone: text("customer_phone").notNull().default(""),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export type Coupon = typeof coupons.$inferSelect;
export type Order = typeof order.$inferSelect;
export type Subscription = typeof subscription.$inferSelect;

// ─── Product reviews ───────────────────────────────────────────────────────
//
// graycup.in's reviews, in the shared "graycup-orders" D1 database. The
// graycup_in_ prefix namespaces the table for this site (the database hosts
// several sites' tables). rating is nullable: rows written before star
// ratings existed have none and are excluded from schema.org markup.

export const graycupReviews = sqliteTable("graycup_in_reviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  productSlug: text("product_slug").notNull(),
  fullName: text("full_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`),
});

export type GraycupReview = typeof graycupReviews.$inferSelect;
