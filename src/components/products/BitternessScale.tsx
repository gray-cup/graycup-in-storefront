type BitternessScaleProps = {
  level: number;
  label?: string;
  className?: string;
};

export function BitternessScale({
  level,
  label = "Bitterness",
  className = "",
}: BitternessScaleProps) {
  const clamped = Math.min(10, Math.max(0, level));
  const percent = (clamped / 10) * 100;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-neutral-800 flex-shrink-0">{label}</span>
      <div className="relative h-3 flex-1 min-w-[64px] overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-inner">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-amber-800"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-neutral-400 flex-shrink-0">{clamped}/10</span>
    </div>
  );
}
