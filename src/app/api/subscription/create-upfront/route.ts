import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { order } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";

interface SubscriptionItem {
  name: string;
  price: number;
}

interface UpfrontRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: SubscriptionItem[];
  months: number;
}

export const UPFRONT_DISCOUNT_RATE = 0.05;

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({ headers: request.headers });

    const body: UpfrontRequest = await request.json();
    const { customerName, customerEmail, customerPhone, items, months } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !items?.length ||
      items.some((item) => !item.name || !item.price) ||
      !months ||
      months < 1
    ) {
      return NextResponse.json(
        { error: "Missing required subscription fields" },
        { status: 400 },
      );
    }

    const monthlyTotal = items.reduce((sum, item) => sum + item.price, 0);
    const fullTotal = monthlyTotal * months;
    const totalAmount = Math.round(fullTotal * (1 - UPFRONT_DISCOUNT_RATE) * 100) / 100;

    const cfOrderId = `subup_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const [newOrder] = await db
      .insert(order)
      .values({
        userId: session?.user?.id ?? null,
        addressSnapshot: {},
        items: items as unknown as Record<string, unknown>[],
        subtotal: fullTotal.toFixed(2),
        deliveryCharge: "0",
        totalAmount: totalAmount.toFixed(2),
        paymentStatus: "pending",
        cashfreeOrderId: cfOrderId,
        customerName,
        customerEmail,
        customerPhone: customerPhone.replace(/\D/g, "").slice(-10),
        notes: `Upfront subscription payment — ${months} month${months > 1 ? "s" : ""}, ${UPFRONT_DISCOUNT_RATE * 100}% discount applied. Delivery address to be collected on activation.`,
      })
      .returning();

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://graycup.in";

    const cfPayload = {
      order_id: cfOrderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: session?.user?.id ?? `guest_${Date.now()}`,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone.replace(/\D/g, "").slice(-10) || "9999999999",
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
      await db.delete(order).where(eq(order.id, newOrder.id));
      console.error("Cashfree upfront order creation failed:", cfData);
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
      totalAmount,
    });
  } catch (error) {
    console.error("Upfront subscription creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
