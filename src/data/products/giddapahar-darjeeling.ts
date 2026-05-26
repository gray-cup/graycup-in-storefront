import type { Product } from "./types";

export const giddapaharDarjeelingProducts: Product[] = [
  {
    slug: "giddapahar-darjeeling-orthodox",
    name: "Giddapahar Darjeeling Orthodox",
    image: "/giddapahar.png",
    images: ["/giddapahar.png"],
    description:
      "Single-estate Orthodox tea from Giddapahar, Darjeeling. Whole-leaf, hand-crafted, with a naturally sweet muscatel character.",
    longDescription:
      "Grown on the slopes of the Giddapahar estate in Darjeeling, this Orthodox tea is plucked and processed by hand to preserve the integrity of every leaf. The result is a cup with a delicate golden liquor, a floral muscatel aroma, and a clean, naturally sweet finish — true to the finest Darjeeling tradition.",
    details: [
      "Single-estate, Giddapahar, Darjeeling",
      "Whole-leaf orthodox processing",
      "Hand-crafted, small-batch",
      "Natural muscatel sweetness",
      "No artificial flavours or additives",
      "Batch: GRAYBD1",
    ],
    locations: ["Darjeeling"],
    category: "Tea",
    categoryTwo: "Single Origin",
    priceRange: {
      min: 200,
      max: 340,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "50g", price: 200, weightGrams: 50, deliveryCharge: 30, batchId: "GRAYBD1" },
      { name: "100g", price: 340, weightGrams: 100, deliveryCharge: 30, batchId: "GRAYBD1" },
    ],
    packaging: ["50g pack", "100g pack"],
    sku: "GC-TEA-GDO-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "422",
  },
];
