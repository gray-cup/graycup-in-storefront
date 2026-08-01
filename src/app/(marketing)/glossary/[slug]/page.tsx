import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import {
  getGlossaryTermBySlug,
  getAllGlossarySlugs,
  type GlossaryRelatedFilter,
} from "@/data/glossary";
import { retailProducts } from "@/data/products";
import { BreadcrumbSchema, DefinedTermSchema } from "@/components/seo";

const baseUrl = "https://graycup.in";

type GlossaryTermPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return { title: "Term Not Found" };
  }

  const url = `${baseUrl}/glossary/${slug}`;
  const title = `What is ${term.term}? | Gray Cup Glossary`;

  return {
    title,
    description: term.shortDefinition,
    openGraph: {
      title,
      description: term.shortDefinition,
      url,
      siteName: "Gray Cup",
      type: "article",
      locale: "en_IN",
    },
    twitter: {
      card: "summary",
      title,
      description: term.shortDefinition,
    },
    alternates: {
      canonical: url,
    },
  };
}

function matchesFilter(
  product: (typeof retailProducts)[number],
  filter: GlossaryRelatedFilter,
): boolean {
  if (filter.process && product.process !== filter.process) return false;
  if (filter.categoryTwo && product.categoryTwo !== filter.categoryTwo) return false;
  if (filter.category && product.category !== filter.category) return false;
  return true;
}

export default async function GlossaryTermPage({ params }: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

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
          href="/glossary"
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
                  href={`/products/${product.slug}`}
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
                  href={`/glossary/${relatedTerm.slug}`}
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
