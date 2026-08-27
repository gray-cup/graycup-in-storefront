import { Link } from "react-router";
import React from "react";
import { ChevronLeft } from "lucide-react";
import { getGuide, getRelatedGuides, guideImage } from "@/data/guides";

interface GuideLayoutProps {
  children: React.ReactNode;
  /** Slug from src/data/guides.ts. Title/date/tags/hero/related are read from there. */
  slug: string;
  // Optional overrides (rarely needed - keep guides.ts as the source of truth).
  title?: string;
  description?: string;
  date?: string;
  readingTime?: string;
  tags?: string[];
}

export function GuideLayout({
  children,
  slug,
  title,
  description,
  date,
  readingTime,
  tags,
}: GuideLayoutProps) {
  const entry = getGuide(slug);
  const t = title ?? entry?.title ?? "";
  const desc = description ?? entry?.description ?? "";
  const d = date ?? entry?.date ?? "";
  const rt = readingTime ?? entry?.readingTime ?? "";
  const tagList = tags ?? entry?.tags ?? [];
  const related = getRelatedGuides(slug);

  const formatted = d
    ? new Date(d).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      <Link
        to="/guides"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-neutral-900 transition-colors mb-10"
      >
        <ChevronLeft className="size-4" /> All Guides
      </Link>

      <header className="mb-10 pb-8 border-b border-neutral-200">
        <div className="flex flex-wrap gap-2 mb-4">
          {tagList.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-4 leading-tight">
          {t}
        </h1>

        <p className="text-lg text-muted-foreground mb-5 leading-relaxed">
          {desc}
        </p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {formatted && <time dateTime={d}>{formatted}</time>}
          {formatted && rt && <span aria-hidden>·</span>}
          {rt && <span>{rt}</span>}
        </div>
      </header>

      {entry && (
        <img
          src={guideImage(slug)}
          alt={t}
          width={1200}
          height={675}
          className="mb-10 aspect-[16/9] w-full rounded-xl object-cover bg-neutral-100"
        />
      )}

      <div className="guide-prose">{children}</div>

      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900 mb-5">
            Related Articles
          </h2>
          <ul className="space-y-3">
            {related.map((g) => (
              <li key={g.slug}>
                <Link
                  to={`/guides/${g.slug}`}
                  className="group flex items-baseline justify-between gap-4 text-neutral-800 hover:text-neutral-900"
                >
                  <span className="font-medium group-hover:underline">
                    {g.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {g.readingTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
