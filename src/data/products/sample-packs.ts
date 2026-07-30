import type { Product } from "./types";

export const samplePackProducts: Product[] = [
  {
    slug: "3-coffee-sampler-pack",
    name: "x3 Coffee 75gm Packs",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png", "/products/green-coffee-beans.png"],
    description:
      "A curated trio of three of our coffees - a great way to explore different origins and roasts before committing to a full bag.",
    longDescription:
      "Can't decide which coffee to try first? The 3-Coffee Sampler Pack brings together three of our coffees, hand-picked by us to showcase a range of origins, processes, and roast styles. Perfect for gifting or simply exploring what Gray Cup has to offer.",
    details: [
      "3 curated coffee samples",
      "Hand-picked assortment, changes with availability",
      "Available in 75g or 150g per sample",
      "Great way to explore before buying a full bag",
    ],
    isSamplePack: true,
    locations: ["Chikmagalur", "Coorg", "Koraput, Odisha"],
    category: "Coffee",
    priceRange: {
      min: 450,
      max: 840,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "75g x 3", price: 450, weightGrams: 225 },
      { name: "150g x 3", price: 840, weightGrams: 450 },
    ],
    packaging: ["75g x 3 samples", "150g x 3 samples"],
    sku: "GC-COF-SMP3-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "5-coffee-sampler-pack",
    name: "x5 Coffee 75gm Packs",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png", "/products/green-coffee-beans.png"],
    description:
      "A curated selection of five of our coffees - more variety for a deeper tasting flight.",
    longDescription:
      "The 5-Coffee Sampler Pack brings together five of our coffees, hand-picked to showcase a wider range of origins, processes, and roast styles than our 3-pack. A great way to explore before committing to a full bag, or to put together a tasting flight at home.",
    details: [
      "5 curated coffee samples",
      "Hand-picked assortment, changes with availability",
      "Available in 75g or 150g per sample",
      "Great way to explore before buying a full bag",
    ],
    isSamplePack: true,
    locations: ["Chikmagalur", "Coorg", "Koraput, Odisha"],
    category: "Coffee",
    priceRange: {
      min: 750,
      max: 1400,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "75g x 5", price: 750, weightGrams: 375 },
      { name: "150g x 5", price: 1400, weightGrams: 750 },
    ],
    packaging: ["75g x 5 samples", "150g x 5 samples"],
    sku: "GC-COF-SMP5-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "7-coffee-sampler-pack",
    name: "x7 Coffee 75gm Packs",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png", "/products/green-coffee-beans.png"],
    description:
      "A curated selection of seven of our coffees - our biggest fixed sampler, built for serious tasting.",
    longDescription:
      "The 7-Coffee Sampler Pack is our biggest curated sampler, bringing together seven of our coffees hand-picked to showcase the full range of what Gray Cup grows and sources - different origins, processes, and roast styles in one box.",
    details: [
      "7 curated coffee samples",
      "Hand-picked assortment, changes with availability",
      "Available in 75g or 150g per sample",
      "Our biggest fixed sampler pack",
    ],
    isSamplePack: true,
    locations: ["Chikmagalur", "Coorg", "Koraput, Odisha"],
    category: "Coffee",
    priceRange: {
      min: 1050,
      max: 1960,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "75g x 7", price: 1050, weightGrams: 525 },
      { name: "150g x 7", price: 1960, weightGrams: 1050 },
    ],
    packaging: ["75g x 7 samples", "150g x 7 samples"],
    sku: "GC-COF-SMP7-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "pick-your-poison-sampler",
    name: "Pick Your Poison Sampler",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png", "/products/green-coffee-beans.png"],
    description:
      "Build your own sampler - pick up to 12 coffees yourself and choose your sample size.",
    longDescription:
      "Skip the curation and build your own box. Pick any combination of our coffees - up to 12 - and choose 75g or 150g per sample. Perfect if you already know what you like, or want full control over your tasting flight.",
    details: [
      "Pick up to 12 coffees yourself",
      "Choose 75g or 150g per sample",
      "Price scales with how many you choose",
      "Full control over your sampler box",
    ],
    isSamplePack: true,
    locations: ["Chikmagalur", "Coorg", "Koraput, Odisha"],
    category: "Coffee",
    priceRange: {
      min: 450,
      max: 3360,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    // Base per-sample rate at each size - the actual pack price is
    // per-sample price x number of coffees picked (see SampleBuilder).
    variants: [
      { name: "75g per sample", price: 150, weightGrams: 75 },
      { name: "150g per sample", price: 280, weightGrams: 150 },
    ],
    packaging: ["75g samples", "150g samples"],
    sku: "GC-COF-SMPPYP-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
