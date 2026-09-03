"use client";

import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products/types";
import { productPath } from "@/lib/product-url";
import { CURRENCY } from "@/lib/currency";

type PickYourPoisonCardProps = {
  product: Product;
};

export function PickYourPoisonCard({ product }: PickYourPoisonCardProps) {
  return (
    <div className="relative col-span-2 flex aspect-[2/1] w-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      {/* Gradient blob, top right - wobbly organic shape that slowly rotates and cycles through colors */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 bg-gradient-to-br from-sky-400 via-indigo-400 to-purple-400 opacity-50 blur-2xl [border-radius:60%_40%_30%_70%/60%_30%_70%_40%]"
        animate={{
          rotate: 360,
          filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Grain texture over the blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 opacity-20 mix-blend-overlay [border-radius:60%_40%_30%_70%/60%_30%_70%_40%]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative space-y-1">
        <span className="inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          Build Your Own
        </span>
        <h3 className="text-sm font-semibold text-black md:text-base">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 md:text-sm">
          From {CURRENCY.symbol}
          {product.priceRange.min.toLocaleString(CURRENCY.locale)}
        </p>
      </div>

      <Button asChild variant="lightgraybg" size="sm" className="relative w-full">
        <Link to={productPath(product)}>Pick Your Poison</Link>
      </Button>
    </div>
  );
}
