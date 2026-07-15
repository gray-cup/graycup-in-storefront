export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://graycup.in/#organization",
    name: "Gray Cup Enterprises Private Limited",
    alternateName: "Gray Cup",
    url: "https://graycup.in",
    logo: {
      "@type": "ImageObject",
      url: "https://graycup.in/logo.png",
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://x.com/TheGrayCup",
      "https://github.com/Gray-Cup",
      "https://instagram.com/thegraycup",
      "https://www.indiamart.com/gray-cup-enterprises/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "bulk@graycup.org",
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    legalName: "Gray Cup Enterprises Private Limited",
    additionalType: "http://schema.org/LocalBusiness",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "FSSAI",
      description: "Food Safety and Standards Authority of India Certification",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
