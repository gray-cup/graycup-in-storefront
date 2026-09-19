import type { Product } from "@/data/products";
import { CURRENCY } from "@/lib/currency";

export function ComingSoonNotice({ product }: { product: Product }) {
  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
      <div>
        <p className="font-semibold text-black">Coming soon</p>
        <p className="text-sm text-muted-foreground">
          This coffee isn&apos;t available to order yet. Planned pricing:
        </p>
      </div>
      <dl className="space-y-1 text-sm">
        {product.variants.map((v) => (
          <div key={v.name} className="flex justify-between">
            <dt className="text-muted-foreground">{v.name}</dt>
            <dd className="font-medium">
              {CURRENCY.symbol}
              {v.price.toLocaleString(CURRENCY.locale)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
