import { getCityBySlug, getTopCities } from "@/data/india-locations";
import { wholesaleGroundCoffeeProducts } from "@/data/products";
import { LocationListing } from "@/components/products";
import type { Route } from "./+types/ground-coffee-for-cafes.$city";

export async function loader({ params }: Route.LoaderArgs) {
  const { city } = params;
  const location = getCityBySlug(city);
  if (!location) {
    throw new Response(null, { status: 404 });
  }
  return { city, ...location };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Not Found" }];
  const { city, cityData, stateData } = loaderData;
  const title = `Wholesale Ground Coffee Supplier in ${cityData.city}, ${stateData.state} | Bulk Orders`;
  const description = `Source wholesale ground coffee in bulk for ${cityData.city} cafes, hotels, and retailers. MOQ from 5 kg, GST invoice, delivered to ${cityData.city} and across ${stateData.state} by Gray Cup.`;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: `https://graycup.in/ground-coffee-for-cafes/${city}`,
    },
  ];
}

export default function GroundCoffeeForCafesCityPage({ loaderData }: Route.ComponentProps) {
  const { city, cityData, stateData } = loaderData;

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        {
          "@type": "ListItem",
          position: 2,
          name: `Ground Coffee for Cafes in ${cityData.city}`,
          item: `https://graycup.in/ground-coffee-for-cafes/${city}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: wholesaleGroundCoffeeProducts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://graycup.in/products/${p.slug}`,
      })),
    },
  ];

  return (
    <LocationListing
      eyebrow={`Gray Cup Ground Coffee for Cafes in ${cityData.city}, ${stateData.state}`}
      title={`Ground Coffee for Cafes in ${cityData.city}`}
      intro={`Bulk ground coffee delivered to ${cityData.city} for cafes, hotels, offices, and retailers. Ground fresh in wholesale packs, with a GST invoice on every bulk order.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Ground Coffee for Cafes" },
        { label: cityData.city },
      ]}
      products={wholesaleGroundCoffeeProducts}
      defaultDirection={defaultDirection}
      relatedTitle="Other Cities We Serve"
      relatedLinks={getTopCities(12, city).map((c) => ({
        label: c.city,
        href: `/ground-coffee-for-cafes/${c.citySlug}`,
        sublabel: "Ground Coffee",
      }))}
      topicLinks={[
        {
          label: `Roasted Coffee Beans for Cafes in ${cityData.city}`,
          href: `/roasted-coffee-beans-for-cafes/${city}`,
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
