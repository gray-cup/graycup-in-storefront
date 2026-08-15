import { Link } from "react-router";
import React from "react";
import { ChevronLeft } from "lucide-react";

interface GuideLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export function GuideLayout({
  children,
  title,
  description,
  date,
  readingTime,
  tags,
}: GuideLayoutProps) {
  const formatted = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-4 leading-tight">
          {title}
        </h1>

        <p className="text-lg text-muted-foreground mb-5 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={date}>{formatted}</time>
          <span aria-hidden>·</span>
          <span>{readingTime}</span>
        </div>
      </header>

      <div className="guide-prose">{children}</div>
    </div>
  );
}
