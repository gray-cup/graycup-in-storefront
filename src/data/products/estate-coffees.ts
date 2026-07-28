import type { Product } from "./types";

export const estateCoffeeProducts: Product[] = [
  {
    slug: "karadykan-estate-coffee",
    name: "Karadykan Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/roasted-coffee-beans.png", "/products/green-coffee-beans.png"],
    description:
      "Single-estate Arabica coffee from Karadykan Estate, grown under native shade cover with a clean, aromatic cup.",
    longDescription:
      "Karadykan Estate coffee is grown under a native shade canopy, producing a clean, well-balanced cup with bright acidity and a smooth, aromatic finish. Hand-picked and processed on the estate, each batch reflects the terroir of its high-altitude plantation.",
    details: [
      "Single-estate Arabica",
      "Shade-grown under native canopy",
      "Medium roast",
      "Clean cup, bright acidity",
      "Hand-picked and estate-processed",
    ],
    locations: ["Karadykan Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 550,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 550, weightGrams: 250 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-KDK-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "biccode-estate-coffee",
    name: "Biccode Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/ground-coffee.png", "/products/roasted-coffee-beans.png"],
    description:
      "Single-estate Arabica coffee from Biccode Estate, offering a full-bodied cup with rich, syrupy sweetness.",
    longDescription:
      "Biccode Estate coffee is cultivated across its high-elevation plantation, yielding a full-bodied cup with rich, syrupy sweetness and a lingering finish. Careful estate processing preserves the natural character of the bean from harvest through drying.",
    details: [
      "Single-estate Arabica",
      "High-elevation plantation",
      "Medium roast",
      "Full-bodied, syrupy sweetness",
      "Estate-processed and hand-sorted",
    ],
    locations: ["Biccode Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 550,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 550, weightGrams: 250 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-BIC-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "attikan-estate-honey-sundried-coffee",
    name: "Attikan Estate Coffee — Honey/Sundried",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/green-coffee-beans.png", "/products/koraput-washed.webp"],
    description:
      "Single-estate honey/sundried-process Arabica from Attikan Estate. Full-bodied with rich, syrupy sweetness and dried-fruit notes.",
    longDescription:
      "Grown on the terraced, shade-covered slopes of Attikan Estate, this Arabica is processed using the honey (sundried) method — the cherry's mucilage is left on the parchment during sun-drying. The result is a full-bodied cup with rich, syrupy sweetness and notes of dried fruit.",
    details: [
      "Single-estate Arabica, Attikan Estate",
      "Honey (sundried) process",
      "Medium roast",
      "Full-bodied, syrupy sweetness, dried-fruit notes",
      "Terraced, shade-grown plantation",
    ],
    locations: ["Attikan Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 550,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 550, weightGrams: 250 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-ATKHS-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "attikan-estate-washed-coffee",
    name: "Attikan Estate Coffee — Washed",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/koraput-washed.png", "/products/roasted-coffee-beans.png"],
    description:
      "Single-estate washed-process Arabica from Attikan Estate. Clean, balanced cup with delicate floral and citrus notes.",
    longDescription:
      "Grown on the terraced, shade-covered slopes of Attikan Estate, this Arabica is fully washed — the cherry skin and mucilage are removed before drying. The result is a clean, balanced cup with delicate floral and citrus notes.",
    details: [
      "Single-estate Arabica, Attikan Estate",
      "Fully washed process",
      "Medium roast",
      "Clean, balanced, floral and citrus notes",
      "Terraced, shade-grown plantation",
    ],
    locations: ["Attikan Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 550,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 550, weightGrams: 250 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-ATKWSH-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
