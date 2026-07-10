import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { subscription } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const subscriptions = await db
    .select()
    .from(subscription)
    .where(eq(subscription.userId, session.user.id))
    .orderBy(desc(subscription.createdAt));

  return NextResponse.json({ subscriptions });
}
