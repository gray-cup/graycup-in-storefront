import { auth } from "@/lib/auth";
import { subscription } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { eq, desc } from "drizzle-orm";
import type { Route } from "./+types/subscription.list";

export async function loader({ request, context }: Route.LoaderArgs) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const d1 = getD1Db(context.get(cloudflareContext).env.DB);
  const subscriptions = await d1
    .select()
    .from(subscription)
    .where(eq(subscription.userId, session.user.id))
    .orderBy(desc(subscription.createdAt));

  return Response.json({ subscriptions });
}
