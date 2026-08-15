import { Link, useLoaderData } from "react-router";
import { getProductBySlug } from "@/data/products";
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
import type { Route } from "./+types/products.$slug";

const REVALIDATE_SECONDS = 3600;

export async function loader({ params }: Route.LoaderArgs) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    throw new Response(null, { status: 404 });
  }

  return { product, slug: params.slug };
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
  const productUrl = `${baseUrl}/products/${slug}`;
  const ogImageUrl = `${baseUrl}/og/products/${slug}.png`;

  const priceLabel = product.priceRange.unit
    ? `₹${product.priceRange.min}-₹${product.priceRange.max} ${product.priceRange.unit}`
    : `₹${product.priceRange.min}-₹${product.priceRange.max}`;
  const seoDescription = `Buy ${product.name} from Gray Cup. ${product.description} Price: ${priceLabel}.`;
  const title = `${product.name} | Premium ${product.category} - Gray Cup`;

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
  const { product, slug } = useLoaderData<typeof loader>();

  const breadcrumbs = [
    { name: "Home", url: "https://graycup.in" },
    { name: "Products", url: "https://graycup.in/products" },
    { name: product.name, url: `https://graycup.in/products/${slug}` },
  ];

  return (
    <>
      <ProductSchema product={product} />
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
