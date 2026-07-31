import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  INDIA_CITIES,
  getStateBySlug,
  getCity,
  getCitiesByState,
} from "@/data/india-locations";
import { wholesaleCoffeeProducts } from "@/data/products";
import { LocationListing } from "@/components/products";

export const dynamicParams = false;

type Props = {
  params: Promise<{ state: string; city: string }>;
};

export function generateStaticParams() {
  return INDIA_CITIES.map((c) => ({ state: c.stateSlug, city: c.citySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city } = await params;
  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  if (!stateData || !cityData) return { title: "Not Found" };

  const title = `Wholesale Coffee Supplier in ${cityData.city}, ${stateData.state} | Bulk Roasted Coffee`;
  const description = `Source wholesale roasted whole bean and ground coffee in bulk for ${cityData.city} cafés, hotels, and retailers. MOQ from 5 kg, GST invoice, delivered to ${cityData.city} and across ${stateData.state} by Gray Cup.`;

  return {
    title,
    description,
    alternates: { canonical: `/wholesale/${state}/${city}` },
    openGraph: { title, description, url: `https://graycup.in/wholesale/${state}/${city}` },
  };
}

export default async function WholesaleCityPage({ params }: Props) {
  const { state, city } = await params;

  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  if (!stateData || !cityData) notFound();

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";
  const otherCities = getCitiesByState(state).filter((c) => c.citySlug !== city);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        { "@type": "ListItem", position: 2, name: "Wholesale", item: "https://graycup.in/wholesale" },
        {
          "@type": "ListItem",
          position: 3,
          name: stateData.state,
          item: `https://graycup.in/wholesale/${state}`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: cityData.city,
          item: `https://graycup.in/wholesale/${state}/${city}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: wholesaleCoffeeProducts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://graycup.in/products/${p.slug}`,
      })),
    },
  ];

  return (
    <LocationListing
      eyebrow={`Gray Cup Wholesale for ${cityData.city}, ${stateData.state}`}
      title={`Wholesale Coffee Beans & Ground Coffee in ${cityData.city}`}
      intro={`Bulk roasted whole bean and ground coffee delivered to ${cityData.city} for cafés, hotels, offices, and retailers. Roasted to order in wholesale packs, with a GST invoice on every bulk order.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wholesale", href: "/wholesale" },
        { label: stateData.state, href: `/wholesale/${state}` },
        { label: cityData.city },
      ]}
      products={wholesaleCoffeeProducts}
      defaultDirection={defaultDirection}
      relatedTitle={`Other Cities in ${stateData.state}`}
      relatedLinks={otherCities.map((c) => ({
        label: c.city,
        href: `/wholesale/${state}/${c.citySlug}`,
        sublabel: "Wholesale Coffee",
      }))}
      topicLinks={[]}
      jsonLd={jsonLd}
    />
  );
}
