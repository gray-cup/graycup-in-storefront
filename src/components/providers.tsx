"use client";

import React from "react";
import { CartProvider } from "@/components/cart-provider";
import { WebMCPTools } from "@/components/webmcp-tools";
import { Toaster } from "@/components/ui/sonner";

interface RootProvidersProps {
  children: React.ReactNode;
}

export default function RootProviders({ children }: RootProvidersProps) {
  return (
    <CartProvider>
      {children}
      <WebMCPTools />
      <Toaster />
    </CartProvider>
  );
}
