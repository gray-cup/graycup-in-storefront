import { auth } from "@/lib/auth";
import { subscription } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { CF_BASE, cfSubscriptionHeaders } from "@/lib/cashfree";
import { repriceSubscription, PricingError, type SubLineInput } from "@/lib/server-pricing";
import { rateLimit } from "@/lib/rate-limit";
import { isValidIndiaPincode } from "@/lib/pincode";
import type { Route } from "./+types/subscription.create";

interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface SubscriptionRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: DeliveryAddress;
  primary: SubLineInput;
  addons?: SubLineInput[];
  months: number;
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const limited = await rateLimit(context, request, "subscription");
    if (limited) return limited;

    const d1 = getD1Db(context.get(cloudflareContext).env.DB);
    if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
      return Response.json(
        { error: "Payment gateway not configured" },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({ headers: request.headers });

    const body: SubscriptionRequest = await request.json();
    const { customerName, customerEmail, customerPhone, address, primary, addons, months } = body;

    if (!customerName || !customerEmail || !customerPhone || !primary?.slug) {
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
    if (!isValidIndiaPincode(address.pincode)) {
      return Response.json(
        { error: "Enter a valid 6-digit PIN code" },
        { status: 400 },
      );
    }

    const planMaxCycles = Math.min(36, Math.max(1, Math.floor(Number(months) || 0)));
    if (planMaxCycles < 1) {
      return Response.json({ error: "Invalid subscription length" }, { status: 400 });
    }
    const planIntervalType = "MONTH" as const;
    const planIntervals = 1;

    // Prices and labels are rebuilt server-side from the catalog - the client
    // only supplies slug + variant name per line.
    let items: { name: string; price: number }[];
    let planAmount: number;
    try {
      ({ items, monthlyTotal: planAmount } = repriceSubscription(primary, addons ?? []));
    } catch (e) {
      return Response.json(
        { error: e instanceof PricingError ? e.message : "Invalid subscription items" },
        { status: 400 },
      );
    }
    const planName = items.map((item) => item.name).join(" + ").slice(0, 40);

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

    const dbPlanDetails = { ...planDetails, items, address };

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
      return Response.json(
        { error: data.message || "Failed to create subscription" },
        { status: response.status },
      );
    }

    await d1.insert(subscription).values({
      userId: session?.user?.id ?? null,
      subscriptionId,
      cfSubscriptionId: data.cf_subscription_id?.toString() ?? null,
      status: "pending",
      planDetails: dbPlanDetails,
      customerName,
      customerEmail,
      customerPhone,
    });

    return Response.json({
      success: true,
      subscriptionId,
      subscriptionSessionId: data.subscription_session_id,
      subscriptionStatus: data.subscription_status,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
