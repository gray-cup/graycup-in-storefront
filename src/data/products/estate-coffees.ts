import type { Product } from "./types";
import { reviseRetailCoffeePricing, blendPackPrice } from "./pricing";

// Custom Attikan blend: ₹/kg by Arabica %. Anchored at ₹1,300/kg for 100% Robusta
// (fixed here - independent of the 100% Robusta product's own pricing)
// and ₹1,350/kg for 80% Arabica / 20% Robusta, then ~₹6.25 per extra 1% Arabica
// (rounded to ₹5). The 250g/500g packs add a markup on top (see blendPackPrice).
// Edit here to change a ratio's price.
const ATTIKAN_BLEND_PER_KG: Record<number, number> = {
  90: 1355,
  80: 1350,
  70: 1345,
  60: 1340,
  50: 1330,
  40: 1325,
  30: 1320,
  20: 1315,
  10: 1305,
};
const blendLabel = (arabica: number) => `${arabica}% Arabica / ${100 - arabica}% Robusta`;
const blendPerKgValues = Object.values(ATTIKAN_BLEND_PER_KG);
const blendCheapestPerKg = Math.min(...blendPerKgValues);
const blendDearestPerKg = Math.max(...blendPerKgValues);

export const estateCoffeeProducts: Product[] = reviseRetailCoffeePricing([
  {
    slug: "karadykan-estate-coffee",
    name: "Karadykan Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/roasted-coffee-beans.png", "/products/green-coffee-beans.png"],
    description:
      "Single-estate Arabica coffee from Karadykan Estate, grown under native shade cover with a clean, aromatic cup.",
    longDescription:
      "Karadykan Estate coffee is grown under a native shade canopy, producing a clean, well-balanced cup with bright acidity and a smooth, aromatic finish. Hand-picked and processed on the estate, each batch reflects the terroir of its high-altitude plantation.",
    details: [
      "Single-estate Arabica",
      "Shade-grown under native canopy",
      "Medium roast",
      "Clean cup, bright acidity",
      "Hand-picked and estate-processed",
    ],
    process: "Washed",
    varietal: "Arabica SLN 9",
    roast: "Medium-Dark",
    flavourNotes: ["Chocolate", "Citrus", "Nutty", "Orange"],
    locations: ["Karadykan Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    quality: "Commercial",
    brewStyle: "Black",
    priceRange: {
      min: 440,
      max: 1550,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 440, weightGrams: 250 },
      { name: "500g", price: 800, weightGrams: 500 },
      { name: "1kg", price: 1550, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-KDK-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "biccode-estate-coffee",
    name: "Biccode Estate Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/ground-coffee.png", "/products/roasted-coffee-beans.png"],
    description:
      "Single-estate, washed-process Arabica SLN 795 from Biccode Estate - medium-intensity cup with lemon zest, cacao nibs, caramel and toasted notes.",
    longDescription:
      "Biccode Estate coffee is a washed-process Arabica of the SLN 795 varietal. After hand-picking and selecting only ripe cherries, the coffee is pulped and rinsed with spring water, then dried on raised beds for 21 days with continuous movement for even airflow. The result is a medium-intensity cup with notes of lemon zest, cacao nibs, caramel, and toasted flavours.",
    details: [
      "Single-estate Arabica, SLN 795 varietal",
      "Washed process",
      "Dark roast",
      "Hand-picked and selectively harvested",
      "Pulped and rinsed with spring water",
      "Dried on raised beds for 21 days with continuous movement",
      "Medium-intensity flavour: lemon zest, cacao nibs, caramel, toasted notes",
    ],
    process: "Washed",
    varietal: "SLN 795",
    roast: "Dark",
    flavourNotes: ["Lemon zest", "Cacao nibs", "Caramel", "Toasted notes"],
    locations: ["Biccode Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    quality: "Commercial",
    brewStyle: "Black",
    priceRange: {
      min: 395,
      max: 1799,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 395, weightGrams: 250, deliveryCharge: 40 },
      { name: "500g", price: 999, weightGrams: 500 },
      { name: "1kg", price: 1799, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-BIC-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "attikan-estate-honey-sundried-coffee",
    name: "Attikan Honey Sundried Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/green-coffee-beans.png", "/products/koraput-washed.webp"],
    description:
      "Single-estate honey/sundried-process Arabica from Attikan Estate. Full-bodied with rich, syrupy sweetness and dried-fruit notes.",
    longDescription:
      "Grown on the terraced, shade-covered slopes of Attikan Estate, this Arabica is processed using the honey (sundried) method - the cherry's mucilage is left on the parchment during sun-drying. The result is a full-bodied cup with rich, syrupy sweetness and notes of dried fruit.",
    details: [
      "Single-estate Arabica, Attikan Estate",
      "Honey (sundried) process",
      "Medium roast",
      "Full-bodied, syrupy sweetness, dried-fruit notes",
      "Terraced, shade-grown plantation",
    ],
    process: "Honey Sundried (HSD)",
    varietal: "Pending",
    roast: "Medium-Dark",
    flavourNotes: ["Dried Fruit", "Caramel", "Toffee"],
    bitterness: 5,
    locations: ["Attikan Estate"],
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
    sku: "GC-COF-ATKHS-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "attikan-estate-washed-coffee",
    name: "Attikan Washed Coffee",
    image: "/products/koraput.webp",
    images: ["/products/koraput.webp", "/products/koraput-washed.png", "/products/roasted-coffee-beans.png"],
    description:
      "Single-estate washed-process Arabica from Attikan Estate. Clean, balanced cup with delicate floral and citrus notes.",
    longDescription:
      "Grown on the terraced, shade-covered slopes of Attikan Estate, this Arabica is fully washed - the cherry skin and mucilage are removed before drying. The result is a clean, balanced cup with delicate floral and citrus notes.",
    details: [
      "Single-estate Arabica, Attikan Estate",
      "Fully washed process",
      "Medium roast",
      "Clean, balanced, floral and citrus notes",
      "Terraced, shade-grown plantation",
    ],
    process: "Pending",
    varietal: "Pending",
    roast: "Pending",
    flavourNotes: ["Citrus", "Floral", "Balanced Acidity"],
    locations: ["Attikan Estate"],
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
    sku: "GC-COF-ATKWSH-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "100-robusta-coffee",
    name: "100% Robusta Coffee",
    image: "/robusta-100-percent.png",
    images: ["/robusta-100-percent.png", "/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
    description:
      "100% Robusta from Attikan Estate, roasted to order at the level you choose - a strong, bold cup with heavy crema.",
    longDescription:
      "Grown at Attikan Estate, this 100% Robusta is roasted only after you order, at the roast level you pick - light, medium, medium-dark or dark. Robusta gives a strong, full-bodied cup with heavy crema and roughly twice the caffeine of Arabica, a favourite for espresso, cold coffee and strong milk coffee.",
    details: [
      "100% Robusta, no blending",
      "Single-estate, Attikan Estate",
      "Grade AAA, washed process",
      "Choose your roast: light, medium, medium-dark or dark",
      "Strong, bold cup with heavy crema",
      "Roasted fresh after you order",
    ],
    process: "Washed",
    grade: "AAA",
    varietal: "Robusta",
    roast: "Medium",
    flavourNotes: ["Bold", "Earthy", "Strong"],
    locations: ["Attikan Estate"],
    category: "Coffee",
    categoryTwo: "Single Origin",
    quality: "Commercial",
    brewStyle: "Both",
    skipPriceRevision: true,
    // ₹1,050/kg for 1kg; buying 5kg drops it to ₹950/kg.
    priceRange: {
      min: 265,
      max: 4750,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 265, weightGrams: 250 },
      { name: "500g", price: 525, weightGrams: 500 },
      { name: "1kg", price: 1050, weightGrams: 1000 },
      { name: "5kg", price: 4750, weightGrams: 5000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack", "5kg pack"],
    sku: "GC-COF-ROB100-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "custom-attikan-arabica-robusta-blend",
    name: "Custom Arabica Robusta Blend - Attikan Estate",
    image: "/robusta-100-percent.png",
    images: ["/robusta-100-percent.png", "/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
    description:
      "Choose your own Arabica / Robusta percentage, blended from AAA Arabica and AAA Robusta from Attikan Estate and roasted to order.",
    longDescription:
      "Pick exactly how much Arabica and Robusta you want, from 90% Arabica / 10% Robusta to 10% Arabica / 90% Robusta. Both coffees are AAA grade from Attikan Estate, and the blend is roasted to order at the roast level you choose. More Arabica gives a smoother, more aromatic cup; more Robusta gives a stronger, bolder cup with heavier crema and more caffeine. The price is per kg and changes slightly with the ratio you pick.",
    details: [
      "Choose your Arabica / Robusta percentage, from 90/10 to 10/90",
      "AAA Arabica and AAA Robusta, both from Attikan Estate",
      "Choose your roast: light, medium, medium-dark or dark",
      "Blended and roasted fresh after you order",
    ],
    grade: "AAA",
    varietal: "Arabica + Robusta",
    roast: "Medium",
    flavourNotes: ["Bold", "Balanced", "Crema"],
    specs: [
      { label: "Arabica", value: "AAA, Attikan Estate" },
      { label: "Robusta", value: "AAA, Attikan Estate" },
    ],
    locations: ["Attikan Estate"],
    category: "Coffee",
    categoryTwo: "Blend",
    quality: "Commercial",
    brewStyle: "Both",
    skipPriceRevision: true,
    blendRatioOptions: Object.keys(ATTIKAN_BLEND_PER_KG)
      .map(Number)
      .sort((a, b) => b - a)
      .map(blendLabel),
    defaultBlendRatio: blendLabel(80),
    blendPricing: Object.fromEntries(
      Object.entries(ATTIKAN_BLEND_PER_KG).map(([a, perKg]) => [blendLabel(Number(a)), perKg]),
    ),
    // Variant prices are the cheapest ratio's - the "From" price. The real price
    // follows the selected ratio via blendPricing.
    priceRange: {
      min: blendPackPrice(blendCheapestPerKg, 250),
      max: blendDearestPerKg,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: blendPackPrice(blendCheapestPerKg, 250), weightGrams: 250 },
      { name: "500g", price: blendPackPrice(blendCheapestPerKg, 500), weightGrams: 500 },
      { name: "1kg", price: blendCheapestPerKg, weightGrams: 1000 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-ATKBLEND-001",
    brand: "Gray Cup",
    availability: "in_stock",
    googleProductCategory: "1868",
  },
]);
