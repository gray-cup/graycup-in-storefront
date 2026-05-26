import type { Product } from "./types";

export const ctcTeaProducts: Product[] = [
  {
    slug: "ctc-tea",
    name: "CTC Tea",
    image: "/products/ctc-tea.png",
    images: ["/products/ctc-tea.png", "/products/loose-leaf-tea.png"],
    description:
      "Premium CTC (Crush, Tear, Curl) black tea with a robust flavor profile and rich, malty taste.",
    longDescription:
      "Our CTC tea is sourced from the finest tea gardens across India. The Crush, Tear, Curl process creates small, uniform granules that brew quickly and produce a strong, full-bodied cup. Perfect for chai preparations and milk tea blends, this tea offers consistent quality and exceptional value.",
    details: [
      "Strong and full-bodied flavor",
      "Perfect for milk tea",
      "Quick brewing time",
      "Consistent particle size",
      "Extended shelf life",
      "Premium quality assurance",
    ],
    locations: ["Assam", "Darjeeling", "Nilgiri", "Dooars"],
    category: "Tea",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 99,
      max: 349,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 99 },
      { name: "500g", price: 189 },
      { name: "1kg", price: 349 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-TEA-CTC-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "422",
  },
  {
    slug: "ctc-premium-blend",
    name: "CTC Premium Blend",
    image: "/products/ctc-tea.png",
    images: ["/products/ctc-tea.png", "/products/loose-leaf-tea.png", "/products/matcha-tea.png"],
    description:
      "A carefully crafted blend of premium CTC teas from multiple estates for a balanced, consistent taste.",
    longDescription:
      "Our CTC Premium Blend combines the best characteristics of teas from Assam, Dooars, and Nilgiri regions. This expertly blended tea delivers a consistent cup every time, with rich color, strong body, and a satisfying finish. Ideal for everyday chai and milk tea.",
    details: [
      "Expertly blended for consistency",
      "Rich amber liquor",
      "Strong malty notes",
      "Excellent milk absorption",
      "Quality assured batches",
      "Versatile brewing applications",
    ],
    locations: ["Assam", "Dooars", "Nilgiri"],
    category: "Tea",
    categoryTwo: "Blend",
    priceRange: {
      min: 129,
      max: 429,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 129 },
      { name: "500g", price: 239 },
      { name: "1kg", price: 429 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-TEA-CTC-002",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "422",
  },
];
