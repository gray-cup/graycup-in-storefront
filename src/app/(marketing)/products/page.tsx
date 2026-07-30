"use client";

import { useState, useMemo } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/products";

type CategoryFilter = "All" | "Tea" | "Coffee";

export default function ProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "All") return products;
    return products.filter((product) => product.category === categoryFilter);
  }, [categoryFilter]);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "All", label: "All Products" },
    { value: "Tea", label: "Tea" },
    { value: "Coffee", label: "Coffee" },
  ];

  return (
    <div className="px-4 lg:px-6">
      <div className="min-h-dvh py-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className=" text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold text-black mb-4">
              Our Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Premium quality tea and coffee selections
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Filters Sidebar */}
            <aside className="lg:w-56 shrink-0">
              <div className="sticky top-24">
                <h2 className="text-sm font-semibold text-black mb-4 uppercase tracking-wide">
                  Category
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => setCategoryFilter(category.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        categoryFilter === category.value
                          ? "bg-black text-white"
                          : "text-muted-foreground hover:bg-gray-100"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No products found for this category.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
