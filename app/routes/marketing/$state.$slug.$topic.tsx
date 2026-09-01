import {
  getStateBySlug,
  getCity,
  getCitiesByState,
} from "@/data/india-locations";
import {
  LOCATION_TOPICS,
  LOCATION_TOPIC_SLUGS,
  getLocationTopic,
  getProductsForTopic,
} from "@/data/location-topics";
import { LocationListing } from "@/components/products";
import { getLocationContent } from "@/data/location-content";
import type { Route } from "./+types/$state.$slug.$topic";

export async function loader({ params }: Route.LoaderArgs) {
  const { state, slug: city, topic } = params;
  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  const topicData = getLocationTopic(topic);
  if (!stateData || !cityData || !topicData) {
    throw new Response(null, { status: 404 });
  }
  return { state, city, topic, stateData, cityData, topicData };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Not Found" }];
  const { state, city, topic, stateData, cityData, topicData } = loaderData;
  const title = `${topicData.label} in ${cityData.city}, ${stateData.state} | Gray Cup`;
  const description = getLocationContent(
    cityData,
    stateData,
    "retail",
    topicData.copyLabel,
  ).intro;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://graycup.in/${state}/${city}/${topic}` },
  ];
}

export default function CityTopicPage({ loaderData }: Route.ComponentProps) {
  const { state, city, topic, stateData, cityData, topicData } = loaderData;

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";
  const products = getProductsForTopic(topicData.slug);

  const otherCities = getCitiesByState(state).filter((c) => c.citySlug !== city);
  const content = getLocationContent(cityData, stateData, "retail", topicData.copyLabel);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        { "@type": "ListItem", position: 2, name: "Products", item: "https://graycup.in/products" },
        {
          "@type": "ListItem",
          position: 3,
          name: stateData.state,
          item: `https://graycup.in/${state}/${topic}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: cityData.city,
          item: `https://graycup.in/${state}/${city}/${topic}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://graycup.in/products/${p.slug}`,
      })),
    },
  ];

  return (
    <LocationListing
      eyebrow={`Gray Cup for ${cityData.city}, ${stateData.state}`}
      title={`${topicData.label} in ${cityData.city}`}
      intro={content.intro}
      bodyParagraphs={content.paragraphs}
      faqs={content.faqs}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: stateData.state, href: `/${state}/${topic}` },
        { label: cityData.city },
      ]}
      products={products}
      defaultDirection={defaultDirection}
      relatedTitle={`Other Cities in ${stateData.state}`}
      relatedLinks={otherCities.map((c) => ({
        label: c.city,
        href: `/${state}/${c.citySlug}/${topic}`,
        sublabel: topicData.label,
      }))}
      topicLinks={LOCATION_TOPIC_SLUGS.filter((t) => t !== topic).map((t) => ({
        label: LOCATION_TOPICS[t].label,
        href: `/${state}/${city}/${t}`,
      }))}
      jsonLd={jsonLd}
    />
  );
}
