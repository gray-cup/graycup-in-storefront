import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  INDIA_STATES,
  getStateBySlug,
  getCitiesByState,
} from "@/data/india-locations";
import { wholesaleCoffeeProducts } from "@/data/products";
import { LocationListing } from "@/components/products";

export const dynamicParams = false;

type Props = {
  params: Promise<{ state: string }>;
};

export function generateStaticParams() {
  return INDIA_STATES.map((s) => ({ state: s.stateSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const stateData = getStateBySlug(state);
  if (!stateData) return { title: "Not Found" };

  const title = `Wholesale Coffee Beans Supplier in ${stateData.state} | Bulk Orders`;
  const description = `Buy wholesale roasted coffee beans and ground coffee in bulk for cafés, hotels, and retailers across ${stateData.state}. MOQ from 5 kg, GST invoice, doorstep delivery from Gray Cup.`;

  return {
    title,
    description,
    alternates: { canonical: `/roasted-wholesale-coffee/${state}` },
    openGraph: { title, description, url: `https://graycup.in/roasted-wholesale-coffee/${state}` },
  };
}

export default async function WholesaleStatePage({ params }: Props) {
  const { state } = await params;

  const stateData = getStateBySlug(state);
  if (!stateData) notFound();

  const defaultDirection: "asc" | "desc" = stateData.tier === "high" ? "desc" : "asc";
  const cities = getCitiesByState(state);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
        { "@type": "ListItem", position: 2, name: "Wholesale", item: "https://graycup.in/roasted-wholesale-coffee" },
        {
          "@type": "ListItem",
          position: 3,
          name: stateData.state,
          item: `https://graycup.in/roasted-wholesale-coffee/${state}`,
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
      eyebrow={`Gray Cup Wholesale for ${stateData.state}`}
      title={`Wholesale Coffee Beans & Ground Coffee in ${stateData.state}`}
      intro={`Bulk roasted whole bean and ground coffee for cafés, hotels, offices, and retailers in ${stateData.state}. Roasted to order in wholesale packs, with a GST invoice and delivery on every order.`}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wholesale", href: "/roasted-wholesale-coffee" },
        { label: stateData.state },
      ]}
      products={wholesaleCoffeeProducts}
      defaultDirection={defaultDirection}
      relatedTitle={`Cities in ${stateData.state}`}
      relatedLinks={cities.map((c) => ({
        label: c.city,
        href: `/roasted-wholesale-coffee/${state}/${c.citySlug}`,
        sublabel: "Wholesale Coffee",
      }))}
      topicLinks={[]}
      jsonLd={jsonLd}
    />
  );
}
