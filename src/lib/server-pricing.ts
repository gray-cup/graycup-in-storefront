import { getProductBySlug } from "@/data/products";
import type { Product, ProductVariant } from "@/data/products";
import type { CartItem } from "@/lib/cart";

// Server-side pricing authority. The client sends whole product/variant objects
// pulled from localStorage - never trust any price, priceRange, or salePrice on
// them. Re-derive every line's unit price from the real catalog by slug + variant
// name and throw on anything that doesn't resolve.
export class PricingError extends Error {}

function trustedUnitPrice(item: CartItem): number {
  const product = getProductBySlug(item.product?.slug);
  if (!product) {
    throw new PricingError(`Unknown product: ${item.product?.slug ?? "(none)"}`);
  }

  // Pick-your-poison sampler: price is (per-sample price) x (samples chosen).
  // The client builds a synthetic variant named "N x <grams>g samples: ...".
  if (product.isSamplePack && (item.selectedSamples?.length ?? 0) > 0) {
    const grams = Number(/(\d+)g samples/.exec(item.selectedVariant?.name ?? "")?.[1]);
    const size =
      product.variants.find((v) => v.weightGrams === grams) ?? product.variants[0];
    return size.price * item.selectedSamples!.length;
  }

  const wantVariant = item.selectedVariant?.name;
  if (wantVariant) {
    const v = product.variants.find((x) => x.name === wantVariant);
    if (!v) {
      throw new PricingError(`Unknown variant "${wantVariant}" for ${product.slug}`);
    }
    return v.price;
  }

  return product.priceRange.min;
}

// ── Subscriptions ──────────────────────────────────────────────────────────
// The subscription builder sends only slug + variant name per line; every price
// and the display label are rebuilt here from the catalog.
export type SubLineInput = {
  slug: string;
  variantName?: string;
  quantity?: number;
  grind?: string;
};

function resolveVariant(product: Product, variantName?: string): ProductVariant {
  if (variantName) {
    const v = product.variants.find((x) => x.name === variantName);
    if (!v) throw new PricingError(`Unknown variant "${variantName}" for ${product.slug}`);
    return v;
  }
  return (
    product.variants.find((v) => v.name.replace(/\s/g, "").toLowerCase() === "250g") ??
    product.variants[0]
  );
}

export function repriceSubscription(
  primary: SubLineInput,
  addons: SubLineInput[] = [],
): { items: { name: string; price: number }[]; monthlyTotal: number } {
  const p = getProductBySlug(primary.slug);
  if (!p) throw new PricingError(`Unknown product: ${primary.slug ?? "(none)"}`);

  const qty = Math.min(99, Math.max(1, Math.floor(Number(primary.quantity) || 1)));
  const pv = resolveVariant(p, primary.variantName);
  const isCoffee = p.category === "Coffee";
  const label = [pv.name, isCoffee ? primary.grind : null].filter(Boolean).join(", ");

  const items = [
    { name: `${p.name} (${label})${qty > 1 ? ` x${qty}` : ""}`, price: pv.price * qty },
  ];

  for (const a of addons) {
    const ap = getProductBySlug(a.slug);
    if (!ap) throw new PricingError(`Unknown add-on product: ${a.slug ?? "(none)"}`);
    const av = resolveVariant(ap, a.variantName);
    items.push({ name: `${ap.name} (${av.name})`, price: av.price });
  }

  const monthlyTotal = items.reduce((sum, l) => sum + l.price, 0);
  return { items, monthlyTotal };
}

// Returns the trusted subtotal and a copy of `items` with catalog-correct prices,
// safe to snapshot into the order record.
export function repriceCartItems(items: CartItem[]): { subtotal: number; items: CartItem[] } {
  let subtotal = 0;
  const priced = items.map((item) => {
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const unit = trustedUnitPrice(item);
    subtotal += unit * qty;
    return {
      ...item,
      quantity: qty,
      selectedVariant: item.selectedVariant
        ? { ...item.selectedVariant, price: unit }
        : { name: "Standard", price: unit },
    };
  });
  return { subtotal, items: priced };
}
