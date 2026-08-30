import type { Config } from "drizzle-kit";

// Everything is on Cloudflare D1 now (the "graycup-orders" database). Use
// `npm run db:generate` to diff schema.d1.ts into drizzle/, then apply with
// `wrangler d1 execute graycup-orders --file=...` (see package.json db:migrate).
export default {
  schema: "./src/lib/schema.d1.ts",
  out: "./drizzle",
  dialect: "sqlite",
  driver: "d1-http",
} satisfies Config;
