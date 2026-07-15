import { NextResponse } from "next/server";
import { products } from "@/data/products";
import type { Product } from "@/data/products/types";

export const revalidate = 3600;

// Exchange rate: 1 INR = ~16.5 KRW
const INR_TO_KRW = 16.5;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function convertToKRW(priceINR: number): number {
  // Convert and round to nearest 100 for nice pricing
  const krw = priceINR * INR_TO_KRW;
  return Math.round(krw / 100) * 100;
}

function generateProductItem(product: Product, baseUrl: string): string {
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${baseUrl}${product.image}`;

  const priceKRW = convertToKRW(product.priceRange.min);
  const variantsText =
    product.variants.length > 0 ? ` Available options: ${product.variants.map(v => v.name).join(", ")}.` : "";

  return `    <item>
      <g:id>${escapeXml(product.sku)}</g:id>
      <g:title>${escapeXml(product.name)} - ${product.category}</g:title>
      <g:description>${escapeXml(product.description + variantsText)}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:availability>${product.availability}</g:availability>
      <g:price>${priceKRW} KRW</g:price>
      <g:brand>${escapeXml(product.brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${product.googleProductCategory}</g:google_product_category>
      <g:product_type>${escapeXml(product.category)}${product.categoryTwo ? ` &gt; ${escapeXml(product.categoryTwo)}` : ""}</g:product_type>
      <g:mpn>${escapeXml(product.mpn || product.sku)}</g:mpn>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>KR</g:country>
        <g:service>International Freight</g:service>
        <g:price>0 KRW</g:price>
      </g:shipping>
    </item>`;
}

function generateFeed(products: Product[], baseUrl: string): string {
  const items = products.map((p) => generateProductItem(p, baseUrl)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Gray Cup - South Korea (KRW)</title>
    <link>${baseUrl}</link>
    <description>Tea and coffee products from India for South Korea</description>
${items}
  </channel>
</rss>`;
}

export async function GET() {
  const baseUrl = "https://graycup.in";
  const xml = generateFeed(products, baseUrl);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
