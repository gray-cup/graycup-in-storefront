import { graycupReviews } from "@/lib/schema.d1";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { desc, eq } from "drizzle-orm";
import type { Route } from "./+types/reviews";

export async function loader({ request, context }: Route.LoaderArgs) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return Response.json({ error: "slug is required" }, { status: 400 });
  }

  const d1 = getD1Db(context.get(cloudflareContext).env.DB);

  const reviews = await d1
    .select()
    .from(graycupReviews)
    .where(eq(graycupReviews.productSlug, slug))
    .orderBy(desc(graycupReviews.createdAt));

  return Response.json({ reviews });
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const body = await request.json();
    const { slug, fullName, content, rating } = body;

    if (!slug || !fullName?.trim() || !content?.trim()) {
      return Response.json(
        { error: "slug, fullName and content are required" },
        { status: 400 },
      );
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return Response.json(
        { error: "rating must be an integer between 1 and 5" },
        { status: 400 },
      );
    }

    if (content.trim().length < 10) {
      return Response.json(
        { error: "Review must be at least 10 characters" },
        { status: 400 },
      );
    }

    const d1 = getD1Db(context.get(cloudflareContext).env.DB);

    const [newReview] = await d1
      .insert(graycupReviews)
      .values({
        productSlug: slug,
        fullName: fullName.trim(),
        content: content.trim(),
        rating: ratingNum,
      })
      .returning();

    return Response.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
