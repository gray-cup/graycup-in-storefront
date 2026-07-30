"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products/types";
import { CURRENCY } from "@/lib/currency";

type PickYourPoisonCardProps = {
  product: Product;
};

export function PickYourPoisonCard({ product }: PickYourPoisonCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative col-span-2 block w-full overflow-hidden rounded-lg border border-gray-200 bg-white aspect-[2/1]"
    >
      {/* Animated gradient blob in the corner */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-pink-400 opacity-40 blur-2xl"
        animate={{
          x: [0, 15, -8, 0],
          y: [0, -10, 8, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glare sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-black/5 to-transparent"
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
      />

      <div className="relative flex h-full flex-col justify-center gap-1 px-4 py-3">
        <span className="w-fit rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-500">
          Build Your Own
        </span>
        <h3 className="text-sm font-semibold text-black md:text-base">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-neutral-700">
          <span>
            From {CURRENCY.symbol}
            {product.priceRange.min.toLocaleString(CURRENCY.locale)}
          </span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
