type DefinedTermSchemaProps = {
  term: string;
  definition: string;
  url: string;
  inDefinedTermSetUrl: string;
};

export function DefinedTermSchema({
  term,
  definition,
  url,
  inDefinedTermSetUrl,
}: DefinedTermSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
    url,
    inDefinedTermSet: inDefinedTermSetUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
