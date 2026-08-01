import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt = "Top 5 Black Coffees for Liver Health | Gray Cup Guides";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage("Top 5 Black Coffees for Liver Health");
}
