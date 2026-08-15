import { Link } from "react-router";
import { getGlossaryTermsByCategory } from "@/data/glossary";
import { BreadcrumbSchema, DefinedTermSetSchema } from "@/components/seo";

const baseUrl = "https://graycup.in";
const title = "Coffee & Tea Glossary | Gray Cup";
const description =
  "A glossary of coffee and tea terms - processing methods, varietals, tea styles, and brewing methods, explained in plain language.";

export function meta() {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function GlossaryPage() {
  const groups = getGlossaryTermsByCategory();
  const allTerms = groups.flatMap((group) => group.terms);

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Glossary", url: `${baseUrl}/glossary` },
  ];

  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <BreadcrumbSchema items={breadcrumbs} />
      <DefinedTermSetSchema
        name="Gray Cup Coffee & Tea Glossary"
        description={description}
        url={`${baseUrl}/glossary`}
        terms={allTerms.map((term) => ({
          name: term.term,
          description: term.shortDefinition,
          url: `${baseUrl}/glossary/${term.slug}`,
        }))}
      />

      <div className="max-w-5xl mx-auto">
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Coffee &amp; Tea Glossary
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-xl">
            {description}
          </p>
        </div>

        <div className="space-y-14">
          {groups.map(
            (group) =>
              group.terms.length > 0 && (
                <section key={group.category}>
                  <h2 className="text-xl font-semibold text-black mb-5">
                    {group.category}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.terms.map((term) => (
                      <Link
                        key={term.slug}
                        to={`/glossary/${term.slug}`}
                        className="group block"
                      >
                        <article className="h-full border border-neutral-200 rounded-xl p-5 bg-white hover:border-neutral-300 hover:shadow-sm transition-all">
                          <h3 className="text-md font-semibold text-neutral-900 mb-1.5 group-hover:text-neutral-700 transition-colors">
                            {term.term}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {term.shortDefinition}
                          </p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
