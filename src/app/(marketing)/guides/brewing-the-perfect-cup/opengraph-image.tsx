import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt = "How to Brew the Perfect Cup of Tea | Gray Cup Guides";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage("How to Brew the Perfect Cup of Tea");
}
