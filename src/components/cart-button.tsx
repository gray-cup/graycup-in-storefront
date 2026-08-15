"use client";

import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

export function CartButton() {
  const { itemCount, isLoading } = useCart();

  return (
    <Link to="/cart">
      <Button
        variant="ghost"
        size="sm"
        className="relative gap-2"
        disabled={isLoading}
      >
        <ShoppingCart className="h-5 w-5" />
        {!isLoading && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-medium">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}
