import type { Product } from "./types";
import { reviseRetailCoffeePricing } from "./pricing";

export const halflongAssamCoffeeProducts: Product[] = reviseRetailCoffeePricing([
  {
    slug: "halflong-assam-coffee",
    name: "Halflong Assam Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
    description:
      "Single-origin Arabica coffee grown in the hills of Halflong, North Cachar Hills, Assam. Mild acidity with a soft, earthy sweetness.",
    longDescription:
      "Grown in the hill terrain around Halflong in Assam's North Cachar Hills, this single-origin Arabica offers a distinctive cup shaped by its unusual growing region - mild acidity, a soft body, and gentle earthy sweetness that sets it apart from the classic South Indian estates.",
    details: [
      "Single-origin Arabica, Halflong, Assam",
      "Grown in the North Cachar Hills",
      "Medium roast",
      "Mild acidity, soft earthy sweetness",
      "Hand-picked and estate-processed",
    ],
    process: "Natural",
    varietal: "SL-9",
    roast: "Medium-Dark",
    flavourNotes: ["Chocolate", "Spice", "Fruity"],
    specs: [{ label: "Elevation", value: "950-960 masl" }],
    locations: ["Halflong, Assam"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    quality: "Speciality",
    brewStyle: "Black",
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
    sku: "GC-COF-HLA-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
]);
