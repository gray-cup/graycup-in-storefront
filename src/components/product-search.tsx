"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { products } from "@/data/products";

export function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((product) => product.name.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  function goToProduct(slug: string) {
    setOpen(false);
    navigate(`/products/${slug}`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="hidden items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 sm:flex"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="whitespace-nowrap">Search products...</span>
        <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-neutral-300 bg-white px-1.5 py-0.5 font-sans text-xs text-neutral-500">
          ⌘K
        </kbd>
      </button>

      <button
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="inline-flex items-center rounded-md p-2 hover:bg-neutral-100 sm:hidden"
      >
        <Search className="h-5 w-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-24 translate-y-0 max-w-xl">
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <textarea
            autoFocus
            rows={1}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (results[0]) goToProduct(results[0].slug);
              }
            }}
            placeholder="Search products..."
            className="w-full resize-none rounded-md border border-neutral-200 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
          />

          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
              {results.map((product) => (
                <li key={product.slug}>
                  <button
                    onClick={() => goToProduct(product.slug)}
                    className="flex w-full items-center gap-3 py-2 text-left hover:bg-neutral-50 rounded-md px-2"
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-black line-clamp-1">{product.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {query.trim() && results.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">No products found.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
