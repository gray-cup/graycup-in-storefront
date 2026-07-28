"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { COFFEE_GRIND_OPTIONS } from "@/data/products";

type GrindSizeContextValue = {
  grindSize: string;
  setGrindSize: (grindSize: string) => void;
};

const GrindSizeContext = createContext<GrindSizeContextValue | null>(null);

export function GrindSizeProvider({ children }: { children: ReactNode }) {
  const [grindSize, setGrindSize] = useState(COFFEE_GRIND_OPTIONS[0]);
  return (
    <GrindSizeContext.Provider value={{ grindSize, setGrindSize }}>
      {children}
    </GrindSizeContext.Provider>
  );
}

export function useGrindSize() {
  const ctx = useContext(GrindSizeContext);
  if (!ctx) {
    throw new Error("useGrindSize must be used within a GrindSizeProvider");
  }
  return ctx;
}
