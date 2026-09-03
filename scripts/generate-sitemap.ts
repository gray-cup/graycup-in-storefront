/**
 * Replaces next-sitemap (which crawled Next's build output) now that the app
 * is a plain React Router/Vite build with no build-time route manifest to
 * crawl. Enumerates URLs directly from the same source data the routes
 * themselves render from, and writes sitemap.xml + robots.txt straight into
 * the client build output so they ship as static assets.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { getAllProductSlugs } from "../src/data/products";
import { productPath } from "../src/lib/product-url";
import { getAllGlossarySlugs } from "../src/data/glossary";
import { INDIA_STATES, INDIA_CITIES } from "../src/data/india-locations";
import { LOCATION_TOPIC_SLUGS } from "../src/data/location-topics";
import { GUIDE_SLUGS } from "../src/data/guides";

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "build", "client");
const SITE_URL = process.env.SITE_URL || "https://graycup.in";

// Indexable pages only - cart/checkout/payment/auth are deliberately excluded
// (utility pages Google should never index or list).
const STATIC_PATHS = [
  "/",
  "/about",
  "/careers",
  "/contact",
  "/distributor-franchise",
  "/fundraisers",
  "/how-to-use",
  "/locations",
  "/privacy",
  "/return-policy",
  "/social-responsibility",
  "/sites",
  "/team",
  "/terms",
  "/accessories",
  "/green-wholesale-coffee",
  "/roasted-wholesale-coffee",
  "/roasted-coffee-beans-for-cafes",
  "/products",
  "/glossary",
  "/guides",
];

// Google accepts 50k URLs per sitemap; the smaller cap is per the site owner's
// request - many small sitemaps make it easier to see in Search Console which
// batch is/isn't getting crawled.
const URLS_PER_SITEMAP = 250;

function collectUrls(): string[] {
  const urls = new Set<string>(STATIC_PATHS);

  for (const slug of getAllProductSlugs()) {
    urls.add(productPath({ slug }));
    urls.add(`/subscribe/${slug}`);
  }

  for (const slug of getAllGlossarySlugs()) {
    urls.add(`/glossary/${slug}`);
  }

  for (const slug of GUIDE_SLUGS) {
    urls.add(`/guides/${slug}`);
  }

  for (const state of INDIA_STATES) {
    urls.add(`/roasted-wholesale-coffee/${state.stateSlug}`);
    for (const topic of LOCATION_TOPIC_SLUGS) {
      urls.add(`/${state.stateSlug}/${topic}`);
    }
  }

  for (const city of INDIA_CITIES) {
    urls.add(`/roasted-wholesale-coffee/${city.stateSlug}/${city.citySlug}`);
    urls.add(`/roasted-coffee-beans-for-cafes/${city.citySlug}`);
    urls.add(`/ground-coffee-for-cafes/${city.citySlug}`);
    for (const topic of LOCATION_TOPIC_SLUGS) {
      urls.add(`/${city.stateSlug}/${city.citySlug}/${topic}`);
    }
  }

  return Array.from(urls);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function buildSitemapXml(urls: string[]): string {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobotsTxt(sitemapFiles: string[]): string {
  const lines = ["sitemap.xml", ...sitemapFiles]
    .map((name) => `Sitemap: ${SITE_URL}/${name}`)
    .join("\n");
  return `User-agent: *\nAllow: /\n\n${lines}\n`;
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const urls = collectUrls();
  const batches = chunk(urls, URLS_PER_SITEMAP);

  // sitemap.xml = every URL in one file. sitemap-1.xml .. sitemap-N.xml = the
  // same URLs split into <=250-URL batches (easier to read crawl coverage
  // per-batch in Search Console). All are listed in robots.txt.
  const fileNames = batches.map((_, i) => `sitemap-${i + 1}.xml`);
  writeFileSync(path.join(OUTPUT_DIR, "sitemap.xml"), buildSitemapXml(urls));
  batches.forEach((batch, i) => {
    writeFileSync(path.join(OUTPUT_DIR, fileNames[i]), buildSitemapXml(batch));
  });
  writeFileSync(path.join(OUTPUT_DIR, "robots.txt"), buildRobotsTxt(fileNames));

  console.log(
    `Wrote sitemap.xml (${urls.length} URLs) + ${fileNames.length} batch sitemaps to ${path.relative(ROOT, OUTPUT_DIR)}/`,
  );
}

main();
