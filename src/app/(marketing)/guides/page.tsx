import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides | Gray Cup",
  description:
    "Practical guides on brewing tea and coffee, understanding different types, and getting the most from every cup.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Guides | Gray Cup",
    description:
      "Practical guides on brewing tea and coffee, understanding different types, and getting the most from every cup.",
    type: "website",
    url: "/guides",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guides | Gray Cup",
    description:
      "Practical guides on brewing tea and coffee, understanding different types, and getting the most from every cup.",
  },
};

const guides = [
  {
    slug: "brewing-the-perfect-cup",
    title: "How to Brew the Perfect Cup of Tea",
    description:
      "Master the art of tea brewing - the right water temperature, steeping times, and techniques for every type of tea.",
    readingTime: "6 min read",
    tags: ["Tea", "Brewing", "Beginner"],
    date: "2026-01-15",
  },
  {
    slug: "ctc-vs-loose-leaf-tea",
    title: "CTC vs Loose Leaf Tea: What's the Difference?",
    description:
      "Explore the differences between CTC and loose leaf tea - how they're made, how they taste, and which to choose.",
    readingTime: "5 min read",
    tags: ["Tea", "Education", "CTC"],
    date: "2026-01-22",
  },
  {
    slug: "instant-vs-brewed-coffee",
    title: "Instant Coffee vs Brewed Coffee: Which Is Right for You?",
    description:
      "A practical comparison of instant and brewed coffee - flavor, convenience, quality, and when each one shines.",
    readingTime: "4 min read",
    tags: ["Coffee", "Instant Coffee", "Brewing"],
    date: "2026-02-01",
  },
  {
    slug: "black-coffee-liver-health",
    title: "Top 5 Black Coffees for Liver Health",
    description:
      "Research links black coffee to better liver enzyme levels and lower risk of liver disease. Here are 5 black coffees worth keeping in your rotation.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Black Coffee"],
    date: "2026-07-30",
  },
  {
    slug: "best-black-coffee-for-fatty-liver",
    title: "Best Black Coffee Brand for Fatty Liver",
    description:
      "Fatty liver disease is linked to lower coffee consumption in several studies. Here's what the research says and the best black coffees to build into a daily routine.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Fatty Liver"],
    date: "2026-08-10",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
          Guides
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-xl">
          Practical guides on brewing tea and coffee, understanding different
          types, and getting the most from every cup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="group block"
          >
            <article className="h-full border border-neutral-200 rounded-xl p-6 bg-white hover:border-neutral-300 hover:shadow-sm transition-all">
              <div className="flex flex-wrap gap-2 mb-3">
                {guide.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors leading-snug">
                {guide.title}
              </h2>

              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {guide.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <time dateTime={guide.date}>
                  {new Date(guide.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>{guide.readingTime}</span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
