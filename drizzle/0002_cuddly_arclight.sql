CREATE TABLE IF NOT EXISTS "coupons" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"discount_type" text DEFAULT 'PERCENTAGE' NOT NULL,
	"discount_amount" integer,
	"discount_percent" real,
	"max_discount_amount" integer,
	"min_order_amount" integer,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "coupons_code_unique" UNIQUE("code")
);
--> statement-breakpoint
-- carrier / shadowfax_request_id / delhivery_pickup_date / dispatch_status already exist in
-- production (added at runtime by orders-graycup's ensureStorefrontOrderColumns helper, never
-- previously captured in this repo's migration history) - guarded with IF NOT EXISTS so this
-- migration is safe to run against the live DB.
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "carrier" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "shadowfax_request_id" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "delhivery_pickup_date" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "dispatch_status" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "coupon_code" text;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN IF NOT EXISTS "coupon_usage_counted" boolean DEFAULT false NOT NULL;
