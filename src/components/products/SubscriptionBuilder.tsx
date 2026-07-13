"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Loader2, Repeat } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CURRENCY } from "@/lib/currency";
import type { Product, ProductVariant } from "@/data/products";

type SubscriptionBuilderProps = {
  product: Product;
  addonProducts: Product[];
};

const MIN_MONTHS = 1;
const MAX_MONTHS = 36;
const DEFAULT_MONTHS = 6;

export function SubscriptionBuilder({ product, addonProducts }: SubscriptionBuilderProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const [primaryVariant, setPrimaryVariant] = useState(product.variants[0]);
  const [months, setMonths] = useState(DEFAULT_MONTHS);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, ProductVariant>>({});

  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [phone, setPhone] = useState("");

  const items = useMemo(() => {
    const list = [{ name: `${product.name} (${primaryVariant.name})`, price: primaryVariant.price }];
    for (const addonProduct of addonProducts) {
      const variant = selectedAddons[addonProduct.slug];
      if (variant) {
        list.push({ name: `${addonProduct.name} (${variant.name})`, price: variant.price });
      }
    }
    return list;
  }, [product.name, primaryVariant, addonProducts, selectedAddons]);

  const monthlyTotal = items.reduce((sum, item) => sum + item.price, 0);

  const toggleAddon = (addonProduct: Product, checked: boolean) => {
    setSelectedAddons((prev) => {
      const next = { ...prev };
      if (checked) {
        next[addonProduct.slug] = addonProduct.variants[0];
      } else {
        delete next[addonProduct.slug];
      }
      return next;
    });
  };

  const setAddonVariant = (addonProduct: Product, variant: ProductVariant) => {
    setSelectedAddons((prev) => ({ ...prev, [addonProduct.slug]: variant }));
  };

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
          items,
          planIntervalType: "MONTH",
          planIntervals: 1,
          planMaxCycles: months,
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
    <div className="grid gap-6 py-8 md:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Subscribe to {product.name}</h1>
            <p className="text-sm text-muted-foreground">
              Delivered every month for as long as your subscription runs. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="primary-variant">Select Option</Label>
            <select
              id="primary-variant"
              value={primaryVariant.name}
              onChange={(e) => {
                const variant = product.variants.find((v) => v.name === e.target.value);
                if (variant) setPrimaryVariant(variant);
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {product.variants.map((variant) => (
                <option key={variant.name} value={variant.name}>
                  {variant.name} - {CURRENCY.symbol}
                  {variant.price.toLocaleString(CURRENCY.locale)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Months slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="months">How many months?</Label>
            <span className="text-sm font-semibold">
              {months} {months > 1 ? "months" : "month"}
            </span>
          </div>
          <input
            id="months"
            type="range"
            min={MIN_MONTHS}
            max={MAX_MONTHS}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{MIN_MONTHS} month</span>
            <span>{MAX_MONTHS} months</span>
          </div>
        </div>

        {/* Add more products */}
        {addonProducts.length > 0 && (
          <div className="space-y-3">
            <Label>Add more products to your monthly delivery</Label>
            <div className="space-y-3">
              {addonProducts.map((addonProduct) => {
                const selectedVariant = selectedAddons[addonProduct.slug];
                const isSelected = Boolean(selectedVariant);
                return (
                  <div
                    key={addonProduct.slug}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <input
                      type="checkbox"
                      id={`addon-${addonProduct.slug}`}
                      checked={isSelected}
                      onChange={(e) => toggleAddon(addonProduct, e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border">
                      <Image
                        src={addonProduct.image}
                        alt={addonProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <label htmlFor={`addon-${addonProduct.slug}`} className="flex-1 cursor-pointer">
                      <p className="text-sm font-medium">{addonProduct.name}</p>
                    </label>
                    {isSelected && addonProduct.variants.length > 1 ? (
                      <select
                        value={selectedVariant!.name}
                        onChange={(e) => {
                          const variant = addonProduct.variants.find(
                            (v) => v.name === e.target.value,
                          );
                          if (variant) setAddonVariant(addonProduct, variant);
                        }}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        {addonProduct.variants.map((variant) => (
                          <option key={variant.name} value={variant.name}>
                            {variant.name} - {CURRENCY.symbol}
                            {variant.price.toLocaleString(CURRENCY.locale)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {CURRENCY.symbol}
                        {addonProduct.variants[0].price.toLocaleString(CURRENCY.locale)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Your subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name}</span>
                  <span>
                    {CURRENCY.symbol}
                    {item.price.toLocaleString(CURRENCY.locale)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Per month</span>
              <span>
                {CURRENCY.symbol}
                {monthlyTotal.toLocaleString(CURRENCY.locale)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Runs for {months} {months > 1 ? "months" : "month"} (
              {CURRENCY.symbol}
              {(monthlyTotal * months).toLocaleString(CURRENCY.locale)} total). Cancel anytime.
            </p>

            <div className="space-y-3 border-t pt-4">
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
            </div>

            <Button onClick={handleSubscribe} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Repeat className="mr-2 h-4 w-4" />
              )}
              Start Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
