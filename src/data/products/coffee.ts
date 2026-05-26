import type { Product } from "./types";

export const coffeeProducts: Product[] = [
  {
    slug: "green-coffee-beans",
    name: "Green Coffee Beans",
    image: "/products/green-coffee-beans.png",
    images: ["/products/green-coffee-beans.png", "/products/roasted-coffee-beans.png"],
    description:
      "Unroasted green coffee beans perfect for custom roasting profiles and specialty coffee applications.",
    longDescription:
      "Our green coffee beans are sourced directly from premium estates across South India. These unroasted beans offer roasters complete control over the final flavor profile. With extended shelf life and consistent quality, green beans are ideal for roasteries seeking traceable coffee origins.",
    details: [
      "Premium unroasted beans",
      "Customizable roast levels",
      "Fresh and natural",
      "Extended shelf stability",
      "Single origin available",
      "Traceable sourcing",
    ],
    locations: ["Coorg", "Chikmagalur", "Wayanad", "Araku Valley"],
    category: "Coffee",
    priceRange: {
      min: 199,
      max: 699,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 199 },
      { name: "500g", price: 379 },
      { name: "1kg", price: 699 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-GCB-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "roasted-coffee-beans",
    name: "Roasted Coffee Beans",
    image: "/products/roasted-coffee-beans.png",
    images: ["/products/roasted-coffee-beans.png", "/products/ground-coffee.png", "/products/green-coffee-beans.png"],
    description:
      "Expertly roasted coffee beans with a perfect balance of aroma, flavor, and body for the ultimate coffee experience.",
    longDescription:
      "Our roasted coffee beans undergo precision roasting to unlock their full potential. Available in light, medium, and dark roast profiles, each batch is carefully monitored for optimal flavor development. Perfect for cafes, restaurants, and retail, our roasted beans deliver consistent quality cup after cup.",
    details: [
      "Medium to dark roast options",
      "Rich, bold flavor",
      "Aromatic and fresh",
      "Perfect for espresso or filter",
      "Consistent roast profile",
      "Freshly roasted to order",
    ],
    locations: ["Chikmagalur", "Coorg", "Wayanad", "Bababudangiri"],
    category: "Coffee",
    priceRange: {
      min: 349,
      max: 1199,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 349 },
      { name: "500g", price: 649 },
      { name: "1kg", price: 1199 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-RCB-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
  {
    slug: "ground-coffee",
    name: "Ground Coffee",
    image: "/products/ground-coffee.png",
    images: ["/products/ground-coffee.png", "/products/roasted-coffee-beans.png"],
    description:
      "Freshly ground coffee powder ready to brew, delivering convenience without compromising on quality and taste.",
    longDescription:
      "Our ground coffee is freshly milled from premium roasted beans, ensuring maximum freshness and flavor extraction. Available in various grind sizes to suit different brewing methods - from espresso fine to French press coarse. Nitrogen-flushed packaging preserves aroma and extends shelf life.",
    details: [
      "Ready to brew",
      "Consistent grind size",
      "Rich aroma",
      "Versatile brewing methods",
      "Nitrogen-flushed freshness",
      "Multiple grind options",
    ],
    locations: ["Wayanad", "Chikmagalur", "Coorg", "Araku Valley"],
    category: "Coffee",
    priceRange: {
      min: 299,
      max: 999,
      unit: "",
    },
    minimumOrder: {
      quantity: 1,
      unit: "pack",
    },
    variants: [
      { name: "250g", price: 299 },
      { name: "500g", price: 549 },
      { name: "1kg", price: 999 },
    ],
    packaging: ["250g pack", "500g pack", "1kg pack"],
    sku: "GC-COF-GND-001",
    brand: "Gray Cup",
    comingSoon: true,
    availability: "in_stock",
    googleProductCategory: "1868",
  },
];
