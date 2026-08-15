import { products } from "@/data/products";
import type { Product } from "@/data/products/types";

const BASE_URL = "https://graycup.in";

function resolveUrl(path: string): string {
  return path.startsWith("http") ? path : `${BASE_URL}${path}`;
}

function mapProduct(product: Product) {
  return {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    categoryTwo: product.categoryTwo ?? null,
    description: product.description,
    longDescription: product.longDescription ?? null,
    url: `${BASE_URL}/products/${product.slug}`,
    image: resolveUrl(product.image),
    images: (product.images ?? []).map(resolveUrl),
    currency: "INR",
    priceRange: product.priceRange,
    variants: product.variants.map((variant) => ({
      name: variant.name,
      price: variant.price,
      weightGrams: variant.weightGrams ?? null,
      deliveryCharge: variant.deliveryCharge ?? null,
    })),
    minimumOrder: product.minimumOrder,
    packaging: product.packaging,
    details: product.details,
    locations: product.locations,
    availability: product.availability,
    mpn: product.mpn ?? null,
    googleProductCategory: product.googleProductCategory,
    comingSoon: product.comingSoon ?? false,
  };
}

export async function loader() {
  const body = {
    site: "graycup.in",
    baseUrl: BASE_URL,
    currency: "INR",
    generatedAt: new Date().toISOString(),
    products: products.filter((p) => !p.isFundraiser && !p.isWholesale).map(mapProduct),
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
