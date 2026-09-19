export function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      Grade {grade}
    </span>
  );
}
