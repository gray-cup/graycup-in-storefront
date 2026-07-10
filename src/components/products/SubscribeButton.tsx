"use client";

import { useState } from "react";
import { Repeat, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CURRENCY } from "@/lib/currency";
import type { Product, ProductVariant } from "@/data/products";

type SubscribeButtonProps = {
  product: Product;
  variant: ProductVariant;
};

export function SubscribeButton({ product, variant }: SubscribeButtonProps) {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [phone, setPhone] = useState("");

  const handleSubscribe = async () => {
    if (!name || !email || !phone) {
      toast.error("Please fill in your name, email and phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          planName: `${product.name} - Monthly Subscription`,
          planAmount: variant.price,
          planIntervalType: "MONTH",
          planIntervals: 1,
          planMaxCycles: 12,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Could not start subscription");
        return;
      }

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({
        mode:
          (process.env.NEXT_PUBLIC_CASHFREE_MODE as "sandbox" | "production") ??
          "production",
      });

      // Cashfree's drop-in checkout accepts a subscription_session_id under the
      // same paymentSessionId key used for one-off order sessions.
      await cashfree.checkout({
        paymentSessionId: data.subscriptionSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error("Something went wrong starting your subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="lg">
          <Repeat className="mr-2 h-4 w-4" />
          Subscribe & Save (Monthly)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to {product.name}</DialogTitle>
          <DialogDescription>
            Get {variant.name} delivered every month for{" "}
            {CURRENCY.symbol}
            {variant.price.toLocaleString(CURRENCY.locale)}/cycle. Cancel anytime.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="sub-name">Full Name</Label>
            <Input
              id="sub-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-email">Email</Label>
            <Input
              id="sub-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sub-phone">Phone</Label>
            <Input
              id="sub-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
            />
          </div>
          <Button onClick={handleSubscribe} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Repeat className="mr-2 h-4 w-4" />
            )}
            Start Subscription
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
