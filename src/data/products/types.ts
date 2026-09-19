export type ProductAvailability = "in_stock" | "out_of_stock" | "preorder";

export const COFFEE_GRIND_OPTIONS: string[] = [
  "French Press",
  "Cold Brew",
  "Whole Beans",
  "Espresso",
  "Moka Pot",
  "South Indian Filter",
  "Pour Over",
  "Aeropress",
  "Extra Fine",
  "Turkish Fine",
  "Super Fine",
  "Fine",
  "Fine-Medium",
  "Medium-Fine",
  "Medium",
  "Medium-Coarse",
  "Coarse",
  "Coarse-Extra Coarse",
  "Extra Coarse",
  "Very Extra Coarse",
];

export type ProductVariant = {
  name: string;
  price: number;
  weightGrams?: number;
  deliveryCharge?: number;
  batchId?: string;
  /** Discounted price shown alongside `price` on Google Merchant Center. Must be lower than `price`. */
  salePrice?: number;
  /** Barcode (UPC/EAN/ISBN) for this specific packaged variant, if one has been assigned. */
  gtin?: string;
};

export type CoffeeProcess = "Washed" | "Natural" | "Honey Sundried (HSD)" | "Pending";
export type CoffeeRoast =
  | "Light"
  | "Medium"
  | "Medium-Dark"
  | "Dark"
  | "Vienna"
  | "French"
  | "Pending";

/** Roast levels a buyer can choose on any retail coffee that doesn't set its own `roastOptions`. */
export const COFFEE_ROAST_OPTIONS: CoffeeRoast[] = ["Light", "Medium", "Medium-Dark", "Dark"];

export type ProductQuality = "Speciality" | "Commercial";
export type BrewStyle = "Milk" | "Black" | "Both";

export type Product = {
  slug: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  longDescription?: string;
  details: string[];
  locations: string[];
  category: "Tea" | "Coffee" | "Matcha" | "Accessories";
  categoryTwo?: "Single Origin" | "Blend" | "Premium";
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  minimumOrder: {
    quantity: number;
    unit: string;
  };
  variants: ProductVariant[];
  packaging: string[];
  comingSoon?: boolean;
  isSamplePack?: boolean;
  /** Sold unroasted (green) - no grind size applies */
  isGreenCoffee?: boolean;
  process?: CoffeeProcess;
  /** Bean grade / screen size, shown as a badge (e.g. "AAA"). */
  grade?: string;
  varietal?: string;
  roast?: CoffeeRoast;
  flavourNotes?: string[];
  /** Bitterness on a 0-10 scale (0 = none, 10 = very bitter) */
  bitterness?: number;
  specs?: { label: string; value: string }[];
  specsNote?: string;
  quality?: ProductQuality;
  brewStyle?: BrewStyle;
  /** When set, buyers can pick their roast level from this list on the product page. */
  roastOptions?: CoffeeRoast[];
  /** When set, buyers can pick their Arabica/Robusta blend ratio from this list on the product page. */
  blendRatioOptions?: string[];
  /** Ratio option pre-selected on the product page (defaults to the first option). */
  defaultBlendRatio?: string;
  /**
   * Price per kg for each `blendRatioOptions` entry. When set, a pack's price is
   * the ratio's per-kg price x pack weight (see blendPackPrice), not `variant.price`
   * - variant prices then only serve as the "From" price. Not subscribable.
   */
  blendPricing?: Record<string, number>;
  /** Fundraiser reward pack - excluded from the regular product grid, feeds, and sitemap. */
  isFundraiser?: boolean;
  /** Bulk wholesale SKU - only shown on /wholesale, excluded from the retail catalog, homepage, and feeds. */
  isWholesale?: boolean;
  /** Ships free regardless of cart value (set for Speciality coffee in the 2026 price revision). */
  freeShipping?: boolean;
  /** Opt this SKU out of the automatic 2026 Commercial +₹90 revision - its variant prices are already final. */
  skipPriceRevision?: boolean;
  // Google Merchant Center fields
  sku: string;
  brand: string;
  availability: ProductAvailability;
  googleProductCategory: string;
  mpn?: string;
  color?: string;
  material?: string;
};
