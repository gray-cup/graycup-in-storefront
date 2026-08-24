import type { CartItem } from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import type { Route } from "./+types/validate-coupon";

interface ValidateCouponPayload {
  code: string;
  items: CartItem[];
}

function computeSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.selectedVariant?.price ?? item.product.priceRange.min;
    return sum + price * item.quantity;
  }, 0);
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    const body: ValidateCouponPayload = await request.json();
    if (!body.items?.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = computeSubtotal(body.items);
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
