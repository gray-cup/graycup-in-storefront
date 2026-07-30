"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products/types";
import { CURRENCY } from "@/lib/currency";

type PickYourPoisonCardProps = {
  product: Product;
};

export function PickYourPoisonCard({ product }: PickYourPoisonCardProps) {
  return (
    <div className="relative col-span-2 flex aspect-[2/1] w-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
      {/* Gradient blob, top right - slowly cycles through colors */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-sky-400 via-indigo-400 to-purple-400 opacity-50 blur-2xl"
        animate={{ filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
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
        <Link href={`/products/${product.slug}`}>Pick Your Poison</Link>
      </Button>
    </div>
  );
}
