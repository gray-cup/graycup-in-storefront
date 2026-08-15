import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { CF_BASE, cfSubscriptionHeaders, mapSubscriptionStatus } from "@/lib/cashfree";
import type { Route } from "./+types/subscription.status.$subscriptionId";

export async function loader({ params }: Route.LoaderArgs) {
  const { subscriptionId } = params;

  const response = await fetch(`${CF_BASE}/subscriptions/${subscriptionId}`, {
    headers: cfSubscriptionHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    return Response.json(
      { error: data.message || "Failed to fetch subscription" },
      { status: response.status },
    );
  }

  const status = mapSubscriptionStatus(data.subscription_status);

  await db
    .update(subscription)
    .set({ status, updatedAt: new Date() })
    .where(eq(subscription.subscriptionId, subscriptionId));

  return Response.json({
    subscriptionId,
    subscriptionStatus: data.subscription_status,
    status,
  });
}
