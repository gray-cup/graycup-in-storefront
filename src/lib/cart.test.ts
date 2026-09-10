import {
  calculateDeliveryCharge,
  FREE_DELIVERY_THRESHOLD,
  SAMPLE_DELIVERY_CHARGE,
  SAMPLE_FREE_DELIVERY_THRESHOLD,
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
// wholesale variant delivery charge still applies + no flat rate item
console.assert(
  calculateDeliveryCharge(
    [{ ...mk(9000), selectedVariant: { name: "5kg", price: 9000, deliveryCharge: 500 } as never }],
    40,
  ) === 500,
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
