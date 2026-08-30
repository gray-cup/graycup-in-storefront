import { auth } from "@/lib/auth";
import { order, address as addressTable } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq, count } from "drizzle-orm";
import { calculateDeliveryCharge, type CartItem } from "@/lib/cart";

const FLAT_DELIVERY_CHARGE = 40;
import { CF_BASE, cfHeaders } from "@/lib/cashfree";
import { validateCoupon } from "@/lib/coupons";
import { repriceCartItems, PricingError } from "@/lib/server-pricing";
import { rateLimit } from "@/lib/rate-limit";
import type { Route } from "./+types/checkout";

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const limited = await rateLimit(context, request, "checkout");
    if (limited) return limited;

    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    const session = await auth.api.getSession({ headers: request.headers });

    const body = await request.json();
    const {
      items,
      address,
      deliveryCharge,
      gstNumber,
      guest,
      couponCode,
    }: {
      items: CartItem[];
      address: Record<string, string>;
      deliveryCharge: number;
      gstNumber?: string;
      guest?: { name: string; email: string; phone: string };
      couponCode?: string;
    } = body;

    if (!items?.length) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!address?.addressLine1 || !address?.city || !address?.state || !address?.pincode) {
      return Response.json({ error: "Complete delivery address required" }, { status: 400 });
    }

    // Guest must supply contact details
    if (!session?.user && (!guest?.name || !guest?.email || !guest?.phone)) {
      return Response.json(
        { error: "Name, email and phone are required for guest checkout" },
        { status: 400 },
      );
    }

    // ── Resolve customer identity ──────────────────────────────────────────
    type ExtendedUser = { id: string; email: string; name: string; firstName?: string; lastName?: string; phone?: string };
    const u = session?.user as ExtendedUser | undefined;

    const customerName = u
      ? [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.name || "Buyer"
      : guest!.name.trim();

    const customerEmail = u ? u.email : guest!.email.trim();

    const customerPhone = u
      ? (u.phone || address.phone || "").replace(/\D/g, "").slice(-10)
      : guest!.phone.replace(/\D/g, "").slice(-10);

    // ── Calculate totals ───────────────────────────────────────────────────
    // Re-price every line from the catalog - the client's prices are not trusted.
    void deliveryCharge;
    let subtotal: number;
    let pricedItems: CartItem[];
    try {
      ({ subtotal, items: pricedItems } = repriceCartItems(items));
    } catch (e) {
      return Response.json(
        { error: e instanceof PricingError ? e.message : "Invalid cart" },
        { status: 400 },
      );
    }
    const delivery = calculateDeliveryCharge(pricedItems, FLAT_DELIVERY_CHARGE);

    // Re-validate the coupon server-side against the subtotal we just computed -
    // never trust a discount amount supplied by the client.
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;
    if (couponCode) {
      const validation = await validateCoupon(d1, couponCode, subtotal);
      if (!validation.valid) {
        return Response.json({ error: validation.error || "Invalid coupon code" }, { status: 400 });
      }
      appliedCouponCode = validation.coupon!.code;
      discountAmount = validation.discountAmount;
    }

    const totalAmount = subtotal + delivery - discountAmount;

    // ── Persist order (pending) ────────────────────────────────────────────
    const cfOrderId = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const [newOrder] = await d1
      .insert(order)
      .values({
        userId: u?.id ?? null,
        addressSnapshot: address,
        items: pricedItems as unknown as Record<string, unknown>[],
        subtotal,
        deliveryCharge: delivery,
        totalAmount,
        paymentStatus: "pending",
        cashfreeOrderId: cfOrderId,
        customerName,
        customerEmail,
        customerPhone,
        gstNumber: gstNumber || null,
        couponCode: appliedCouponCode,
        discountAmount,
      })
      .returning();

    // ── Save address for logged-in users (first order only) ───────────────
    if (u?.id) {
      const [{ value: addrCount }] = await d1
        .select({ value: count() })
        .from(addressTable)
        .where(eq(addressTable.userId, u.id));

      if (addrCount === 0) {
        await d1.insert(addressTable).values({
          userId: u.id,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || null,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          isDefault: true,
        });
      }
    }

    // ── Create Cashfree order ──────────────────────────────────────────────
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://graycup.in";

    const cfPayload = {
      order_id: cfOrderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: u?.id ?? `guest_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        return_url: `${origin}/payment/success?order_id={order_id}`,
        notify_url: `${origin}/api/payment/webhook`,
      },
    };

    const cfRes = await fetch(`${CF_BASE}/orders`, {
      method: "POST",
      headers: cfHeaders(),
      body: JSON.stringify(cfPayload),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      await d1.delete(order).where(eq(order.id, newOrder.id));
      console.error("Cashfree order creation failed:", cfData);
      return Response.json(
        { error: cfData.message || "Payment gateway error" },
        { status: cfRes.status },
      );
    }

    return Response.json({
      success: true,
      orderId: newOrder.id,
      cashfreeOrderId: cfOrderId,
      paymentSessionId: cfData.payment_session_id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
