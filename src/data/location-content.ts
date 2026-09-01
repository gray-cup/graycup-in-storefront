// Per-location editorial content for the /:state/:slug(/:topic) and
// /*-for-cafes/:city pages. The point is that every generated page carries
// paragraphs + FAQs that are actually *specific* to that place (region, coffee
// vs tea belt, metro vs non-metro delivery, neighbouring cities) instead of one
// template string with the city name swapped in - which is what gets these
// pages stuck in "Discovered / Crawled - currently not indexed".
//
// Everything here is deterministic: a city always renders the same copy, and
// the FNV-1a seed picks a different phrasing per city so neighbours don't read
// identically.
import type { IndiaCity, IndiaState } from "./india-locations";
import { getCitiesByState } from "./india-locations";

type Region = "North" | "South" | "East" | "West" | "Central" | "Northeast";

type StateInfo = {
  region: Region;
  /** Coffee is grown commercially in this state (estates, not just consumed). */
  coffeeGrowing?: boolean;
  /** Part of the South Indian filter-coffee belt. */
  filterCoffeeBelt?: boolean;
  /** Well-known tea-growing area, with the district name. */
  teaBelt?: string;
};

const STATE_INFO: Record<string, StateInfo> = {
  maharashtra: { region: "West" },
  "tamil-nadu": { region: "South", coffeeGrowing: true, filterCoffeeBelt: true, teaBelt: "the Nilgiris" },
  "uttar-pradesh": { region: "North" },
  karnataka: { region: "South", coffeeGrowing: true, filterCoffeeBelt: true },
  gujarat: { region: "West" },
  "west-bengal": { region: "East", teaBelt: "Darjeeling" },
  rajasthan: { region: "North" },
  telangana: { region: "South", filterCoffeeBelt: true },
  "andhra-pradesh": { region: "South", coffeeGrowing: true, filterCoffeeBelt: true },
  "madhya-pradesh": { region: "Central" },
  kerala: { region: "South", coffeeGrowing: true, filterCoffeeBelt: true },
  delhi: { region: "North" },
  haryana: { region: "North" },
  bihar: { region: "East" },
  odisha: { region: "East", coffeeGrowing: true },
  punjab: { region: "North" },
  assam: { region: "Northeast", teaBelt: "Assam" },
  chhattisgarh: { region: "Central" },
  jharkhand: { region: "East" },
  uttarakhand: { region: "North" },
  "jammu-and-kashmir": { region: "North" },
  "himachal-pradesh": { region: "North", teaBelt: "Kangra" },
  goa: { region: "West" },
  tripura: { region: "Northeast" },
  chandigarh: { region: "North" },
  meghalaya: { region: "Northeast" },
  sikkim: { region: "Northeast", teaBelt: "Temi" },
  puducherry: { region: "South", filterCoffeeBelt: true },
  nagaland: { region: "Northeast" },
  "arunachal-pradesh": { region: "Northeast" },
  manipur: { region: "Northeast" },
  mizoram: { region: "Northeast" },
};

function stateInfo(stateSlug: string): StateInfo {
  return STATE_INFO[stateSlug] ?? { region: "North" };
}

// FNV-1a. Small, stable, good enough to spread phrasings across cities.
function seed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: T[], key: string): T {
  return arr[seed(key) % arr.length];
}

/** Working-day delivery estimate - metros are quicker, the Northeast slower. */
function deliveryEstimate(city: IndiaCity, info: StateInfo): string {
  if (info.region === "Northeast") return "5-8 working days";
  if (city.tier === "high") return "2-4 working days";
  return "3-6 working days";
}

function nearbyCities(city: IndiaCity, limit = 4): IndiaCity[] {
  return getCitiesByState(city.stateSlug)
    .filter((c) => c.citySlug !== city.citySlug)
    .slice(0, limit);
}

function regionSentence(city: IndiaCity, state: IndiaState, info: StateInfo): string {
  const near = nearbyCities(city, 2)
    .map((c) => c.city)
    .join(" and ");
  const regionName =
    info.region === "Northeast" ? "the Northeast" : `${info.region} India`;
  if (near) {
    return `${city.city} sits in ${state.state}, in ${regionName}, and every order also covers nearby ${near} and the rest of the state.`;
  }
  return `${city.city} is in ${state.state}, in ${regionName}, and we ship to it along with the rest of the state.`;
}

