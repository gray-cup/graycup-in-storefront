import { getProductBySlug } from "@/data/products";
import type { Product } from "@/data/products/types";

export type QuizStyle = "black" | "milk" | "both";
export type QuizFlavorBlack = "fruity" | "chocolate" | "nutty" | "earthy" | "unsure";
export type QuizBitterness = "none" | "light" | "medium" | "strong";
export type QuizStrengthMilk = "mild" | "balanced" | "strong" | "very-strong";
export type QuizFlavorMilk = "chocolate" | "caramel" | "nuts" | "fruity" | "unsure";
export type QuizReason = "taste" | "energy" | "both";

export type QuizAnswers = {
  style: QuizStyle;
  flavorBlack?: QuizFlavorBlack;
  bitterness?: QuizBitterness;
  strengthMilk?: QuizStrengthMilk;
  flavorMilk?: QuizFlavorMilk;
  reason: QuizReason;
};

export type QuizOption<T extends string> = { value: T; label: string; emoji: string };

export type QuizQuestion =
  | {
      id: "style";
      question: "How do you usually drink your coffee?";
      options: QuizOption<QuizStyle>[];
    }
  | {
      id: "flavorBlack";
      question: "What kind of flavor do you enjoy?";
      options: QuizOption<QuizFlavorBlack>[];
    }
  | {
      id: "bitterness";
      question: "How much bitterness do you like?";
      options: QuizOption<QuizBitterness>[];
    }
  | {
      id: "strengthMilk";
      question: "How strong should it taste through milk?";
      options: QuizOption<QuizStrengthMilk>[];
    }
  | {
      id: "flavorMilk";
      question: "What flavors do you like?";
      options: QuizOption<QuizFlavorMilk>[];
    }
  | {
      id: "reason";
      question: "Why do you drink coffee?";
      options: QuizOption<QuizReason>[];
    };

export const styleQuestion: QuizQuestion = {
  id: "style",
  question: "How do you usually drink your coffee?",
  options: [
    { value: "black", label: "Black", emoji: "☕" },
    { value: "milk", label: "With milk", emoji: "🥛" },
    { value: "both", label: "Both", emoji: "🔄" },
  ],
};

export const flavorBlackQuestion: QuizQuestion = {
  id: "flavorBlack",
  question: "What kind of flavor do you enjoy?",
  options: [
    { value: "fruity", label: "Fruity & bright", emoji: "🍓" },
    { value: "chocolate", label: "Chocolatey & smooth", emoji: "🍫" },
    { value: "nutty", label: "Nutty & balanced", emoji: "🌰" },
    { value: "earthy", label: "Rich & earthy", emoji: "🌍" },
    { value: "unsure", label: "I'm not sure", emoji: "🤷" },
  ],
};

export const bitternessQuestion: QuizQuestion = {
  id: "bitterness",
  question: "How much bitterness do you like?",
  options: [
    { value: "none", label: "Almost none", emoji: "🌤️" },
    { value: "light", label: "A little", emoji: "🌥️" },
    { value: "medium", label: "Medium", emoji: "☁️" },
    { value: "strong", label: "Strong", emoji: "⛈️" },
  ],
};

export const strengthMilkQuestion: QuizQuestion = {
  id: "strengthMilk",
  question: "How strong should it taste through milk?",
  options: [
    { value: "mild", label: "Mild", emoji: "🌤️" },
    { value: "balanced", label: "Balanced", emoji: "⛅" },
    { value: "strong", label: "Strong", emoji: "☁️" },
    { value: "very-strong", label: "Very strong", emoji: "⛈️" },
  ],
};

export const flavorMilkQuestion: QuizQuestion = {
  id: "flavorMilk",
  question: "What flavors do you like?",
  options: [
    { value: "chocolate", label: "Chocolate", emoji: "🍫" },
    { value: "caramel", label: "Caramel", emoji: "🍮" },
    { value: "nuts", label: "Nuts", emoji: "🌰" },
    { value: "fruity", label: "Fruity", emoji: "🍓" },
    { value: "unsure", label: "Not sure", emoji: "🤷" },
  ],
};

export const reasonQuestion: QuizQuestion = {
  id: "reason",
  question: "Why do you drink coffee?",
  options: [
    { value: "taste", label: "I enjoy the taste", emoji: "😋" },
    { value: "energy", label: "I need energy", emoji: "⚡" },
    { value: "both", label: "Both", emoji: "🙌" },
  ],
};

/** Returns the ordered list of questions to show based on answers so far. */
export function getQuizFlow(style: QuizStyle | undefined): QuizQuestion[] {
  if (style === "milk") {
    return [styleQuestion, strengthMilkQuestion, flavorMilkQuestion, reasonQuestion];
  }
  // "black" and "both" share the black-leaning flavor/bitterness path
  return [styleQuestion, flavorBlackQuestion, bitternessQuestion, reasonQuestion];
}

export type QuizResult = {
  primarySlug: string;
  alternateSlugs: string[];
  headline: string;
  why: string[];
  brewNote: string;
};

