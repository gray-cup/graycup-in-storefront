export default function ReturnPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Return & Refund Policy
      </h1>

      <div className="prose prose-neutral">
        <p className="text-muted-foreground mb-6">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          General Policy
        </h2>
        <p className="mb-4">
          Gray Cup sells perishable food products (tea, coffee, and related
          goods), so we do not accept general change-of-mind returns. We do
          not offer returns or refunds simply because you no longer want an
          item you ordered.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          When a Refund Is Available
        </h2>
        <p className="mb-4">
          We will issue a refund or replacement if your order arrives
          damaged, spoiled, defective, or otherwise not fit for consumption,
          or if there was an error on our part in fulfilling your order.
          Contact us within a reasonable time of delivery with your order
          number and a description (and photos, where relevant) of the
          issue, and we will review your claim.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          How Refunds Are Issued
        </h2>
        <p className="mb-4">
          Approved refunds are issued to your original payment method through
          our payment processor. Once approved, refunds may take up to 7-10
          business days to reflect, depending on your bank or payment
          provider.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Repeated Refund Claims
        </h2>
        <p className="mb-4">
          Refund claims are reviewed individually and in good faith. However,
          if a customer repeatedly reports issues with orders that do not
          reflect a verifiable product or service problem, we reserve the
          right to decline further refund requests and, after three such
          claims, to stop accepting future orders from that customer.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          How to Request a Refund
        </h2>
        <p className="mb-4">
          Email your order number and the issue with your order to{" "}
          <a
            href="mailto:office@graycup.org"
            className="text-blue-700 underline"
          >
            office@graycup.org
          </a>
          . We will get back to you with next steps.
        </p>
      </div>
    </div>
  );
}
