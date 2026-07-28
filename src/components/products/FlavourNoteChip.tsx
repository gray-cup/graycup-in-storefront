const FLAVOUR_COLOR_KEYWORDS: [RegExp, string][] = [
  [/^pending$/i, "bg-neutral-400"],
  [/^washed$/i, "bg-sky-500"],
  [/^natural$/i, "bg-orange-500"],
  [/^hsd$/i, "bg-amber-500"],
  [/lemon|citrus|lime|zest|orange peel/i, "bg-yellow-400"],
  [/cacao|chocolate|cocoa/i, "bg-amber-800"],
  [/caramel|toffee|butterscotch/i, "bg-orange-500"],
  [/toast|nutty|almond|hazelnut/i, "bg-amber-600"],
  [/berry|cherry|red fruit/i, "bg-red-400"],
  [/floral|jasmine|rose/i, "bg-pink-400"],
  [/grape|wine|plum/i, "bg-purple-400"],
  [/apple|pear|green/i, "bg-green-500"],
  [/honey|vanilla|sweet/i, "bg-yellow-300"],
  [/spice|cinnamon|clove/i, "bg-red-600"],
];

const FALLBACK_COLORS = [
  "bg-yellow-400",
  "bg-amber-600",
  "bg-orange-500",
  "bg-red-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-blue-400",
  "bg-teal-500",
  "bg-green-500",
  "bg-lime-500",
];

function colorForFlavour(flavour: string): string {
  for (const [pattern, color] of FLAVOUR_COLOR_KEYWORDS) {
    if (pattern.test(flavour)) return color;
  }
  let hash = 0;
  for (let i = 0; i < flavour.length; i++) {
    hash = (hash * 31 + flavour.charCodeAt(i)) >>> 0;
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
}

export function FlavourNoteChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 shadow-inner">
      <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${colorForFlavour(label)}`} />
      <span className="text-xs font-medium text-neutral-800">{label}</span>
    </span>
  );
}
