-- Reviews table for graycup.in, added to the shared "graycup-orders" D1 database
-- (id c761625d-96b2-40a9-b1a3-4d9a58cae436), which also hosts tables for other
-- sites (bulkctc_orders, odisha_coffee_orders, storefront_order, ...). The
-- graycup_in_ prefix namespaces this site's reviews.
--
-- Run against the D1 database from either repo, e.g.:
--   wrangler d1 execute graycup-orders --remote --file=./scripts/d1-graycup-in-reviews-migration.sql

CREATE TABLE IF NOT EXISTS graycup_in_reviews (
  id TEXT PRIMARY KEY NOT NULL,
  product_slug TEXT NOT NULL,
  full_name TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_graycup_in_reviews_product_slug
  ON graycup_in_reviews (product_slug);
