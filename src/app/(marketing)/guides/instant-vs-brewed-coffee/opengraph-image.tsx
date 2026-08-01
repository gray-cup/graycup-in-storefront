import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt =
  "Instant Coffee vs Brewed Coffee: Which Is Right for You? | Gray Cup Guides";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage(
    "Instant Coffee vs Brewed Coffee: Which Is Right for You?",
  );
}
