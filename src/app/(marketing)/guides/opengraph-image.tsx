import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt = "Guides | Gray Cup";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage("Guides");
}
