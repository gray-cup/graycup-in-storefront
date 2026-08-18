"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/products";
import type { Product } from "@/data/products";

type TabValue = "all" | "tea" | "ground-coffee" | "coffee-blends" | "specialty-coffee";

type HomeProductTabsProps = {
  teaProducts: Product[];
  groundCoffeeProducts: Product[];
  coffeeBlendProducts: Product[];
  specialtyCoffeeProducts: Product[];
};

export function HomeProductTabs({
  teaProducts,
  groundCoffeeProducts,
  coffeeBlendProducts,
  specialtyCoffeeProducts,
}: HomeProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("all");

  const allProducts = useMemo(
    () => [...teaProducts, ...groundCoffeeProducts, ...coffeeBlendProducts, ...specialtyCoffeeProducts],
    [teaProducts, groundCoffeeProducts, coffeeBlendProducts, specialtyCoffeeProducts]
  );

  const tabs: { value: TabValue; label: string; products: Product[] }[] = [
    { value: "all", label: "All", products: allProducts },
    { value: "tea", label: "Tea", products: teaProducts },
    { value: "ground-coffee", label: "Ground Coffee", products: groundCoffeeProducts },
    { value: "coffee-blends", label: "Coffee Blends", products: coffeeBlendProducts },
    { value: "specialty-coffee", label: "Specialty Coffee", products: specialtyCoffeeProducts },
  ];

  const activeProducts = tabs.find((tab) => tab.value === activeTab)?.products ?? [];

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

      {activeProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {activeProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground py-12">No products in this category yet.</p>
      )}
    </div>
  );
}
