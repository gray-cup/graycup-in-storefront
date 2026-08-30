import type { CartItem } from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { repriceCartItems, PricingError } from "@/lib/server-pricing";
import { rateLimit } from "@/lib/rate-limit";
import type { Route } from "./+types/validate-coupon";

interface ValidateCouponPayload {
  code: string;
  items: CartItem[];
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const limited = await rateLimit(context, request, "coupon");
    if (limited) return limited;

    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    const body: ValidateCouponPayload = await request.json();
    if (!body.items?.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Subtotal is recomputed from the catalog - the coupon's minOrderAmount and
    // percentage discount must not be driven by client-supplied prices.
    let subtotal: number;
    try {
      ({ subtotal } = repriceCartItems(body.items));
    } catch (e) {
      return Response.json(
        { valid: false, error: e instanceof PricingError ? e.message : "Invalid cart" },
        { status: 400 },
      );
    }
    const result = await validateCoupon(d1, body.code, subtotal);
    if (!result.valid) {
      return Response.json({ valid: false, error: result.error }, { status: 400 });
    }

    return Response.json({
      valid: true,
      code: result.coupon!.code,
      discountAmount: result.discountAmount,
    });
  } catch (err) {
    console.error("validate-coupon:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
