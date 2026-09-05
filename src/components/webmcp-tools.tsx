"use client";

// WebMCP tools: exposes the Gray Cup catalogue + cart to a browser AI agent
// (Chrome's document.modelContext). Mounted once from <RootProviders/>.
//
// IMPORTANT: `execute` callbacks must not close over React state —
// use-webmcp-tool does not re-register when `execute` changes. Everything is
// read through the static product data and the module-level cartBridge /
// navBridge (see @/lib/webmcp-cart-bridge).
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useWebMCP } from "use-webmcp-tool";
import {
  COFFEE_GRIND_OPTIONS,
  getProductBySlug,
  getProductsByCategory,
  retailProducts,
} from "@/data/products";
import type { Product } from "@/data/products/types";
import { productUrl } from "@/lib/product-url";
import { getQuizResult, resolveQuizProducts } from "@/lib/coffee-quiz";
import type { QuizAnswers } from "@/lib/coffee-quiz";
import { cartBridge, navBridge } from "@/lib/webmcp-cart-bridge";

// use-webmcp-tool aborts the browser's async registerTool() on unmount
// (StrictMode, route changes); Chrome rejects that promise with an AbortError
// nothing awaits. Expected lifecycle noise — keep it out of the console.
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as Error | undefined;
    if (
      reason?.name === "AbortError" &&
      String(reason.stack ?? "").includes("use-webmcp-tool")
    ) {
      event.preventDefault();
    }
  });
}

const readOnly = { readOnlyHint: true };
const mutating = { readOnlyHint: false };

const CATEGORIES = ["Tea", "Coffee", "Matcha", "Accessories"] as const;

function summariseProduct(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    category: p.category,
    quality: p.quality ?? null,
    roast: p.roast ?? null,
    brewStyle: p.brewStyle ?? null,
    flavourNotes: p.flavourNotes ?? [],
    priceFrom: p.priceRange.min,
    variants: p.variants.map((v) => ({ name: v.name, price: v.price })),
    availability: p.availability,
    url: productUrl(p),
    description: p.description,
  };
}

function findCartLine(slug: string, variant?: string) {
  const items = cartBridge.current?.items ?? [];
  return items.findIndex(
    (i) =>
      i.product.slug === slug &&
      (variant == null || i.selectedVariant?.name === variant),
  );
}

// ponytail: 30ms settle so the returned snapshot reflects the state update the
// mutation just triggered. Tool-call latency here is irrelevant.
const settle = () => new Promise((r) => setTimeout(r, 30));

function cartSnapshot() {
  const c = cartBridge.current;
  if (!c) return { lines: [], total: 0 };
  return {
    lines: c.items.map((i) => ({
      slug: i.product.slug,
      name: i.product.name,
      variant: i.selectedVariant?.name ?? null,
      grind: i.selectedGrind ?? null,
      quantity: i.quantity,
      unitPrice: i.selectedVariant?.price ?? i.product.priceRange.min,
    })),
    total: c.total,
    checkoutUrl: "https://graycup.in/checkout",
  };
}

