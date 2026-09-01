import { getCityBySlug, getTopCities } from "@/data/india-locations";
import { wholesaleRoastedBeansProducts } from "@/data/products";
import { LocationListing } from "@/components/products";
import { getLocationContent } from "@/data/location-content";
import type { Route } from "./+types/roasted-coffee-beans-for-cafes.$city";

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
  const title = `Wholesale Roasted Coffee Beans Supplier in ${cityData.city}, ${stateData.state} | Bulk Orders`;
  const description = getLocationContent(
    cityData,
    stateData,
    "wholesale",
    "roasted whole bean coffee",
  ).intro;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    {
      property: "og:url",
      content: `https://graycup.in/roasted-coffee-beans-for-cafes/${city}`,
    },
  ];
}

export default function RoastedBeansForCafesCityPage({ loaderData }: Route.ComponentProps) {
  const { city, cityData, stateData } = loaderData;

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";
  const content = getLocationContent(cityData, stateData, "wholesale", "roasted whole bean coffee");

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
        {
          "@type": "ListItem",
          position: 3,
          name: cityData.city,
          item: `https://graycup.in/roasted-coffee-beans-for-cafes/${city}`,
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
    <LocationListing
      eyebrow={`Gray Cup Roasted Coffee Beans for Cafes in ${cityData.city}, ${stateData.state}`}
      title={`Roasted Coffee Beans for Cafes in ${cityData.city}`}
      intro={content.intro}
      bodyParagraphs={content.paragraphs}
      faqs={content.faqs}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Roasted Coffee Beans for Cafes", href: "/roasted-coffee-beans-for-cafes" },
        { label: cityData.city },
      ]}
      products={wholesaleRoastedBeansProducts}
      defaultDirection={defaultDirection}
      relatedTitle="Other Cities We Serve"
      relatedLinks={getTopCities(12, city).map((c) => ({
        label: c.city,
        href: `/roasted-coffee-beans-for-cafes/${c.citySlug}`,
        sublabel: "Roasted Coffee Beans",
      }))}
      topicLinks={[
        {
          label: `Ground Coffee for Cafes in ${cityData.city}`,
          href: `/ground-coffee-for-cafes/${city}`,
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
