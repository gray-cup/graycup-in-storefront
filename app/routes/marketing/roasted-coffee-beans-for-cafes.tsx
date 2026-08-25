import { Link } from "react-router";
import { wholesaleRoastedBeansProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export function meta() {
  const title = "Wholesale Roasted Coffee Beans for Cafes | Gray Cup";
  const description =
    "Buy whole roasted coffee beans in bulk for cafes, restaurants, and hotels. Single-origin and blend lots from Chikmagalur, Coorg, and Koraput. MOQ from 5 kg, GST invoice.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    {
      property: "og:description",
      content:
        "Buy whole roasted coffee beans in bulk for cafes, restaurants, and hotels. Single-origin and blend lots from Chikmagalur, Coorg, and Koraput.",
    },
  ];
}

export default function RoastedBeansForCafesPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Roasted Coffee Beans for Cafes",
          item: "https://graycup.in/roasted-coffee-beans-for-cafes",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: wholesaleRoastedBeansProducts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://graycup.in/products/${p.slug}`,
      })),
    },
  ];

  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Wholesale Roasted Coffee Beans for Cafes, Restaurants, and Hotels
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Buy Whole Roasted Coffee Beans in Bulk Quantities for Restaurants, Cafes and Hotels.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Looking for unroasted beans instead?{" "}
            <Link to="/green-wholesale-coffee" className="underline hover:text-black">
              Shop wholesale green coffee
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wholesaleRoastedBeansProducts.map((product) => (
            <div key={product.slug}>
              <ProductCard product={product} showPrice={false} />
              <p className="text-sm text-muted-foreground mt-2 px-1">
                {product.priceRange.min === product.priceRange.max
                  ? `₹${product.priceRange.min.toLocaleString("en-IN")} / kg`
                  : `₹${product.priceRange.min.toLocaleString("en-IN")}–₹${product.priceRange.max.toLocaleString("en-IN")} / kg`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
