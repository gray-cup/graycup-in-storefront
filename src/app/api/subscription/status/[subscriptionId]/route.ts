import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfSubscriptionHeaders, mapSubscriptionStatus } from "@/lib/cashfree";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ subscriptionId: string }> },
) {
  const { subscriptionId } = await params;

  const response = await fetch(`${CF_BASE}/subscriptions/${subscriptionId}`, {
    headers: cfSubscriptionHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data.message || "Failed to fetch subscription" },
      { status: response.status },
    );
  }

  const status = mapSubscriptionStatus(data.subscription_status);

  await db
    .update(subscription)
    .set({ status, updatedAt: new Date() })
    .where(eq(subscription.subscriptionId, subscriptionId));

  return NextResponse.json({
    subscriptionId,
    subscriptionStatus: data.subscription_status,
    status,
  });
}
