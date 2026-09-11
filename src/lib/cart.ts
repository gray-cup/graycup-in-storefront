import type { Product, ProductVariant } from "@/data/products/types";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedPackaging?: string;
  selectedGrind?: string;
  selectedRoast?: string;
  selectedBlendRatio?: string;
  selectedSamples?: string[];
};

export type Cart = {
  items: CartItem[];
  total: number;
};

const CART_STORAGE_KEY = "graycup_cart";

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    const itemPrice = item.selectedVariant?.price ?? item.product.priceRange.min;
    return total + itemPrice * item.quantity;
  }, 0);
}

// Free-delivery threshold: a cart (or Buy Now) subtotal at/above this ships the
// flat-rate portion free. Speciality coffee (product.freeShipping) always ships
// free on its own line regardless of subtotal.
export const FREE_DELIVERY_THRESHOLD = 400;

// Sample packs (Pick Your Poison etc.) ship at a flat ₹50, free once the
// sampler line subtotal goes above ₹1,000. Priced as its own bucket so it
// doesn't stack with the regular flat retail rate.
export const SAMPLE_DELIVERY_CHARGE = 50;
export const SAMPLE_FREE_DELIVERY_THRESHOLD = 1000;

// Courier rate card for wholesale (isWholesale) coffee, keyed by the order's
// TOTAL wholesale weight in kg (not per line) - each entry is "at or below
// this many kg, charge this much". Anything past 100kg falls back to the
// 100kg rate; buyers that heavy should be using VRL Logistics instead (see
// VRL_MIN_WEIGHT_KG below).
const WHOLESALE_SHIPPING_TABLE: [maxKg: number, charge: number][] = [
  [1, 130],
  [2, 205],
  [3, 260],
  [4, 300],
  [5, 270],
  [6, 310],
  [7, 350],
  [8, 400],
  [9, 440],
  [10, 450],
  [20, 846],
  [30, 1080],
  [40, 1320],
  [50, 1560],
  [60, 1800],
  [70, 2040],
  [80, 2280],
  [90, 2530],
  [100, 2761],
];

export function getWholesaleShippingCharge(totalWeightKg: number): number {
  if (totalWeightKg <= 0) return 0;
  if (totalWeightKg < 1) return 100;
  for (const [maxKg, charge] of WHOLESALE_SHIPPING_TABLE) {
    if (totalWeightKg <= maxKg) return charge;
  }
  return WHOLESALE_SHIPPING_TABLE[WHOLESALE_SHIPPING_TABLE.length - 1][1];
}

export function getWholesaleWeightKg(items: CartItem[]): number {
  return items.reduce((total, item) => {
    if (!item.product.isWholesale) return total;
    return total + ((item.selectedVariant?.weightGrams ?? 0) * item.quantity) / 1000;
  }, 0);
}

// VRL Logistics is a freight-collect carrier the buyer can pick instead of the
// metered courier rate above, but only once the order is heavy enough that
// freight actually makes sense - below this it stays selectable-but-disabled
// in the UI. Picking it charges nothing online; the buyer pays VRL directly
// when their warehouse receives the shipment.
export const VRL_MIN_WEIGHT_KG = 50;
export type ShippingMethod = "standard" | "vrl";

// Falls back to `flatRate` only for the portion of the cart made up of
// non-wholesale items (regular retail packs), and only when the subtotal is
// below the free-delivery threshold.
export function calculateDeliveryCharge(
  items: CartItem[],
  flatRate: number,
  shippingMethod: ShippingMethod = "standard",
): number {
  let fixedDelivery = 0;
  let hasFlatRateItem = false;
  let samplePackSubtotal = 0;

  for (const item of items) {
    if (item.product.isWholesale) continue;
    const charge = item.selectedVariant?.deliveryCharge;
    const price = item.selectedVariant?.price ?? item.product.priceRange.min;
    if (charge != null) {
      // A handful of non-wholesale SKUs (e.g. small Darjeeling batches) carry
      // their own fixed per-unit shipping cost instead of the flat rate.
      fixedDelivery += charge * item.quantity;
    } else if (item.product.isSamplePack) {
      samplePackSubtotal += price * item.quantity;
    } else if (!item.product.freeShipping) {
      hasFlatRateItem = true;
    }
  }

  const wholesaleKg = getWholesaleWeightKg(items);
  const useVrl = shippingMethod === "vrl" && wholesaleKg > VRL_MIN_WEIGHT_KG;
  const wholesaleDelivery = wholesaleKg > 0 && !useVrl ? getWholesaleShippingCharge(wholesaleKg) : 0;

  const subtotal = calculateCartTotal(items);
  const flat = hasFlatRateItem && subtotal < FREE_DELIVERY_THRESHOLD ? flatRate : 0;
  const sampleFlat =
    samplePackSubtotal > 0 && samplePackSubtotal <= SAMPLE_FREE_DELIVERY_THRESHOLD
      ? SAMPLE_DELIVERY_CHARGE
      : 0;
  return wholesaleDelivery + fixedDelivery + flat + sampleFlat;
}

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Handle storage errors silently
  }
}

export function addToCart(
  currentItems: CartItem[],
  product: Product,
  quantity: number = 1,
  variant?: ProductVariant,
  packaging?: string,
  grind?: string,
  samples?: string[],
  roast?: string,
  blendRatio?: string
): CartItem[] {
  const samplesKey = samples?.join(",");

  const existingItemIndex = currentItems.findIndex(
    (item) =>
      item.product.slug === product.slug &&
      item.selectedVariant?.name === variant?.name &&
      item.selectedPackaging === packaging &&
      item.selectedGrind === grind &&
      item.selectedRoast === roast &&
      item.selectedBlendRatio === blendRatio &&
      item.selectedSamples?.join(",") === samplesKey
  );

  if (existingItemIndex > -1) {
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
    };
    return updatedItems;
  }

  return [
    ...currentItems,
    {
      product,
      quantity,
      selectedVariant: variant,
      selectedPackaging: packaging,
      selectedGrind: grind,
      selectedRoast: roast,
      selectedBlendRatio: blendRatio,
      selectedSamples: samples,
    },
  ];
}

export function removeFromCart(currentItems: CartItem[], index: number): CartItem[] {
  return currentItems.filter((_, i) => i !== index);
}

export function updateCartItemQuantity(
  currentItems: CartItem[],
  index: number,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(currentItems, index);
  }

  const updatedItems = [...currentItems];
  updatedItems[index] = {
    ...updatedItems[index],
    quantity,
  };
  return updatedItems;
}

export function clearCart(): CartItem[] {
  return [];
}

export function getCartItemCount(items: CartItem[]): number {
  return items.length;
}
