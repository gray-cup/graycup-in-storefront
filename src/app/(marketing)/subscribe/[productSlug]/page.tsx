import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, getAllProductSlugs, products } from "@/data/products";
import { SubscriptionBuilder } from "@/components/products";

type SubscribePageProps = {
  params: Promise<{ productSlug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((productSlug) => ({ productSlug }));
}

export async function generateMetadata({
  params,
}: SubscribePageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) {
    return { title: "Subscription Not Found" };
  }

  return {
    title: `Subscribe to ${product.name} | Gray Cup`,
    description: `Set up a monthly subscription for ${product.name} and add more products to your recurring delivery.`,
  };
}

export default async function SubscribePage({ params }: SubscribePageProps) {
  const { productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product || product.comingSoon) {
    notFound();
  }

  const addonProducts = products.filter(
    (p) => p.slug !== product.slug && !p.comingSoon && p.availability === "in_stock",
  );

  return <SubscriptionBuilder product={product} addonProducts={addonProducts} />;
}
