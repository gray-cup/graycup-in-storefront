import type { CoffeeProcess } from "./products/types";

export type GlossaryCategory =
  | "Coffee Processing"
  | "Coffee Character"
  | "Tea"
  | "Brewing Methods";

export type GlossaryRelatedFilter = {
  process?: CoffeeProcess;
  categoryTwo?: "Single Origin" | "Blend" | "Premium";
  category?: "Tea" | "Coffee" | "Matcha" | "Accessories";
};

export type GlossaryTerm = {
  slug: string;
  term: string;
  category: GlossaryCategory;
  shortDefinition: string;
  definition: string;
  relatedSlugs?: string[];
  relatedProductFilter?: GlossaryRelatedFilter;
};

export const glossaryTerms: GlossaryTerm[] = [
  // Coffee Processing
  {
    slug: "washed-process",
    term: "Washed Process",
    category: "Coffee Processing",
    shortDefinition:
      "A coffee processing method where the fruit skin and pulp are fully removed with water before drying, giving a clean, bright cup.",
    definition:
      "Washed (or wet) processing is a coffee processing method where the outer fruit skin and sticky mucilage are completely removed from the bean using water, then the parchment is dried separately. Because none of the fruit stays on the bean during drying, washed coffees tend to have a cleaner, brighter, more consistent cup - the flavour comes through more clearly since less fruit sugar interacts with the bean.",
    relatedSlugs: ["natural-process", "honey-process", "single-origin"],
    relatedProductFilter: { process: "Washed" },
  },
  {
    slug: "natural-process",
    term: "Natural Process",
    category: "Coffee Processing",
    shortDefinition:
      "A coffee processing method where whole cherries are dried in the sun before hulling, producing a fruity, full-bodied cup.",
    definition:
      "Natural (or dry) processing is the oldest coffee processing method: whole cherries are dried in the sun with the fruit still intact, then hulled afterwards to remove the dried skin and pulp. Because the bean absorbs sugars and flavour compounds from the fruit while drying, natural-processed coffees tend to be fruitier, more full-bodied, and sometimes wine-like in the cup.",
    relatedSlugs: ["washed-process", "honey-process", "single-origin"],
    relatedProductFilter: { process: "Natural" },
  },
  {
    slug: "honey-process",
    term: "Honey Process (HSD)",
    category: "Coffee Processing",
    shortDefinition:
      "A processing method between washed and natural, where some sticky mucilage is left on the bean during sun-drying.",
    definition:
      "Honey processing (also called honey sundried, or HSD) sits between washed and natural processing. Some or all of the sticky mucilage is left on the parchment during sun-drying instead of being washed off, which balances brightness with sweetness. The result is typically a fuller-bodied cup than washed coffee, with more clarity than a fully natural-processed one.",
    relatedSlugs: ["washed-process", "natural-process", "single-origin"],
    relatedProductFilter: { process: "Honey Sundried (HSD)" },
  },

  // Coffee Character
  {
    slug: "single-origin",
    term: "Single Origin Coffee",
    category: "Coffee Character",
    shortDefinition:
      "Coffee sourced from one specific estate, farm, or region rather than blended with beans from other sources.",
    definition:
      "Single origin coffee comes from one specific estate, farm, or growing region, rather than being blended with beans from multiple sources. Because the beans share the same soil, altitude, and climate, single origin coffee tends to have a more distinct, traceable flavour profile that reflects the terroir of that specific place.",
    relatedSlugs: ["estate-coffee", "varietal", "washed-process"],
    relatedProductFilter: { categoryTwo: "Single Origin" },
  },
  {
    slug: "blend",
    term: "Blend",
    category: "Coffee Character",
    shortDefinition:
      "Coffee made by combining beans from more than one origin, varietal, or process to create a balanced, consistent cup.",
    definition:
      "A blend is coffee made by combining beans from more than one origin, varietal, or processing method. Blending lets a roaster balance sweetness, acidity, and body across batches, and deliver a consistent flavour profile year-round even as any single origin's harvest changes.",
    relatedSlugs: ["single-origin", "varietal"],
    relatedProductFilter: { categoryTwo: "Blend" },
  },
  {
    slug: "varietal",
    term: "Varietal",
    category: "Coffee Character",
    shortDefinition:
      "The specific genetic variety of the coffee plant a bean was grown from, similar to a grape varietal in wine.",
    definition:
      "A varietal is the specific genetic variety of coffee plant a bean was grown from - similar to how a grape varietal shapes a wine. Varietals like SLN 9 or SLN 795 differ in flavour potential, disease resistance, and yield, and are one of the biggest factors (alongside processing and terroir) behind why two coffees can taste so different.",
    relatedSlugs: ["single-origin", "arabica", "robusta"],
  },
  {
    slug: "arabica",
    term: "Arabica",
    category: "Coffee Character",
    shortDefinition:
      "The coffee species prized for its complex, aromatic flavour; it accounts for the majority of specialty coffee worldwide.",
    definition:
      "Arabica (Coffea arabica) is the coffee species most associated with specialty and single-origin coffee. It's grown at higher altitudes, is more delicate to farm, and produces a more complex, aromatic cup with brighter acidity compared to Robusta - which is why it commands a premium and dominates specialty coffee menus.",
    relatedSlugs: ["robusta", "varietal", "single-origin"],
  },
  {
    slug: "robusta",
    term: "Robusta",
    category: "Coffee Character",
    shortDefinition:
      "A hardier, higher-caffeine coffee species known for a bolder, earthier cup, often used in blends and instant coffee.",
    definition:
      "Robusta (Coffea canephora) is a hardier coffee species that grows at lower altitudes and resists pests better than Arabica. It has roughly double the caffeine content and a bolder, earthier, more bitter cup - it's commonly used in espresso blends for crema and body, and in instant coffee.",
    relatedSlugs: ["arabica", "varietal", "blend"],
  },
  {
    slug: "shade-grown",
    term: "Shade-Grown Coffee",
    category: "Coffee Character",
    shortDefinition:
      "Coffee grown under a canopy of native trees rather than in direct sun, which slows cherry ripening and deepens flavour.",
    definition:
      "Shade-grown coffee is cultivated under a canopy of native trees instead of in direct, cleared sunlight. The shade slows down how fast the cherries ripen, which gives the beans more time to develop sugars and flavour compounds - it's also better for biodiversity, since the tree canopy supports birds and other wildlife that clear-cut plantations don't.",
    relatedSlugs: ["estate-coffee", "single-origin"],
  },
  {
    slug: "estate-coffee",
    term: "Estate Coffee",
    category: "Coffee Character",
    shortDefinition:
      "Coffee grown, harvested, and often processed on one specific, named plantation or estate.",
    definition:
      "Estate coffee is grown, harvested, and often processed entirely on one specific, named plantation - as opposed to being pooled together from many smallholder farms in a region. Because every step happens under one estate's practices, estate coffee usually offers more consistency and traceability than a general regional lot.",
    relatedSlugs: ["single-origin", "shade-grown"],
  },
  {
    slug: "speciality-coffee",
    term: "Speciality Coffee",
    category: "Coffee Character",
    shortDefinition:
      "Coffee graded highest for quality - typically defect-free and scoring 80+ on the 100-point cupping scale.",
    definition:
      "Speciality coffee refers to the highest quality grade of coffee, typically defect-free green beans that score 80 or above out of 100 on a professional cupping evaluation. It sits above \"commercial\" grade coffee, which is perfectly drinkable but has more inconsistency, defects, or a simpler flavour profile.",
    relatedSlugs: ["cupping", "single-origin"],
  },
  {
    slug: "cupping",
    term: "Cupping",
    category: "Coffee Character",
    shortDefinition:
      "The standardized tasting method roasters and graders use to evaluate a coffee's aroma, flavour, and quality.",
    definition:
      "Cupping is the standardized method coffee professionals use to taste and evaluate coffee - brewing a set ratio of coarsely ground coffee to hot water in a bowl, breaking the crust to smell the aroma, then slurping the brew across the palate to score its aroma, acidity, body, sweetness, and aftertaste. It's how coffees are graded and how buyers and roasters compare lots before purchasing.",
    relatedSlugs: ["speciality-coffee", "flavour-notes"],
  },
  {
    slug: "flavour-notes",
    term: "Flavour Notes",
    category: "Coffee Character",
    shortDefinition:
      "Descriptive tasting terms (like \"citrus\" or \"caramel\") used to describe what you might taste in a cup of coffee.",
    definition:
      "Flavour notes describe the tastes and aromas you might pick up in a cup - similar to how tasting notes work for wine or whisky. They come from a coffee's origin, processing method, and roast, and are meant as a guide to what to expect rather than a guarantee of what you'll taste, since palates and brewing methods vary.",
    relatedSlugs: ["cupping", "washed-process", "natural-process"],
  },

  // Tea
  {
    slug: "ctc-tea",
    term: "CTC Tea",
    category: "Tea",
    shortDefinition:
      "Tea processed by the Crush, Tear, Curl method, producing small, uniform granules that brew strong and fast.",
    definition:
      "CTC stands for Crush, Tear, Curl - a tea processing method where leaves are passed through rollers that crush, tear, and curl them into small, uniform granules. CTC tea brews faster and stronger than loose leaf tea, making it well suited to milk tea and chai, and is the dominant style produced in Assam and the Dooars.",
    relatedSlugs: ["orthodox-tea", "loose-leaf-tea"],
    relatedProductFilter: { category: "Tea" },
  },
  {
    slug: "orthodox-tea",
    term: "Orthodox Tea",
    category: "Tea",
    shortDefinition:
      "Tea processed with traditional rolling methods that keep leaves whole or in large pieces, for a more nuanced cup.",
    definition:
      "Orthodox tea is processed using traditional methods - withering, rolling, and oxidising whole or large-leaf tea by hand or with gentler machinery, rather than mechanically fragmenting it like CTC processing does. Keeping the leaf more intact generally produces a more nuanced, complex cup, prized in regions like Darjeeling.",
    relatedSlugs: ["ctc-tea", "loose-leaf-tea"],
    relatedProductFilter: { category: "Tea" },
  },
  {
    slug: "loose-leaf-tea",
    term: "Loose Leaf Tea",
    category: "Tea",
    shortDefinition:
      "Whole or large-piece tea leaves sold unbagged, generally offering more flavour and reusability than tea bags.",
    definition:
      "Loose leaf tea is whole or large-piece tea leaves sold without being packed into bags. Because the leaves have more room to unfurl and release their oils during steeping, loose leaf tea generally delivers more flavour and aroma than bagged tea, and the same leaves can often be steeped more than once.",
    relatedSlugs: ["orthodox-tea", "ctc-tea"],
    relatedProductFilter: { category: "Tea" },
  },

  // Brewing Methods
  {
    slug: "french-press",
    term: "French Press",
    category: "Brewing Methods",
    shortDefinition:
      "A full-immersion brewing method using a metal mesh plunger, producing a full-bodied cup with natural oils intact.",
    definition:
      "A French Press brews coffee by steeping coarse grounds directly in hot water, then separating them with a metal mesh plunger. Because a metal filter (rather than paper) is used, the coffee's natural oils stay in the cup, giving a fuller body and richer mouthfeel than filtered methods.",
    relatedSlugs: ["cold-brew", "pour-over"],
  },
  {
    slug: "cold-brew",
    term: "Cold Brew",
    category: "Brewing Methods",
    shortDefinition:
      "Coffee steeped in cold or room-temperature water for many hours, giving a smoother, less acidic concentrate.",
    definition:
      "Cold brew is made by steeping coarsely ground coffee in cold or room-temperature water for 12-24 hours, rather than using heat to extract flavour quickly. The slow, cold extraction produces a smoother, naturally sweeter, less acidic concentrate, usually diluted with water, milk, or ice before drinking.",
    relatedSlugs: ["french-press", "south-indian-filter"],
  },
  {
    slug: "espresso",
    term: "Espresso",
    category: "Brewing Methods",
    shortDefinition:
      "A concentrated shot of coffee made by forcing hot water through finely ground, tightly packed coffee under pressure.",
    definition:
      "Espresso is made by forcing hot water through finely ground, tightly packed coffee at high pressure, producing a small, concentrated shot topped with crema. It's the base for most café drinks - lattes, cappuccinos, and Americanos are all built on an espresso shot.",
    relatedSlugs: ["moka-pot", "french-press"],
  },
  {
    slug: "moka-pot",
    term: "Moka Pot",
    category: "Brewing Methods",
    shortDefinition:
      "A stovetop brewer that uses steam pressure to push hot water through grounds, giving a strong, espresso-like cup.",
    definition:
      "A Moka Pot is a stovetop brewer with three chambers: water at the bottom, finely ground coffee in the middle basket, and the brewed coffee collecting at the top. As the water heats, steam pressure pushes it up through the grounds, producing a strong, concentrated cup closer to espresso than drip coffee, without needing an espresso machine.",
    relatedSlugs: ["espresso", "south-indian-filter"],
  },
  {
    slug: "south-indian-filter",
    term: "South Indian Filter Coffee",
    category: "Brewing Methods",
    shortDefinition:
      "Coffee brewed in a traditional metal drip filter, then mixed with hot milk and sugar - the classic South Indian style.",
    definition:
      "South Indian filter coffee is brewed by slowly dripping hot water through finely ground coffee (often with chicory) in a traditional two-chamber metal filter, called a filter kaapi set. The strong decoction is then mixed with hot milk and sugar and traditionally poured back and forth between two cups (\"meter coffee\") to build a frothy top.",
    relatedSlugs: ["moka-pot", "cold-brew"],
    relatedProductFilter: { category: "Coffee" },
  },
  {
    slug: "pour-over",
    term: "Pour Over",
    category: "Brewing Methods",
    shortDefinition:
      "A manual brewing method where hot water is poured over grounds in a paper or metal filter, for a clean, bright cup.",
    definition:
      "Pour over is a manual brewing method where hot water is poured in a controlled, circular motion over coffee grounds sitting in a paper or metal filter cone. The slower, gravity-fed extraction and paper filtration (in most setups) produce a cleaner, brighter cup that highlights a coffee's origin character.",
    relatedSlugs: ["french-press", "aeropress"],
  },
  {
    slug: "aeropress",
    term: "AeroPress",
    category: "Brewing Methods",
    shortDefinition:
      "A compact brewer that steeps coffee briefly then pushes it through a paper filter using manual air pressure.",
    definition:
      "The AeroPress is a compact, manual brewer that steeps coffee grounds in hot water for a short time, then uses a plunger to push the brew through a paper filter with gentle air pressure. It's fast, portable, and forgiving, and can produce anything from an espresso-like concentrate to a lighter, filter-style cup depending on the recipe used.",
    relatedSlugs: ["pour-over", "french-press"],
  },
];

export function getGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossaryTerms.find((term) => term.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return glossaryTerms.map((term) => term.slug);
}

export function getGlossaryTermsByCategory(): { category: GlossaryCategory; terms: GlossaryTerm[] }[] {
  const categories: GlossaryCategory[] = [
    "Coffee Processing",
    "Coffee Character",
    "Tea",
    "Brewing Methods",
  ];

  return categories.map((category) => ({
    category,
    terms: glossaryTerms
      .filter((term) => term.category === category)
      .sort((a, b) => a.term.localeCompare(b.term)),
  }));
}
