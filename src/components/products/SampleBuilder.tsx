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
import { getProductsByCategory, type Product } from "@/data/products";

const MIN_SAMPLES = 3;
const MAX_SAMPLES = 12;

type SampleBuilderProps = {
  product: Product;
};

export function SampleBuilder({ product }: SampleBuilderProps) {
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const eligibleCoffees = useMemo(
    () => getProductsByCategory("Coffee").filter((p) => !p.isSamplePack),
    [],
  );

  const [selectedSize, setSelectedSize] = useState(product.variants[0]);
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((n) => n !== name);
      if (prev.length >= MAX_SAMPLES) {
        toast.error(`You can pick up to ${MAX_SAMPLES} samples`);
        return prev;
      }
      return [...prev, name];
    });
  };

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
    addToCart(product, 1, buildCartVariant(), undefined, undefined, selected);
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
      selectedSamples: selected,
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

        {/* Coffee Selection */}
        <div className="space-y-2">
          <Label>Choose your coffees</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-80 overflow-y-auto pr-1">
            {eligibleCoffees.map((coffee) => {
              const isChecked = selected.includes(coffee.name);
              return (
                <label
                  key={coffee.slug}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    isChecked
                      ? "border-black bg-neutral-50"
                      : "border-input hover:border-neutral-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(coffee.name)}
                    className="accent-black"
                  />
                  <span className="line-clamp-1">{coffee.name}</span>
                </label>
              );
            })}
          </div>
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
