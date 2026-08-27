// Single source of truth for guide / blog articles.
// Consumed by: routes/marketing/guides-index.tsx, components/GuideLayout.tsx,
// scripts/generate-sitemap.ts, scripts/generate-og-images.ts,
// scripts/fetch-guide-images.ts.
//
// To add an article:
//   1. add an entry here (pick an `unsplash` photo id for the hero)
//   2. `npm run fetch:guide-images`  -> writes public/guides/<slug>.webp
//   3. create app/routes/marketing/guides/<slug>.mdx
//   4. add the route line in app/routes.ts

export interface Guide {
  slug: string;
  title: string;
  description: string;
  readingTime: string;
  tags: string[];
  date: string; // ISO publish date
  unsplash: string; // Unsplash photo id, source for the local hero image
}

/** Local, pre-optimised hero/thumbnail image for an article. */
export const guideImage = (slug: string) => `/guides/${slug}.webp`;

const SITE = "https://graycup.in";

/** react-router meta() payload for an article route. */
export function guideMeta(slug: string) {
  const g = getGuide(slug);
  if (!g) return [{ title: "Guide | Gray Cup" }];
  const title = `${g.title} | Gray Cup`;
  const description = g.description;
  const url = `${SITE}/guides/${slug}`;
  const image = `${SITE}/og/guides/${slug}.png`;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

export const GUIDES: Guide[] = [
  // ---- original guides ----
  {
    slug: "brewing-the-perfect-cup",
    title: "How to Brew the Perfect Cup of Tea",
    description:
      "Master the art of tea brewing - the right water temperature, steeping times, and techniques for every type of tea.",
    readingTime: "6 min read",
    tags: ["Tea", "Brewing", "Beginner"],
    date: "2026-01-15",
    unsplash: "photo-1544787219-7f47ccb76574",
  },
  {
    slug: "ctc-vs-loose-leaf-tea",
    title: "CTC vs Loose Leaf Tea: What's the Difference?",
    description:
      "Explore the differences between CTC and loose leaf tea - how they're made, how they taste, and which to choose.",
    readingTime: "5 min read",
    tags: ["Tea", "Education", "CTC"],
    date: "2026-01-22",
    unsplash: "photo-1571934811356-5cc061b6821f",
  },
  {
    slug: "instant-vs-brewed-coffee",
    title: "Instant Coffee vs Brewed Coffee: Which Is Right for You?",
    description:
      "A practical comparison of instant and brewed coffee - flavor, convenience, quality, and when each one shines.",
    readingTime: "4 min read",
    tags: ["Coffee", "Instant Coffee", "Brewing"],
    date: "2026-02-01",
    unsplash: "photo-1509042239860-f550ce710b93",
  },
  {
    slug: "black-coffee-liver-health",
    title: "Top 5 Black Coffees for Liver Health",
    description:
      "Research links black coffee to better liver enzyme levels and lower risk of liver disease. Here are 5 black coffees worth keeping in your rotation.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Black Coffee"],
    date: "2026-07-30",
    unsplash: "photo-1447933601403-0c6688de566e",
  },
  {
    slug: "best-black-coffee-for-fatty-liver",
    title: "Best Black Coffee Brand for Fatty Liver",
    description:
      "Fatty liver disease is linked to lower coffee consumption in several studies. Here's what the research says and the best black coffees to build into a daily routine.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Fatty Liver"],
    date: "2026-08-10",
    unsplash: "photo-1461023058943-07fcbe16d735",
  },

  // ---- Tier 1 (articles.md) ----
  {
    slug: "best-black-coffee-for-weight-loss",
    title: "Best Black Coffee for Weight Loss: Top 5 Picks",
    description:
      "Black coffee is near zero-calorie and mildly boosts metabolism. Here are five black coffees that are easy to drink without sugar or milk, plus how to use them.",
    readingTime: "6 min read",
    tags: ["Coffee", "Weight Loss", "Black Coffee", "Health"],
    date: "2026-08-12",
    unsplash: "photo-1495474472287-4d71bcdd2085",
  },
  {
    slug: "best-coffee-for-gym",
    title: "Best Coffee for the Gym: Top 5 Picks",
    description:
      "Caffeine is one of the most researched training aids there is. Here are five coffees that work well before a gym session, and how much to drink.",
    readingTime: "6 min read",
    tags: ["Coffee", "Fitness", "Gym", "Caffeine"],
    date: "2026-08-13",
    unsplash: "photo-1534438327276-14e5300c3a48",
  },
  {
    slug: "best-coffee-before-workout",
    title: "Best Coffee Before a Workout: What to Drink and When",
    description:
      "Coffee 30-60 minutes before training improves endurance, focus and perceived effort. Here's the timing, the dose, and five coffees suited to it.",
    readingTime: "6 min read",
    tags: ["Coffee", "Fitness", "Pre-Workout", "Caffeine"],
    date: "2026-08-14",
    unsplash: "photo-1476480862126-209bfaa8edc8",
  },
  {
    slug: "best-coffee-for-caffeine",
    title: "Best Coffee for Caffeine: Strongest Picks in India",
    description:
      "If you want the most caffeine per cup, Robusta-heavy blends and dark roasts brewed strong are the way. Here are five high-caffeine coffees.",
    readingTime: "6 min read",
    tags: ["Coffee", "Caffeine", "Strong Coffee"],
    date: "2026-08-15",
    unsplash: "photo-1442512595331-e89e73853f31",
  },
  {
    slug: "highest-caffeine-coffee-in-india",
    title: "Highest Caffeine Coffee in India",
    description:
      "Robusta has roughly twice the caffeine of Arabica. These are the highest-caffeine coffees you can buy in India, and how to brew for maximum strength.",
    readingTime: "6 min read",
    tags: ["Coffee", "Caffeine", "India", "Robusta"],
    date: "2026-08-16",
    unsplash: "photo-1514432324607-a09d9b4aefdd",
  },
  {
    slug: "best-coffee-for-energy",
    title: "Best Coffee for Energy: Top 5 for a Real Boost",
    description:
      "For steady energy through a long day, brew method and roast matter as much as the bean. Here are five coffees for a clean energy lift.",
    readingTime: "6 min read",
    tags: ["Coffee", "Energy", "Caffeine"],
    date: "2026-08-17",
    unsplash: "photo-1524350876685-274059332603",
  },
  {
    slug: "best-black-coffee-in-india",
    title: "Best Black Coffee in India: Top Brands and Beans",
    description:
      "The best black coffee is one you enjoy without milk or sugar. Here are the black coffees worth buying in India, from everyday blends to single origins.",
    readingTime: "7 min read",
    tags: ["Coffee", "Black Coffee", "India"],
    date: "2026-08-18",
    unsplash: "photo-1497515114629-f71d768fd07c",
  },
  {
    slug: "best-coffee-beans-in-india",
    title: "Best Coffee Beans in India: A Buying Guide",
    description:
      "India grows some of the world's best shade-grown Arabica and Robusta. Here's how to choose beans by roast, origin and brew method, with picks.",
    readingTime: "7 min read",
    tags: ["Coffee", "Coffee Beans", "India", "Buying Guide"],
    date: "2026-08-19",
    unsplash: "photo-1447933601403-0c6688de566e",
  },
  {
    slug: "best-filter-coffee-in-india",
    title: "Best Filter Coffee in India: Top Picks",
    description:
      "South Indian filter coffee lives or dies by the powder. Here are the best filter coffee blends in India and how to get a strong, sweet decoction.",
    readingTime: "6 min read",
    tags: ["Coffee", "Filter Coffee", "India"],
    date: "2026-08-20",
    unsplash: "photo-1498804103079-a6351b050096",
  },
  {
    slug: "best-filter-coffee-powder-in-india",
    title: "Best Filter Coffee Powder in India",
    description:
      "From pure Arabica to classic Arabica-chicory blends, here are the best filter coffee powders in India, with notes on strength, chicory ratio and price.",
    readingTime: "6 min read",
    tags: ["Coffee", "Filter Coffee", "India", "Buying Guide"],
    date: "2026-08-21",
    unsplash: "photo-1459755486867-b55449bb39ff",
  },
  {
    slug: "best-coffee-for-drinking-black",
    title: "Best Coffee for Drinking Black (No Milk, No Sugar)",
    description:
      "Some coffees taste good black and some need milk to hide behind. Here are the smoothest, least bitter coffees to drink black.",
    readingTime: "6 min read",
    tags: ["Coffee", "Black Coffee", "Buying Guide"],
    date: "2026-08-22",
    unsplash: "photo-1509785307050-d4066910ec1e",
  },
  {
    slug: "best-strong-coffee-in-india",
    title: "Best Strong Coffee in India",
    description:
      "Strength comes from the bean (Robusta), the roast (dark) and the brew (more grounds, less water). Here are the strongest coffees in India.",
    readingTime: "6 min read",
    tags: ["Coffee", "Strong Coffee", "India", "Robusta"],
    date: "2026-08-23",
    unsplash: "photo-1504630083234-14187a9df0f5",
  },
  {
    slug: "arabica-vs-robusta",
    title: "Arabica vs Robusta: Which Coffee Is Better?",
    description:
      "Arabica is smoother and more aromatic; Robusta is stronger, more bitter and higher in caffeine. Here's how they differ and when to pick each.",
    readingTime: "6 min read",
    tags: ["Coffee", "Education", "Arabica", "Robusta"],
    date: "2026-08-24",
    unsplash: "photo-1524350876685-274059332603",
  },
  {
    slug: "arabica-vs-robusta-caffeine",
    title: "Arabica vs Robusta: Caffeine Compared",
    description:
      "Robusta has roughly 2,400 mg caffeine per 100 g versus Arabica's ~1,300 mg - almost double. Here's what that means per cup and which coffees use more Robusta.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Caffeine", "Robusta"],
    date: "2026-08-25",
    unsplash: "photo-1514432324607-a09d9b4aefdd",
  },
  {
    slug: "coffee-vs-chicory",
    title: "Coffee vs Chicory: What's the Difference?",
    description:
      "Chicory is a caffeine-free root added to filter coffee for body and a woody sweetness. Here's how it changes the cup and how much to use.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Chicory", "Filter Coffee"],
    date: "2026-08-26",
    unsplash: "photo-1461988320302-91bde64fc8e4",
  },

  // ---- Tier 2 (articles.md clusters) ----
  {
    slug: "best-coffee-for-focus-and-studying",
    title: "Best Coffee for Focus, Studying and Work",
    description:
      "Caffeine sharpens attention, reaction time and short-term recall. Here are the best coffees for focus, long study sessions and deep work - and how to dose them.",
    readingTime: "6 min read",
    tags: ["Coffee", "Focus", "Students", "Caffeine"],
    date: "2026-08-27",
    unsplash: "photo-1481833761820-0509d3217039",
  },
  {
    slug: "best-coffee-for-metabolism",
    title: "Best Coffee for Metabolism",
    description:
      "Caffeine gives a small, real bump to metabolic rate and fat oxidation. Here are the best black coffees to support a metabolism-focused routine.",
    readingTime: "6 min read",
    tags: ["Coffee", "Weight Loss", "Metabolism", "Health"],
    date: "2026-08-28",
    unsplash: "photo-1470337458703-46ad1756a187",
  },
  {
    slug: "best-coffee-for-belly-fat",
    title: "Best Coffee for Belly Fat: What Actually Helps",
    description:
      "No coffee burns belly fat directly, but black coffee can make a calorie deficit easier to hold. Here's the honest version, and five coffees to use.",
    readingTime: "6 min read",
    tags: ["Coffee", "Weight Loss", "Black Coffee", "Health"],
    date: "2026-08-29",
    unsplash: "photo-1461023058943-07fcbe16d735",
  },
  {
    slug: "best-coffee-for-staying-awake",
    title: "Best Coffee for Staying Awake and Long Working Hours",
    description:
      "For night shifts, long drives and late deadlines, dose and timing beat brand. Here are the best coffees for staying awake without a hard crash.",
    readingTime: "6 min read",
    tags: ["Coffee", "Energy", "Caffeine", "Focus"],
    date: "2026-08-30",
    unsplash: "photo-1521302080334-4bebac2763a6",
  },
  {
    slug: "best-black-coffee-without-sugar",
    title: "Best Black Coffee Without Sugar",
    description:
      "The trick to drinking black coffee without sugar is picking beans that aren't bitter in the first place. Here are the smoothest sugar-free options.",
    readingTime: "6 min read",
    tags: ["Coffee", "Black Coffee", "Health", "Buying Guide"],
    date: "2026-08-31",
    unsplash: "photo-1509785307050-d4066910ec1e",
  },
  {
    slug: "best-coffee-beans-for-black-coffee",
    title: "Best Coffee Beans for Black Coffee",
    description:
      "Beans for black coffee should be Arabica-forward, cleanly processed and roasted medium. Here are the best beans to brew black at home.",
    readingTime: "6 min read",
    tags: ["Coffee", "Coffee Beans", "Black Coffee", "Buying Guide"],
    date: "2026-09-01",
    unsplash: "photo-1442550528053-c431ecb55509",
  },
  {
    slug: "best-smooth-black-coffee",
    title: "Smoothest Black Coffee: Least Bitter Picks",
    description:
      "Smooth means low bitterness, low harshness and a clean finish. Here are the smoothest black coffees in our range, and how to brew to keep them that way.",
    readingTime: "5 min read",
    tags: ["Coffee", "Black Coffee", "Buying Guide"],
    date: "2026-09-02",
    unsplash: "photo-1453614512568-c4024d13c247",
  },
  {
    slug: "best-south-indian-filter-coffee",
    title: "Best South Indian Filter Coffee",
    description:
      "Authentic South Indian filter coffee needs the right powder, a steel filter and a proper decoction. Here are the best blends and how to make degree coffee.",
    readingTime: "6 min read",
    tags: ["Coffee", "Filter Coffee", "India"],
    date: "2026-09-03",
    unsplash: "photo-1498804103079-a6351b050096",
  },
  {
    slug: "best-filter-coffee-for-home",
    title: "Best Filter Coffee for Daily Home Use",
    description:
      "For an everyday home filter coffee you want a forgiving blend, consistent grind and a good price. Here are the best options for daily use.",
    readingTime: "5 min read",
    tags: ["Coffee", "Filter Coffee", "India", "Buying Guide"],
    date: "2026-09-04",
    unsplash: "photo-1516315720917-231ef9acce48",
  },
  {
    slug: "best-arabica-coffee-in-india",
    title: "Best Arabica Coffee in India",
    description:
      "Indian Arabica is shade-grown, washed or honey-processed, and clean in the cup. Here are the best single-origin and estate Arabicas to buy.",
    readingTime: "6 min read",
    tags: ["Coffee", "Arabica", "India", "Buying Guide"],
    date: "2026-09-05",
    unsplash: "photo-1524350876685-274059332603",
  },
  {
    slug: "best-robusta-coffee-in-india",
    title: "Best Robusta Coffee in India",
    description:
      "India grows high-quality Robusta with more caffeine, body and crema than Arabica. Here's where Robusta shines and the best options to buy.",
    readingTime: "6 min read",
    tags: ["Coffee", "Robusta", "India", "Caffeine"],
    date: "2026-09-06",
    unsplash: "photo-1514432324607-a09d9b4aefdd",
  },
  {
    slug: "best-medium-roast-coffee-in-india",
    title: "Best Medium Roast Coffee in India",
    description:
      "Medium roast keeps origin character and acidity while staying easy to drink. Here are the best medium-roast coffees in India, and how it compares to dark.",
    readingTime: "6 min read",
    tags: ["Coffee", "Roast", "India", "Buying Guide"],
    date: "2026-09-07",
    unsplash: "photo-1500051638674-ff996a0ec29e",
  },
  {
    slug: "light-roast-vs-dark-roast-coffee",
    title: "Light Roast vs Medium vs Dark Roast Coffee",
    description:
      "Roast level changes acidity, body, bitterness and flavour far more than caffeine. Here's what each roast does and which to pick for how you drink coffee.",
    readingTime: "6 min read",
    tags: ["Coffee", "Education", "Roast"],
    date: "2026-09-08",
    unsplash: "photo-1442550528053-c431ecb55509",
  },
  {
    slug: "black-coffee-vs-milk-coffee",
    title: "Black Coffee vs Milk Coffee: Which Is Better?",
    description:
      "Black coffee is lower-calorie and shows origin flavour; milk coffee is smoother and gentler on the stomach. Here's how they compare and when to pick each.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Black Coffee", "Health"],
    date: "2026-09-09",
    unsplash: "photo-1470337458703-46ad1756a187",
  },
  {
    slug: "filter-coffee-vs-instant-coffee",
    title: "Filter Coffee vs Instant Coffee",
    description:
      "Filter coffee is fresher, more aromatic and higher in beneficial compounds; instant is faster and cheaper. Here's the full comparison for Indian coffee drinkers.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Filter Coffee", "Instant Coffee"],
    date: "2026-09-10",
    unsplash: "photo-1509042239860-f550ce710b93",
  },

  // ---- Tier 3 (brew methods + informational) ----
  {
    slug: "best-coffee-for-french-press",
    title: "Best Coffee for French Press",
    description:
      "French press needs a coarse grind and a coffee with body that won't turn bitter over a 4-minute steep. Here are the best coffees for a press pot.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "French Press", "Buying Guide"],
    date: "2026-09-11",
    unsplash: "photo-1544776193-352d25ca82cd",
  },
  {
    slug: "best-coffee-for-cold-brew",
    title: "Best Coffee for Cold Brew",
    description:
      "Cold brew is low-acid and smooth by design, so it suits medium-dark roasts with chocolate and nutty notes. Here are the best coffees for cold brew, and the recipe.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "Cold Brew", "Buying Guide"],
    date: "2026-09-12",
    unsplash: "photo-1541167760496-1628856ab772",
  },
  {
    slug: "best-coffee-for-moka-pot",
    title: "Best Coffee for Moka Pot",
    description:
      "A moka pot brews strong, near-espresso coffee on the stove. It wants a fine-ish grind and a bold, low-acid roast. Here are the best coffees for a moka pot.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "Moka Pot", "Buying Guide"],
    date: "2026-09-13",
    unsplash: "photo-1610889556528-9a770e32642f",
  },
  {
    slug: "best-coffee-for-pour-over",
    title: "Best Coffee for Pour Over",
    description:
      "Pour over is the most revealing brew method - it rewards clean, aromatic beans and a careful medium grind. Here are the best coffees for pour over.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "Pour Over", "Buying Guide"],
    date: "2026-09-14",
    unsplash: "photo-1519082274554-1ca37fb8abb7",
  },
  {
    slug: "best-coffee-for-espresso-at-home",
    title: "Best Coffee for Espresso at Home",
    description:
      "Home espresso needs a bold, fresh, medium-dark roast and often a little Robusta for crema. Here are the best coffees to pull espresso with.",
    readingTime: "6 min read",
    tags: ["Coffee", "Brewing", "Espresso", "Buying Guide"],
    date: "2026-09-15",
    unsplash: "photo-1442512595331-e89e73853f31",
  },
  {
    slug: "black-coffee-vs-espresso",
    title: "Black Coffee vs Espresso: What's the Difference?",
    description:
      "Espresso is black coffee - just brewed under pressure, concentrated and small. Here's how they differ in caffeine, strength, flavour and when to drink each.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Espresso", "Black Coffee"],
    date: "2026-09-16",
    unsplash: "photo-1524350876685-274059332603",
  },
  {
    slug: "best-coffee-for-beginners",
    title: "Best Coffee for Beginners",
    description:
      "If you're new to real coffee, start with smooth, forgiving, medium-roast beans and a simple brew. Here are the best coffees to begin with.",
    readingTime: "5 min read",
    tags: ["Coffee", "Beginner", "Buying Guide"],
    date: "2026-09-17",
    unsplash: "photo-1500051638674-ff996a0ec29e",
  },
  {
    slug: "best-coffee-under-500-in-india",
    title: "Best Coffee Under ₹500 in India",
    description:
      "You don't need to spend a lot for fresh, well-roasted coffee. Here are the best coffees and filter powders under ₹500 in India.",
    readingTime: "5 min read",
    tags: ["Coffee", "Budget", "India", "Buying Guide"],
    date: "2026-09-18",
    unsplash: "photo-1447933601403-0c6688de566e",
  },
  {
    slug: "how-to-choose-coffee",
    title: "How to Choose Coffee: A Simple Buying Guide",
    description:
      "Species, roast, process, grind and freshness - five decisions that determine your cup. Here's how to choose coffee without the jargon.",
    readingTime: "6 min read",
    tags: ["Coffee", "Education", "Buying Guide", "Beginner"],
    date: "2026-09-19",
    unsplash: "photo-1453614512568-c4024d13c247",
  },
  {
    slug: "is-black-coffee-good-for-you",
    title: "Is Black Coffee Good for You?",
    description:
      "Moderate black coffee is linked to lower risk of several conditions and has almost no calories. Here's what the research supports and what it doesn't.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Black Coffee"],
    date: "2026-09-20",
    unsplash: "photo-1495474472287-4d71bcdd2085",
  },
  {
    slug: "black-coffee-benefits",
    title: "Black Coffee Benefits: What the Research Says",
    description:
      "From alertness and exercise performance to liver and metabolic markers, here are the evidence-backed benefits of black coffee - and the caveats.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Black Coffee"],
    date: "2026-09-21",
    unsplash: "photo-1509785307050-d4066910ec1e",
  },
  {
    slug: "how-much-caffeine-in-a-cup-of-coffee",
    title: "How Much Caffeine Is in a Cup of Coffee?",
    description:
      "It depends on the bean, the dose and the brew - not much on the roast. Here's a practical breakdown of caffeine per cup, with numbers.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Caffeine"],
    date: "2026-09-22",
    unsplash: "photo-1514432324607-a09d9b4aefdd",
  },
  {
    slug: "best-time-to-drink-black-coffee",
    title: "Best Time to Drink Black Coffee",
    description:
      "Timing affects sleep, focus and how well coffee works before exercise. Here's when to drink black coffee - and when to stop.",
    readingTime: "5 min read",
    tags: ["Coffee", "Health", "Black Coffee", "Caffeine"],
    date: "2026-09-23",
    unsplash: "photo-1470337458703-46ad1756a187",
  },
  {
    slug: "best-coffee-for-intermittent-fasting",
    title: "Best Coffee for Intermittent Fasting",
    description:
      "Black coffee doesn't break a fast - it may even help. Here's what you can and can't add, and the best black coffees for a fasting window.",
    readingTime: "5 min read",
    tags: ["Coffee", "Weight Loss", "Black Coffee", "Health"],
    date: "2026-09-24",
    unsplash: "photo-1481833761820-0509d3217039",
  },
  {
    slug: "best-coffee-for-morning-workout",
    title: "Best Coffee for a Morning Workout",
    description:
      "An early session leaves no time for caffeine to kick in slowly. Here's what to drink as soon as you wake, and five coffees suited to it.",
    readingTime: "5 min read",
    tags: ["Coffee", "Fitness", "Pre-Workout", "Caffeine"],
    date: "2026-09-25",
    unsplash: "photo-1538805060514-97d9cc17730c",
  },

  // ---- Tier 4 (long-tail + how-to + education) ----
  {
    slug: "best-coffee-for-athletes",
    title: "Best Coffee for Athletes and Endurance Sports",
    description:
      "Caffeine is a proven ergogenic aid for endurance, power and focus. Here's how athletes should use coffee - dose, timing, tolerance - and five to try.",
    readingTime: "6 min read",
    tags: ["Coffee", "Fitness", "Caffeine", "Pre-Workout"],
    date: "2026-09-26",
    unsplash: "photo-1571019614242-c5c5dee9f50b",
  },
  {
    slug: "best-coffee-for-running",
    title: "Best Coffee for Running",
    description:
      "A cup 45 minutes before a run improves endurance and makes the effort feel easier. Here's the timing, the GI caveats, and the best coffees for runners.",
    readingTime: "5 min read",
    tags: ["Coffee", "Fitness", "Running", "Caffeine"],
    date: "2026-09-27",
    unsplash: "photo-1549060279-7e168fcee0c2",
  },
  {
    slug: "best-coffee-for-the-office",
    title: "Best Coffee for the Office",
    description:
      "Office coffee is usually stale and bitter. Here's how to bring your own - filter, press or a good instant - and the best coffees for a workday.",
    readingTime: "5 min read",
    tags: ["Coffee", "Focus", "Work", "Buying Guide"],
    date: "2026-09-28",
    unsplash: "photo-1521302080334-4bebac2763a6",
  },
  {
    slug: "best-coffee-for-night-shift",
    title: "Best Coffee for Night Shifts",
    description:
      "Night-shift caffeine needs careful timing so you stay sharp at 4 am but can still sleep after. Here's the strategy and the strongest coffees for it.",
    readingTime: "6 min read",
    tags: ["Coffee", "Energy", "Caffeine", "Focus"],
    date: "2026-09-29",
    unsplash: "photo-1504630083234-14187a9df0f5",
  },
  {
    slug: "best-coffee-for-milk-coffee",
    title: "Best Coffee for Milk Coffee",
    description:
      "Coffee for milk needs body and strength to cut through - that means some Robusta, a darker roast, or a natural process. Here are the best options.",
    readingTime: "5 min read",
    tags: ["Coffee", "Milk Coffee", "Buying Guide"],
    date: "2026-09-30",
    unsplash: "photo-1470337458703-46ad1756a187",
  },
  {
    slug: "best-ground-coffee-for-milk",
    title: "Best Ground Coffee for Milk Coffee",
    description:
      "Pre-ground coffee for milk drinks should be a fine-to-medium grind with enough body to stand up to dairy. Here are the best ground coffees for milk.",
    readingTime: "5 min read",
    tags: ["Coffee", "Milk Coffee", "Filter Coffee", "Buying Guide"],
    date: "2026-10-01",
    unsplash: "photo-1459755486867-b55449bb39ff",
  },
  {
    slug: "natural-vs-washed-coffee",
    title: "Natural vs Washed Coffee: What's the Difference?",
    description:
      "Processing decides a lot of a coffee's flavour. Washed is clean and bright; natural is fruity and heavy. Here's how each is made and which to pick.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Process"],
    date: "2026-10-02",
    unsplash: "photo-1447933601403-0c6688de566e",
  },
  {
    slug: "what-is-honey-processed-coffee",
    title: "What Is Honey Processed Coffee?",
    description:
      "Honey (or pulped natural) processing leaves some fruit mucilage on the bean while it dries, giving a sweet, syrupy, low-acid cup. Here's how it works.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Process"],
    date: "2026-10-03",
    unsplash: "photo-1442550528053-c431ecb55509",
  },
  {
    slug: "single-origin-vs-blend-coffee",
    title: "Single Origin vs Blend Coffee",
    description:
      "Single origin shows where a coffee is from; blends are built for consistency and balance. Here's when each makes sense and what to buy.",
    readingTime: "5 min read",
    tags: ["Coffee", "Education", "Buying Guide"],
    date: "2026-10-04",
    unsplash: "photo-1500051638674-ff996a0ec29e",
  },
  {
    slug: "how-to-make-black-coffee",
    title: "How to Make Black Coffee: 4 Easy Methods",
    description:
      "Black coffee at home takes one piece of kit and five minutes. Here's how to make it with a steel filter, French press, pour over or a simple saucepan.",
    readingTime: "6 min read",
    tags: ["Coffee", "Brewing", "Black Coffee", "Beginner"],
    date: "2026-10-05",
    unsplash: "photo-1509785307050-d4066910ec1e",
  },
  {
    slug: "coffee-and-sleep",
    title: "Coffee and Sleep: How Late Is Too Late?",
    description:
      "Caffeine has a 5-6 hour half-life, so an afternoon coffee is still working at bedtime. Here's how coffee affects sleep and when to have your last cup.",
    readingTime: "5 min read",
    tags: ["Coffee", "Health", "Caffeine", "Sleep"],
    date: "2026-10-06",
    unsplash: "photo-1541167760496-1628856ab772",
  },
  {
    slug: "coffee-on-an-empty-stomach",
    title: "Is Coffee on an Empty Stomach Bad?",
    description:
      "For most people a morning black coffee before food is fine. Here's what the evidence says about acid, cortisol and jitters - and who should eat first.",
    readingTime: "5 min read",
    tags: ["Coffee", "Health", "Black Coffee"],
    date: "2026-10-07",
    unsplash: "photo-1495474472287-4d71bcdd2085",
  },
  {
    slug: "how-to-store-coffee",
    title: "How to Store Coffee to Keep It Fresh",
    description:
      "Air, heat, light and moisture are what stale coffee. Here's how to store beans and ground coffee properly - and whether the freezer really works.",
    readingTime: "5 min read",
    tags: ["Coffee", "Storage", "Beginner"],
    date: "2026-10-08",
    unsplash: "photo-1610632380989-680fe40816c6",
  },
  {
    slug: "coffee-grind-size-guide",
    title: "Coffee Grind Size Guide",
    description:
      "Grind size is the biggest lever on taste after freshness. Here's the right grind for filter, French press, pour over, moka pot and espresso.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "Education"],
    date: "2026-10-09",
    unsplash: "photo-1516315720917-231ef9acce48",
  },
  {
    slug: "how-to-reset-caffeine-tolerance",
    title: "How to Reset Your Caffeine Tolerance",
    description:
      "If coffee has stopped working, your body has adapted. Here's how tolerance builds, whether a full detox is needed, and how to get the effect back.",
    readingTime: "5 min read",
    tags: ["Coffee", "Caffeine", "Health"],
    date: "2026-10-10",
    unsplash: "photo-1514432324607-a09d9b4aefdd",
  },

  // ---- Tier 5 (remaining articles.md keywords) ----
  {
    slug: "best-coffee-for-aeropress",
    title: "Best Coffee for AeroPress",
    description:
      "The AeroPress is forgiving and fast, and works with almost any roast. Here's how to get the most from it and the best coffees to use.",
    readingTime: "5 min read",
    tags: ["Coffee", "Brewing", "AeroPress", "Buying Guide"],
    date: "2026-10-11",
    unsplash: "photo-1519082274554-1ca37fb8abb7",
  },
  {
    slug: "decaf-coffee-in-india",
    title: "Decaf Coffee in India: What to Know",
    description:
      "Decaf still has a little caffeine and the process matters. Here's how decaffeination works, what to look for, and lower-caffeine alternatives.",
    readingTime: "5 min read",
    tags: ["Coffee", "Caffeine", "India", "Education"],
    date: "2026-10-12",
    unsplash: "photo-1541167760496-1628856ab772",
  },
  {
    slug: "chicory-coffee-benefits",
    title: "Chicory Coffee: Benefits and Downsides",
    description:
      "Chicory adds fibre, cuts caffeine and mellows filter coffee - but too much can cause bloating. Here's the balanced view on chicory in coffee.",
    readingTime: "5 min read",
    tags: ["Coffee", "Chicory", "Health", "Filter Coffee"],
    date: "2026-10-13",
    unsplash: "photo-1461988320302-91bde64fc8e4",
  },
  {
    slug: "best-coffee-for-fat-loss",
    title: "Best Coffee for Fat Loss",
    description:
      "Coffee doesn't burn fat, but black coffee makes a calorie deficit easier to hold and helps you train harder. Here's how to use it and what to drink.",
    readingTime: "6 min read",
    tags: ["Coffee", "Weight Loss", "Black Coffee", "Health"],
    date: "2026-10-14",
    unsplash: "photo-1476480862126-209bfaa8edc8",
  },
  {
    slug: "is-coffee-a-good-pre-workout",
    title: "Is Coffee a Good Pre-Workout?",
    description:
      "Coffee delivers caffeine with the same evidence base as a pre-workout supplement, for a fraction of the price. Here's what it does and doesn't cover.",
    readingTime: "5 min read",
    tags: ["Coffee", "Fitness", "Pre-Workout", "Caffeine"],
    date: "2026-10-15",
    unsplash: "photo-1534438327276-14e5300c3a48",
  },
  {
    slug: "best-coffee-powder-for-black-coffee",
    title: "Best Coffee Powder for Black Coffee",
    description:
      "If you don't grind your own, pre-ground coffee for black coffee needs to be Arabica-forward, medium-roast and fresh. Here are the best powders.",
    readingTime: "5 min read",
    tags: ["Coffee", "Black Coffee", "Buying Guide"],
    date: "2026-10-16",
    unsplash: "photo-1459755486867-b55449bb39ff",
  },
  {
    slug: "best-strong-filter-coffee",
    title: "Best Strong Filter Coffee",
    description:
      "Strong filter coffee comes from more Robusta, a thicker decoction and less dilution. Here are the strongest filter blends and how to brew them.",
    readingTime: "5 min read",
    tags: ["Coffee", "Filter Coffee", "Strong Coffee", "India"],
    date: "2026-10-17",
    unsplash: "photo-1498804103079-a6351b050096",
  },
  {
    slug: "best-dark-roast-coffee-in-india",
    title: "Best Dark Roast Coffee in India",
    description:
      "Dark roast means bold, smoky, low-acid coffee that shines in espresso and strong milk drinks. Here are the best dark roasts in India.",
    readingTime: "5 min read",
    tags: ["Coffee", "Roast", "India", "Buying Guide"],
    date: "2026-10-18",
    unsplash: "photo-1504630083234-14187a9df0f5",
  },
  {
    slug: "best-light-roast-coffee-in-india",
    title: "Best Light Roast Coffee in India",
    description:
      "Light roast keeps the most origin character, acidity and aroma - best for pour over and black coffee. Here are the best light roasts in India.",
    readingTime: "5 min read",
    tags: ["Coffee", "Roast", "India", "Buying Guide"],
    date: "2026-10-19",
    unsplash: "photo-1500051638674-ff996a0ec29e",
  },
  {
    slug: "best-arabica-robusta-blend-coffee",
    title: "Best Arabica Robusta Blend Coffee in India",
    description:
      "An Arabica-Robusta blend gives you aroma and strength together. Here's how to pick the ratio and the best blends for filter coffee and espresso.",
    readingTime: "5 min read",
    tags: ["Coffee", "Arabica", "Robusta", "Filter Coffee"],
    date: "2026-10-20",
    unsplash: "photo-1447933601403-0c6688de566e",
  },
  {
    slug: "black-coffee-for-diabetes",
    title: "Black Coffee for Diabetes: What the Research Says",
    description:
      "Long-term coffee drinking is linked to lower type 2 diabetes risk, but caffeine can raise blood sugar short-term. Here's the nuanced picture - not medical advice.",
    readingTime: "6 min read",
    tags: ["Coffee", "Health", "Black Coffee", "Diabetes"],
    date: "2026-10-21",
    unsplash: "photo-1495474472287-4d71bcdd2085",
  },
  {
    slug: "is-filter-coffee-good-for-you",
    title: "Is Filter Coffee Good for You?",
    description:
      "Paper-filtered coffee removes cafestol, a compound that raises cholesterol - so filter coffee has a small edge over unfiltered. Here's the full picture.",
    readingTime: "5 min read",
    tags: ["Coffee", "Health", "Filter Coffee"],
    date: "2026-10-22",
    unsplash: "photo-1516315720917-231ef9acce48",
  },
  {
    slug: "best-instant-coffee-alternatives",
    title: "Best Instant Coffee Alternatives",
    description:
      "If you want to move on from instant without much more effort, here are the easiest fresh-coffee alternatives - South Indian filter, French press and more.",
    readingTime: "5 min read",
    tags: ["Coffee", "Instant Coffee", "Buying Guide"],
    date: "2026-10-23",
    unsplash: "photo-1509042239860-f550ce710b93",
  },
  {
    slug: "best-coffee-for-weight-management",
    title: "Best Coffee for Weight Management",
    description:
      "Black coffee is a low-effort tool for weight management: near zero calories, mild appetite control, and a better pre-workout than most. Here's how to use it.",
    readingTime: "5 min read",
    tags: ["Coffee", "Weight Loss", "Black Coffee", "Health"],
    date: "2026-10-24",
    unsplash: "photo-1470337458703-46ad1756a187",
  },
  {
    slug: "best-non-bitter-coffee",
    title: "Best Coffee for People Who Don't Like Bitter Coffee",
    description:
      "Bitterness usually comes from Robusta, dark roasts and over-extraction - not coffee itself. Here are the least bitter coffees and how to brew them.",
    readingTime: "5 min read",
    tags: ["Coffee", "Black Coffee", "Beginner", "Buying Guide"],
    date: "2026-10-25",
    unsplash: "photo-1453614512568-c4024d13c247",
  },
];

export const GUIDE_SLUGS = GUIDES.map((g) => g.slug);

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** Related articles: shared-tag matches first, padded with most recent. */
export function getRelatedGuides(slug: string, count = 3): Guide[] {
  const current = getGuide(slug);
  const others = GUIDES.filter((g) => g.slug !== slug);
  const byDate = (a: Guide, b: Guide) => (a.date < b.date ? 1 : -1);

  const tagged = current
    ? others
        .filter((g) => g.tags.some((t) => current.tags.includes(t)))
        .sort(byDate)
    : [];

  const rest = others.filter((g) => !tagged.includes(g)).sort(byDate);
  return [...tagged, ...rest].slice(0, count);
}
