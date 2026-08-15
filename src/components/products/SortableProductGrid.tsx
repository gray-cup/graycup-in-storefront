"use client";

import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

type SortableProductGridProps = {
  products: Product[];
  defaultDirection: "asc" | "desc";
};

export function SortableProductGrid({ products, defaultDirection }: SortableProductGridProps) {
  const [direction, setDirection] = useState<"asc" | "desc">(defaultDirection);

  const sorted = useMemo(() => {
    return products.slice().sort((a, b) => {
      const diff = a.priceRange.min - b.priceRange.min;
      return direction === "asc" ? diff : -diff;
    });
  }, [products, direction]);

  const options: { value: "desc" | "asc"; label: string }[] = [
    { value: "desc", label: "Price: High to Low" },
    { value: "asc", label: "Price: Low to High" },
  ];

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-black">
          {sorted.length} {sorted.length === 1 ? "Product" : "Products"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Sort</span>
          <div className="flex gap-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => setDirection(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  direction === option.value
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sorted.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12">
          No products currently match this category — browse our{" "}
          <Link to="/products" className="underline">
            full product range
          </Link>
          .
        </p>
      )}
    </div>
  );
}
