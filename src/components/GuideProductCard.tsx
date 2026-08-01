"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import { CURRENCY } from "@/lib/currency";
import { setBuyNowItem } from "@/lib/buy-now";

type GuideProductCardProps = {
  slug: string;
};

export function GuideProductCard({ slug }: GuideProductCardProps) {
  const product = getProductBySlug(slug);
  const router = useRouter();
  const pathname = usePathname();

  if (!product) return null;

  const cheapestVariant = product.variants.reduce((min, v) =>
    v.price < min.price ? v : min,
  );

  const handleBuyNow = () => {
    setBuyNowItem(
      { product, quantity: 1, selectedVariant: cheapestVariant },
      { label: "Back to Guide", href: pathname },
    );
    router.push("/checkout");
  };

  return (
    <div className="not-prose my-5 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3">
      <Link
        href={`/products/${product.slug}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:size-20"
      >
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.slug}`}
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
