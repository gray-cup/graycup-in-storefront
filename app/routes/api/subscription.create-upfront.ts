import { auth } from "@/lib/auth";
import { order } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";
import { CF_BASE, cfHeaders } from "@/lib/cashfree";
import type { Route } from "./+types/subscription.create-upfront";

interface SubscriptionItem {
  name: string;
  price: number;
}

interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface UpfrontRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: DeliveryAddress;
  items: SubscriptionItem[];
  months: number;
}

export const UPFRONT_DISCOUNT_RATE = 0.05;

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      return Response.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({ headers: request.headers });

    const body: UpfrontRequest = await request.json();
    const { customerName, customerEmail, customerPhone, address, items, months } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !items?.length ||
      items.some((item) => !item.name || !item.price) ||
      !months ||
      months < 1
    ) {
      return Response.json(
        { error: "Missing required subscription fields" },
        { status: 400 },
      );
    }

    if (!address?.addressLine1 || !address?.city || !address?.state || !address?.pincode) {
      return Response.json(
        { error: "Complete delivery address required" },
        { status: 400 },
      );
    }

    const monthlyTotal = items.reduce((sum, item) => sum + item.price, 0);
    const fullTotal = monthlyTotal * months;
    const totalAmount = Math.round(fullTotal * (1 - UPFRONT_DISCOUNT_RATE) * 100) / 100;

    const cfOrderId = `subup_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const [newOrder] = await d1
      .insert(order)
      .values({
        userId: session?.user?.id ?? null,
        addressSnapshot: address,
        items: items as unknown as Record<string, unknown>[],
        subtotal: fullTotal,
        deliveryCharge: 0,
        totalAmount,
        paymentStatus: "pending",
        cashfreeOrderId: cfOrderId,
        customerName,
        customerEmail,
        customerPhone: customerPhone.replace(/\D/g, "").slice(-10),
        notes: `Upfront subscription payment - ${months} month${months > 1 ? "s" : ""}, ${UPFRONT_DISCOUNT_RATE * 100}% discount applied.`,
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
      await d1.delete(order).where(eq(order.id, newOrder.id));
      console.error("Cashfree upfront order creation failed:", cfData);
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
      totalAmount,
    });
  } catch (error) {
    console.error("Upfront subscription creation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
