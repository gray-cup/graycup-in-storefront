"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, Loader2, Repeat } from "lucide-react";
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
const UPFRONT_DISCOUNT_RATE = 0.05;

export function SubscriptionBuilder({ product, addonProducts }: SubscriptionBuilderProps) {
  const { data: session } = authClient.useSession();
  const [loading, setLoading] = useState(false);

  const [primaryVariant, setPrimaryVariant] = useState(product.variants[0]);
  const [months, setMonths] = useState(DEFAULT_MONTHS);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, ProductVariant>>({});
  const [paymentType, setPaymentType] = useState<"recurring" | "upfront">("recurring");

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
  const fullTotal = monthlyTotal * months;
  const upfrontTotal = Math.round(fullTotal * (1 - UPFRONT_DISCOUNT_RATE) * 100) / 100;
  const upfrontSavings = fullTotal - upfrontTotal;

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
      const isUpfront = paymentType === "upfront";
      const res = await fetch(
        isUpfront ? "/api/subscription/create-upfront" : "/api/subscription/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isUpfront
              ? {
                  customerName: name,
                  customerEmail: email,
                  customerPhone: phone,
                  items,
                  months,
                }
              : {
                  customerName: name,
                  customerEmail: email,
                  customerPhone: phone,
                  items,
                  planIntervalType: "MONTH",
                  planIntervals: 1,
                  planMaxCycles: months,
                },
          ),
        },
      );

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
        paymentSessionId: data.subscriptionSessionId ?? data.paymentSessionId,
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {addonProducts.map((addonProduct) => {
                const selectedVariant = selectedAddons[addonProduct.slug];
                const isSelected = Boolean(selectedVariant);
                return (
                  <motion.button
                    key={addonProduct.slug}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleAddon(addonProduct, !isSelected)}
                    whileTap={{ scale: 0.96 }}
                    className={`group relative flex aspect-square flex-col overflow-hidden rounded-lg border text-left transition-colors ${
                      isSelected
                        ? "border-primary ring-2 ring-primary"
                        : "border-input hover:border-primary/50"
                    }`}
                  >
                    <div className="relative flex-1">
                      <Image
                        src={addonProduct.image}
                        alt={addonProduct.name}
                        fill
                        className="object-cover"
                      />
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow"
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="space-y-1 bg-background/95 p-2">
                      <p className="line-clamp-1 text-xs font-medium">{addonProduct.name}</p>
                      {isSelected && addonProduct.variants.length > 1 ? (
                        <select
                          value={selectedVariant!.name}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const variant = addonProduct.variants.find(
                              (v) => v.name === e.target.value,
                            );
                            if (variant) setAddonVariant(addonProduct, variant);
                          }}
                          className="h-7 w-full rounded-md border border-input bg-background px-1 text-[11px]"
                        >
                          {addonProduct.variants.map((variant) => (
                            <option key={variant.name} value={variant.name}>
                              {variant.name} - {CURRENCY.symbol}
                              {variant.price.toLocaleString(CURRENCY.locale)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {CURRENCY.symbol}
                          {addonProduct.variants[0].price.toLocaleString(CURRENCY.locale)}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment type */}
        <div className="space-y-2">
          <Label>How would you like to pay?</Label>
          <div className="relative grid grid-cols-2 rounded-lg border bg-muted p-1">
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-md bg-background shadow"
              style={{ left: paymentType === "recurring" ? "0.25rem" : "50%" }}
            />
            <button
              type="button"
              onClick={() => setPaymentType("recurring")}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                paymentType === "recurring" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Repeat className="h-4 w-4" />
              Auto-renew monthly
            </button>
            <button
              type="button"
              onClick={() => setPaymentType("upfront")}
              className={`relative z-10 flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-colors ${
                paymentType === "upfront" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              Pay upfront
              <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                5% off
              </span>
            </button>
          </div>
          <AnimatePresence mode="wait">
            {paymentType === "upfront" ? (
              <motion.p
                key="upfront-hint"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground"
              >
                Pay the full {months}-month total in one go via the payment gateway and save 5%.
                No auto-renewal — start a new subscription when it ends.
              </motion.p>
            ) : (
              <motion.p
                key="recurring-hint"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground"
              >
                We&apos;ll charge {CURRENCY.symbol}
                {monthlyTotal.toLocaleString(CURRENCY.locale)} automatically every month for{" "}
                {months} {months > 1 ? "months" : "month"}. Cancel anytime.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
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
            <AnimatePresence mode="wait">
              {paymentType === "upfront" ? (
                <motion.div
                  key="upfront-total"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {months} {months > 1 ? "months" : "month"} total
                    </span>
                    <span className="text-muted-foreground line-through">
                      {CURRENCY.symbol}
                      {fullTotal.toLocaleString(CURRENCY.locale)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-primary">
                    <span>You pay today</span>
                    <span>
                      {CURRENCY.symbol}
                      {upfrontTotal.toLocaleString(CURRENCY.locale)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You save {CURRENCY.symbol}
                    {upfrontSavings.toLocaleString(CURRENCY.locale)} paying upfront.
                  </p>
                </motion.div>
              ) : (
                <motion.p
                  key="recurring-total"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs text-muted-foreground"
                >
                  Runs for {months} {months > 1 ? "months" : "month"} (
                  {CURRENCY.symbol}
                  {fullTotal.toLocaleString(CURRENCY.locale)} total). Cancel anytime.
                </motion.p>
              )}
            </AnimatePresence>

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

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button onClick={handleSubscribe} disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : paymentType === "upfront" ? (
                  <CreditCard className="mr-2 h-4 w-4" />
                ) : (
                  <Repeat className="mr-2 h-4 w-4" />
                )}
                {paymentType === "upfront"
                  ? `Pay ${CURRENCY.symbol}${upfrontTotal.toLocaleString(CURRENCY.locale)} Now`
                  : "Start Subscription"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
