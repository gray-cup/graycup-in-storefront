import type { Product } from "./types";

export const accessoryProducts: Product[] = [
  {
    slug: "cotton-bags",
    name: "Cotton Bags",
    image: "/accessories/cotton-bag.webp",
    images: [
      "/accessories/cotton-bag.webp",
      "/accessories/cotton-bags.webp",
      "/accessories/cotton-bag-in-water.webp",
      "/accessories/cotton-bag-in-water-2.webp",
    ],
    description:
      "Eco-friendly, organic cotton bags - reusable and sustainable, made for brewing coffee. 150 GSM, holds up to 40g of ground coffee, sized for cold brew and filter coffee. Made to last up to 400 brews with proper care.",
    longDescription:
      "Our cotton bags are made from sturdy, organic 150 GSM cotton fabric with a capacity of about 40g of ground coffee. At 5in x 4in, they're sized for brewing rather than repackaging or gifting - ideal for steeping cold brew or filtering coffee, reused brew after brew. Made to last up to 400 brews with proper care. Available in packs of 5, 10, or 100, with better value per bag the more you buy.",
    details: [
      "100% organic cotton, reusable",
      "Eco-friendly and sustainable for coffee usage",
      "150 GSM fabric weight",
      "Holds up to 40g of ground coffee",
      "Made to last up to 400 brews with proper care",
      "Sized for cold brew and filter coffee brewing",
      "Drawstring closure",
      "Bulk pricing available",
    ],
    specs: [
      { label: "Capacity", value: "40g of ground coffee" },
      { label: "Thickness", value: "150 GSM" },
      { label: "Size", value: "5 in x 4 in (L x B)" },
      { label: "Color", value: "Floral White" },
    ],
    specsNote:
      "Each bag is stitched from soft, breathable organic cotton - sturdy enough to hold its shape through repeated brews.",
    locations: ["India"],
    category: "Accessories",
    priceRange: {
      min: 110,
      max: 1750,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "Pack of 5", price: 110 },
      { name: "Pack of 10", price: 195 },
      { name: "Pack of 100", price: 1300 },
    ],
    packaging: ["Pack of 5", "Pack of 10", "Pack of 100"],
    sku: "GC-ACC-CTNBAG-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "6552",
  },
];
