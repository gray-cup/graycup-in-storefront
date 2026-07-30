type DefinedTermSetSchemaProps = {
  name: string;
  description: string;
  url: string;
  terms: { name: string; description: string; url: string }[];
};

export function DefinedTermSetSchema({
  name,
  description,
  url,
  terms,
}: DefinedTermSetSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name,
    description,
    url,
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.description,
      url: term.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
