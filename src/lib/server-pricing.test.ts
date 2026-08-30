import { repriceCartItems, repriceSubscription, PricingError } from "./server-pricing";
import { products, getProductBySlug } from "@/data/products";
import type { CartItem } from "./cart";

const real = products.find((p) => !p.isSamplePack && p.variants.length > 0)!;
const realVariant = real.variants[0];

// A client trying to pay ₹1 for a real product -> server ignores the fake price.
const tampered: CartItem = {
  product: { ...real, priceRange: { ...real.priceRange, min: 1 } } as never,
  quantity: 2,
  selectedVariant: { ...realVariant, price: 1 },
};
const out = repriceCartItems([tampered]);
console.assert(out.subtotal === realVariant.price * 2, `expected ${realVariant.price * 2}, got ${out.subtotal}`);
console.assert(out.items[0].selectedVariant!.price === realVariant.price);

// Unknown product is rejected.
let threw = false;
try {
  repriceCartItems([{ product: { slug: "not-real" } as never, quantity: 1 }]);
} catch (e) {
  threw = e instanceof PricingError;
}
console.assert(threw, "unknown product should throw PricingError");

// Unknown variant is rejected.
threw = false;
try {
  repriceCartItems([{ product: real as never, quantity: 1, selectedVariant: { name: "999kg", price: 5 } }]);
} catch (e) {
  threw = e instanceof PricingError;
}
console.assert(threw, "unknown variant should throw");

// Pick-your-poison: price = per-sample x count, not the client figure.
const pyp = getProductBySlug("pick-your-poison-sampler");
if (pyp) {
  const size = pyp.variants[0];
  const r = repriceCartItems([
    {
      product: pyp as never,
      quantity: 1,
      selectedVariant: { name: `3 x ${size.weightGrams}g samples: a, b, c`, price: 1 },
      selectedSamples: ["a", "b", "c"],
    },
  ]);
  console.assert(r.subtotal === size.price * 3, `pyp expected ${size.price * 3}, got ${r.subtotal}`);
}

// Subscription re-pricing: catalog price wins, unknown slug throws.
const subProduct = products.find((p) => p.category === "Coffee" && !p.isSamplePack && !p.isWholesale)!;
const sv = subProduct.variants[0];
const sub = repriceSubscription(
  { slug: subProduct.slug, variantName: sv.name, quantity: 2, grind: "French Press" },
  [],
);
console.assert(sub.monthlyTotal === sv.price * 2, `sub expected ${sv.price * 2}, got ${sub.monthlyTotal}`);
console.assert(sub.items[0].price === sv.price * 2);

let subThrew = false;
try {
  repriceSubscription({ slug: "nope" }, []);
} catch (e) {
  subThrew = e instanceof PricingError;
}
console.assert(subThrew, "unknown subscription slug should throw");

console.log("server-pricing checks passed");
