import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Sites | GrayCup",
  description:
    "Explore the informational websites owned and operated by GrayCup, focused on bulk chai, CTC tea education, loose-leaf tea knowledge, and green coffee.",
};

export default function SitesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Our Sites</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          GrayCup operates a group of informational websites focused on
          different aspects of tea and coffee — from bulk chai usage to CTC
          grading, loose-leaf tea education, and green coffee sourcing. All
          sites listed below are owned and operated by GrayCup.
        </p>
      </header>

      {/* Cards Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        {/* GrayCup.com Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">GrayCup</h2>
          <p className="mt-3 text-gray-600">
            The main GrayCup website — products, sourcing, exports, and
            everything we do with tea, coffee, and spices.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Tea, coffee, and spice products</li>
            <li>Bulk sourcing and B2B enquiries</li>
            <li>Export and trade information</li>
          </ul>

          <Link
            href="https://graycup.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop at GrayCup →
          </Link>
        </div>

        {/* GrayCup.org Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">GrayCup.org</h2>
          <p className="mt-3 text-gray-600">
            Company information website for Gray Cup Enterprises, covering
            registration details, leadership, and corporate disclosures.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Corporate registration and CIN</li>
            <li>Leadership and company structure</li>
            <li>Compliance and disclosure</li>
          </ul>

          <Link
            href="https://graycup.org"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Gray Cup →
          </Link>
        </div>

        {/* BulkGreenCoffee Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">
            Bulk Green Coffee
          </h2>
          <p className="mt-3 text-gray-600">
            Informational resource on sourcing and buying green coffee in bulk,
            covering grades, processing methods, and supply chain basics for
            roasters and traders.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Green coffee grades and processing</li>
            <li>Bulk sourcing for roasters</li>
            <li>Supply chain and origin info</li>
          </ul>

          <Link
            href="https://bulkgreencoffee.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Bulk Green Coffee →
          </Link>
        </div>

        {/* BulkChai Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">BulkChai</h2>
          <p className="mt-3 text-gray-600">
            BulkChai is an informational platform focused on bulk chai usage and
            how chai is consumed at scale across cafés, offices, canteens, and
            retail environments.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Chai consumption at business scale</li>
            <li>Operational considerations for bulk brewing</li>
            <li>Common questions from bulk chai buyers</li>
          </ul>

          <Link
            href="https://bulkchai.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Bulk Chai →
          </Link>
        </div>

        {/* BulkCTC Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">BulkCTC</h2>
          <p className="mt-3 text-gray-600">
            BulkCTC is dedicated to explaining CTC (Crush, Tear, Curl) tea —
            including grades, particle size, colour output, and consistency in
            bulk chai preparation.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>CTC tea grades and classification</li>
            <li>Dust vs fannings vs leaf behaviour</li>
            <li>Consistency and colour in bulk chai</li>
          </ul>

          <Link
            href="https://bulkctc.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy Bulk CTC Tea →
          </Link>
        </div>

        {/* PureCha Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">PureCha</h2>
          <p className="mt-3 text-gray-600">
            PureCha focuses on loose-leaf and orthodox tea education, helping
            readers understand tea purity, processing methods, and leaf quality.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Loose-leaf and orthodox tea basics</li>
            <li>Processing methods and flavour impact</li>
            <li>Understanding tea beyond blends</li>
          </ul>

          <Link
            href="https://purecha.in"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore PureCha →
          </Link>
        </div>

        {/* OdishaCoffee Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Odisha Coffee</h2>
          <p className="mt-3 text-gray-600">
            Dedicated to coffee grown in Odisha — origin stories, farm profiles,
            and the region's emerging specialty coffee scene.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Origin stories and farm profiles</li>
            <li>Odisha's specialty coffee varieties</li>
            <li>Direct sourcing information</li>
          </ul>

          <Link
            href="https://odishacoffee.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore Odisha Coffee →
          </Link>
        </div>

        {/* GrayBulk Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">GrayBulk</h2>
          <p className="mt-3 text-gray-600">
            A marketplace to buy machines and commodities in bulk directly from
            manufacturers and wholesalers — for businesses sourcing at scale.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Machinery and equipment from manufacturers</li>
            <li>Bulk commodity sourcing</li>
            <li>Direct wholesale pricing</li>
          </ul>

          <Link
            href="https://graybulk.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy in Bulk at GrayBulk →
          </Link>
        </div>
      </section>

      {/* Ownership Note */}
      <section className="mt-16 max-w-3xl">
        <h3 className="text-xl font-semibold text-gray-900">
          Ownership & Transparency
        </h3>
        <p className="mt-3 text-gray-600">
          All websites listed on this page are owned and operated by GrayCup.
          Each platform serves a specific informational purpose while following
          the same standards of accuracy, clarity, and transparency.
        </p>
      </section>
    </main>
  );
}
