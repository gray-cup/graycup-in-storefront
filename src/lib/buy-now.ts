import type { CartItem } from "./cart";

const BUY_NOW_STORAGE_KEY = "graycup_buy_now_item";

export type BuyNowSource = {
  label: string;
  href: string;
};

export type BuyNowEntry = {
  item: CartItem;
  source?: BuyNowSource;
};

export function setBuyNowItem(item: CartItem, source?: BuyNowSource): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify({ item, source }));
}

export function getBuyNowEntry(): BuyNowEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearBuyNowItem(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
}
