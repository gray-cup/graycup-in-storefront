import {
  getStateBySlug,
  getCity,
  getCitiesByState,
} from "@/data/india-locations";
import { wholesaleCoffeeProducts } from "@/data/products";
import { LocationListing } from "@/components/products";
import { getLocationContent } from "@/data/location-content";
import type { Route } from "./+types/roasted-wholesale-coffee.$state.$city";

export async function loader({ params }: Route.LoaderArgs) {
  const { state, city } = params;
  const stateData = getStateBySlug(state);
  const cityData = getCity(state, city);
  if (!stateData || !cityData) {
    throw new Response(null, { status: 404 });
  }
  return { state, city, stateData, cityData };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Not Found" }];
  const { state, city, stateData, cityData } = loaderData;
  const title = `Wholesale Coffee Supplier in ${cityData.city}, ${stateData.state} | Bulk Roasted Coffee`;
  const description = getLocationContent(
    cityData,
    stateData,
    "wholesale",
    "roasted and ground coffee",
  ).intro;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: `https://graycup.in/roasted-wholesale-coffee/${state}/${city}` },
  ];
}

export default function WholesaleCityPage({ loaderData }: Route.ComponentProps) {
  const { state, city, stateData, cityData } = loaderData;

  const defaultDirection: "asc" | "desc" = cityData.tier === "high" ? "desc" : "asc";
  const otherCities = getCitiesByState(state).filter((c) => c.citySlug !== city);
  const content = getLocationContent(cityData, stateData, "wholesale", "roasted and ground coffee");

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
        {
          "@type": "ListItem",
          position: 4,
          name: cityData.city,
          item: `https://graycup.in/roasted-wholesale-coffee/${state}/${city}`,
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
      intro={content.intro}
      bodyParagraphs={content.paragraphs}
      faqs={content.faqs}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Wholesale", href: "/roasted-wholesale-coffee" },
        { label: stateData.state, href: `/roasted-wholesale-coffee/${state}` },
        { label: cityData.city },
      ]}
      products={wholesaleCoffeeProducts}
      defaultDirection={defaultDirection}
      relatedTitle={`Other Cities in ${stateData.state}`}
      relatedLinks={otherCities.map((c) => ({
        label: c.city,
        href: `/roasted-wholesale-coffee/${state}/${c.citySlug}`,
        sublabel: "Wholesale Coffee",
      }))}
      topicLinks={[]}
      jsonLd={jsonLd}
    />
  );
}
