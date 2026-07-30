import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  INDIA_CITIES,
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

export const dynamicParams = false;

type Props = {
  params: Promise<{ state: string; slug: string; topic: string }>;
};

export function generateStaticParams() {
  return INDIA_CITIES.flatMap((c) =>
    LOCATION_TOPIC_SLUGS.map((topic) => ({
      state: c.stateSlug,
      slug: c.citySlug,
      topic,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, slug: city, topic } = await params;
  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  const topicData = getLocationTopic(topic);
  if (!stateData || !cityData || !topicData) return { title: "Not Found" };

  const title = `${topicData.label} in ${cityData.city}, ${stateData.state} | Gray Cup`;
  const description = `Order ${topicData.copyLabel} online in ${cityData.city}. Fresh-roasted, GST-invoiced, delivered to ${cityData.city} and across ${stateData.state} by Gray Cup.`;

  return {
    title,
    description,
    alternates: { canonical: `/${state}/${city}/${topic}` },
    openGraph: { title, description, url: `https://graycup.in/${state}/${city}/${topic}` },
  };
}

export default async function CityTopicPage({ params }: Props) {
  const { state, slug: city, topic } = await params;

  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  const topicData = getLocationTopic(topic);
  if (!stateData || !cityData || !topicData) notFound();

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";
  const products = getProductsForTopic(topicData.slug);

  const otherCities = getCitiesByState(state).filter((c) => c.citySlug !== city);

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
      intro={`Shop ${topicData.copyLabel} for delivery to ${cityData.city} — fresh-roasted to order, packed for freshness, and shipped with a GST invoice on every order.`}
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
