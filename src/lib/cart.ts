import type { Product, ProductVariant } from "@/data/products/types";

export type CartItem = {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  selectedPackaging?: string;
  selectedGrind?: string;
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
  grind?: string
): CartItem[] {
  const existingItemIndex = currentItems.findIndex(
    (item) =>
      item.product.slug === product.slug &&
      item.selectedVariant?.name === variant?.name &&
      item.selectedPackaging === packaging &&
      item.selectedGrind === grind
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
  return items.reduce((count, item) => count + item.quantity, 0);
}
