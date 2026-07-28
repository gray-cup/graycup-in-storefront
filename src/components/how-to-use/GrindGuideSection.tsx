"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { COFFEE_GRIND_OPTIONS } from "@/data/products";
import { getHowToUseGuide } from "@/data/how-to-use";

export function GrindGuideSection() {
  const [selectedGrind, setSelectedGrind] = useState(COFFEE_GRIND_OPTIONS[0]);
  const [gifFailed, setGifFailed] = useState(false);
  const guide = getHowToUseGuide(selectedGrind);

  return (
    <div className="space-y-8">
      {/* Grind Size Selector */}
      <div className="flex flex-wrap gap-2">
        {COFFEE_GRIND_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setSelectedGrind(option);
              setGifFailed(false);
            }}
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

      {/* How to Use Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
          {!gifFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={guide.gif}
              alt={`How to brew coffee using the ${guide.grind} method`}
              loading="lazy"
              onError={() => setGifFailed(true)}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center px-6 text-sm text-muted-foreground">
              Demo video coming soon for {guide.grind}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-black mb-1">{guide.grind}</h2>
            <p className="text-gray-600">{guide.tagline}</p>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{guide.time}</span>
            </div>
          </div>

          <ol className="space-y-3">
            {guide.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-black text-white text-xs font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {guide.tips && guide.tips.length > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-100 p-4 space-y-2">
              <p className="text-sm font-medium text-green-900">Tips</p>
              <ul className="space-y-1.5">
                {guide.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-green-800 leading-relaxed">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
