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
  process?: CoffeeProcess;
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
  /** Fundraiser reward pack - excluded from the regular product grid, feeds, and sitemap. */
  isFundraiser?: boolean;
  /** Bulk wholesale SKU - only shown on /wholesale, excluded from the retail catalog, homepage, and feeds. */
  isWholesale?: boolean;
  // Google Merchant Center fields
  sku: string;
  brand: string;
  availability: ProductAvailability;
  googleProductCategory: string;
  mpn?: string;
  color?: string;
  material?: string;
};
