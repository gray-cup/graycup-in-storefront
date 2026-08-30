import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "./schema.d1";

export { schema };

// Everything is on Cloudflare D1 now (the "graycup-orders" database, DB
// binding). workers/app.ts stashes env.DB on globalThis per request so this
// stays importable as a plain singleton - no per-request wiring at call sites.
// ponytail: globalThis stash, switch to a context-passed binding if this app
// ever runs multiple D1s or needs isolate-safe request scoping.
let _db: DrizzleD1Database<typeof schema> | null = null;

function getDb(): DrizzleD1Database<typeof schema> {
  const d1 = (globalThis as unknown as { DB?: D1Database }).DB;
  if (!d1) throw new Error("D1 binding `DB` is not available on globalThis");
  if (!_db) _db = drizzle(d1, { schema });
  return _db;
}

export const db = new Proxy({} as DrizzleD1Database<typeof schema>, {
  get(_target, prop) {
    return getDb()[prop as keyof DrizzleD1Database<typeof schema>];
  },
});
