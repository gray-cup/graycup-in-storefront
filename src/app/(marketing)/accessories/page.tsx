import type { Metadata } from "next";
import { accessoryProducts } from "@/data/products";
import { ProductCard } from "@/components/products";

const baseUrl = "https://graycup.in";

export const metadata: Metadata = {
  title: "Accessories | Gray Cup",
  description:
    "Shop coffee and tea brewing accessories from Gray Cup - reusable cotton bags and more, made for everyday brewing.",
  openGraph: {
    title: "Accessories | Gray Cup",
    description:
      "Shop coffee and tea brewing accessories from Gray Cup - reusable cotton bags and more, made for everyday brewing.",
    url: `${baseUrl}/accessories`,
    siteName: "Gray Cup",
    type: "website",
    locale: "en_IN",
    images: [
      { url: `${baseUrl}/og/categories/accessories.png`, width: 1200, height: 630, alt: "Accessories by Gray Cup" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessories | Gray Cup",
    description:
      "Shop coffee and tea brewing accessories from Gray Cup - reusable cotton bags and more, made for everyday brewing.",
    images: [`${baseUrl}/og/categories/accessories.png`],
  },
  alternates: {
    canonical: `${baseUrl}/accessories`,
  },
};

export default function AccessoriesPage() {
  return (
    <div className="min-h-dvh py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="text-start mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Accessories
          </h1>
          <p className="text-md md:text-lg text-muted-foreground">
            Accessories You can Buy from Us
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {accessoryProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
        {accessoryProducts.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No accessories available right now.
          </p>
        )}
      </div>
    </div>
  );
}
