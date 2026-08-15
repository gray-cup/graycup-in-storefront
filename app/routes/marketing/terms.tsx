export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Terms of Service
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
          1. Introduction
        </h2>
        <p className="mb-4">
          Gray Cup Enterprises Private Limited (&ldquo;Gray Cup&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates graycup.in, an online
          store for tea, coffee, and related products. By placing an order or
          otherwise using this website, you agree to these Terms of Service.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          2. Company Information
        </h2>
        <p className="mb-4">
          Gray Cup Enterprises Private Limited is a company incorporated in
          India under the Companies Act, 2013 (CIN: U47211DL2025PTC457808,
          GST: 07AAMCG4985H1Z2, IEC: AAMCG4985H, FSSAI License:
          23326008000195). We are engaged in the sourcing, packaging, and
          trading of tea, coffee, and spices.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          3. Orders &amp; Payment
        </h2>
        <p className="mb-4">
          Placing an order is an offer to buy the selected products at the
          price shown at checkout. Payments are processed securely through
          our payment partner, Cashfree; we do not store your card or bank
          details. We reserve the right to cancel or refuse any order,
          including for suspected fraud, pricing errors, or stock
          unavailability, in which case any payment already made will be
          refunded.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          4. Shipping
        </h2>
        <p className="mb-4">
          Shipping charges, estimated delivery timelines, and serviceable
          locations are shown at checkout before you pay. Delivery times are
          estimates and may vary due to courier delays or circumstances
          outside our control.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          5. Returns &amp; Refunds
        </h2>
        <p className="mb-4">
          Our return and refund terms are set out in our{" "}
          <a href="/return-policy" className="text-blue-700 underline">
            Return &amp; Refund Policy
          </a>
          , which forms part of these Terms of Service.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          6. Accounts
        </h2>
        <p className="mb-4">
          Some features, such as order tracking and subscriptions, require an
          account. You are responsible for keeping your login credentials
          confidential and for all activity under your account.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          7. Product Information
        </h2>
        <p className="mb-4">
          We try to keep product descriptions, images, pricing, and
          availability accurate and up to date, but errors can occur.
          Product images and descriptions are for illustrative purposes;
          actual products may vary slightly (for example, due to seasonal
          harvest or batch differences typical of agricultural products).
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          8. Prohibited Uses
        </h2>
        <p className="mb-4">
          You agree not to misuse this website, including by attempting
          unauthorized access to our systems, interfering with other users&apos;
          access, or using the site for any unlawful purpose.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          9. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the extent permitted by law, Gray Cup is not liable for indirect
          or consequential losses arising from your use of this website or
          our products, beyond the value of the relevant order.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          10. Changes to These Terms
        </h2>
        <p className="mb-4">
          We may update these Terms of Service from time to time. Changes
          take effect once posted on this page.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          11. Governing Law
        </h2>
        <p className="mb-4">
          These terms are governed by the laws of India, and disputes are
          subject to the jurisdiction of the courts of Delhi, India.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          12. Contact Us
        </h2>
        <p className="mb-4">
          Questions about these Terms of Service can be sent to{" "}
          <a
            href="mailto:office@graycup.org"
            className="text-blue-700 underline"
          >
            office@graycup.org
          </a>{" "}
          or by phone at +91 8527914317.
        </p>
      </div>
    </div>
  );
}
