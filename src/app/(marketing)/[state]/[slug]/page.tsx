import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  INDIA_STATES,
  getStateBySlug,
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
  params: Promise<{ state: string; slug: string }>;
};

export function generateStaticParams() {
  return INDIA_STATES.flatMap((s) =>
    LOCATION_TOPIC_SLUGS.map((topic) => ({ state: s.stateSlug, slug: topic }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, slug: topic } = await params;
  const stateData = getStateBySlug(state);
  const topicData = getLocationTopic(topic);
  if (!stateData || !topicData) return { title: "Not Found" };

  const title = `${topicData.label} in ${stateData.state} | Gray Cup`;
  const description = `Order ${topicData.copyLabel} online in ${stateData.state}. Fresh-roasted, GST-invoiced, delivered across ${stateData.state} by Gray Cup.`;

  return {
    title,
    description,
    alternates: { canonical: `/${state}/${topic}` },
    openGraph: { title, description, url: `https://graycup.in/${state}/${topic}` },
  };
}

export default async function StateTopicPage({ params }: Props) {
  const { state, slug: topic } = await params;

  const stateData = getStateBySlug(state);
  const topicData = getLocationTopic(topic);
  if (!stateData || !topicData) notFound();

  const defaultDirection: "asc" | "desc" = stateData.tier === "high" ? "desc" : "asc";
  const products = getProductsForTopic(topicData.slug);

  const cities = getCitiesByState(state);

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
      eyebrow={`Gray Cup for ${stateData.state}`}
      title={`${topicData.label} in ${stateData.state}`}
      intro={`Shop ${topicData.copyLabel} for delivery across ${stateData.state} — fresh-roasted to order, packed for freshness, and shipped with a GST invoice on every order.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: stateData.state },
      ]}
      products={products}
      defaultDirection={defaultDirection}
      relatedTitle={`Cities in ${stateData.state}`}
      relatedLinks={cities.map((c) => ({
        label: c.city,
        href: `/${state}/${c.citySlug}/${topic}`,
        sublabel: `${topicData.label}`,
      }))}
      topicLinks={LOCATION_TOPIC_SLUGS.filter((t) => t !== topic).map((t) => ({
        label: LOCATION_TOPICS[t].label,
        href: `/${state}/${t}`,
      }))}
      jsonLd={jsonLd}
    />
  );
}
