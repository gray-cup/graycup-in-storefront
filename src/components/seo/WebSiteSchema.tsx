export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://graycup.in/#website",
    name: "Gray Cup",
    url: "https://graycup.in",
    publisher: {
      "@id": "https://graycup.in/#organization",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
