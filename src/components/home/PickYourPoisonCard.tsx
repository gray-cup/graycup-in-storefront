"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products/types";

type PickYourPoisonCardProps = {
  product: Product;
};

export function PickYourPoisonCard({ product }: PickYourPoisonCardProps) {
  return (
    <Card className="overflow-hidden rounded-lg bg-neutral-50 p-0">
      <div className="relative flex aspect-square flex-col items-center justify-center overflow-hidden bg-white p-4 text-center">
        {/* Animated gradient blobs - bluish tint */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-400 opacity-40 blur-2xl"
          animate={{
            x: [0, 15, -8, 0],
            y: [0, -10, 8, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-200 via-sky-300 to-cyan-300 opacity-30 blur-2xl"
          animate={{
            x: [0, -10, 8, 0],
            y: [0, 10, -8, 0],
          }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glare sweep */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-blue-900/5 to-transparent"
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
        />

        <div className="relative space-y-2">
          <span className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-blue-600">
            Build Your Own
          </span>
          <p className="text-sm text-neutral-600">{product.description}</p>
        </div>
      </div>
      <div className="space-y-2 px-3 pb-6 pt-3">
        <h3 className="text-md font-semibold text-black">{product.name}</h3>
        <Button asChild size="sm" className="w-full">
          <Link href={`/products/${product.slug}`}>Pick Your Poison</Link>
        </Button>
      </div>
    </Card>
  );
}
