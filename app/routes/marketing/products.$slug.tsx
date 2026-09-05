import { Link, redirect, useLoaderData } from "react-router";
import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { getProductBySlug } from "@/data/products";
import { productPath, resolveProductSlug } from "@/lib/product-url";
import { caffeineLabel } from "@/lib/caffeine";
import {
  ProductConfigurator,
  SampleBuilder,
  ProductImageGallery,
  ProductHowToUseSection,
  ProductEducationSection,
  FlavourProfile,
  ProductSpecsTable,
  ReviewSection,
  GrindSizeProvider,
} from "@/components/products";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductSchema, BreadcrumbSchema } from "@/components/seo";
import { getD1Db } from "@/lib/db.d1";
import { cloudflareContext } from "@/lib/cloudflare-context";
import { graycupReviews } from "@/lib/schema.d1";
import type { Route } from "./+types/products.$slug";

const REVALIDATE_SECONDS = 3600;

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const slug = resolveProductSlug(params.slug);
  const product = getProductBySlug(slug);

  if (!product) {
    throw new Response(null, { status: 404 });
  }

  // Canonicalise: green coffee lives under /green-coffee/, everything else
  // under /products/, and renamed slugs 301 to their current path.
  // React Router's client-side single-fetch requests hit this loader at
  // "<path>.data", so strip that suffix before comparing - otherwise every
  // client-side navigation here 301s to itself forever.
  const desiredPath = productPath(product);
  const requestPath = new URL(request.url).pathname.replace(/\.data$/, "");
  if (requestPath !== desiredPath) {
    throw redirect(desiredPath, 301);
  }

  let ratingSummary: { average: number; count: number } | undefined;
  let reviews: {
    fullName: string;
    content: string;
    rating: number | null;
    createdAt: string;
  }[] = [];

  try {
    const d1 = getD1Db(context.get(cloudflareContext).env.DB);

    const [agg] = await d1
      .select({
        count: sql<number>`count(*)`,
        average: sql<number | null>`avg(${graycupReviews.rating})`,
      })
      .from(graycupReviews)
      .where(
        and(
          eq(graycupReviews.productSlug, slug),
          isNotNull(graycupReviews.rating),
        ),
      );

    if (agg && agg.count > 0) {
      ratingSummary = { average: agg.average ?? 0, count: agg.count };
    }

    reviews = await d1
      .select({
        fullName: graycupReviews.fullName,
        content: graycupReviews.content,
        rating: graycupReviews.rating,
        createdAt: graycupReviews.createdAt,
      })
      .from(graycupReviews)
      .where(eq(graycupReviews.productSlug, slug))
      .orderBy(desc(graycupReviews.createdAt))
      .limit(10);
  } catch {
    ratingSummary = undefined;
    reviews = [];
  }

  return { product, slug, ratingSummary, reviews };
}

export function headers() {
  return {
    "Cache-Control": `public, max-age=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
  };
}

export function meta({ loaderData }: { loaderData: Awaited<ReturnType<typeof loader>> }) {
  if (!loaderData) return [{ title: "Product Not Found" }];
  const { product, slug } = loaderData;

  const baseUrl = "https://graycup.in";
  const productUrl = `${baseUrl}${productPath(product)}`;
  const ogImageUrl = `${baseUrl}/og/products/${slug}.png`;

  const priceLabel = product.priceRange.unit
    ? `₹${product.priceRange.min}-₹${product.priceRange.max} ${product.priceRange.unit}`
    : `₹${product.priceRange.min}-₹${product.priceRange.max}`;
  const seoDescription = `Buy ${product.name} from Gray Cup. ${product.description} Price: ${priceLabel}.`;
  const title = `${product.name} by Gray Cup`;

  return [
    { title },
    { name: "description", content: seoDescription },
    { property: "og:title", content: title },
    { property: "og:description", content: seoDescription },
    { property: "og:url", content: productUrl },
    { property: "og:site_name", content: "Gray Cup" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "en_IN" },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: product.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: seoDescription },
    { name: "twitter:image", content: ogImageUrl },
  ];
}

export default function ProductPage() {
  const { product, slug, ratingSummary, reviews } = useLoaderData<typeof loader>();

  const breadcrumbs = [
    { name: "Home", url: "https://graycup.in" },
    { name: "Products", url: "https://graycup.in/products" },
    { name: product.name, url: `https://graycup.in${productPath(product)}` },
  ];

  return (
    <>
      <ProductSchema
        product={product}
        ratingSummary={ratingSummary}
        reviews={reviews}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <div className="px-4 lg:px-6">
      <div className="min-h-dvh py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-black transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>/</li>
              <li className="text-black font-medium">{product.name}</li>
            </ol>
          </nav>

          <GrindSizeProvider>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Image Gallery */}
              <ProductImageGallery
                images={product.images && product.images.length > 0 ? product.images : [product.image]}
                productName={product.name}
                priority
              />

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                {/* Product Header */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div>
                  <ProductSpecsTable specs={product.specs} />
                  {product.specsNote && (
                    <p className="text-sm text-gray-500 mt-2">{product.specsNote}</p>
                  )}
                </div>

                <FlavourProfile
                  process={product.process}
                  varietal={product.varietal}
                  flavourNotes={product.flavourNotes}
                  bitterness={product.bitterness}
                />

                {caffeineLabel(product) && (
                  <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm">
                    <span className="font-medium text-amber-900">
                      Caffeine: {caffeineLabel(product)}
                    </span>
                    <span className="ml-2 text-amber-800/70">
                      Estimate - Robusta has ~2x the caffeine of Arabica.
                    </span>
                  </div>
                )}

                {/* Add to Cart */}
                {product.slug === "pick-your-poison-sampler" ? (
                  <SampleBuilder product={product} />
                ) : (
                  <ProductConfigurator product={product} />
                )}

                {/* Accordions for Product Details */}
                <Accordion type="multiple" defaultValue={["description"]}>
                  <AccordionItem value="description">
                    <AccordionTrigger>Product Description</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {product.longDescription
                          ?.split(/(?<=[.!?])\s+(?=[A-Z])/)
                          .filter(Boolean)
                          .map((sentence, i) => (
                            <p key={i} className="text-gray-700 leading-relaxed">
                              {sentence}
                            </p>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {product.category !== "Accessories" && (
                    <>
                      <AccordionItem value="variants">
                        <AccordionTrigger>Available Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                              <Badge
                                key={variant.name}
                                variant="outline"
                                className="bg-white"
                              >
                                {variant.name}
                              </Badge>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="locations">
                        <AccordionTrigger>Source Locations</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2">
                            {product.locations.map((location) => (
                              <span
                                key={location}
                                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                              >
                                {location}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="packaging">
                        <AccordionTrigger>Packaging Options</AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-wrap gap-2">
                            {product.packaging.map((pack) => (
                              <span
                                key={pack}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                              >
                                {pack}
                              </span>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </>
                  )}
                </Accordion>
              </div>
            </div>

            <ProductEducationSection
              process={product.process}
              flavourNotes={product.flavourNotes}
            />

            {product.category === "Coffee" && !product.isSamplePack && <ProductHowToUseSection />}
          </GrindSizeProvider>

          <ReviewSection productSlug={slug} />
        </div>
      </div>
    </div>
    </>
  );
}