function blackRecommendation(answers: QuizAnswers): QuizResult {
  const { flavorBlack, bitterness, reason } = answers;

  if (flavorBlack === "fruity" && (bitterness === "none" || bitterness === "light")) {
    return {
      primarySlug: "koraput-odisha-washed-coffee",
      alternateSlugs: ["attikan-estate-washed-coffee", "basic-black-coffee"],
      headline: "A clean, bright washed-process Arabica",
      why: [
        "You like coffee fruity and bright, not bitter",
        "You drink it black",
        reason === "energy" ? "You still want a steady lift" : "You drink it mainly for the taste",
      ],
      brewNote: "Its clean acidity and guava-like notes shine in a pour-over, V60, or as cold brew.",
    };
  }

  if (flavorBlack === "chocolate") {
    return {
      primarySlug: "biccode-estate-coffee",
      alternateSlugs: ["karadykan-estate-coffee", "basic-black-coffee"],
      headline: "A smooth, chocolatey medium-intensity cup",
      why: [
        "You like chocolatey, smooth flavors",
        "You take your coffee black",
        "You want balanced, not overpowering bitterness",
      ],
      brewNote: "Notes of cacao nibs, caramel and toasted flavour come through best in a French press or Moka pot.",
    };
  }

  if (flavorBlack === "nutty") {
    return {
      primarySlug: "karadykan-estate-coffee",
      alternateSlugs: ["biccode-estate-coffee", "basic-black-coffee"],
      headline: "A balanced, nutty single-estate Arabica",
      why: [
        "You like nutty, balanced flavors",
        "You drink your coffee black",
        "You want a clean, well-rounded cup",
      ],
      brewNote: "Its chocolate, nutty and citrus notes work beautifully as a pour-over or filter brew.",
    };
  }

  if (flavorBlack === "earthy" || bitterness === "strong") {
    if (bitterness === "strong" || reason === "energy") {
      return {
        primarySlug: "french-roast-coffee",
        alternateSlugs: ["halflong-assam-coffee", "basic-black-coffee"],
        headline: "A bold, dark French roast",
        why: [
          "You like rich, earthy flavors and don't mind strong bitterness",
          "You drink your coffee black",
          reason === "energy" ? "You want a coffee that packs a punch" : "You want a bold, full-bodied cup",
        ],
        brewNote: "Low acidity and a heavy body make it perfect for a French press or straight espresso.",
      };
    }
    return {
      primarySlug: "halflong-assam-coffee",
      alternateSlugs: ["french-roast-coffee", "basic-black-coffee"],
      headline: "A soft, earthy single-origin Assam Arabica",
      why: [
        "You like rich, earthy flavors",
        "You drink your coffee black",
        "You prefer it without harsh bitterness",
      ],
      brewNote: "Its mild acidity and earthy sweetness are lovely as a pour-over or French press.",
    };
  }

  return {
    primarySlug: "basic-black-coffee",
    alternateSlugs: ["karadykan-estate-coffee", "koraput-odisha-washed-coffee"],
    headline: "An easy, everyday black coffee",
    why: [
      "You're still exploring what flavors you like",
      "You drink your coffee black",
      "You want something reliable and smooth to start with",
    ],
    brewNote: "Versatile enough for filter, French press, or a simple black cup - no fuss required.",
  };
}

function milkRecommendation(answers: QuizAnswers): QuizResult {
  const { strengthMilk, reason } = answers;

  if (strengthMilk === "mild") {
    return {
      primarySlug: "filter-coffee-arabica-chicory",
      alternateSlugs: ["filter-coffee-pure-arabica", "basic-black-coffee"],
      headline: "A smooth, mellow Arabica-chicory blend",
      why: [
        "You like your coffee milder through milk",
        "You want reduced bitterness",
        "You want a classic, comforting cup",
      ],
      brewNote: "Made for traditional South Indian filter brewing - just add hot milk to taste.",
    };
  }

  if (strengthMilk === "balanced") {
    return {
      primarySlug: "filter-coffee-pure-arabica",
      alternateSlugs: ["filter-coffee-arabica-chicory", "basic-black-coffee"],
      headline: "A naturally sweet, pure Arabica filter coffee",
      why: [
        "You want a balanced taste through milk",
        "You'd rather skip chicory and blends",
        "You want a smooth, aromatic everyday cup",
      ],
      brewNote: "Brew it as a filter decoction and top up with hot milk for a classic South Indian cup.",
    };
  }

  // strong / very-strong
  return {
    primarySlug: "filter-coffee-arabica-robusta",
    alternateSlugs: ["filter-coffee-pure-arabica", "basic-black-coffee"],
    headline: "A bold Arabica-Robusta blend that cuts through milk",
    why: [
      strengthMilk === "very-strong"
        ? "You want the strongest coffee taste through milk"
        : "You want a strong coffee taste through milk",
      reason === "energy" ? "You're drinking coffee for a real lift" : "You want a bold, café-style cup",
      "You want good crema and a rich finish",
    ],
    brewNote: "70% Arabica, 30% Robusta gives it enough body to stand up to milk without losing aroma.",
  };
}

export function getQuizResult(answers: QuizAnswers): QuizResult {
  if (answers.style === "milk") {
    return milkRecommendation(answers);
  }

  if (answers.style === "both") {
    return {
      primarySlug: "basic-black-coffee",
      alternateSlugs: ["filter-coffee-arabica-robusta", "karadykan-estate-coffee"],
      headline: "A versatile coffee that works black or with milk",
      why: [
        "You switch between black and milk coffee",
        "You want one coffee that does both well",
        "You value flexibility over a single strong preference",
      ],
      brewNote: "Smooth and balanced enough to drink black, or with milk when you're in the mood.",
    };
  }

  return blackRecommendation(answers);
}

export function resolveQuizProducts(result: QuizResult): Product[] {
  const slugs = [result.primarySlug, ...result.alternateSlugs];
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const product = getProductBySlug(slug);
    if (product) {
      out.push(product);
      seen.add(slug);
    }
  }
  return out;
}
