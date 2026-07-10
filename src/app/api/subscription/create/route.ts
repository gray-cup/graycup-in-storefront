import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { CF_BASE, cfSubscriptionHeaders } from "@/lib/cashfree";

interface SubscriptionRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planAmount: number;
  planIntervalType: "DAY" | "WEEK" | "MONTH" | "YEAR";
  planIntervals?: number;
  planMaxCycles?: number;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({ headers: request.headers });

    const body: SubscriptionRequest = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      planName,
      planAmount,
      planIntervalType,
      planIntervals = 1,
      planMaxCycles = 12,
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !planName || !planAmount) {
      return NextResponse.json(
        { error: "Missing required subscription fields" },
        { status: 400 },
      );
    }

    const subscriptionId = `sub_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL;

    const planDetails = {
      plan_name: planName,
      plan_type: "PERIODIC" as const,
      plan_amount: planAmount,
      plan_max_amount: planAmount * planMaxCycles,
      plan_max_cycles: planMaxCycles,
      plan_intervals: planIntervals,
      plan_interval_type: planIntervalType,
      plan_currency: "INR",
    };

    const payload = {
      subscription_id: subscriptionId,
      customer_details: {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone.replace(/\D/g, "").slice(-10),
      },
      plan_details: planDetails,
      authorization_details: {
        authorization_amount: 1,
        authorization_amount_refund: true,
        payment_methods: ["upi", "card"],
      },
      subscription_meta: {
        return_url: `${origin}/subscription/success?subscription_id=${subscriptionId}`,
        notification_channel: ["EMAIL", "SMS"],
      },
    };

    const response = await fetch(`${CF_BASE}/subscriptions`, {
      method: "POST",
      headers: cfSubscriptionHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree subscription error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to create subscription" },
        { status: response.status },
      );
    }

    await db.insert(subscription).values({
      userId: session?.user?.id ?? null,
      subscriptionId,
      cfSubscriptionId: data.cf_subscription_id?.toString() ?? null,
      status: "pending",
      planDetails,
      customerName,
      customerEmail,
      customerPhone,
    });

    return NextResponse.json({
      success: true,
      subscriptionId,
      subscriptionSessionId: data.subscription_session_id,
      subscriptionStatus: data.subscription_status,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
