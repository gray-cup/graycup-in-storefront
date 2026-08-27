import { caffeineMgPerCup, CUP_GRAMS } from "@/lib/caffeine";

type Props = {
  /** Robusta share of the coffee portion, 0-100. */
  robusta?: number;
  /** Non-caffeine filler share (e.g. chicory), 0-100. */
  chicory?: number;
  grams?: number;
  /** Show a "~405-490 mg" range instead (pass the low Robusta %). */
  robustaTo?: number;
};

export function CaffeinePerCup({
  robusta = 0,
  chicory = 0,
  grams = CUP_GRAMS,
  robustaTo,
}: Props) {
  const value =
    robustaTo !== undefined
      ? `~${caffeineMgPerCup(robusta, chicory, grams)}-${caffeineMgPerCup(robustaTo, chicory, grams)} mg`
      : `~${caffeineMgPerCup(robusta, chicory, grams)} mg`;

  const mix = chicory
    ? `${100 - chicory}% coffee / ${chicory}% chicory`
    : robusta || robustaTo
      ? `${100 - robusta}% Arabica / ${robusta}%${robustaTo ? `-${robustaTo}%` : ""} Robusta`
      : "100% Arabica";

  return (
    <p className="not-prose my-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">
      <span>
        Caffeine: {value} per {grams} g cup
      </span>
      <span aria-hidden>·</span>
      <span className="font-normal">{mix}</span>
    </p>
  );
}
