import type { Product } from "./types";

export const looseLeafTeaProducts: Product[] = [
  {
    slug: "loose-leaf-tea",
    name: "Loose Leaf Tea",
    image: "/products/loose-leaf-tea.png",
    images: ["/products/loose-leaf-tea.png", "/products/ctc-tea.png", "/products/matcha-tea.png"],
    description:
      "Artisanal loose leaf tea with whole leaves that unfurl beautifully, delivering a delicate and aromatic experience.",
    longDescription:
      "Our loose leaf teas represent the pinnacle of tea craftsmanship. Each batch is carefully hand-picked and processed to preserve the natural oils and complex flavor compounds. The whole leaves allow for multiple infusions, making it an economical choice for premium tea service. Available in orthodox and specialty varieties.",
    details: [
      "Whole leaf quality",
      "Complex flavor notes",
      "Multiple infusions possible",
      "Natural and unprocessed",
      "Hand-picked selection",
      "Premium grade options",
    ],
    locations: ["Darjeeling", "Assam", "Kangra", "Munnar"],
    category: "Tea",
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
    sku: "GC-TEA-LLT-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "422",
  },
  {
    slug: "darjeeling-first-flush",
    name: "Darjeeling First Flush",
    image: "/products/loose-leaf-tea.png",
    images: ["/products/loose-leaf-tea.png", "/products/matcha-tea.png"],
    description:
      "The champagne of teas - delicate, floral first flush Darjeeling with bright muscatel notes.",
    longDescription:
      "Harvested in early spring, our Darjeeling First Flush captures the essence of the Himalayan terroir. These tender young leaves produce a light, golden liquor with distinctive muscatel character and floral undertones. Highly prized by tea connoisseurs worldwide for its unique and refreshing taste.",
    details: [
      "Spring harvest excellence",
      "Distinctive muscatel flavor",
      "Light golden liquor",
      "Floral and fruity notes",
      "Single estate sourced",
      "Limited seasonal availability",
    ],
    locations: ["Darjeeling"],
    category: "Tea",
    priceRange: {
      min: 299,
      max: 1299,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "50g", price: 299 },
      { name: "100g", price: 549 },
      { name: "250g", price: 1299 },
    ],
    packaging: ["50g pack", "100g pack", "250g pack"],
    sku: "GC-TEA-DFF-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "422",
  },
  {
    slug: "assam-orthodox",
    name: "Assam Orthodox",
    image: "/products/loose-leaf-tea.png",
    images: ["/products/loose-leaf-tea.png", "/products/ctc-tea.png"],
    description:
      "Full-bodied Assam orthodox tea with bold malty character and rich golden tips.",
    longDescription:
      "Our Assam Orthodox tea is sourced from the lush gardens of the Brahmaputra Valley. Unlike CTC, these whole leaf teas are processed using traditional methods, resulting in a complex, full-bodied brew with distinctive malty sweetness and a hint of honey. The golden tips indicate the highest quality plucking standards.",
    details: [
      "Traditional orthodox processing",
      "Bold malty character",
      "Golden tips present",
      "Rich and full-bodied",
      "Second flush specialty",
      "Perfect for connoisseurs",
    ],
    locations: ["Assam", "Upper Assam", "Dibrugarh"],
    category: "Tea",
    priceRange: {
      min: 199,
      max: 849,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "100g", price: 199 },
      { name: "250g", price: 449 },
      { name: "500g", price: 849 },
    ],
    packaging: ["100g pack", "250g pack", "500g pack"],
    sku: "GC-TEA-AO-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "422",
  },
];
