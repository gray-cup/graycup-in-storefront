import type { CoffeeProcess } from "@/data/products";

const PROCESS_COLORS: Record<CoffeeProcess, string> = {
  Washed: "bg-sky-500",
  Natural: "bg-orange-500",
  HSD: "bg-amber-500",
};

export function ProcessBadge({
  process,
  className = "",
}: {
  process: CoffeeProcess;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${PROCESS_COLORS[process]}`} />
      <span className="text-xs font-medium">{process}</span>
    </span>
  );
}
