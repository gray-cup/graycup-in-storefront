import type { Product } from "./types";

export const halflongAssamTeaProducts: Product[] = [
  {
    slug: "halflong-assam-tea",
    name: "Halflong Assam Tea",
    image: "/products/dooars.png",
    images: ["/products/dooars.png"],
    description:
      "Bold, malty CTC tea from Halflong in the North Cachar Hills of Assam, brewing a strong, brisk cup.",
    longDescription:
      "Grown in the hills around Halflong in Assam's North Cachar Hills, this CTC tea delivers the strong, brisk, malty character prized in classic Indian chai. Freshly packed to preserve aroma, it brews a consistently rich cup batch after batch.",
    details: [
      "Sourced from Halflong, North Cachar Hills, Assam",
      "Strong, malty flavour — ideal for chai",
      "Freshly packed in sealed pouches",
      "No additives or artificial flavours",
      "Consistent quality, batch after batch",
    ],
    locations: ["Halflong, Assam"],
    category: "Tea",
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
    sku: "GC-TEA-HLA-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "422",
  },
];
