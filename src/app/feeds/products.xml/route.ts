import { NextResponse } from "next/server";
import { products } from "@/data/products";
import type { Product } from "@/data/products/types";

export const revalidate = 3600;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function mapFeedAvailability(availability: string): string {
  const map: Record<string, string> = {
    in_stock: "in_stock",
    out_of_stock: "out_of_stock",
    preorder: "preorder",
  };
  return map[availability] || "in_stock";
}

// All target countries for Google Merchant Center
// Using INR consistently for all prices (Google handles currency conversion for display)
const TARGET_COUNTRIES = [
  "IN", // India (domestic)
  "US", "CA", "PA", // North America
  "AT", "BE", "FI", "FR", "DE", "GR", "IE", "IT", "NL", "PT", "SK", "ES", // Eurozone
  "CZ", "DK", "HU", "PL", "SE", "CH", "GB", // Non-Euro Europe
  "GE", "RU", // Eastern Europe
  "AE", "IL", "KW", "LB", "OM", "SA", // Middle East
  "AU", "HK", "JP", "KR", "MY", "PH", "SG", "TW", "TH", // Asia Pacific
];

function generateShippingEntries(): string {
  return TARGET_COUNTRIES.map(
    (code) => `<g:shipping>
        <g:country>${code}</g:country>
        <g:service>${code === "IN" ? "Standard Freight" : "International Freight"}</g:service>
        <g:price>0 INR</g:price>
      </g:shipping>`
  ).join("\n      ");
}

function generateProductItem(product: Product, baseUrl: string): string {
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  const variantsText = product.variants.length > 0 ? ` Available options: ${product.variants.map(v => v.name).join(", ")}.` : "";

  return `<item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(product.name)} - ${product.category}</g:title>
      <g:description>${escapeXml(product.description + variantsText)}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:availability>${mapFeedAvailability(product.availability)}</g:availability>
      <g:price>${product.priceRange.min} INR</g:price>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${product.googleProductCategory}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}${product.categoryTwo ? ` &gt; ${escapeXml(product.categoryTwo)}` : ""}</g:product_type>
      <g:mpn>${escapeXml(product.mpn || product.sku)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:unit_pricing_measure>1 kg</g:unit_pricing_measure>
      <g:unit_pricing_base_measure>1 kg</g:unit_pricing_base_measure>
      ${generateShippingEntries()}
      <g:custom_label_0>${escapeXml(product.category)}</g:custom_label_0>
      <g:custom_label_1>MOQ_${product.minimumOrder.quantity}${product.minimumOrder.unit}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(product.variants[0]?.name || "Standard")}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(product.variants.map(v => v.name).join(", "))}</g:custom_label_3>
    </item>`;
}

function generateProductFeed(products: Product[], baseUrl: string): string {
  const items = products.map((product) => generateProductItem(product, baseUrl));

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Gray Cup - Tea and Coffee</title>
    <link>${baseUrl}</link>
    <description>Tea and coffee products from India, sustainably sourced and ethically traded.</description>
    ${items.join("\n    ")}
  </channel>
</rss>`;
}

export async function GET() {
  const baseUrl = "https://graycup.in";

  const xml = generateProductFeed(products, baseUrl);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
