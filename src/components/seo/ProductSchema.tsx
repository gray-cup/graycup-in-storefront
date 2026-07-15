import type { Product } from "@/data/products/types";

type ProductSchemaProps = {
  product: Product;
};

function mapAvailability(availability: string): string {
  const availabilityMap: Record<string, string> = {
    in_stock: "https://schema.org/InStock",
    out_of_stock: "https://schema.org/OutOfStock",
    preorder: "https://schema.org/PreOrder",
  };
  return availabilityMap[availability] || "https://schema.org/InStock";
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const baseUrl = "https://graycup.in";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.mpn || product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    image: imageUrl,
    url: productUrl,
    category: `${product.category}${product.categoryTwo ? ` > ${product.categoryTwo}` : ""}`,
    offers: {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: "INR",
      lowPrice: product.priceRange.min,
      highPrice: product.priceRange.max,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        priceCurrency: "INR",
        price: product.priceRange.min,
        unitCode: "KGM",
        unitText: product.priceRange.unit,
        eligibleQuantity: {
          "@type": "QuantitativeValue",
          minValue: product.minimumOrder.quantity,
          unitCode: "KGM",
          unitText: product.minimumOrder.unit,
        },
      },
      availability: mapAvailability(product.availability),
      eligibleCustomerType: "Business",
      seller: {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "Gray Cup Enterprises Private Limited",
      },
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 7,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Available Options",
        value: product.variants.map((v) => v.name).join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Source Locations",
        value: product.locations.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Packaging Options",
        value: product.packaging.join(", "),
      },
      {
        "@type": "PropertyValue",
        name: "Minimum Order Quantity",
        value: `${product.minimumOrder.quantity} ${product.minimumOrder.unit}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
