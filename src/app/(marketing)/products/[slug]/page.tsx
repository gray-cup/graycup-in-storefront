import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getProductBySlug, getAllProductSlugs } from "@/data/products";
import { ProductConfigurator, ProductImageSlideshow, ReviewSection } from "@/components/products";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ProductSchema, BreadcrumbSchema } from "@/components/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const baseUrl = "https://graycup.in";
  const productUrl = `${baseUrl}/products/${slug}`;

  const seoDescription = `Buy ${product.name} from Gray Cup. ${product.description} Price: ₹${product.priceRange.min}-₹${product.priceRange.max} ${product.priceRange.unit}.`;

  return {
    title: `${product.name} | Premium ${product.category} - Gray Cup`,
    description: seoDescription,
    openGraph: {
      title: `${product.name} | Premium ${product.category} - Gray Cup`,
      description: seoDescription,
      url: productUrl,
      siteName: "Gray Cup",
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Premium ${product.category} - Gray Cup`,
      description: seoDescription,
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

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
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-black transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>/</li>
              <li className="text-black font-medium">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image */}
            <div>
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 sticky top-24">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  draggable={false}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-black mb-2">
                  {product.name}
                </h1>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Add to Cart */}
              <ProductConfigurator product={product} />

              {/* Accordions for Product Details */}
              <Accordion type="multiple" defaultValue={["description"]}>
                <AccordionItem value="description">
                  <AccordionTrigger>Product Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 leading-relaxed">
                      {product.longDescription}
                    </p>
                  </AccordionContent>
                </AccordionItem>

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
              </Accordion>
            </div>
          </div>

          {/* Image Slideshow */}
          {product.images && product.images.length > 0 && (
            <ProductImageSlideshow
              images={product.images}
              productName={product.name}
            />
          )}

          <ReviewSection productSlug={slug} />
        </div>
      </div>
    </div>
    </>
  );
}
