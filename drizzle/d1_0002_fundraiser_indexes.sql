-- Fundraiser progress sums paid orders (json_each over items), so it filters on
-- payment_status. The old cashfree_order_id index duplicated the UNIQUE
-- constraint's autoindex, so it only slowed writes.
-- Apply: wrangler d1 execute graycup-orders --remote --file=drizzle/d1_0002_fundraiser_indexes.sql

CREATE INDEX IF NOT EXISTS idx_storefront_order_payment_status ON storefront_order(payment_status);
DROP INDEX IF EXISTS idx_storefront_order_cashfree_order_id;
