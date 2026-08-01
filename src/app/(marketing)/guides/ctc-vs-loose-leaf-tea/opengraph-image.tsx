import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt = "CTC vs Loose Leaf Tea: What's the Difference? | Gray Cup Guides";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage("CTC vs Loose Leaf Tea: What's the Difference?");
}
