import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/data/products";
import { CURRENCY } from "@/lib/currency";

type GuideProductCardProps = {
  slug: string;
};

export function GuideProductCard({ slug }: GuideProductCardProps) {
  const product = getProductBySlug(slug);
  if (!product) return null;

  const minPrice = Math.min(...product.variants.map((v) => v.price));

  return (
    <Link
      href={`/products/${product.slug}`}
      className="not-prose group my-5 flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 sm:size-20">
        <Image src={product.image} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-semibold text-neutral-900 group-hover:underline sm:text-base">
          {product.name}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500 sm:text-sm">
          From {CURRENCY.symbol}
          {minPrice.toLocaleString(CURRENCY.locale)}
        </p>
      </div>
      <span className="shrink-0 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white sm:text-sm">
        View
      </span>
    </Link>
  );
}
