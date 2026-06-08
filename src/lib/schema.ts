import {
  pgTable,
  text,
  boolean,
  timestamp,
  uuid,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── Better Auth Tables ────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  // Extended buyer fields
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name"),
  phone: text("phone").notNull().default(""),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── Buyer Addresses ───────────────────────────────────────────────────────

export const address = pgTable("address", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Orders ────────────────────────────────────────────────────────────────
//
// items        – full cart snapshot (product slug, name, variant, qty, price)
// addressSnapshot – full address at time of order (not FK, so history is preserved)
// paymentStatus   – pending | paid | failed | refunded
// isFulfilled     – toggled by admin once shipped
// delhiveryTrackingId – required by admin when marking isFulfilled = true

export const order = pgTable("order", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "restrict" }),
  addressSnapshot: jsonb("address_snapshot").notNull(),
  items: jsonb("items").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharge: numeric("delivery_charge", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"),
  cashfreeOrderId: text("cashfree_order_id").unique(),
  cashfreePaymentId: text("cashfree_payment_id"),
  // Optional GST number for B2B buyers
  gstNumber: text("gst_number"),
  // Customer contact snapshot – denormalised so admin views need no JOIN
  customerName: text("customer_name").notNull().default(""),
  customerEmail: text("customer_email").notNull().default(""),
  customerPhone: text("customer_phone").notNull().default(""),
  // Set by admin after shipping
  delhiveryTrackingId: text("delhivery_tracking_id"),
  isFulfilled: boolean("is_fulfilled").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Product Reviews ───────────────────────────────────────────────────────

export const review = pgTable("review", {
  id: uuid("id").primaryKey().defaultRandom(),
  productSlug: text("product_slug").notNull(),
  fullName: text("full_name").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Review = typeof review.$inferSelect;
export type User = typeof user.$inferSelect;
export type Address = typeof address.$inferSelect;
export type Order = typeof order.$inferSelect;
