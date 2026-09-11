/**
 * Submits every URL in the freshly built sitemap.xml to IndexNow (Bing, Yandex,
 * etc.) so new/changed pages get discovered without waiting for a crawl.
 * Runs after `npm run deploy` via the postdeploy hook. Key file lives at
 * public/<KEY>.txt and ships as a static asset at https://graycup.in/<KEY>.txt.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE_URL = process.env.SITE_URL || "https://graycup.in";
const KEY = "22cf253b59304db19b39cce7b9181a57";

function readSitemapUrls(): string[] {
  const xml = readFileSync(path.join(ROOT, "build", "client", "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const urlList = readSitemapUrls();
  const host = new URL(SITE_URL).host;

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: KEY,
      keyLocation: `${SITE_URL}/${KEY}.txt`,
      urlList,
    }),
  });

  if (!res.ok) {
    throw new Error(`IndexNow submission failed: ${res.status} ${await res.text()}`);
  }
  console.log(`IndexNow: submitted ${urlList.length} URLs (${res.status})`);
}

main();
