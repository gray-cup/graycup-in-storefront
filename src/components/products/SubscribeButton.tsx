import { Link } from "react-router";
import { Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

type SubscribeButtonProps = {
  product: Product;
};

export function SubscribeButton({ product }: SubscribeButtonProps) {
  // Ratio-priced blends can't be repriced by the subscription flow.
  if (product.blendPricing) return null;
  return (
    <Button variant="outline" className="w-full" size="lg" asChild>
      <Link to={`/subscribe/${product.slug}`}>
        <Repeat className="mr-2 h-4 w-4" />
        Subscribe & Save (Monthly)
      </Link>
    </Button>
  );
}
