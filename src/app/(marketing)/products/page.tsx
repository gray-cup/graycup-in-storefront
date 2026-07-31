"use client";

import { useState, useMemo } from "react";
import { retailProducts } from "@/data/products";
import { ProductCard } from "@/components/products";
import { Search } from "lucide-react";

type CategoryFilter = "All" | "Tea" | "Coffee";
type SortOption = "none" | "price-asc" | "price-desc";

export default function ProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("none");

  const filteredProducts = useMemo(() => {
    let result = retailProducts;

    if (categoryFilter !== "All") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    if (sort !== "none") {
      result = result.slice().sort((a, b) => {
        const diff = a.priceRange.min - b.priceRange.min;
        return sort === "price-asc" ? diff : -diff;
      });
    }

    return result;
  }, [categoryFilter, search, sort]);

  const categories: { value: CategoryFilter; label: string }[] = [
    { value: "All", label: "All Products" },
    { value: "Tea", label: "Tea" },
    { value: "Coffee", label: "Coffee" },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "none", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
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
              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No products found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
