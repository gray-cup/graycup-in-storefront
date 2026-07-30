import type { CoffeeProcess } from "@/data/products";
import { ProcessBadge } from "./ProcessBadge";
import { FlavourNoteChip } from "./FlavourNoteChip";
import { BitternessScale } from "./BitternessScale";

type FlavourProfileProps = {
  process?: CoffeeProcess;
  varietal?: string;
  flavourNotes?: string[];
  bitterness?: number;
  className?: string;
};

export function FlavourProfile({
  process,
  varietal,
  flavourNotes,
  bitterness,
  className = "",
}: FlavourProfileProps) {
  const hasFlavourNotes = flavourNotes && flavourNotes.length > 0;
  const hasBitterness = typeof bitterness === "number";

  if (!process && !varietal && !hasFlavourNotes && !hasBitterness) return null;

  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-4 ${className}`}>
      {(process || varietal) && (
        <div className="flex items-center justify-between mb-3">
          {process && <ProcessBadge process={process} pill />}
          {varietal && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">
              {varietal}
            </span>
          )}
        </div>
      )}
      {hasFlavourNotes && (
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          {flavourNotes.map((note) => (
            <FlavourNoteChip key={note} label={note} />
          ))}
        </div>
      )}
      {hasBitterness && (
        <BitternessScale level={bitterness} className={hasFlavourNotes ? "mt-3" : ""} />
      )}
    </div>
  );
}
