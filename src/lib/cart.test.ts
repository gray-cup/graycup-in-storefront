import {
  calculateDeliveryCharge,
  getWholesaleShippingCharge,
  FREE_DELIVERY_THRESHOLD,
  SAMPLE_DELIVERY_CHARGE,
  SAMPLE_FREE_DELIVERY_THRESHOLD,
  VRL_MIN_WEIGHT_KG,
} from "./cart";
import type { CartItem } from "./cart";
import type { Product } from "@/data/products/types";

const mk = (price: number, opts: Partial<Product> = {}): CartItem => ({
  product: { priceRange: { min: price }, ...opts } as Product,
  quantity: 1,
  selectedVariant: { name: "x", price } as never,
});

// below threshold, normal item -> flat rate
console.assert(calculateDeliveryCharge([mk(200)], 40) === 40);
// at/above threshold -> free
console.assert(calculateDeliveryCharge([mk(FREE_DELIVERY_THRESHOLD)], 40) === 0);
// speciality item ships free even below threshold
console.assert(calculateDeliveryCharge([mk(150, { freeShipping: true })], 40) === 0);
// wholesale order weight looks up the flat rate card, not the per-unit flat rate
console.assert(
  calculateDeliveryCharge(
    [
      {
        ...mk(9000, { isWholesale: true }),
        selectedVariant: { name: "5kg", price: 9000, weightGrams: 5000 } as never,
      },
    ],
    40,
  ) === getWholesaleShippingCharge(5),
);
console.assert(getWholesaleShippingCharge(0.5) === 100);
console.assert(getWholesaleShippingCharge(10) === 450);
console.assert(getWholesaleShippingCharge(100) === 2761);
// VRL Logistics only zeroes the charge once the order actually crosses the threshold
console.assert(
  calculateDeliveryCharge(
    [
      {
        ...mk(120000, { isWholesale: true }),
        selectedVariant: { name: "100kg", price: 120000, weightGrams: 100000 } as never,
      },
    ],
    40,
    "vrl",
  ) === 0,
);
console.assert(
  calculateDeliveryCharge(
    [
      {
        ...mk(6000, { isWholesale: true }),
        selectedVariant: { name: "5kg", price: 6000, weightGrams: VRL_MIN_WEIGHT_KG * 1000 - 5000 } as never,
      },
    ],
    40,
    "vrl",
  ) > 0,
);

// sample pack below its ₹1,000 threshold -> flat ₹50, not the ₹40 retail rate
console.assert(
  calculateDeliveryCharge([mk(600, { isSamplePack: true })], 40) === SAMPLE_DELIVERY_CHARGE,
);
// sample pack above ₹1,000 -> free
console.assert(
  calculateDeliveryCharge(
    [mk(SAMPLE_FREE_DELIVERY_THRESHOLD + 1, { isSamplePack: true })],
    40,
  ) === 0,
);

console.log("cart delivery checks passed");
