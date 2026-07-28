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
};

export type CoffeeProcess = "Washed" | "Natural" | "HSD" | "Pending";
export type CoffeeRoast = "Light" | "Medium" | "Medium-Dark" | "Dark" | "Pending";

export type Product = {
  slug: string;
  name: string;
  image: string;
  images?: string[];
  description: string;
  longDescription?: string;
  details: string[];
  locations: string[];
  category: "Tea" | "Coffee" | "Matcha";
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
  process?: CoffeeProcess;
  varietal?: string;
  roast?: CoffeeRoast;
  flavourNotes?: string[];
  // Google Merchant Center fields
  sku: string;
  brand: string;
  availability: ProductAvailability;
  googleProductCategory: string;
  mpn?: string;
};
