import type { Product } from "./types";

export const instantCoffeeProducts: Product[] = [
  {
    slug: "instant-coffee-spray-dried",
    name: "Instant Coffee (Spray Dried)",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/roasted-coffee-beans.png"],
    description:
      "Premium spray-dried instant coffee with excellent solubility and rich coffee flavor for quick preparation.",
    longDescription:
      "Our spray-dried instant coffee is manufactured using advanced processing technology to preserve the authentic coffee taste. The fine powder dissolves instantly in hot or cold water, making it perfect for busy commercial kitchens, vending machines, and ready-to-drink applications. Available in various intensities to match your requirements.",
    details: [
      "Instant solubility",
      "Rich authentic taste",
      "No residue formula",
      "Hot and cold compatible",
      "Consistent quality",
      "Long shelf life",
    ],
    locations: ["Chikmagalur", "Coorg", "Wayanad"],
    category: "Coffee",
    priceRange: {
      min: 149,
      max: 599,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "100g", price: 149 },
      { name: "250g", price: 329 },
      { name: "500g", price: 599 },
    ],
    packaging: ["100g pack", "250g pack", "500g pack"],
    sku: "GC-COF-ISD-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "instant-coffee-freeze-dried",
    name: "Instant Coffee (Freeze Dried)",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/green-coffee-beans.png", "/products/roasted-coffee-beans.png"],
    description:
      "Superior freeze-dried instant coffee that retains maximum aroma and delivers a café-quality experience.",
    longDescription:
      "Our freeze-dried instant coffee represents the pinnacle of instant coffee technology. The low-temperature freeze-drying process locks in volatile aromatics and flavor compounds, resulting in a product that closely mimics freshly brewed coffee. Ideal for premium retail products and specialty food service applications.",
    details: [
      "Superior aroma retention",
      "Café-quality taste",
      "Crystal granule format",
      "Premium bean selection",
      "No artificial additives",
      "Perfect for specialty retail",
    ],
    locations: ["Coorg", "Chikmagalur", "Araku Valley"],
    category: "Coffee",
    priceRange: {
      min: 249,
      max: 999,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "100g", price: 249 },
      { name: "250g", price: 549 },
      { name: "500g", price: 999 },
    ],
    packaging: ["100g pack", "250g pack", "500g pack"],
    sku: "GC-COF-IFD-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "instant-coffee-chicory-blend",
    name: "Instant Coffee Chicory Blend",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/roasted-coffee-beans.png"],
    description:
      "Traditional South Indian style instant coffee blended with chicory for a rich, smooth flavor profile.",
    longDescription:
      "Our Instant Coffee Chicory Blend brings the beloved South Indian filter coffee taste in an instant format. The carefully balanced ratio of coffee and chicory creates a full-bodied, slightly sweet brew with reduced bitterness. Perfect for traditional coffee lovers who want convenience without compromising on authentic taste.",
    details: [
      "Authentic South Indian taste",
      "Coffee-chicory balanced blend",
      "Smooth and less bitter",
      "Rich dark color",
      "Traditional flavor profile",
      "Economical choice",
    ],
    locations: ["Chikmagalur", "Coorg", "Salem"],
    category: "Coffee",
    priceRange: {
      min: 99,
      max: 429,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "100g", price: 99 },
      { name: "250g", price: 229 },
      { name: "500g", price: 429 },
    ],
    packaging: ["100g pack", "250g pack", "500g pack"],
    sku: "GC-COF-ICB-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
