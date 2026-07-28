"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Product } from "@/data/products";
import { CURRENCY } from "@/lib/currency";
import { ProcessBadge } from "./ProcessBadge";

type ProductCardProps = {
  product: Product;
  showPrice?: boolean;
};

export function ProductCard({ product, showPrice = true }: ProductCardProps) {
  const minPrice = Math.min(...product.variants.map((v) => v.price));

  const card = (
    <Card className="group overflow-hidden rounded-lg bg-neutral-50 p-0 cursor-pointer transition-all">
      <div className="aspect-square relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          draggable={false}
          className={`object-cover${product.comingSoon ? " opacity-40" : ""}`}
        />

        {product.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded">
              Coming Soon
            </span>
          </div>
        )}

        {!product.comingSoon && product.categoryTwo && (
          <span className="absolute top-2 right-2 bg-green-600 px-2 py-1 rounded text-xs font-medium text-white capitalize">
            {product.categoryTwo}
          </span>
        )}

        {product.process && (
          <ProcessBadge
            process={product.process}
            className="absolute bottom-2 left-2 bg-white/90 rounded-full px-2.5 py-1"
          />
        )}

        {product.process && product.flavourNotes && product.flavourNotes.length > 0 && (
          <div className="absolute inset-0 flex flex-col justify-end bg-black/75 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ProcessBadge process={product.process} className="text-white mb-1.5" />
            <p className="text-xs text-white/90 leading-relaxed">
              {product.flavourNotes.join(" · ")}
            </p>
          </div>
        )}
      </div>
      <div className="px-3 pb-6">
        <h3 className="text-md hover:underline font-semibold text-black">
          {product.name}
        </h3>
        {showPrice && !product.comingSoon && (
          <p className="text-sm text-muted-foreground mt-1">
            From {CURRENCY.symbol}
            {minPrice.toLocaleString(CURRENCY.locale)}
          </p>
        )}
        {product.comingSoon && (
          <p className="text-sm text-muted-foreground mt-1">Available soon</p>
        )}
      </div>
    </Card>
  );

  if (product.comingSoon) return <div>{card}</div>;

  return <Link href={`/products/${product.slug}`}>{card}</Link>;
}
