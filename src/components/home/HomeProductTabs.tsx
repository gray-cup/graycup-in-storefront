"use client";

import { useState } from "react";
import { ProductCard } from "@/components/products";
import { PickYourPoisonCard } from "./PickYourPoisonCard";
import type { Product } from "@/data/products";

type TabValue = "all" | "tea" | "ground-coffee" | "coffee-blends" | "specialty-coffee";

type HomeProductTabsProps = {
  teaProducts: Product[];
  samplePackProducts: Product[];
  groundCoffeeProducts: Product[];
  coffeeBlendProducts: Product[];
  specialtyCoffeeProducts: Product[];
};

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}

function ProductSection({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-neutral-900 mb-6 font-instrument-sans">
        {title}
      </h3>
      <ProductGrid products={products} />
    </div>
  );
}

function SamplePacksProductSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const pickYourPoison = products.find((p) => p.slug === "pick-your-poison-sampler");
  const fixedPacks = products.filter((p) => p.slug !== "pick-your-poison-sampler");

  return (
    <div className="mb-12">
      <h3 className="text-xl font-semibold text-neutral-900 mb-6 font-instrument-sans">
        Sample Packs
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fixedPacks.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
        {pickYourPoison && <PickYourPoisonCard product={pickYourPoison} />}
      </div>
    </div>
  );
}

export function HomeProductTabs({
  teaProducts,
  samplePackProducts,
  groundCoffeeProducts,
  coffeeBlendProducts,
  specialtyCoffeeProducts,
}: HomeProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const tabs: { value: TabValue; label: string }[] = [
    { value: "all", label: "All" },
    { value: "tea", label: "Tea" },
    { value: "ground-coffee", label: "Ground Coffee" },
    { value: "coffee-blends", label: "Coffee Blends" },
    { value: "specialty-coffee", label: "Specialty Coffee" },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "all" && (
        <div>
          <ProductSection title="Tea" products={teaProducts} />
          <SamplePacksProductSection products={samplePackProducts} />
          <ProductSection title="Ground Coffee" products={groundCoffeeProducts} />
          <ProductSection title="Coffee Blends" products={coffeeBlendProducts} />
          <ProductSection title="Specialty Coffee" products={specialtyCoffeeProducts} />
        </div>
      )}
      {activeTab === "tea" && <ProductGrid products={teaProducts} />}
      {activeTab === "ground-coffee" && <ProductGrid products={groundCoffeeProducts} />}
      {activeTab === "coffee-blends" && <ProductGrid products={coffeeBlendProducts} />}
      {activeTab === "specialty-coffee" && <ProductGrid products={specialtyCoffeeProducts} />}
    </div>
  );
}
