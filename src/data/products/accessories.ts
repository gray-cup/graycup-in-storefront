import type { Product } from "./types";

export const accessoryProducts: Product[] = [
  {
    slug: "cotton-bags",
    name: "Cotton Bags",
    image: "/accessories/cotton-bag.webp",
    images: ["/accessories/cotton-bag.webp"],
    description:
      "Reusable, eco-friendly cotton bags - great for gifting, repackaging, or carrying your coffee and tea.",
    longDescription:
      "Our cotton bags are soft, durable, and reusable - perfect for repackaging your tea or coffee, gifting, or everyday carrying. Available in packs of 5, 10, or 100, with better value per bag the more you buy.",
    details: [
      "100% cotton, reusable",
      "Drawstring closure",
      "Great for gifting or repackaging",
      "Bulk pricing available",
    ],
    locations: ["India"],
    category: "Accessories",
    priceRange: {
      min: 75,
      max: 1200,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "Pack of 5", price: 75 },
      { name: "Pack of 10", price: 130 },
      { name: "Pack of 100", price: 1200 },
    ],
    packaging: ["Pack of 5", "Pack of 10", "Pack of 100"],
    sku: "GC-ACC-CTNBAG-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "6552",
  },
];
