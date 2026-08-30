-- better-auth `admin` plugin: server-controlled role + ban fields on the user
-- table, and impersonatedBy on session. Guarded with IF NOT EXISTS so this is
-- safe to run against the live retail DB.
-- (Only the user/session statements from drizzle-kit's generated diff are kept -
--  the DROP TABLE lines it emitted for coupons/order/review/subscription are
--  tables owned by schema.d1.ts / orders-graycup and must never be dropped.)
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "ban_expires" timestamp;
