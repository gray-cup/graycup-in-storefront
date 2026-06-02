"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile, useTurnstile } from "@/components/ui/turnstile";

const feedbackTypes = [
  {
    id: "product",
    label: "Product Quality",
    color: "bg-green-600 border-green-600",
  },
  { id: "service", label: "Service", color: "bg-blue-600 border-blue-600" },
  { id: "delivery", label: "Delivery", color: "bg-amber-600 border-amber-600" },
  {
    id: "suggestion",
    label: "Suggestion",
    color: "bg-purple-600 border-purple-600",
  },
  { id: "other", label: "Other", color: "bg-neutral-700 border-neutral-700" },
];

const ratingOptions = [
  {
    id: "excellent",
    label: "Excellent",
    color: "bg-green-600 border-green-600",
  },
  { id: "good", label: "Good", color: "bg-blue-600 border-blue-600" },
  { id: "average", label: "Average", color: "bg-amber-600 border-amber-600" },
  { id: "poor", label: "Poor", color: "bg-red-600 border-red-600" },
];

export default function FeedbackPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const turnstile = useTurnstile();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      feedbackType: selectedType,
      rating: selectedRating,
      feedback: formData.get("feedback") as string,
      turnstileToken: turnstile.token,
    };

    try {
      const response = await fetch("/api/webhooks/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you for your feedback!",
        });
        (e.target as HTMLFormElement).reset();
        setSelectedType("");
        setSelectedRating("");
        turnstile.reset();
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-lg mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-black mb-2">
            Share Your Feedback
          </h1>
          <p className="text-muted-foreground">
            Your feedback helps us improve our products and services.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" placeholder="First name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" placeholder="Last name" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Feedback Type</Label>
            <div className="flex flex-wrap gap-2">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedType === type.id
                      ? `${type.color} text-white`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Overall Experience</Label>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating.id}
                  type="button"
                  onClick={() => setSelectedRating(rating.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedRating === rating.id
                      ? `${rating.color} text-white`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Please share your experience, suggestions, or concerns in detail..."
              rows={7}
              required
            />
          </div>

          <Turnstile
            onVerify={turnstile.handleVerify}
            onError={turnstile.handleError}
            onExpire={turnstile.handleExpire}
          />

          {submitStatus && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <Button
            type="submit"
            variant="gray"
            className="w-full h-11 rounded-lg mt-4"
            disabled={!turnstile.isVerified || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </div>
    </div>
  );
}
