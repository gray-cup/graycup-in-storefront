export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Privacy & Security
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
          Our Commitment to Privacy
        </h2>
        <p className="mb-4">
          Gray Cup Enterprises Private Limited (&ldquo;Gray Cup&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates graycup.in. This policy
          describes what personal information we collect from customers and
          website visitors, and how we use it.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Information We Collect
        </h2>
        <p className="mb-4">We collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Account Information:</strong> Your name, email, and
            authentication details when you create an account.
          </li>
          <li>
            <strong>Order Information:</strong> Shipping address, phone
            number, and order history when you place an order or subscribe
            to a product.
          </li>
          <li>
            <strong>Payment Information:</strong> Payments are processed by
            our payment partner, Cashfree. We do not store your card, UPI, or
            bank account details on our servers.
          </li>
          <li>
            <strong>Support Communications:</strong> Messages you send us via
            email, phone, or our in-app chat (Intercom), including for
            customer support and order-related enquiries.
          </li>
          <li>
            <strong>Usage &amp; Device Data:</strong> Information about how
            you use our website, such as pages visited and the device and
            browser you use, collected via analytics tooling.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Process and deliver your orders and subscriptions</li>
          <li>Communicate with you about your order, account, or enquiries</li>
          <li>Provide customer support</li>
          <li>Improve our website and product offering</li>
          <li>Detect and prevent fraud or abuse</li>
          <li>Comply with legal and tax obligations</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Data Security
        </h2>
        <p className="mb-4">
          We implement reasonable technical and organizational measures to
          protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. All traffic to our website
          is encrypted with SSL/TLS.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Data Retention
        </h2>
        <p className="mb-4">
          We retain your personal information only for as long as necessary
          to fulfill the purposes described in this policy, including any
          retention required to meet our legal, accounting, or tax
          obligations.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Third-Party Services
        </h2>
        <p className="mb-4">
          We share information with trusted third parties only as needed to
          run our business: our payment processor (Cashfree) to process
          payments, courier partners to deliver your order, our support
          chat provider (Intercom) to handle enquiries, and analytics
          providers to help us understand site usage. We do not sell your
          personal information.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Your Rights
        </h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to our processing of your information</li>
          <li>
            Request a copy of your information in a structured,
            machine-readable format
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page and
          updating the &ldquo;Last updated&rdquo; date.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or want to
          exercise any of your rights, contact us at{" "}
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
