"use client";

import { Link, useNavigate, useLocation } from "react-router";
import { getProductBySlug } from "@/data/products";
import { productPath } from "@/lib/product-url";
import { CURRENCY } from "@/lib/currency";
import { setBuyNowItem } from "@/lib/buy-now";

type GuideProductCardProps = {
  slug: string;
  vertical?: boolean;
};

export function GuideProductCard({ slug, vertical = false }: GuideProductCardProps) {
  const product = getProductBySlug(slug);
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  if (!product) return null;

  const cheapestVariant = product.variants.reduce((min, v) =>
    v.price < min.price ? v : min,
  );

  const handleBuyNow = () => {
    setBuyNowItem(
      { product, quantity: 1, selectedVariant: cheapestVariant },
      { label: "Back to Guide", href: pathname },
    );
    navigate("/checkout");
  };

  if (vertical) {
    return (
      <div className="not-prose flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <Link
          to={productPath(product)}
          className="relative aspect-square w-full overflow-hidden bg-neutral-100"
        >
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </Link>
        <div className="flex flex-1 flex-col p-3">
          <Link
            to={productPath(product)}
            className="block text-sm font-semibold text-neutral-900 hover:text-neutral-700"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-xs text-neutral-500">
            From {CURRENCY.symbol}
            {cheapestVariant.price.toLocaleString(CURRENCY.locale)}
          </p>
          <button
            type="button"
            onClick={handleBuyNow}
            className="mt-3 w-full cursor-pointer rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose my-5 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3">
      <Link
        to={productPath(product)}
        className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:size-20"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={productPath(product)}
          className="block truncate text-sm font-semibold text-neutral-900 hover:text-neutral-700 sm:text-base"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">
          From {CURRENCY.symbol}
          {cheapestVariant.price.toLocaleString(CURRENCY.locale)}
        </p>
      </div>
      <button
        type="button"
        onClick={handleBuyNow}
        className="shrink-0 cursor-pointer rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 sm:text-base"
      >
        Buy Now
      </button>
    </div>
  );
}
