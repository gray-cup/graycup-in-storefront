import type { Product } from "./types";

export const FUNDRAISER_GOAL_INR = 613000;
export const FUNDRAISER_PRODUCT_SLUG = "aillio-bullet-r2-fundraiser-pack";
// Pack sizes on offer, and the discount once a single line is over 1kg.
export const FUNDRAISER_SIZES = ["250g", "500g", "1kg"];
export const FUNDRAISER_BULK_MIN_GRAMS = 1000;
export const FUNDRAISER_BULK_DISCOUNT = 0.05;

// Fundraiser variants only name the sizes: the price is the picked coffee's
// regular price for that size (see fundraiserUnitPrice in ./index).
const sizeVariants = [
  { name: "250g", weightGrams: 250 },
  { name: "500g", weightGrams: 500 },
  { name: "1kg", weightGrams: 1000 },
].map((v) => ({ ...v, price: 0 }));

export const fundraiserProducts: Product[] = [
  {
    slug: FUNDRAISER_PRODUCT_SLUG,
    name: "Aillio Bullet R2 Fundraiser - Coffee Pack",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
    description:
      "Buy any of our coffees - 250g, 500g or 1kg, roasted to your choice - at our regular prices and the money goes toward our Aillio Bullet R2 roaster. Orders over 1kg get 5% off.",
    longDescription:
      "We're raising funds to buy an Aillio Bullet R2 - a ₹6,13,000 electric coffee roaster that will let us roast in-house with far tighter control over batch quality and consistency than our current setup. Pick any of our available coffees in 250g, 500g or 1kg at its regular price, roasted to the level you choose - Light, Medium, Medium-Dark or Dark - and the whole amount goes toward the roaster. Orders over 1kg get 5% off. The progress bar on the fundraiser page updates as soon as your payment is confirmed.",
    details: [
      "Regular coffee prices in 250g, 500g and 1kg packs",
      "5% off orders over 1kg",
      "Pick any available coffee and any roast level",
      "Funds go directly toward an Aillio Bullet R2 roaster",
      "Ships like any other Gray Cup order",
    ],
    process: "Pending",
    varietal: "Pending",
    roast: "Medium",
    flavourNotes: ["Pending"],
    locations: ["Chikmagalur", "Coorg"],
    category: "Coffee",
    categoryTwo: "Blend",
    quality: "Commercial",
    brewStyle: "Both",
    isFundraiser: true,
    priceRange: {
      min: 0,
      max: 0,
      unit: "per pack",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: sizeVariants,
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-FUND-AILLIO-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
