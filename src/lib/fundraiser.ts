import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { FUNDRAISER_GOAL_INR, FUNDRAISER_PRODUCT_SLUG } from "@/data/products";

export type FundraiserStats = {
  raisedInr: number;
  goalInr: number;
  percent: number;
};

export async function getFundraiserStats(): Promise<FundraiserStats> {
  // Sum the paid fundraiser lines inside D1 (json_each over the order's items JSON)
  // so only one number crosses the wire. Each line's selectedVariant.price is the
  // server-derived unit price (bulk discount included) snapshotted at checkout.
  // Narrowed by idx_storefront_order_payment_status.
  const row = await db.get<{ raised: number | null }>(sql`
    SELECT SUM(
      json_extract(j.value, '$.quantity') * json_extract(j.value, '$.selectedVariant.price')
    ) AS raised
    FROM storefront_order o, json_each(o.items) j
    WHERE o.payment_status = 'paid'
      AND json_extract(j.value, '$.product.slug') = ${FUNDRAISER_PRODUCT_SLUG}
  `);
  const raisedInr = Number(row?.raised ?? 0);

  return {
    raisedInr,
    goalInr: FUNDRAISER_GOAL_INR,
    percent: Math.min(100, (raisedInr / FUNDRAISER_GOAL_INR) * 100),
  };
}
