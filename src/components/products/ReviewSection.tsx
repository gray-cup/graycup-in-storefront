"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

type Review = {
  id: string;
  fullName: string;
  content: string;
  createdAt: string;
};

export function ReviewSection({ productSlug }: { productSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ fullName: "", content: "" });
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const res = await fetch(`/api/reviews?slug=${productSlug}`);
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setLoading(false);
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: productSlug, ...form }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Failed to submit review");
      setSubmitting(false);
      return;
    }

    setReviews((prev) => [data.review, ...prev]);
    setForm({ fullName: "", content: "" });
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="mt-16 space-y-10">
      <Separator />
      <h2 className="text-2xl font-semibold">Reviews</h2>

      {/* Write a review */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="font-medium text-gray-900 mb-4">Write a Review</h3>
        {submitted ? (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            Thanks for your review!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="review-name">Full Name</Label>
              <Input
                id="review-name"
                placeholder="Your name"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="review-content">Your Review</Label>
              <Textarea
                id="review-content"
                placeholder="Share your experience with this product..."
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </Button>
          </form>
        )}
      </div>

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div key={r.id} className="space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="font-medium text-gray-900">{r.fullName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{r.content}</p>
              <Separator />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
