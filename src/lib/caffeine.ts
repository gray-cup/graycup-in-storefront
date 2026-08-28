// Rough caffeine content of brewed coffee, by bean mix.
// Reference (dry grounds): Arabica ~1,300 mg / 100 g, Robusta ~2,400 mg / 100 g.
// Standard cup here = 30 g of grounds. Chicory contributes no caffeine.
// Sanity: 0% Robusta -> ~390 mg, 30% -> ~490 mg, 100% -> ~720 mg per 30 g cup.

import type { Product } from "@/data/products/types";

export const ARABICA_MG_PER_100G = 1300;
export const ROBUSTA_MG_PER_100G = 2400;
export const CUP_GRAMS = 30;

export function caffeineMgPerCup(
  robustaPct: number,
  chicoryPct = 0,
  grams = CUP_GRAMS,
): number {
  const coffeeFrac = Math.max(0, 1 - chicoryPct / 100);
  const r = Math.min(100, Math.max(0, robustaPct)) / 100;
  const per100g =
    coffeeFrac * ((1 - r) * ARABICA_MG_PER_100G + r * ROBUSTA_MG_PER_100G);
  return Math.round(((per100g / 100) * grams) / 5) * 5;
}

/** Best-effort Arabica/Robusta/chicory split from a product's text fields. */
export function deriveBlend(p: Product): { robusta: number; chicory: number } {
  const hay = [
    p.name,
    p.longDescription ?? "",
    p.varietal ?? "",
    ...(p.details ?? []),
    ...(p.blendRatioOptions ?? []),
  ]
    .join(" ")
    .toLowerCase();

  const chicory = Number(hay.match(/(\d+)\s*%\s*chicory/)?.[1] ?? 0);

  // Blend picker: caffeine varies - report the strongest option.
  if (p.blendRatioOptions?.length) {
    const robusta = Math.max(
      ...p.blendRatioOptions.map((o) => Number(o.match(/(\d+)\s*%\s*robusta/i)?.[1] ?? 0)),
    );
    return { robusta, chicory };
  }

  const robMatch = hay.match(/(\d+)\s*%\s*robusta/);
  if (robMatch) return { robusta: Number(robMatch[1]), chicory };

  if (/100\s*%?\s*robusta|pure robusta/.test(hay)) return { robusta: 100, chicory };

  const v = (p.varietal ?? "").toLowerCase();
  if (v.includes("robusta") && !v.includes("arabica"))
    return { robusta: 100, chicory };

  return { robusta: 0, chicory }; // default: treat as Arabica
}

/** One-line caffeine label for a coffee product page. */
export function caffeineLabel(p: Product): string | null {
  if (p.category !== "Coffee" || p.isSamplePack) return null;
  const { robusta, chicory } = deriveBlend(p);
  const mg = caffeineMgPerCup(robusta, chicory);
  const suffix = p.blendRatioOptions?.length ? " (strongest ratio)" : "";
  return `~${mg} mg per ${CUP_GRAMS} g cup${suffix}`;
}

// --- self-check (run: npx tsx src/lib/caffeine.ts) ---
// `typeof process` guard: this module ships to the browser (product pages
// import caffeineLabel), where a bare `process.argv` is a ReferenceError that
// breaks the whole route.
if (
  typeof process !== "undefined" &&
  import.meta.url === `file://${process.argv[1]}`
) {
  const eq = (a: number, b: number) => {
    if (a !== b) throw new Error(`expected ${b}, got ${a}`);
  };
  eq(caffeineMgPerCup(0), 390);
  eq(caffeineMgPerCup(100), 720);
  eq(caffeineMgPerCup(30), 490);
  eq(caffeineMgPerCup(70), 620);
  eq(caffeineMgPerCup(70, 30), 435); // 30% chicory filler cuts caffeine ~30%
  console.log("caffeine.ts ok");
}
