import { Link } from "react-router";
import { greenCoffeeProducts } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";

export function meta() {
  return [
    { title: "Wholesale Green (Unroasted) Coffee Beans | Gray Cup" },
    {
      name: "description",
      content:
        "Buy unroasted green coffee beans in bulk for roasters and cafes. Single-origin lots from Chikmagalur, Coorg, Koraput, and Assam. MOQ from 5 kg, GST invoice.",
    },
    { property: "og:title", content: "Wholesale Green (Unroasted) Coffee Beans | Gray Cup" },
    {
      property: "og:description",
      content:
        "Buy unroasted green coffee beans in bulk for roasters and cafes. Single-origin lots from Chikmagalur, Coorg, Koraput, and Assam.",
    },
  ];
}

export default function GreenWholesaleCoffeePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        {
          "@type": "ListItem",
          position: 2,
          name: "Green Coffee",
          item: "https://graycup.in/green-wholesale-coffee",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: greenCoffeeProducts.map((p, i) => ({
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
            Wholesale Green Coffee Beans for Roasters, Cafes, and Restaurants
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Buy Unroasted Single-Origin Green Coffee in Bulk for Your Own Roast
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Looking for coffee already roasted?{" "}
            <Link to="/roasted-wholesale-coffee" className="underline hover:text-black">
              Shop wholesale roasted coffee
            </Link>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {greenCoffeeProducts.map((product) => (
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
