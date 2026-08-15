import { getProductBySlug, retailProducts } from "@/data/products";
import { SubscriptionBuilder } from "@/components/products";
import type { Route } from "./+types/subscribe.$productSlug";

export async function loader({ params }: Route.LoaderArgs) {
  const product = getProductBySlug(params.productSlug);

  if (!product || product.comingSoon) {
    throw new Response(null, { status: 404 });
  }

  return { product };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Subscription Not Found" }];
  const { product } = loaderData;
  return [
    { title: `Subscribe to ${product.name} | Gray Cup` },
    {
      name: "description",
      content: `Set up a monthly subscription for ${product.name} and add more products to your recurring delivery.`,
    },
  ];
}

export default function SubscribePage({ loaderData }: Route.ComponentProps) {
  const { product } = loaderData;

  const addonProducts = retailProducts.filter(
    (p) => p.slug !== product.slug && !p.comingSoon && p.availability === "in_stock",
  );

  return <SubscriptionBuilder product={product} addonProducts={addonProducts} />;
}
