"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "./ShareButton";
import { SubscribeButton } from "./SubscribeButton";
import { Button } from "@/components/ui/button";
import { CardHeader, Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart-provider";
import { setBuyNowItem } from "@/lib/buy-now";
import { CURRENCY } from "@/lib/currency";
import { COFFEE_GRIND_OPTIONS, type Product, type ProductVariant } from "@/data/products";
import { useGrindSize } from "./grind-size-context";

type ProductConfiguratorProps = {
  product: Product;
};

function perKgPrice(variant: ProductVariant): number | null {
  if (!variant.weightGrams) return null;
  return variant.price / (variant.weightGrams / 1000);
}

function getDefaultVariant(product: Product) {
  return (
    product.variants.find((v) => v.name.replace(/\s/g, "").toLowerCase() === "250g") ??
    product.variants[0]
  );
}

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { addToCart, openCart } = useCart();
  const router = useRouter();
  const isCoffee = product.category === "Coffee" && !product.isSamplePack;
  const [selectedVariant, setSelectedVariant] = useState(() => getDefaultVariant(product));
  const [quantity, setQuantity] = useState(1);
  const { grindSize, setGrindSize } = useGrindSize();
  const hasRoastOptions = !!product.roastOptions && product.roastOptions.length > 0;
  const [selectedRoast, setSelectedRoast] = useState(() => product.roastOptions?.[0] ?? "");
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);

  // Pick up ?variant=, ?grind= and ?roast= from the URL on load, so shared/pasted
  // links land on the same selection.
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const variantParam = searchParams.get("variant");
    if (variantParam) {
      const variant = product.variants.find((v) => v.name === variantParam);
      if (variant) setSelectedVariant(variant);
    }

    const grindParam = searchParams.get("grind");
    if (isCoffee && grindParam && COFFEE_GRIND_OPTIONS.includes(grindParam)) {
      setGrindSize(grindParam);
    }

    const roastParam = searchParams.get("roast");
    if (hasRoastOptions && roastParam && (product.roastOptions as string[]).includes(roastParam)) {
      setSelectedRoast(roastParam);
    }

    setHydratedFromUrl(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the URL in sync whenever the selection changes. Uses the native
  // History API (not router.replace) so this never triggers an App Router
  // navigation/transition - just updates the address bar.
  useEffect(() => {
    if (!hydratedFromUrl) return;

    const searchParams = new URLSearchParams(window.location.search);
    if (product.variants.length > 1) {
      searchParams.set("variant", selectedVariant.name);
    }
    if (isCoffee) {
      searchParams.set("grind", grindSize);
    }
    if (hasRoastOptions) {
      searchParams.set("roast", selectedRoast);
    }

    const query = searchParams.toString();
    const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [
    hydratedFromUrl,
    selectedVariant,
    grindSize,
    selectedRoast,
    isCoffee,
    hasRoastOptions,
    product.variants.length,
  ]);

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedVariant,
      undefined,
      isCoffee ? grindSize : undefined,
      undefined,
      hasRoastOptions ? selectedRoast : undefined
    );
    toast.success("Added to cart!", {
      description: `${quantity} ${product.name} (${selectedVariant.name})`,
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleBuyNow = () => {
    setBuyNowItem({
      product,
      quantity,
      selectedVariant,
      selectedGrind: isCoffee ? grindSize : undefined,
      selectedRoast: hasRoastOptions ? selectedRoast : undefined,
    });
    router.push("/checkout");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const handleQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    setQuantity(Number.isNaN(parsed) ? 1 : Math.max(1, parsed));
  };

  const totalPrice = selectedVariant.price * quantity;
  const selectedPerKg = perKgPrice(selectedVariant);

  return (
    <Card className="">
      <CardHeader>
                    <p className="text-2xl font-semibold">
              {CURRENCY.symbol}
              {selectedVariant.price.toLocaleString(CURRENCY.locale)}
            </p>
            {selectedPerKg !== null && (
              <p className="text-sm text-muted-foreground">
                {CURRENCY.symbol}
                {selectedPerKg.toLocaleString(CURRENCY.locale)} / kg
              </p>
            )}
      </CardHeader>
      <CardContent className="space-y-6 py-4">
        {/* Variant Selector + Quantity */}
        <div className="flex gap-4">
          {product.variants.length > 1 && (
            <div className="flex-1 space-y-2">
              <Label htmlFor="variant">Select Option</Label>
              <select
                id="variant"
                value={selectedVariant.name}
                onChange={(e) => {
                  const variant = product.variants.find((v) => v.name === e.target.value);
                  if (variant) setSelectedVariant(variant);
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {product.variants.map((variant) => {
                  const perKg = perKgPrice(variant);
                  return (
                    <option key={variant.name} value={variant.name}>
                      {variant.name} - {CURRENCY.symbol}
                      {variant.price.toLocaleString(CURRENCY.locale)}
                      {perKg !== null &&
                        variant.weightGrams !== 1000 &&
                        ` (${CURRENCY.symbol}${perKg.toLocaleString(CURRENCY.locale)}/kg)`}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={handleQuantityInput}
                className="w-14 h-9 text-center text-xl font-semibold rounded-md border border-input bg-background [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Grind Size (coffee only) */}
        {isCoffee && (
          <div className="space-y-2">
            <Label htmlFor="grind-size">Grind Size</Label>
            <select
              id="grind-size"
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
        )}

        {/* Roast Level */}
        {hasRoastOptions && (
          <div className="space-y-2">
            <Label htmlFor="roast-level">Roast Level</Label>
            <select
              id="roast-level"
              value={selectedRoast}
              onChange={(e) => setSelectedRoast(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {product.roastOptions?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Display */}
        <div className="space-y-2 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {CURRENCY.symbol}
              {totalPrice.toLocaleString(CURRENCY.locale)}
            </span>
          </div>
          {selectedPerKg !== null && (
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                {CURRENCY.symbol}
                {selectedPerKg.toLocaleString(CURRENCY.locale)} / kg
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleBuyNow}
            className="w-full"
            size="lg"
          >
            <Zap className="mr-2 h-4 w-4" />
            Buy Now
          </Button>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <SubscribeButton product={product} />
          <div className="flex justify-center">
            <ShareButton productName={product.name} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
