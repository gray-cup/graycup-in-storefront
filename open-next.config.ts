import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// No incrementalCache was configured, so requests to statically generated
// routes (dynamicParams=false, e.g. /[state]/[slug]/[topic]) fell through to
// the ISR revalidate path with no cache backing store and threw
// NoFallbackError instead of serving the prerendered page. This read-only
// cache serves build-time output straight from Workers Static Assets, which
// fixes that for all pure-SSG routes.
//
// Routes using `export const revalidate` (homepage, /products.json, feeds,
// /fundraisers) still need a queue to trigger background revalidation, or
// the default no-op queue throws "Dummy queue is not implemented" once the
// page goes stale. memoryQueue self-fetches via WORKER_SELF_REFERENCE (see
// wrangler.jsonc) to re-render on demand — no R2/Durable Objects needed.
// Because the cache above is read-only, re-rendered output isn't persisted,
// so every request after the revalidate window re-triggers a render instead
// of getting true background ISR. Given the low-frequency windows here (60s
// on /fundraisers, 1hr elsewhere) that's an acceptable tradeoff; upgrade to
// R2 + Durable Objects only if this needs real caching later.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  queue: memoryQueue,
  enableCacheInterception: true,
});
