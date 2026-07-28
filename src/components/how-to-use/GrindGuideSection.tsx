"use client";

import { useState } from "react";
import { COFFEE_GRIND_OPTIONS } from "@/data/products";
import { getHowToUseGuide } from "@/data/how-to-use";
import { GuideContent } from "./GuideContent";

export function GrindGuideSection() {
  const [selectedGrind, setSelectedGrind] = useState(COFFEE_GRIND_OPTIONS[0]);
  const guide = getHowToUseGuide(selectedGrind);

  return (
    <div className="space-y-8">
      {/* Grind Size Selector */}
      <div className="flex flex-wrap gap-2">
        {COFFEE_GRIND_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedGrind(option)}
            className={`rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
              option === selectedGrind
                ? "bg-black text-white border-black"
                : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <GuideContent guide={guide} />
    </div>
  );
}
