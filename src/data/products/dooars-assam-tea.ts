import type { Product } from "./types";

export const dooarsAssamTeaProducts: Product[] = [
  {
    slug: "dooars-assam-tea",
    name: "Dooars & Assam Tea",
    image: "/products/ctc-tea.png",
    images: ["/products/ctc-tea.png", "/products/loose-leaf-tea.png"],
    description:
      "Bold, malty CTC tea sourced directly from the Dooars and Assam tea belt — brews a rich, strong cup every time.",
    longDescription:
      "Grown in the lush foothills of the Dooars region and the Brahmaputra valley of Assam, this CTC tea delivers the classic strong, brisk character that defines Indian chai. Each 500g pack is freshly sealed to preserve aroma and freshness. Order multiple packs and save — 3 packs or more qualify for free delivery.",
    details: [
      "Sourced from Dooars & Assam tea estates",
      "Strong, malty flavour — ideal for chai",
      "Freshly packed in sealed pouches",
      "Free delivery on 3 packs or more",
      "No additives or artificial flavours",
      "Consistent quality, batch after batch",
    ],
    locations: ["Dooars", "Assam"],
    category: "Tea",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 395,
      max: 1450,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "500g (1 pack)", price: 395 },
      { name: "1kg (2 packs)", price: 750 },
      { name: "1.5kg (3 packs) — Free Delivery", price: 1100 },
      { name: "2kg (4 packs)", price: 1450 },
    ],
    packaging: ["500g pack", "1kg (2 × 500g)", "1.5kg (3 × 500g)", "2kg (4 × 500g)"],
    sku: "GC-TEA-DA-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "422",
  },
];
