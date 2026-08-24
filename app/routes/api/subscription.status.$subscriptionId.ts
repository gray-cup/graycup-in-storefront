import { subscription } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq } from "drizzle-orm";
import { CF_BASE, cfSubscriptionHeaders, mapSubscriptionStatus } from "@/lib/cashfree";
import type { Route } from "./+types/subscription.status.$subscriptionId";

export async function loader({ params, context }: Route.LoaderArgs) {
  const d1 = getD1Db(context.get(cloudflareContext).env.DB);
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

  await d1
    .update(subscription)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(subscription.subscriptionId, subscriptionId));

  return Response.json({
    subscriptionId,
    subscriptionStatus: data.subscription_status,
    status,
  });
}
