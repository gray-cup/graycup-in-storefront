# Keyword content analysis — coffee-articles.csv (Sept 2026 GKP export)

Source: `coffee-articles.csv`, 2000 keywords, Google Keyword Planner, India, Aug 2025–Jul 2026.
Cross-checked against `src/data/guides.ts` (79 existing articles) and `src/data/products/*.ts` (actual SKUs — filter coffee blends, green beans, estate coffees, black coffee, sampler packs; **no brewing equipment, no lattes/instant SKUs**).

## 1. Already covered — don't duplicate

All "black coffee health", "best coffee for X (workout/gym/focus/weight loss)", "arabica vs robusta", "filter vs instant", roast-type, and brew-method (aeropress/french press/moka pot/pour over/cold brew) angles already exist across the 79 `.mdx` guides. New keywords that are just phrasing variants of these (`black coffee good for kidneys`, `black coffee for skin`, `black coffee for acidity`, `drinking black coffee good for you`) → **add as FAQ bullets inside `black-coffee-benefits.mdx`**, not new pages (avoids keyword cannibalization).

## 2. New clusters worth building, ranked by fit

### A. Filter coffee brewing/equipment — HIGH volume, HIGH product fit
`filter coffee maker/machine/percolator/decoction/dabara set/tumbler/davara`, `stainless steel/brass/copper filter`, `coffee decoction maker`, `instant filter coffee liquid` (50k–500/mo, mostly High competition = commercial intent).

They don't sell hardware, so the angle is **"how to brew filter coffee at home + which blend to use"**, not equipment reviews:
- `how-to-make-filter-coffee-decoction-at-home` → cross-sell `filter-coffee-arabica-robusta`, `filter-coffee-80-arabica-20-robusta`, `filter-coffee-90-arabica-10-chicory`
- `filter-coffee-maker-buying-guide` (steel vs brass vs electric) with a "any maker works, the blend is what matters" pivot into product cards
- `filter-coffee-dabara-tumbler-set-guide` (davara/tumbler culture piece, low effort, links to South Indian cluster below)

### B. Branded comparison pages — HIGH volume, direct competitive capture
Real brand-name search volume with **no existing page**: `narasus`, `malgudi`, `bru` (+ green label), `nescafe filter coffee`, `levista`, `cothas`, `continental filter coffee`, `ccd filter coffee`, `id filter coffee/decoction`, `sleepy owl filter coffee`, `blue tokai filter coffee`, `udhayam`/`narasus udhayam`, `hatti kaapi`, `sidapur coffee`.

- One `<brand>-vs-graycup-filter-coffee` page per top 4–5 brands by volume (narasus, bru, nescafe, malgudi, continental) — comparison table (chicory %, roast, price/100g) ending in a `GuideProductCard` for the matching Graycup blend.
- Keep it factual/no-disparagement; these are branded terms so also watch trademark tone.

### C. South Indian filter coffee / kaapi culture — HIGH volume, on-brand
`kaapi coffee`, `south indian filter coffee`, `filter kaapi`, `chennai filter coffee`, `kumbakonam filter coffee`, `south indian coffee cup` — 500–50k/mo, mostly Low/Medium competition (easier wins than cluster A).
- `south-indian-filter-coffee-kaapi-guide` — extend existing `best-south-indian-filter-coffee.mdx`'s internal links rather than fragment further; add a `kaapi-vs-filter-coffee-whats-the-difference` short page (same term, different naming) since it's a distinct high-volume query (50k/mo for "kaapi coffee" alone).
- Interlink target for all filter-coffee SKUs and the brand-comparison pages above.

### D. International brew styles — MEDIUM volume, product fit via robusta
`vietnamese coffee filter/dripper/maker` (500/mo, High competition, but that's hardware-shopping intent — informational angle only), `turkish coffee`.
- One `vietnamese-style-coffee-at-home` piece: ca phe sua da is dark-roast robusta + condensed milk — genuinely good fit for `green-coffee-100-robusta` / `wholesale-100-robusta-beans` / dark roast SKUs. Worth doing; skip Turkish (searches too thin here).

### E. Latte / Starbucks menu terms — HIGH volume, LOW product fit — recommend skipping
`iced latte`, `vanilla/hazelnut/pumpkin spice/matcha latte`, `starbucks <drink> price`, `nescafe latte`, dozens of variants (500–50k/mo, mostly Low competition because it's easy-to-rank informational fluff). Graycup sells roasted beans/powder, not milk-based cafe drinks or flavored syrups — ranking for these brings traffic with no path to purchase and dilutes brand relevance. **Skip**, with one exception:
- `best-coffee-for-milk-coffee.mdx` already exists — could add a short "want a latte at home?" FAQ block pointing at a milk-coffee blend, but don't spin up a dozen latte pages.

## 3. Interlinking map (new pages → existing pages → products)

| New page | Links to existing guide | Links to product |
|---|---|---|
| how-to-make-filter-coffee-decoction-at-home | best-filter-coffee-for-home, coffee-grind-size-guide | filter-coffee-arabica-robusta, filter-coffee-90-arabica-10-chicory |
| filter-coffee-maker-buying-guide | best-south-indian-filter-coffee, filter-coffee-vs-instant-coffee | filter-coffee-pure-arabica |
| narasus/bru/nescafe/malgudi/continental-vs-graycup | best-filter-coffee-in-india, best-filter-coffee-powder-in-india | matching filter-coffee-* blend by chicory % |
| kaapi-vs-filter-coffee-whats-the-difference | best-south-indian-filter-coffee | filter-coffee-90-arabica-10-robusta |
| vietnamese-style-coffee-at-home | arabica-vs-robusta, best-strong-coffee-in-india | green-coffee-100-robusta, french-roast-coffee |

Every new page should also add a "Related Articles" entry back into the nearest existing guide (`GuideLayout` already renders this from `getRelatedGuides` — just add the new slug to the relevant existing entries' tags so it surfaces automatically).

## 4. Suggested build order (lazy-first)

1. FAQ additions to `black-coffee-benefits.mdx` (near-zero effort, covers ~8 keywords)
2. 5 brand-comparison pages (cluster B) — highest volume-to-effort ratio, zero product-catalog gap
3. `how-to-make-filter-coffee-decoction-at-home` + `kaapi-vs-filter-coffee-whats-the-difference` (cluster A+C)
4. `filter-coffee-maker-buying-guide` (cluster A, more research-heavy)
5. `vietnamese-style-coffee-at-home` (cluster D, nice-to-have)
6. Skip cluster E entirely unless traffic strategy changes to include a cafe-style/RTD product line.

Skipped: itemizing all ~1500 zero/50-search keywords — no article is worth writing for single-digit monthly volume; they're covered incidentally by the pages above.
