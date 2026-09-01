import {
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
import { getStateLocationContent } from "@/data/location-content";
import type { Route } from "./+types/$state.$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const { state, slug: topic } = params;
  const stateData = getStateBySlug(state);
  const topicData = getLocationTopic(topic);
  if (!stateData || !topicData) {
    throw new Response(null, { status: 404 });
  }
  return { state, topic, stateData, topicData };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Not Found" }];
  const { state, topic, stateData, topicData } = loaderData;
  const title = `${topicData.label} in ${stateData.state} | Gray Cup`;
  const description = getStateLocationContent(stateData, topicData.copyLabel).intro;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://graycup.in/${state}/${topic}` },
  ];
}

export default function StateTopicPage({ loaderData }: Route.ComponentProps) {
  const { state, topic, stateData, topicData } = loaderData;

  const defaultDirection: "asc" | "desc" = stateData.tier === "high" ? "desc" : "asc";
  const products = getProductsForTopic(topicData.slug);

  const cities = getCitiesByState(state);
  const content = getStateLocationContent(stateData, topicData.copyLabel);

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
      intro={content.intro}
      bodyParagraphs={content.paragraphs}
      faqs={content.faqs}
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
