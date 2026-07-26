import type { Product } from "./types";

export const estateCoffeeProducts: Product[] = [
  {
    slug: "karadykan-estate-coffee",
    name: "Karadykan Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp"],
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
    images: ["/products/koraput.webp"],
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
    slug: "attikan-estate-coffee",
    name: "Attikan Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp"],
    description:
      "Single-estate Arabica coffee from Attikan Estate, delivering a balanced cup with delicate floral and citrus notes.",
    longDescription:
      "Attikan Estate coffee is grown on terraced hillsides under mixed shade cover, producing a balanced cup with delicate floral and citrus notes. The estate's meticulous harvesting and drying practices give each batch consistent quality and character.",
    details: [
      "Single-estate Arabica",
      "Terraced, shade-grown plantation",
      "Medium roast",
      "Balanced, floral and citrus notes",
      "Meticulous harvest and drying",
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
    sku: "GC-COF-ATK-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
