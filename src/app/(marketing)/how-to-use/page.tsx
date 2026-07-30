import type { Metadata } from "next";
import { GrindGuideSection } from "@/components/how-to-use/GrindGuideSection";

export const metadata: Metadata = {
  title: "How to Use | Gray Cup",
  description:
    "Pick your grind size and learn how to brew it - step-by-step instructions with a quick visual guide for every method.",
};

export default function HowToUsePage() {
  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            How to Use
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-xl">
            Select the grind size you bought and follow the steps below to brew it right.
          </p>
        </div>

        <GrindGuideSection />
      </div>
    </div>
  );
}
