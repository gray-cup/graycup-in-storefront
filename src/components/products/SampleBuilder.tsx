"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ShoppingCart, Zap, Flame } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart-provider";
import { setBuyNowItem } from "@/lib/buy-now";
import { CURRENCY } from "@/lib/currency";
import { getProductsByCategory, COFFEE_GRIND_OPTIONS, type Product } from "@/data/products";
import { useGrindSize } from "./grind-size-context";
import { usePostHog } from "@posthog/react";

const MIN_SAMPLES = 3;
const MAX_SAMPLES = 12;

type SampleBuilderProps = {
  product: Product;
};

export function SampleBuilder({ product }: SampleBuilderProps) {
  const { addToCart, openCart } = useCart();
  const { grindSize, setGrindSize } = useGrindSize();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const eligibleCoffees = useMemo(
    () => getProductsByCategory("Coffee").filter((p) => !p.isSamplePack),
    [],
  );

  const [selectedSize, setSelectedSize] = useState(product.variants[0]);
  // One entry per sample slot; "" = not yet chosen. Duplicates are allowed -
  // a buyer may want two of the same coffee in their box.
  const [slots, setSlots] = useState<string[]>(() => Array(MIN_SAMPLES).fill(""));

  const setSlot = (i: number, name: string) =>
    setSlots((prev) => prev.map((s, idx) => (idx === i ? name : s)));

  const addSlot = () => {
    if (slots.length >= MAX_SAMPLES) {
      toast.error(`You can pick up to ${MAX_SAMPLES} samples`);
      return;
    }
    setSlots((prev) => [...prev, ""]);
  };

  const removeSlot = (i: number) =>
    setSlots((prev) => prev.filter((_, idx) => idx !== i));

  const selected = useMemo(() => slots.filter(Boolean), [slots]);
  const count = selected.length;
  const totalPrice = selectedSize.price * count;
  const meetsMinimum = count >= MIN_SAMPLES;

  const buildCartVariant = () => ({
    name: `${count} x ${selectedSize.weightGrams}g samples: ${selected.join(", ")}`,
    price: totalPrice,
    weightGrams: (selectedSize.weightGrams ?? 0) * count,
  });

  const handleAddToCart = () => {
    if (!meetsMinimum) {
      toast.error(`Pick at least ${MIN_SAMPLES} coffees`);
      return;
    }
    addToCart(product, 1, buildCartVariant(), undefined, grindSize, selected);
    posthog?.capture("product_added_to_cart", {
      product_slug: product.slug,
      product_category: product.category,
      sample_count: count,
      total_price: totalPrice,
    });
    toast.success("Added to cart!", {
      description: `${count} samples (${selectedSize.name})`,
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleBuyNow = () => {
    if (!meetsMinimum) {
      toast.error(`Pick at least ${MIN_SAMPLES} coffees`);
      return;
    }
    setBuyNowItem({
      product,
      quantity: 1,
      selectedVariant: buildCartVariant(),
      selectedGrind: grindSize,
      selectedSamples: selected,
    });
    posthog?.capture("buy_now_selected", {
      product_slug: product.slug,
      product_category: product.category,
      sample_count: count,
      total_price: totalPrice,
    });
    navigate("/checkout");
  };

  return (
    <Card>
      <CardHeader>
        <p className="text-2xl font-semibold">
          {CURRENCY.symbol}
          {totalPrice.toLocaleString(CURRENCY.locale)}
        </p>
        <p className="text-sm text-muted-foreground">
          {count} / {MAX_SAMPLES} samples selected (min {MIN_SAMPLES})
        </p>
      </CardHeader>
      <CardContent className="space-y-6 py-4">
        {/* Sample Size */}
        <div className="space-y-2">
          <Label htmlFor="sample-size">Sample Size</Label>
          <select
            id="sample-size"
            value={selectedSize.name}
            onChange={(e) => {
              const variant = product.variants.find((v) => v.name === e.target.value);
              if (variant) setSelectedSize(variant);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {product.variants.map((variant) => (
              <option key={variant.name} value={variant.name}>
                {variant.name} - {CURRENCY.symbol}
                {variant.price.toLocaleString(CURRENCY.locale)} per sample
              </option>
            ))}
          </select>
        </div>

        {/* Coffee Selection - one dropdown per sample slot. Native <select> so
            mobile gets the OS picker (full names, no truncation, no scroll trap). */}
        <div className="space-y-4">
          <Label>Choose your coffees</Label>
          {slots.map((value, i) => {
            const coffee = eligibleCoffees.find((c) => c.name === value);
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sample {i + 1}</span>
                  {slots.length > MIN_SAMPLES && (
                    <button
                      type="button"
                      onClick={() => removeSlot(i)}
                      className="text-xs text-muted-foreground underline hover:text-foreground"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <select
                  value={value}
                  onChange={(e) => setSlot(i, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">— Select a coffee —</option>
                  {eligibleCoffees.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                      {c.flavourNotes?.length ? ` — ${c.flavourNotes.join(", ")}` : ""}
                    </option>
                  ))}
                </select>
                {coffee && (
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {coffee.description}
                  </p>
                )}
              </div>
            );
          })}
          {slots.length < MAX_SAMPLES && (
            <Button type="button" variant="outline" size="sm" onClick={addSlot}>
              + Add another sample
            </Button>
          )}
        </div>

        {/* Grind Size - applied to every coffee in the box */}
        <div className="space-y-2">
          <Label htmlFor="sample-grind">Grind Size</Label>
          <select
            id="sample-grind"
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {COFFEE_GRIND_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleBuyNow}
            disabled={!meetsMinimum}
            className="w-full h-14 text-lg"
            size="lg"
          >
            <Zap className="mr-2 h-5 w-5" />
            Buy Now
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={!meetsMinimum}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center pt-2">
          <Flame className="h-3.5 w-3.5 shrink-0" />
          Roasted only after you order - we don&apos;t hold coffee bean stock, so it&apos;s always freshly roasted.
        </p>
      </CardContent>
    </Card>
  );
}
