"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/products";
import { PickYourPoisonCard } from "./PickYourPoisonCard";
import type { Product } from "@/data/products/types";

type SamplePacksSectionProps = {
  products: Product[];
  delay?: number;
};

export function SamplePacksSection({ products, delay = 0 }: SamplePacksSectionProps) {
  const pickYourPoison = products.find((p) => p.slug === "pick-your-poison-sampler");
  const fixedPacks = products.filter((p) => p.slug !== "pick-your-poison-sampler");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="mb-12"
    >
      <h2 className="text-2xl font-semibold text-neutral-900 mb-6 font-instrument-sans">
        Sample Packs
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fixedPacks.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
        {pickYourPoison && <PickYourPoisonCard product={pickYourPoison} />}
      </div>
    </motion.div>
  );
}
