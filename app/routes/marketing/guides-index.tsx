import { Link } from "react-router";
import { GUIDES, guideImage } from "@/data/guides";

export function meta() {
  return [
    { title: "Guides | Gray Cup" },
    {
      name: "description",
      content:
        "Practical guides and articles on coffee and tea - weight loss, gym and energy, caffeine, black coffee, filter coffee, beans, and brewing.",
    },
    { property: "og:title", content: "Guides | Gray Cup" },
    {
      property: "og:description",
      content:
        "Practical guides and articles on coffee and tea - weight loss, gym and energy, caffeine, black coffee, filter coffee, beans, and brewing.",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/og/guides/index.png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Guides | Gray Cup" },
    {
      name: "twitter:description",
      content:
        "Practical guides and articles on coffee and tea - weight loss, gym and energy, caffeine, black coffee, filter coffee, beans, and brewing.",
    },
    { name: "twitter:image", content: "/og/guides/index.png" },
  ];
}

const guides = [...GUIDES].sort((a, b) => (a.date < b.date ? 1 : -1));

export default function GuidesPage() {
  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="mb-14">
        <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
          Guides &amp; Articles
        </h1>
        <p className="text-md md:text-lg text-muted-foreground max-w-xl">
          Practical guides and articles on coffee and tea - what to drink for
          weight loss, the gym and energy, how to choose beans and filter
          coffee, and how to brew every cup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group block"
          >
            <article className="h-full overflow-hidden border border-neutral-200 rounded-xl bg-white hover:border-neutral-300 hover:shadow-sm transition-all">
              <img
                src={guideImage(guide.slug)}
                alt={guide.title}
                width={1200}
                height={675}
                loading="lazy"
                decoding="async"
                className="aspect-[16/9] w-full object-cover bg-neutral-100"
              />
              <div className="p-6">
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
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
