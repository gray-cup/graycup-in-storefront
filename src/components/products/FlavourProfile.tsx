import type { CoffeeProcess } from "@/data/products";
import { ProcessBadge } from "./ProcessBadge";
import { FlavourNoteChip } from "./FlavourNoteChip";

type FlavourProfileProps = {
  process?: CoffeeProcess;
  varietal?: string;
  flavourNotes?: string[];
  className?: string;
};

export function FlavourProfile({
  process,
  varietal,
  flavourNotes,
  className = "",
}: FlavourProfileProps) {
  const hasFlavourNotes = flavourNotes && flavourNotes.length > 0;

  if (!process && !varietal && !hasFlavourNotes) return null;

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
    </div>
  );
}
