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
import { getAllGlossarySlugs } from "../src/data/glossary";
import { INDIA_STATES, INDIA_CITIES } from "../src/data/india-locations";
import { LOCATION_TOPIC_SLUGS } from "../src/data/location-topics";

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT, "build", "client");
const SITE_URL = process.env.SITE_URL || "https://graycup.in";

const GUIDE_SLUGS = [
  "black-coffee-liver-health",
  "brewing-the-perfect-cup",
  "ctc-vs-loose-leaf-tea",
  "instant-vs-brewed-coffee",
  "best-black-coffee-for-fatty-liver",
];

const STATIC_PATHS = [
  "/",
  "/about",
  "/careers",
  "/cart",
  "/checkout",
  "/contact",
  "/distributor-franchise",
  "/fundraisers",
  "/how-to-use",
  "/locations",
  "/payment/failure",
  "/payment/success",
  "/privacy",
  "/return-policy",
  "/social-responsibility",
  "/sites",
  "/team",
  "/terms",
  "/accessories",
  "/green-wholesale-coffee",
  "/roasted-wholesale-coffee",
  "/products",
  "/glossary",
  "/guides",
  "/auth/login",
  "/auth/register",
];

function collectUrls(): string[] {
  const urls = new Set<string>(STATIC_PATHS);

  for (const slug of getAllProductSlugs()) {
    urls.add(`/products/${slug}`);
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
    for (const topic of LOCATION_TOPIC_SLUGS) {
      urls.add(`/${city.stateSlug}/${city.citySlug}/${topic}`);
    }
  }

  return Array.from(urls);
}

function buildSitemapXml(urls: string[]): string {
  const entries = urls
    .map((url) => `  <url>\n    <loc>${SITE_URL}${url}</loc>\n  </url>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

function buildRobotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const urls = collectUrls();
  writeFileSync(path.join(OUTPUT_DIR, "sitemap.xml"), buildSitemapXml(urls));
  writeFileSync(path.join(OUTPUT_DIR, "robots.txt"), buildRobotsTxt());

  console.log(`Wrote sitemap.xml with ${urls.length} URLs and robots.txt to ${path.relative(ROOT, OUTPUT_DIR)}/`);
}

main();
