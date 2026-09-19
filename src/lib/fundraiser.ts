import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  FUNDRAISER_GOAL_INR,
  FUNDRAISER_PACK_PRICE_INR,
  FUNDRAISER_PACKS_NEEDED,
  FUNDRAISER_PRODUCT_SLUG,
} from "@/data/products";

export type FundraiserStats = {
  packsSold: number;
  raisedInr: number;
  goalInr: number;
  packsNeeded: number;
  percent: number;
};

export async function getFundraiserStats(): Promise<FundraiserStats> {
  // Sum the pack quantity inside D1 (json_each over the order's items JSON) so
  // only one number crosses the wire. Narrowed by idx_storefront_order_payment_status.
  const row = await db.get<{ packs: number | null }>(sql`
    SELECT SUM(json_extract(j.value, '$.quantity')) AS packs
    FROM storefront_order o, json_each(o.items) j
    WHERE o.payment_status = 'paid'
      AND json_extract(j.value, '$.product.slug') = ${FUNDRAISER_PRODUCT_SLUG}
  `);
  const packsSold = Number(row?.packs ?? 0);

  const raisedInr = packsSold * FUNDRAISER_PACK_PRICE_INR;
  const percent = Math.min(100, (raisedInr / FUNDRAISER_GOAL_INR) * 100);

  return {
    packsSold,
    raisedInr,
    goalInr: FUNDRAISER_GOAL_INR,
    packsNeeded: FUNDRAISER_PACKS_NEEDED,
    percent,
  };
}
