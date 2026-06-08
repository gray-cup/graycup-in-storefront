import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { review } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const reviews = await db
    .select()
    .from(review)
    .where(eq(review.productSlug, slug))
    .orderBy(desc(review.createdAt));

  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, fullName, content } = body;

    if (!slug || !fullName?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "slug, fullName and content are required" },
        { status: 400 },
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: "Review must be at least 10 characters" },
        { status: 400 },
      );
    }

    const [newReview] = await db
      .insert(review)
      .values({
        productSlug: slug,
        fullName: fullName.trim(),
        content: content.trim(),
      })
      .returning();

    return NextResponse.json({ review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Review POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
