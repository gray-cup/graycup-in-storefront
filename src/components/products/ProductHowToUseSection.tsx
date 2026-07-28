"use client";

import Link from "next/link";
import { getHowToUseGuide } from "@/data/how-to-use";
import { GuideContent } from "@/components/how-to-use/GuideContent";
import { useGrindSize } from "./grind-size-context";

export function ProductHowToUseSection() {
  const { grindSize } = useGrindSize();
  const guide = getHowToUseGuide(grindSize);

  return (
    <div className="mt-16 pt-16 border-t border-gray-200">
      <div className="flex items-baseline justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-black">How to Use</h2>
        <Link
          href="/how-to-use"
          className="text-sm text-muted-foreground hover:text-black transition-colors"
        >
          View all brew methods
        </Link>
      </div>
      <GuideContent guide={guide} />
    </div>
  );
}
