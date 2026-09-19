import type { CoffeeProcess, Product } from "./types";

// Upcoming roasted specialty lots from Baarbara Coffee Estate. Pages are
// visitable, but `comingSoon` keeps them out of the cart, checkout, feeds and
// the regular catalog lists (see retailProducts). Prices are final - no
// automatic price revision is applied.
const ORIGIN = "Baarbara Coffee Estate";

const kebab = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const mk = (
  name: string,
  g250: number,
  g500: number,
  kg1: number,
  extra: { process?: CoffeeProcess; grade?: string } = {},
): Product => ({
  slug: `baarbara-${kebab(name)}`,
  name,
  image: "/products/roasted-coffee-beans.png",
  images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png"],
  description: `${name} - a specialty lot from ${ORIGIN}, launching soon.`,
  details: [`Specialty coffee from ${ORIGIN}`, "Launching soon"],
  locations: [ORIGIN],
  category: "Coffee",
  categoryTwo: "Single Origin",
  quality: "Speciality",
  comingSoon: true,
  ...extra,
  priceRange: { min: g250, max: kg1, unit: "" },
  minimumOrder: { quantity: 1, unit: "pack" },
  variants: [
    { name: "250g", price: g250, weightGrams: 250 },
    { name: "500g", price: g500, weightGrams: 500 },
    { name: "1kg", price: kg1, weightGrams: 1000 },
  ],
  packaging: ["250g pack", "500g pack", "1kg pack"],
  sku: `GC-COF-BAAR-${kebab(name).toUpperCase()}`,
  brand: "Gray Cup",
  availability: "out_of_stock",
  googleProductCategory: "1868",
});

export const comingSoonCoffeeProducts: Product[] = [
  mk("Arabica Washed AAA", 799, 1499, 2799, { process: "Washed", grade: "AAA" }),
  mk("Honey Sundried", 849, 1599, 2999, { process: "Honey Sundried (HSD)" }),
  mk("Monsoon Malabar", 849, 1599, 2999),
  mk("Frozen Cherry", 999, 1899, 3499),
  mk("Naturals", 849, 1599, 2999, { process: "Natural" }),
  mk("Intenso Yeast", 949, 1799, 3299),
  mk("Pineapple Fermented", 949, 1799, 3299),
  mk("Whiskey Barrel Aged", 1399, 2699, 4999),
  mk("Arabica Washed Peaberry", 649, 1199, 2199, { process: "Washed" }),
  mk("Decaffeinated", 1199, 2299, 4299),
  mk("Brandy Barrel Aged", 1399, 2699, 4999),
  mk("Mysore Nuggets", 1099, 2099, 3999),
  mk("Grapes Fermented", 999, 1899, 3499),
  mk("Double Fermentation", 949, 1799, 3299),
  mk("Rum Barrel Aged", 1399, 2699, 4999),
];
