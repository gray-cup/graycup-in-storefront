import { COFFEE_GRIND_OPTIONS } from "@/data/products/types";

export type HowToUseGuide = {
  grind: string;
  tagline: string;
  time: string;
  gif: string;
  steps: string[];
  tips?: string[];
};

export const HOW_TO_USE_GUIDES: HowToUseGuide[] = [
  {
    grind: "French Press / Cold Brew",
    tagline: "Full-bodied and rich, brewed by steeping coarse grounds directly in water.",
    time: "4 min (hot) / 12 hrs (cold)",
    gif: "/how-to-use/french-press.webm",
    steps: [
      "Add 1 heaped tbsp of coarse-ground coffee per 200 ml of water to the French press.",
      "Pour hot water (just off the boil, ~95°C) over the grounds and stir gently.",
      "Place the lid on with the plunger pulled up, and let it steep for 4 minutes.",
      "Press the plunger down slowly and evenly.",
      "Pour and serve immediately — coffee left on the grounds keeps brewing and turns bitter.",
    ],
    tips: [
      "For cold brew, use the same ratio with room-temperature water and steep in the fridge for 12 hours before plunging.",
      "Grounds that are too fine will clog the mesh filter — stick to a coarse, sea-salt-like grind.",
    ],
  },
  {
    grind: "Whole Beans",
    tagline: "Grind fresh right before brewing to lock in aroma and flavour.",
    time: "Grind fresh, then brew",
    gif: "/how-to-use/whole-beans.gif",
    steps: [
      "Weigh out your beans (roughly 10g per 180 ml of water is a good starting ratio).",
      "Choose a grind size that matches your brew method — coarse for French press, medium for filter/pour over, fine for espresso.",
      "Grind just before brewing; ground coffee loses aroma within minutes of grinding.",
      "Store the remaining beans in an airtight container away from light, heat, and moisture.",
    ],
    tips: [
      "A burr grinder gives a far more even grind than a blade grinder, which improves extraction and taste.",
      "Buy only what you'll use in 2–3 weeks — beans are best within a month of the roast date.",
    ],
  },
  {
    grind: "Espresso",
    tagline: "A concentrated, intense shot brewed under pressure.",
    time: "25–30 sec",
    gif: "/how-to-use/espresso.gif",
    steps: [
      "Use a fine, sugar-like grind — too coarse and the shot will run fast and taste weak.",
      "Dose about 18g of coffee into the portafilter and level it evenly.",
      "Tamp firmly and evenly with consistent pressure.",
      "Lock the portafilter in and start the shot — aim for 36g of espresso in 25–30 seconds.",
      "Adjust grind finer if the shot runs too fast, or coarser if it runs too slow.",
    ],
    tips: [
      "Consistency in dose, tamp pressure, and grind size matters more than any single variable.",
      "Use freshly roasted beans (within 2–4 weeks) for good crema.",
    ],
  },
  {
    grind: "Moka Pot",
    tagline: "Stovetop brewing that produces a strong, espresso-like coffee.",
    time: "5 min",
    gif: "/how-to-use/moka-pot.webm",
    steps: [
      "Fill the bottom chamber with hot water up to just below the pressure valve.",
      "Insert the filter basket and fill with medium-fine ground coffee, levelled but not tamped.",
      "Screw the top chamber on tightly and place the pot on medium heat with the lid open.",
      "Once coffee starts to sputter into the top chamber, remove from heat.",
      "Pour and serve immediately to avoid a burnt taste.",
    ],
    tips: [
      "Starting with hot (not cold) water in the base reduces the time the grounds spend over heat, avoiding a bitter, over-extracted brew.",
      "Never tamp the grounds in a moka pot — it restricts the water flow and can cause pressure build-up.",
    ],
  },
  {
    grind: "South Indian Filter",
    tagline: "Traditional slow-drip filter coffee, often served with milk and sugar.",
    time: "15–20 min drip",
    gif: "/how-to-use/south-indian-filter.gif",
    steps: [
      "Add 2–3 tbsp of fine-medium ground coffee to the upper filter chamber and press down gently with the disc (do not pack tightly).",
      "Pour hot water (just off the boil) slowly over the grounds until the chamber is full.",
      "Cover with the lid and let it drip through into the bottom chamber for 15–20 minutes.",
      "Mix the resulting concentrated decoction with hot milk and sugar to taste, or serve as-is over ice for a cold coffee.",
    ],
    tips: [
      "Don't rush the drip by pressing the disc down hard — slow extraction is what gives filter coffee its distinct flavour.",
      "The decoction keeps well in the fridge for a couple of days, so you can filter a batch in advance.",
    ],
  },
  {
    grind: "Pour Over",
    tagline: "A clean, bright cup made by manually pouring water over grounds in stages.",
    time: "3 min",
    gif: "/how-to-use/pour-over.gif",
    steps: [
      "Place a filter in your dripper, rinse it with hot water, and discard the rinse water.",
      "Add medium-ground coffee (about 15g per 250 ml of water).",
      "Pour a small amount of hot water to saturate the grounds and let it 'bloom' for 30 seconds.",
      "Continue pouring in slow, circular motions in stages, keeping the water level steady.",
      "Total brew time should be around 2.5–3.5 minutes.",
    ],
    tips: [
      "A gooseneck kettle gives much better control over the pour than a regular kettle.",
      "If the brew finishes too fast, grind finer; if it's too slow, grind coarser.",
    ],
  },
  {
    grind: "Aeropress",
    tagline: "A fast, versatile brew that's smooth and low in bitterness.",
    time: "1–2 min",
    gif: "/how-to-use/aeropress.gif",
    steps: [
      "Insert a paper filter into the cap, rinse with hot water, and screw it onto the chamber.",
      "Add medium-fine ground coffee (about 15–17g) to the chamber.",
      "Pour hot water to the top, stir for 10 seconds, and let it steep for 1 minute.",
      "Insert the plunger and press down slowly and steadily for about 20–30 seconds.",
      "Dilute with hot water if you prefer a lighter cup — the base brew is concentrated.",
    ],
    tips: [
      "For a fruitier, brighter cup, try the inverted method (brewing upside down before flipping onto your cup).",
      "Total contact time is short, so a slightly finer grind than pour over works well.",
    ],
  },
];

if (
  process.env.NODE_ENV !== "production" &&
  HOW_TO_USE_GUIDES.some((guide) => !COFFEE_GRIND_OPTIONS.includes(guide.grind))
) {
  throw new Error("how-to-use.ts guides are out of sync with COFFEE_GRIND_OPTIONS");
}

export function getHowToUseGuide(grind: string): HowToUseGuide {
  return (
    HOW_TO_USE_GUIDES.find((guide) => guide.grind === grind) ?? HOW_TO_USE_GUIDES[0]
  );
}
