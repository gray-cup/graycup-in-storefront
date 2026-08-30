import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
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
  // D1 has no jsonb_array_elements - pull paid orders and sum in JS. Volume is
  // low enough that scanning paid orders per request is fine.
  // ponytail: full scan of paid orders, add a materialised counter if this
  // ever gets hot.
  const rows = await db
    .select({ items: schema.order.items })
    .from(schema.order)
    .where(eq(schema.order.paymentStatus, "paid"));

  let packsSold = 0;
  for (const { items } of rows) {
    for (const it of (items as { product?: { slug?: string }; quantity?: number }[]) ?? []) {
      if (it.product?.slug === FUNDRAISER_PRODUCT_SLUG) packsSold += Number(it.quantity ?? 0);
    }
  }

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
