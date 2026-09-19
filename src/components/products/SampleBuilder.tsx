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
import {
  getProductsByCategory,
  COFFEE_GRIND_OPTIONS,
  COFFEE_ROAST_OPTIONS,
  type Product,
} from "@/data/products";
import { usePostHog } from "@posthog/react";

const MIN_SAMPLES = 3;
const MAX_SAMPLES = 12;

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// One entry per sample slot: which coffee, at what roast, ground how.
type Slot = { coffee: string; roast: string; grind: string };
const emptySlot = (): Slot => ({ coffee: "", roast: "", grind: COFFEE_GRIND_OPTIONS[0] });

type SampleBuilderProps = {
  product: Product;
};

export function SampleBuilder({ product }: SampleBuilderProps) {
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();
  const posthog = usePostHog();

  const eligibleCoffees = useMemo(
    () => getProductsByCategory("Coffee").filter((p) => !p.isSamplePack),
    [],
  );

  // Pick Your Poison lets the buyer choose how many samples (priced per sample);
  // the x3/x5/x7 packs have a fixed count and a fixed pack price.
  const isCustom = product.slug === "pick-your-poison-sampler";
  const fixedCount = isCustom ? null : Number(/x (\d+)$/.exec(product.variants[0].name)?.[1]) || MIN_SAMPLES;
  const minCount = fixedCount ?? MIN_SAMPLES;
  const maxCount = fixedCount ?? MAX_SAMPLES;

  const [selectedSize, setSelectedSize] = useState(product.variants[0]);
  // Duplicates are allowed - a buyer may want the same coffee at two roasts.
  const [slots, setSlots] = useState<Slot[]>(() =>
    Array.from({ length: minCount }, emptySlot),
  );

  const roastOptionsFor = (coffee?: Product) => coffee?.roastOptions ?? COFFEE_ROAST_OPTIONS;

  const updateSlot = (i: number, patch: Partial<Slot>) =>
    setSlots((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const setCoffee = (i: number, name: string) => {
    const coffee = eligibleCoffees.find((c) => c.name === name);
    const options = roastOptionsFor(coffee);
    const roast = coffee ? (options.includes(coffee.roast!) ? coffee.roast! : options[0]) : "";
    updateSlot(i, { coffee: name, roast });
  };

  const addSlot = () => {
    if (slots.length >= maxCount) {
      toast.error(`You can pick up to ${maxCount} samples`);
      return;
    }
    setSlots((prev) => [...prev, emptySlot()]);
  };

  const removeSlot = (i: number) =>
    setSlots((prev) => prev.filter((_, idx) => idx !== i));

  // Cart/checkout/admin all render selectedSamples as plain strings.
  const selected = useMemo(
    () => slots.filter((s) => s.coffee).map((s) => `${s.coffee} (${s.roast}, ${s.grind})`),
    [slots],
  );
  const count = selected.length;
  const totalPrice = isCustom ? selectedSize.price * count : selectedSize.price;
  const meetsMinimum = count >= minCount;

  const buildCartVariant = () =>
    isCustom
      ? {
          name: `${count} x ${selectedSize.weightGrams}g samples: ${selected.join(", ")}`,
          price: totalPrice,
          weightGrams: (selectedSize.weightGrams ?? 0) * count,
        }
      : selectedSize;

  const handleAddToCart = () => {
    if (!meetsMinimum) {
      toast.error(`Pick ${fixedCount ? "all" : "at least"} ${minCount} coffees`);
      return;
    }
    addToCart(product, 1, buildCartVariant(), undefined, undefined, selected);
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
      toast.error(`Pick ${fixedCount ? "all" : "at least"} ${minCount} coffees`);
      return;
    }
    setBuyNowItem({
      product,
      quantity: 1,
      selectedVariant: buildCartVariant(),
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
          {fixedCount
            ? `${count} / ${fixedCount} coffees chosen`
            : `${count} / ${maxCount} samples selected (min ${minCount})`}
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
            className={SELECT_CLASS}
          >
            {product.variants.map((variant) => (
              <option key={variant.name} value={variant.name}>
                {variant.name} - {CURRENCY.symbol}
                {variant.price.toLocaleString(CURRENCY.locale)}
                {isCustom ? " per sample" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Coffee Selection - one dropdown per sample slot. Native <select> so
            mobile gets the OS picker (full names, no truncation, no scroll trap). */}
        <div className="space-y-4">
          <Label>Choose your coffees, roast and grind</Label>
          {slots.map((slot, i) => {
            const coffee = eligibleCoffees.find((c) => c.name === slot.coffee);
            return (
              <div key={i} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sample {i + 1}</span>
                  {!fixedCount && slots.length > MIN_SAMPLES && (
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
                  aria-label={`Sample ${i + 1} coffee`}
                  value={slot.coffee}
                  onChange={(e) => setCoffee(i, e.target.value)}
                  className={SELECT_CLASS}
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
                  <>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {coffee.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Roast Level</Label>
                        <select
                          aria-label={`Sample ${i + 1} roast level`}
                          value={slot.roast}
                          onChange={(e) => updateSlot(i, { roast: e.target.value })}
                          className={SELECT_CLASS}
                        >
                          {roastOptionsFor(coffee).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Grind Size</Label>
                        <select
                          aria-label={`Sample ${i + 1} grind size`}
                          value={slot.grind}
                          onChange={(e) => updateSlot(i, { grind: e.target.value })}
                          className={SELECT_CLASS}
                        >
                          {COFFEE_GRIND_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
          {!fixedCount && slots.length < maxCount && (
            <Button type="button" variant="outline" size="sm" onClick={addSlot}>
              + Add another sample
            </Button>
          )}
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
