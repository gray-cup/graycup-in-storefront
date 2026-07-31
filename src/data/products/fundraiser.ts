import type { Product } from "./types";

export const FUNDRAISER_GOAL_INR = 613000;
export const FUNDRAISER_PACK_PRICE_INR = 350;
export const FUNDRAISER_PACK_WEIGHT_GRAMS = 250;
export const FUNDRAISER_PRODUCT_SLUG = "aillio-bullet-r2-fundraiser-pack";
export const FUNDRAISER_PACKS_NEEDED = Math.ceil(
  FUNDRAISER_GOAL_INR / FUNDRAISER_PACK_PRICE_INR,
);

export const fundraiserProducts: Product[] = [
  {
    slug: FUNDRAISER_PRODUCT_SLUG,
    name: "Aillio Bullet R2 Fundraiser - 250g Coffee Pack",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
    description:
      "Every ₹350 you contribute funds our Aillio Bullet R2 roaster and gets you a 250g pack of our coffee, roasted to your preference.",
    longDescription:
      "We're raising funds to buy an Aillio Bullet R2 - a ₹6,13,000 electric coffee roaster that will let us roast in-house with far tighter control over batch quality and consistency than our current setup. Every ₹350 contribution gets you a 250g pack of coffee, roasted to your choice of Medium or Dark. Add more packs to contribute more - the progress bar on the fundraiser page updates as soon as your payment is confirmed.",
    details: [
      "₹350 per 250g pack contributed",
      "Choice of Medium or Dark roast",
      "Funds go directly toward an Aillio Bullet R2 roaster",
      "Ships like any other Gray Cup order",
    ],
    process: "Pending",
    varietal: "Pending",
    roast: "Medium-Dark",
    flavourNotes: ["Pending"],
    locations: ["Chikmagalur", "Coorg"],
    category: "Coffee",
    categoryTwo: "Blend",
    quality: "Commercial",
    brewStyle: "Both",
    roastOptions: ["Medium", "Dark"],
    isFundraiser: true,
    priceRange: {
      min: FUNDRAISER_PACK_PRICE_INR,
      max: FUNDRAISER_PACK_PRICE_INR,
      unit: "per 250g pack",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      {
        name: "250g Pack",
        price: FUNDRAISER_PACK_PRICE_INR,
        weightGrams: FUNDRAISER_PACK_WEIGHT_GRAMS,
      },
    ],
    packaging: ["250g pack"],
    sku: "GC-FUND-AILLIO-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
