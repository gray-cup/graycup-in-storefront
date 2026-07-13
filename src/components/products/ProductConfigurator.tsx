"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Minus, Plus, Zap } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "./ShareButton";
import { SubscribeButton } from "./SubscribeButton";
import { Button } from "@/components/ui/button";
import { CardHeader, Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/cart-provider";
import { CURRENCY } from "@/lib/currency";
import type { Product } from "@/data/products";

type ProductConfiguratorProps = {
  product: Product;
};

export function ProductConfigurator({ product }: ProductConfiguratorProps) {
  const { addToCart, openCart } = useCart();
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    toast.success("Added to cart!", {
      description: `${quantity} ${product.name} (${selectedVariant.name})`,
      action: {
        label: "View Cart",
        onClick: () => openCart(),
      },
    });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    router.push("/checkout");
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  const totalPrice = selectedVariant.price * quantity;

  return (
    <Card className="">
      <CardHeader>
                    <p className="text-2xl font-semibold">
              {CURRENCY.symbol}
              {selectedVariant.price.toLocaleString(CURRENCY.locale)}
            </p>
      </CardHeader>
      <CardContent className="space-y-6 py-4">
        {/* Variant Selector */}
        {product.variants.length > 1 && (
          <div className="space-y-2">
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
              {product.variants.map((variant) => (
                <option key={variant.name} value={variant.name}>
                  {variant.name} - {CURRENCY.symbol}
                  {variant.price.toLocaleString(CURRENCY.locale)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="space-y-2">
          <Label>Quantity</Label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Price Display */}
        <div className="space-y-2 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Item Price:</span>

          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">
              {CURRENCY.symbol}
              {totalPrice.toLocaleString(CURRENCY.locale)}
            </span>
          </div>
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
