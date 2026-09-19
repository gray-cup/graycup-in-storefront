"use client";

import { useState } from "react";
import { HOW_TO_USE_GUIDES, getHowToUseGuide } from "@/data/how-to-use";
import { GuideContent } from "./GuideContent";

export function GrindGuideSection() {
  const [selectedGrind, setSelectedGrind] = useState(HOW_TO_USE_GUIDES[0].grind);
  const guide = getHowToUseGuide(selectedGrind);

  return (
    <div className="space-y-8">
      {/* Grind Size Selector */}
      <div className="flex flex-wrap gap-2">
        {HOW_TO_USE_GUIDES.map(({ grind: option }) => (
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
