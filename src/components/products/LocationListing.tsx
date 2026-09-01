import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SortableProductGrid } from "./SortableProductGrid";
import type { Product } from "@/data/products";

type Crumb = { label: string; href?: string };
type RelatedLink = { label: string; href: string; sublabel?: string };

type Faq = { question: string; answer: string };

type LocationListingProps = {
  eyebrow: string;
  title: string;
  intro: string;
  breadcrumbs: Crumb[];
  products: Product[];
  defaultDirection: "asc" | "desc";
  relatedTitle: string;
  relatedLinks: RelatedLink[];
  topicLinks: RelatedLink[];
  jsonLd?: Record<string, unknown>[];
  /** Location-specific prose rendered under the intro. */
  bodyParagraphs?: string[];
  /** Location-specific FAQ - rendered and emitted as FAQPage schema. */
  faqs?: Faq[];
};

export function LocationListing({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  products,
  defaultDirection,
  relatedTitle,
  relatedLinks,
  topicLinks,
  jsonLd,
  bodyParagraphs,
  faqs,
}: LocationListingProps) {
  const allSchema = [
    ...(jsonLd ?? []),
    ...(faqs && faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      {allSchema.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-black transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-black">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">{title}</h1>
          <p className="text-md text-muted-foreground max-w-2xl mb-4">{intro}</p>
          {bodyParagraphs && bodyParagraphs.length > 0 && (
            <div className="max-w-2xl space-y-3 text-sm text-muted-foreground mb-6">
              {bodyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {topicLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button variant="lightgraybg" size="sm">
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <hr className="mb-8" />

        <SortableProductGrid products={products} defaultDirection={defaultDirection} />

        {relatedLinks.length > 0 && (
          <>
            <hr className="mb-8" />
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-black mb-4">{relatedTitle}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="flex items-center justify-between p-4 border rounded-lg hover:border-neutral-400 transition-colors group"
                  >
                    <div>
                      <p className="font-medium text-black">{link.label}</p>
                      {link.sublabel && (
                        <p className="text-xs text-muted-foreground mt-1">{link.sublabel}</p>
                      )}
                    </div>
                    <span className="text-muted-foreground group-hover:text-black transition-colors">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {faqs && faqs.length > 0 && (
          <>
            <hr className="mb-8" />
            <div className="mb-12">
              <h2 className="text-lg font-semibold text-black mb-4">
                Frequently asked questions
              </h2>
              <dl className="space-y-5">
                {faqs.map((f, i) => (
                  <div key={i}>
                    <dt className="font-medium text-black">{f.question}</dt>
                    <dd className="text-sm text-muted-foreground mt-1">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </>
        )}

        <div className="p-8 rounded-xl border border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-black mb-1">Order from Gray Cup</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Fresh-roasted, GST-invoiced, shipped across India.
          </p>
          <Link to="/products">
            <Button variant="black" size="sm">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
