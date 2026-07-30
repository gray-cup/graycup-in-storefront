import { NextRequest, NextResponse } from "next/server";
import type { CartItem } from "@/lib/cart";
import { validateCoupon } from "@/lib/coupons";

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

export async function POST(req: NextRequest) {
  try {
    const body: ValidateCouponPayload = await req.json();
    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = computeSubtotal(body.items);
    const result = await validateCoupon(body.code, subtotal);
    if (!result.valid) {
      return NextResponse.json({ valid: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      code: result.coupon!.code,
      discountAmount: result.discountAmount,
    });
  } catch (err) {
    console.error("validate-coupon:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
