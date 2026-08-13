import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// No incrementalCache was configured, so requests to statically generated
// routes (dynamicParams=false, e.g. /[state]/[slug]/[topic]) fell through to
// the ISR revalidate path with no cache backing store and threw
// NoFallbackError instead of serving the prerendered page. This read-only
// cache serves build-time output straight from Workers Static Assets, which
// fixes that for all pure-SSG routes. Routes using `export const revalidate`
// (homepage, /products.json, feeds, /fundraisers) will still be served but
// won't get true background revalidation until a real writable cache (R2 +
// Durable Objects) is added.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