// Only mounted when a WebMCP host (Chrome's document.modelContext, injected by
// an agent/extension) is actually present. On every normal browser this renders
// nothing and runs no hooks/effects/listeners, so it can't affect the site.
export function WebMCPTools() {
  const [hasHost, setHasHost] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.modelContext) {
      setHasHost(true);
      return;
    }
    // The host may be injected late by a content script; re-check for 15s.
    let attempts = 0;
    const timer = setInterval(() => {
      if (document.modelContext) {
        setHasHost(true);
        clearInterval(timer);
      } else if (++attempts >= 15) {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return hasHost ? <WebMCPToolsInner /> : null;
}

function WebMCPToolsInner() {
  const navigate = useNavigate();
  useEffect(() => {
    navBridge.current = navigate;
  }, [navigate]);

  useWebMCP({
    name: "search_products",
    description:
      "Search the Gray Cup catalogue by free text and/or category (Tea, Coffee, Matcha, Accessories). Returns product slugs, prices, flavour notes and key attributes. Use the slugs with the other tools.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text search over name, description and flavour notes." },
        category: { type: "string", enum: [...CATEGORIES] },
      },
      additionalProperties: false,
    },
    annotations: readOnly,
    execute: (args: { query?: string; category?: string }) => {
      let list: Product[] =
        args?.category === "Tea" || args?.category === "Coffee"
          ? getProductsByCategory(args.category)
          : retailProducts.filter(
              (p) => !args?.category || p.category === args.category,
            );
      const q = args?.query?.trim().toLowerCase();
      if (q) {
        list = list.filter((p) =>
          [p.name, p.description, p.longDescription ?? "", ...(p.flavourNotes ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(q),
        );
      }
      return { count: list.length, products: list.map(summariseProduct) };
    },
  });

  useWebMCP({
    name: "get_product_details",
    description:
      "Full detail for one product: long description, brew/roast/process info, every packaged variant with price and weight, and the product page URL.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: readOnly,
    execute: (args: { slug: string }) => {
      const p = getProductBySlug(args.slug);
      if (!p) throw new Error(`No product with slug "${args.slug}".`);
      return {
        ...summariseProduct(p),
        longDescription: p.longDescription ?? p.description,
        details: p.details,
        process: p.process ?? null,
        varietal: p.varietal ?? null,
        bitterness: p.bitterness ?? null,
        specs: p.specs ?? [],
        roastOptions: p.roastOptions ?? [],
        packaging: p.packaging,
        variants: p.variants.map((v) => ({
          name: v.name,
          price: v.price,
          weightGrams: v.weightGrams ?? null,
        })),
      };
    },
  });

  useWebMCP({
    name: "recommend_coffee",
    description:
      "Gray Cup's coffee-finder. Given how the user drinks coffee and their taste, returns a recommended coffee plus alternatives, the reasons, and a brew note. Ask the user the questions you need; only `style` and `reason` are required.",
    inputSchema: {
      type: "object",
      properties: {
        style: { type: "string", enum: ["black", "milk", "both"] },
        reason: { type: "string", enum: ["taste", "energy", "both"] },
        flavorBlack: {
          type: "string",
          enum: ["fruity", "chocolate", "nutty", "earthy", "unsure"],
          description: "For black/both drinkers.",
        },
        bitterness: {
          type: "string",
          enum: ["none", "light", "medium", "strong"],
          description: "For black/both drinkers.",
        },
        strengthMilk: {
          type: "string",
          enum: ["mild", "balanced", "strong", "very-strong"],
          description: "For milk drinkers.",
        },
        flavorMilk: {
          type: "string",
          enum: ["chocolate", "caramel", "nuts", "fruity", "unsure"],
          description: "For milk drinkers.",
        },
      },
      required: ["style", "reason"],
      additionalProperties: false,
    },
    annotations: readOnly,
    execute: (args: QuizAnswers) => {
      const result = getQuizResult(args);
      return {
        headline: result.headline,
        why: result.why,
        brewNote: result.brewNote,
        recommended: resolveQuizProducts(result).map(summariseProduct),
      };
    },
  });

  useWebMCP({
    name: "get_cart",
    description: "The current cart: lines with variant, grind and quantity, plus the total and the checkout URL.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: readOnly,
    execute: () => cartSnapshot(),
  });

  useWebMCP({
    name: "add_to_cart",
    description:
      "Add a product to the cart. Pass a `variant` name (e.g. \"250g\") when the product has more than one; if omitted the first is used. `grind` is optional for coffees. Returns the updated cart.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        variant: { type: "string" },
        grind: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 20 },
      },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: mutating,
    execute: async (args: {
      slug: string;
      variant?: string;
      grind?: string;
      quantity?: number;
    }) => {
      const cart = cartBridge.current;
      if (!cart) throw new Error("Cart is not ready yet.");
      const product = getProductBySlug(args.slug);
      if (!product) throw new Error(`No product with slug "${args.slug}".`);
      const variant = args.variant
        ? product.variants.find((v) => v.name === args.variant)
        : product.variants[0];
      if (args.variant && !variant) {
        throw new Error(
          `"${args.variant}" is not a variant of ${product.name}. Options: ${product.variants
            .map((v) => v.name)
            .join(", ")}.`,
        );
      }
      const isCoffee = product.category === "Coffee" && !product.isSamplePack;
      const grind = args.grind ?? (isCoffee ? COFFEE_GRIND_OPTIONS[0] : undefined);
      cart.addToCart(product, args.quantity ?? 1, variant, undefined, grind);
      await settle();
      return { added: product.name, variant: variant?.name ?? null, cart: cartSnapshot() };
    },
  });

  useWebMCP({
    name: "update_cart_quantity",
    description: "Set the quantity of a cart line (0 removes it). Identify the line by `slug` and, if ambiguous, `variant`.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string" },
        variant: { type: "string" },
        quantity: { type: "integer", minimum: 0, maximum: 20 },
      },
      required: ["slug", "quantity"],
      additionalProperties: false,
    },
    annotations: mutating,
    execute: async (args: { slug: string; variant?: string; quantity: number }) => {
      const cart = cartBridge.current;
      if (!cart) throw new Error("Cart is not ready yet.");
      const idx = findCartLine(args.slug, args.variant);
      if (idx < 0) throw new Error(`No cart line for "${args.slug}".`);
      cart.updateQuantity(idx, args.quantity);
      await settle();
      return cartSnapshot();
    },
  });

  useWebMCP({
    name: "remove_from_cart",
    description: "Remove a cart line, identified by `slug` and, if ambiguous, `variant`.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" }, variant: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: mutating,
    execute: async (args: { slug: string; variant?: string }) => {
      const cart = cartBridge.current;
      if (!cart) throw new Error("Cart is not ready yet.");
      const idx = findCartLine(args.slug, args.variant);
      if (idx < 0) throw new Error(`No cart line for "${args.slug}".`);
      cart.removeFromCart(idx);
      await settle();
      return cartSnapshot();
    },
  });

  useWebMCP({
    name: "apply_coupon",
    description:
      "Validate a discount code against the current cart. On success it is saved and applied automatically at checkout. Returns the discount amount or the reason it was rejected.",
    inputSchema: {
      type: "object",
      properties: { code: { type: "string" } },
      required: ["code"],
      additionalProperties: false,
    },
    annotations: mutating,
    execute: async (args: { code: string }) => {
      const cart = cartBridge.current;
      if (!cart || cart.items.length === 0) throw new Error("Cart is empty.");
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: args.code, items: cart.items }),
      });
      const data = (await res.json()) as {
        valid?: boolean;
        code?: string;
        discountAmount?: number;
        error?: string;
      };
      if (!res.ok || !data.valid) {
        return { applied: false, error: data.error ?? "Invalid coupon code." };
      }
      try {
        localStorage.setItem("graycup_coupon_code", data.code!);
      } catch {
        /* private mode – checkout still lets the user re-enter it */
      }
      return { applied: true, code: data.code, discountAmount: data.discountAmount };
    },
  });

  useWebMCP({
    name: "go_to_checkout",
    description:
      "Navigate the browser to the checkout page. Only call when the user explicitly wants to check out / place the order — Gray Cup checkout still needs the user to enter address and pay.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: mutating,
    execute: () => {
      navBridge.current?.("/checkout");
      return { navigatedTo: "/checkout" };
    },
  });

  return null;
}
