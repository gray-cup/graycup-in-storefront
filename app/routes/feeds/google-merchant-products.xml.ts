import { products } from "@/data/products";
import type { Product } from "@/data/products/types";
import { buildFeedItems, escapeXml, isFeedEligible } from "@/lib/gmc-feed";

// Target country: India only. All prices are INR only - no other currency or country.
function generateShippingEntries(): string {
  return `<g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Freight</g:service>
        <g:price>0 INR</g:price>
      </g:shipping>`;
}

function generateProductItems(product: Product, baseUrl: string): string {
  return buildFeedItems(product, baseUrl)
    .map((item) => {
      const variantsText = ` Available options: ${product.variants.map((v) => v.name).join(", ")}.`;
      const identifierFields = item.gtin
        ? `<g:gtin>${escapeXml(item.gtin)}</g:gtin>`
        : `<g:identifier_exists>no</g:identifier_exists>`;

      return `<item>
      <g:id>${escapeXml(item.offerId)}</g:id>
      <g:item_group_id>${escapeXml(item.itemGroupId)}</g:item_group_id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description + variantsText)}</g:description>
      <g:link>${item.link}</g:link>
      <g:image_link>${item.imageLink}</g:image_link>
      ${item.additionalImageLinks.map((img) => `<g:additional_image_link>${img}</g:additional_image_link>`).join("\n      ")}
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price} INR</g:price>
      ${item.salePrice ? `<g:sale_price>${item.salePrice} INR</g:sale_price>` : ""}
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:condition>${item.condition}</g:condition>
      <g:google_product_category>${item.googleProductCategory}</g:google_product_category>
      <g:product_type>${escapeXml(item.productType)}</g:product_type>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      ${identifierFields}
      ${item.color ? `<g:color>${escapeXml(item.color)}</g:color>` : ""}
      ${item.material ? `<g:material>${escapeXml(item.material)}</g:material>` : ""}
      ${item.shippingWeight ? `<g:shipping_weight>${item.shippingWeight}</g:shipping_weight>` : ""}
      <g:unit_pricing_measure>1 kg</g:unit_pricing_measure>
      <g:unit_pricing_base_measure>1 kg</g:unit_pricing_base_measure>
      ${generateShippingEntries()}
      <g:custom_label_0>${escapeXml(product.category)}</g:custom_label_0>
      <g:custom_label_1>MOQ_${product.minimumOrder.quantity}${product.minimumOrder.unit}</g:custom_label_1>
      <g:custom_label_2>${escapeXml(product.variants[0]?.name || "Standard")}</g:custom_label_2>
      <g:custom_label_3>${escapeXml(product.variants.map((v) => v.name).join(", "))}</g:custom_label_3>
    </item>`;
    })
    .join("\n    ");
}

function generateProductFeed(products: Product[], baseUrl: string): string {
  const items = products.map((product) => generateProductItems(product, baseUrl));

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

export async function loader() {
  const baseUrl = "https://graycup.in";

  const xml = generateProductFeed(products.filter(isFeedEligible), baseUrl);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
