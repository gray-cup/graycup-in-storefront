"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, ProductVariant } from "@/data/products/types";
import {
  type CartItem,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItemQuantity as updateCartItemQuantityUtil,
  clearCart as clearCartUtil,
  calculateCartTotal,
  getCartFromStorage,
  saveCartToStorage,
  getCartItemCount,
} from "@/lib/cart";

type CartContextType = {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  addToCart: (
    product: Product,
    quantity?: number,
    variant?: ProductVariant,
    packaging?: string,
    grind?: string
  ) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedItems = getCartFromStorage();
    setItems(storedItems);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveCartToStorage(items);
    }
  }, [items, isLoading]);

  const total = calculateCartTotal(items);
  const itemCount = getCartItemCount(items);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variant?: ProductVariant,
    packaging?: string,
    grind?: string
  ) => {
    setItems((currentItems) =>
      addToCartUtil(currentItems, product, quantity, variant, packaging, grind)
    );
  };

  const removeFromCart = (index: number) => {
    setItems((currentItems) => removeFromCartUtil(currentItems, index));
  };

  const updateQuantity = (index: number, quantity: number) => {
    setItems((currentItems) =>
      updateCartItemQuantityUtil(currentItems, index, quantity)
    );
  };

  const clearCart = () => {
    setItems(clearCartUtil());
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isLoading,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
