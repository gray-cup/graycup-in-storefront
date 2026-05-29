"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Turnstile, useTurnstile } from "@/components/ui/turnstile";

const productCategories = [
  { id: "tea", label: "Tea", color: "bg-green-600 border-green-600" },
  { id: "coffee", label: "Coffee", color: "bg-amber-900 border-amber-900" },
  {
    id: "beverages",
    label: "Other Beverages",
    color: "bg-blue-600 border-blue-600",
  },
  { id: "other", label: "Other", color: "bg-neutral-700 border-neutral-700" },
];

export default function NewProductRequestPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      category:
        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1),
      productName: formData.get("productName") as string,
      details: formData.get("details") as string,
      turnstileToken: turnstile.token,
    };

    try {
      const response = await fetch("/api/new-product-request", {
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
          message: "Your request has been submitted successfully!",
        });
        (e.target as HTMLFormElement).reset();
        setSelectedCategory("");
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
            New Product Request
          </h1>
          <p className="text-muted-foreground">
            Have a product idea or want us to source something specific? Let us
            know.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 8527914317"
                required
              />
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
            <Label>Product Category</Label>
            <div className="flex flex-wrap gap-2">
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedCategory === category.id
                      ? `${category.color} text-white`
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name / Description</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="e.g., Organic Green Tea, Darjeeling First Flush"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Additional Details</Label>
            <Textarea
              id="details"
              name="details"
              placeholder="Tell us more about the product you're looking for, including quantity, specifications, or any specific requirements..."
              rows={4}
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
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
