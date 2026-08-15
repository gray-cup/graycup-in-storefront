import { Link } from "react-router";
import { INDIA_STATES, getCitiesByState } from "@/data/india-locations";
import { LOCATION_TOPIC_SLUGS, LOCATION_TOPICS } from "@/data/location-topics";

export function meta() {
  return [
    { title: "Locations | Black Coffee & Ground Coffee Across India | Gray Cup" },
    {
      name: "description",
      content:
        "Browse Gray Cup black coffee, ground coffee, and filter coffee delivery pages for every Indian state and major city.",
    },
    {
      property: "og:title",
      content: "Locations | Black Coffee & Ground Coffee Across India | Gray Cup",
    },
    {
      property: "og:description",
      content:
        "Browse Gray Cup black coffee, ground coffee, and filter coffee delivery pages for every Indian state and major city.",
    },
  ];
}

export default function LocationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://graycup.in" },
      { "@type": "ListItem", position: 2, name: "Locations", item: "https://graycup.in/locations" },
    ],
  };

  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
            Gray Cup Locations
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Black Coffee & Ground Coffee, City by City
          </h1>
          <p className="text-md text-muted-foreground max-w-2xl">
            Every state and city Gray Cup delivers black coffee, ground coffee, and filter coffee
            to, in one place.
          </p>
        </div>

        <div className="space-y-12">
          {INDIA_STATES.map((s) => {
            const cities = getCitiesByState(s.stateSlug);
            return (
              <div key={s.stateSlug} id={s.stateSlug}>
                <h2 className="text-lg font-semibold text-black mb-3">{s.state}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {LOCATION_TOPIC_SLUGS.map((topic) => (
                    <Link
                      key={topic}
                      to={`/${s.stateSlug}/${topic}`}
                      className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
                    >
                      {LOCATION_TOPICS[topic].label}
                    </Link>
                  ))}
                </div>

                {cities.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                    {cities.map((c) => (
                      <div key={c.citySlug}>
                        <p className="text-sm font-medium text-black mb-1.5">{c.city}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {LOCATION_TOPIC_SLUGS.map((topic) => (
                            <Link
                              key={topic}
                              to={`/${s.stateSlug}/${c.citySlug}/${topic}`}
                              className="text-xs text-muted-foreground hover:text-black transition-colors underline underline-offset-2"
                            >
                              {LOCATION_TOPICS[topic].label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
