import { Link, useLoaderData } from "react-router";
import { ChevronLeft } from "lucide-react";
import {
  getGlossaryTermBySlug,
  type GlossaryRelatedFilter,
} from "@/data/glossary";
import { retailProducts } from "@/data/products";
import { productPath } from "@/lib/product-url";
import { BreadcrumbSchema, DefinedTermSchema } from "@/components/seo";
import type { Route } from "./+types/glossary.$slug";

const baseUrl = "https://graycup.in";

function matchesFilter(
  product: (typeof retailProducts)[number],
  filter: GlossaryRelatedFilter,
): boolean {
  if (filter.process && product.process !== filter.process) return false;
  if (filter.categoryTwo && product.categoryTwo !== filter.categoryTwo) return false;
  if (filter.category && product.category !== filter.category) return false;
  return true;
}

export async function loader({ params }: Route.LoaderArgs) {
  const term = getGlossaryTermBySlug(params.slug);

  if (!term) {
    throw new Response(null, { status: 404 });
  }

  return { term, slug: params.slug };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Term Not Found" }];
  const { term, slug } = loaderData;
  const url = `${baseUrl}/glossary/${slug}`;
  const title = `What is ${term.term}? | Gray Cup Glossary`;

  return [
    { title },
    { name: "description", content: term.shortDefinition },
    { property: "og:title", content: title },
    { property: "og:description", content: term.shortDefinition },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Gray Cup" },
    { property: "og:type", content: "article" },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: term.shortDefinition },
  ];
}

export default function GlossaryTermPage() {
  const { term, slug } = useLoaderData<typeof loader>();

  const relatedTerms = (term.relatedSlugs ?? [])
    .map((relatedSlug) => getGlossaryTermBySlug(relatedSlug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const relatedProducts = term.relatedProductFilter
    ? retailProducts.filter((product) => matchesFilter(product, term.relatedProductFilter!)).slice(0, 4)
    : [];

  const breadcrumbs = [
    { name: "Home", url: baseUrl },
    { name: "Glossary", url: `${baseUrl}/glossary` },
    { name: term.term, url: `${baseUrl}/glossary/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <DefinedTermSchema
        term={term.term}
        definition={term.definition}
        url={`${baseUrl}/glossary/${slug}`}
        inDefinedTermSetUrl={`${baseUrl}/glossary`}
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
        <Link
          to="/glossary"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-neutral-900 transition-colors mb-10"
        >
          <ChevronLeft className="size-4" /> All Glossary Terms
        </Link>

        <header className="mb-10 pb-8 border-b border-neutral-200">
          <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 mb-4">
            {term.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-4 leading-tight">
            {term.term}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {term.shortDefinition}
          </p>
        </header>

        <p className="text-gray-700 leading-relaxed">{term.definition}</p>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-black mb-4">
              Products with {term.term}
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={productPath(product)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full text-sm transition-colors"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {relatedTerms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-black mb-4">
              Related Terms
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedTerms.map((relatedTerm) => (
                <Link
                  key={relatedTerm.slug}
                  to={`/glossary/${relatedTerm.slug}`}
                  className="px-3 py-1.5 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-full text-sm transition-colors"
                >
                  {relatedTerm.term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