function coffeeCultureSentence(
  city: IndiaCity,
  state: IndiaState,
  info: StateInfo,
): string | null {
  if (info.coffeeGrowing && info.filterCoffeeBelt) {
    return pick(
      [
        `${state.state} grows its own coffee, and ${city.city} runs on strong South Indian filter coffee - our medium-to-dark roasts and coarse filter grinds are built for exactly that cup.`,
        `Being part of ${state.state}'s coffee-growing belt, buyers in ${city.city} know their filter coffee; we roast for decoction strength and body rather than a light, acidic profile.`,
      ],
      city.citySlug + "coffee",
    );
  }
  if (info.filterCoffeeBelt) {
    return `Filter coffee is the default in ${city.city}, so we lean towards darker roasts and filter-ready grinds with enough body to stand up to milk.`;
  }
  if (info.teaBelt) {
    return `${city.city} is tea country - ${info.teaBelt} is close by - but the specialty and instant coffee audience here is growing fast, which is who these products are for.`;
  }
  return pick(
    [
      `Coffee habits in ${city.city} run from instant to pour-over, so the range spans everyday blends through single-origin beans.`,
      `${city.city} isn't a traditional coffee market, which is exactly why the fresher-roasted, clearly-labelled options here tend to land well.`,
    ],
    city.citySlug + "culture",
  );
}

export type LocationContent = {
  intro: string;
  paragraphs: string[];
  faqs: { question: string; answer: string }[];
};

type Kind = "retail" | "wholesale";

export function getLocationContent(
  cityData: IndiaCity,
  stateData: IndiaState,
  kind: Kind,
  thing = "coffee",
): LocationContent {
  const info = stateInfo(stateData.stateSlug);
  const eta = deliveryEstimate(cityData, info);
  const key = cityData.citySlug + kind;

  const intro =
    kind === "wholesale"
      ? pick(
          [
            `Gray Cup supplies ${thing} in bulk to cafes, cloud kitchens, offices and retailers across ${cityData.city}. Roasted to order, packed for wholesale, GST invoice on every order.`,
            `Wholesale ${thing} for ${cityData.city} businesses - roasted fresh, shipped in bulk packs with a GST invoice, delivered in about ${eta}.`,
            `If you run a cafe, restaurant or office pantry in ${cityData.city}, this is bulk ${thing} roasted to order and delivered with proper GST paperwork.`,
          ],
          key,
        )
      : pick(
          [
            `Order ${thing} online in ${cityData.city}, ${stateData.state}. Roasted to order, sealed for freshness, and delivered in about ${eta}.`,
            `Gray Cup delivers freshly roasted ${thing} to ${cityData.city} and the rest of ${stateData.state}, usually within ${eta}.`,
            `Fresh-roasted ${thing} shipped to ${cityData.city} - small-batch, dated on the pack, delivered in roughly ${eta}.`,
          ],
          key,
        );

  const paragraphs: string[] = [regionSentence(cityData, stateData, info)];

  const culture = coffeeCultureSentence(cityData, stateData, info);
  if (culture) paragraphs.push(culture);

  paragraphs.push(
    kind === "wholesale"
      ? `Wholesale orders to ${cityData.city} start at a 5 kg minimum, are roasted after you order rather than pulled from old stock, and ship with a GST invoice so input credit is straightforward. Standing weekly or monthly supply for a ${cityData.city} cafe can be set up on request.`
      : `Every pack is roasted in small batches, stamped with its roast date, and dispatched within a day or two so it reaches ${cityData.city} close to peak freshness. Delivery is free over the usual threshold and orders are trackable end to end.`,
  );

  const faqs: { question: string; answer: string }[] = [
    {
      question: `Where does my order ship from?`,
      answer: `Every order is roasted and dispatched from our Delhi facility and couriered to ${cityData.city}${
        info.region === "North" ? " — a short haul within North India" : ""
      }.`,
    },
    {
      question: `How long does delivery to ${cityData.city} take?`,
      answer: `Most orders reach ${cityData.city} in about ${eta} after roasting, shipped from Delhi. ${
        info.region === "Northeast"
          ? "Northeast routes take a little longer than the rest of the country."
          : cityData.tier === "high"
            ? `As a major ${stateData.state} hub, ${cityData.city} is on our fastest routes.`
            : `Smaller centres in ${stateData.state} can occasionally take a day or two more.`
      }`,
    },
    {
      question: `Do you deliver outside ${cityData.city}?`,
      answer: `Yes - the same service covers ${nearbyCities(cityData, 3)
        .map((c) => c.city)
        .join(", ") || stateData.state} and the rest of ${stateData.state}.`,
    },
  ];

  if (kind === "wholesale") {
    faqs.push({
      question: `Is there a minimum order for ${cityData.city} businesses?`,
      answer: `The wholesale minimum is 5 kg, mix-and-match across roasts and grinds. There is no upper limit and repeat supply schedules are available for ${cityData.city} cafes and offices.`,
    });
    faqs.push({
      question: `Do you provide a GST invoice?`,
      answer: `Every wholesale order to ${cityData.city} ships with a GST invoice in your registered business name.`,
    });
  } else {
    faqs.push({
      question: `Is the coffee freshly roasted?`,
      answer: `Yes. Orders for ${cityData.city} are roasted after you place them and the roast date is printed on the pack - nothing sits in a warehouse for months.`,
    });
  }

  if (info.filterCoffeeBelt) {
    faqs.push({
      question: `Which grind should I choose in ${cityData.city}?`,
      answer: `For a traditional ${stateData.state} filter, choose the filter/coarse grind. For a moka pot or South Indian drip filter it works as-is; for espresso machines pick the fine grind.`,
    });
  }

  return { intro, paragraphs, faqs };
}

