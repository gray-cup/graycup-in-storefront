import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfSubscriptionHeaders, mapSubscriptionStatus } from "@/lib/cashfree";

type ManageAction = "CANCEL" | "PAUSE" | "ACTIVATE";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { subscriptionId, action }: { subscriptionId: string; action: ManageAction } =
      await request.json();

    if (!subscriptionId || !["CANCEL", "PAUSE", "ACTIVATE"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const [existing] = await db
      .select()
      .from(subscription)
      .where(eq(subscription.subscriptionId, subscriptionId));

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    const payload: {
      subscription_id: string;
      action: ManageAction;
      action_details?: { next_scheduled_time: string };
    } = {
      subscription_id: subscriptionId,
      action,
    };

    if (action === "ACTIVATE") {
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      payload.action_details = {
        next_scheduled_time: nextDay.toISOString().slice(0, 10),
      };
    }

    const response = await fetch(`${CF_BASE}/subscriptions/${subscriptionId}/manage`, {
      method: "POST",
      headers: cfSubscriptionHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Cashfree subscription manage error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to update subscription" },
        { status: response.status },
      );
    }

    const status = mapSubscriptionStatus(data.subscription_status);

    await db
      .update(subscription)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscription.subscriptionId, subscriptionId));

    return NextResponse.json({ success: true, status, subscriptionStatus: data.subscription_status });
  } catch (error) {
    console.error("Subscription manage error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
