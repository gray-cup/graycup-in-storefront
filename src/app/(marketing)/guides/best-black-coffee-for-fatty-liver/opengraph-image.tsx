import { guideOgImageSize, renderGuideOgImage } from "@/lib/guide-og-image";

export const alt = "Best Black Coffee Brand for Fatty Liver | Gray Cup Guides";
export const size = guideOgImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderGuideOgImage("Best Black Coffee Brand for Fatty Liver");
}