/** State-level pages (/:state/:topic) - no single city to anchor on. */
export function getStateLocationContent(
  stateData: IndiaState,
  thing = "coffee",
): LocationContent {
  const info = stateInfo(stateData.stateSlug);
  const cities = getCitiesByState(stateData.stateSlug);
  const cityNames = cities.map((c) => c.city);
  const regionName =
    info.region === "Northeast" ? "the Northeast" : `${info.region} India`;
  const key = stateData.stateSlug + "state";

  const intro = pick(
    [
      `Gray Cup delivers freshly roasted ${thing} across ${stateData.state} - ${cityNames.slice(0, 3).join(", ")} and every town in between.`,
      `Order ${thing} online anywhere in ${stateData.state}. Roasted to order, dated on the pack, shipped statewide.`,
    ],
    key,
  );

  const paragraphs: string[] = [
    `${stateData.state} is in ${regionName}. We ship to all of it - from ${cityNames.slice(0, 2).join(" and ") || "the major cities"} out to the smaller districts - with the same fresh-roast, roast-dated packs.`,
  ];

  if (info.coffeeGrowing) {
    paragraphs.push(
      `${stateData.state} is one of India's coffee-growing states, so palates here are well-calibrated; the range runs from everyday blends to traceable single origins.`,
    );
  } else if (info.filterCoffeeBelt) {
    paragraphs.push(
      `Filter coffee is the norm across ${stateData.state}, so we skew towards darker roasts and filter-ready grinds with the body to carry milk and decoction.`,
    );
  } else if (info.teaBelt) {
    paragraphs.push(
      `${stateData.state} is better known for tea (${info.teaBelt}), but its specialty-coffee audience is growing quickly - which is who this selection is for.`,
    );
  }

  const faqs = [
    {
      question: `Where does my order ship from?`,
      answer: `Orders are roasted and dispatched from our Delhi facility and couriered anywhere in ${stateData.state}.`,
    },
    {
      question: `Which cities in ${stateData.state} do you deliver to?`,
      answer: `All of them. ${cityNames.join(", ")} are on our regular routes, and delivery reaches the rest of ${stateData.state} too.`,
    },
    {
      question: `Is the coffee freshly roasted?`,
      answer: `Yes - orders are roasted after you place them and the roast date is printed on every pack.`,
    },
  ];

  return { intro, paragraphs, faqs };
}
