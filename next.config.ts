import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    minimumCacheTTL: 604800,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "graycup.in",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/wholesale",
        destination: "/roasted-wholesale-coffee",
        permanent: true,
      },
      {
        source: "/wholesale/:state",
        destination: "/roasted-wholesale-coffee/:state",
        permanent: true,
      },
      {
        source: "/wholesale/:state/:city",
        destination: "/roasted-wholesale-coffee/:state/:city",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Fonts: 2 years
        source: "/:all*(ttf|otf|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=63072000, immutable",
          },
        ],
      },
      {
        // Images: 1 week
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
      {
        // Videos: 1 week (or you can set differently)
        source: "/:all*(mp4|webm|mov)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
      {
        // All other pages: 1 hour with stale-while-revalidate
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-highlight"],
  },
});

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
