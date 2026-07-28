"use client";

import Link from "next/link";
import { getHowToUseGuide } from "@/data/how-to-use";
import { GuideContent } from "@/components/how-to-use/GuideContent";
import { Marquee } from "@/components/Marquee";
import { useGrindSize } from "./grind-size-context";

export function ProductHowToUseSection() {
  const { grindSize } = useGrindSize();
  const guide = getHowToUseGuide(grindSize);

  return (
    <div className="mt-16 pt-16 border-t border-gray-200">
      <Marquee text="How to Use" />
      <div className="flex items-baseline justify-between mt-10 mb-8">
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
