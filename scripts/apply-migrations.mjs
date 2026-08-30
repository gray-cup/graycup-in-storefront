// Applies pending Drizzle migrations to the Neon retail DB over HTTP.
//
// drizzle-kit's own `migrate` command can't run here (it needs a websocket
// connection; the config uses the HTTP url), and the earlier migrations
// (0000-0002) were applied by hand so `drizzle.__drizzle_migrations` was never
// populated. This script:
//   1. ensures drizzle.__drizzle_migrations exists,
//   2. back-fills rows for migrations already applied by hand (idempotent),
//   3. runs any migration file not yet recorded, statement by statement,
//   4. records it.
//
// Run: node --env-file=.env scripts/apply-migrations.mjs
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);
const journal = JSON.parse(readFileSync("drizzle/meta/_journal.json", "utf8"));

// Migrations applied to production before this repo tracked them - mark as done
// without re-running (their CREATE TABLE statements would fail).
const ALREADY_APPLIED = new Set([
  "0000_dashing_shinko_yamashiro",
  "0001_panoramic_ultimates",
  "0002_cuddly_arclight",
]);

await sql`CREATE SCHEMA IF NOT EXISTS drizzle`;
await sql`CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
  id SERIAL PRIMARY KEY,
  hash text NOT NULL,
  created_at bigint
)`;

const done = new Set(
  (await sql`SELECT hash FROM drizzle.__drizzle_migrations`).map((r) => r.hash),
);

for (const entry of journal.entries) {
  const file = `drizzle/${entry.tag}.sql`;
  const body = readFileSync(file, "utf8");
  const hash = createHash("sha256").update(readFileSync(file)).digest("hex");

  if (done.has(hash)) {
    console.log(`skip  ${entry.tag} (already recorded)`);
    continue;
  }

  if (!ALREADY_APPLIED.has(entry.tag)) {
    const statements = body
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    console.log(`apply ${entry.tag} (${statements.length} statements)`);
  } else {
    console.log(`mark  ${entry.tag} (applied by hand earlier)`);
  }

  await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash}, ${entry.when})`;
}

console.log("done");
