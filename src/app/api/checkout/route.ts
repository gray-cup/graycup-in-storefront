import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { order, address as addressTable } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import type { CartItem } from "@/lib/cart";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      items,
      address,
      deliveryCharge,
      gstNumber,
    }: {
      items: CartItem[];
      address: Record<string, string>;
      deliveryCharge: number;
      gstNumber?: string;
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }
    if (!address?.addressLine1 || !address?.city || !address?.state || !address?.pincode) {
      return NextResponse.json({ error: "Complete delivery address required" }, { status: 400 });
    }

    // ── Calculate totals ───────────────────────────────────────────────────
    const subtotal = items.reduce((sum, item) => {
      const price = item.selectedVariant?.price ?? item.product.priceRange.min;
      return sum + price * item.quantity;
    }, 0);
    const delivery = deliveryCharge ?? 0;
    const totalAmount = subtotal + delivery;

    // ── Persist order (pending) ────────────────────────────────────────────
    const cfOrderId = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const u = session.user as typeof session.user & {
      firstName?: string;
      lastName?: string;
      phone?: string;
    };

    const customerName =
      [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
      u.name ||
      "Buyer";

    const customerPhone = (u.phone || address.phone || "")
      .replace(/\D/g, "")
      .slice(-10);

    const [newOrder] = await db
      .insert(order)
      .values({
        userId: session.user.id,
        addressSnapshot: address,
        items: items as unknown as Record<string, unknown>[],
        subtotal: subtotal.toFixed(2),
        deliveryCharge: delivery.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        paymentStatus: "pending",
        cashfreeOrderId: cfOrderId,
        customerName,
        customerEmail: session.user.email,
        customerPhone,
        gstNumber: gstNumber || null,
      })
      .returning();

    // ── Save address if this is the user's first ───────────────────────────
    const [{ value: addrCount }] = await db
      .select({ value: count() })
      .from(addressTable)
      .where(eq(addressTable.userId, session.user.id));

    if (addrCount === 0) {
      await db.insert(addressTable).values({
        userId: session.user.id,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || null,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: true,
      });
    }

    // ── Create Cashfree order ──────────────────────────────────────────────
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "https://b2b.graycup.in";

    const cfPayload = {
      order_id: cfOrderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: session.user.id,
        customer_name: customerName,
        customer_email: session.user.email,
        customer_phone: customerPhone || "9999999999",
      },
      order_meta: {
        // {order_id} is a Cashfree template token – replaced at redirect time
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
      // Roll back the pending order so the customer can retry
      await db.delete(order).where(eq(order.id, newOrder.id));
      console.error("Cashfree order creation failed:", cfData);
      return NextResponse.json(
        { error: cfData.message || "Payment gateway error" },
        { status: cfRes.status },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      cashfreeOrderId: cfOrderId,
      paymentSessionId: cfData.payment_session_id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
