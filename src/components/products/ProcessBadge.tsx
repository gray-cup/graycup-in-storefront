import type { CoffeeProcess } from "@/data/products";

const PROCESS_COLORS: Record<CoffeeProcess, string> = {
  Washed: "bg-sky-500",
  Natural: "bg-orange-500",
  "Honey Sundried (HSD)": "bg-amber-500",
  Pending: "bg-neutral-400",
};

const PROCESS_PILL_STYLES: Record<CoffeeProcess, string> = {
  Washed: "bg-sky-50 text-sky-700 border-sky-200",
  Natural: "bg-orange-50 text-orange-700 border-orange-200",
  "Honey Sundried (HSD)": "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

const PROCESS_DESCRIPTIONS: Record<CoffeeProcess, string> = {
  Washed:
    "Coffee where the outer fruit skin and sticky pulp are completely removed from the coffee bean using water then the bean is dried.",
  Natural:
    "Whole cherries are dried in the sun before hulling - fruity, full-bodied, wine-like cup.",
  "Honey Sundried (HSD)":
    "Honey/semi-dry process - some mucilage is left on during drying, balancing brightness and sweetness.",
  Pending: "Process details coming soon.",
};

const TOOLTIP_SIDE_STYLES = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
};

export function ProcessBadge({
  process,
  className = "",
  pill = false,
  tooltipSide = "top",
}: {
  process: CoffeeProcess;
  className?: string;
  pill?: boolean;
  tooltipSide?: "top" | "bottom";
}) {
  return (
    <span className={`group/process relative inline-flex ${className}`}>
      {pill ? (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${PROCESS_PILL_STYLES[process]}`}
        >
          {process}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${PROCESS_COLORS[process]}`} />
          <span className="text-xs font-medium">{process}</span>
        </span>
      )}

      <span
        className={`pointer-events-none absolute left-0 z-50 w-48 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-[11px] leading-snug text-neutral-700 opacity-0 shadow-lg transition-opacity duration-200 group-hover/process:opacity-100 ${TOOLTIP_SIDE_STYLES[tooltipSide]}`}
      >
        {PROCESS_DESCRIPTIONS[process]}
      </span>
    </span>
  );
}
