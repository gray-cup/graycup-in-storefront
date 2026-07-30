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
      className="group relative block w-full overflow-hidden rounded-2xl bg-neutral-900 aspect-[21/9] md:aspect-[3/1]"
    >
      {/* Animated gradient blob in the corner */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 opacity-50 blur-3xl"
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 10, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glare sweep */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        animate={{ x: ["-120%", "220%"] }}
        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
      />

      <div className="relative flex h-full flex-col justify-center gap-2 px-6 py-6 md:px-10">
        <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/80">
          Build Your Own
        </span>
        <h3 className="text-2xl font-semibold text-white md:text-3xl">
          {product.name}
        </h3>
        <p className="max-w-md text-sm text-white/70 md:text-base">
          {product.description}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white">
          <span>
            From {CURRENCY.symbol}
            {product.priceRange.min.toLocaleString(CURRENCY.locale)}
          </span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
