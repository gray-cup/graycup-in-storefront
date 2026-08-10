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
  const result = await db.execute<{ packs_sold: string | null }>(sql`
    select coalesce(sum((item->>'quantity')::int), 0) as packs_sold
    from "order", jsonb_array_elements(items) as item
    where payment_status = 'paid'
      and item->'product'->>'slug' = ${FUNDRAISER_PRODUCT_SLUG}
  `);

  const packsSold = Number(result.rows[0]?.packs_sold ?? 0);
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
