import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Distributor & Franchise | Gray Cup",
  description:
    "Partner with Gray Cup Enterprises as a distributor or franchise partner. Expand your business with premium teas, coffees, and spices.",
};

export default function DistributorFranchisePage() {
  const benefits = [
    {
      title: "Exclusive Territory",
      description:
        "Get protected exclusivity in your region with no competing Gray Cup partners.",
    },
    {
      title: "Premium Products",
      description:
        "Access our full range of teas, coffees, and spices sourced directly from farms.",
    },
    {
      title: "Marketing Support",
      description:
        "We provide branding materials, digital assets, and co-marketing opportunities.",
    },
    {
      title: "Training & Onboarding",
      description:
        "Product knowledge sessions, sales training, and ongoing support from our team.",
    },
    {
      title: "Competitive Margins",
      description:
        "Attractive pricing structures with healthy margins for your business.",
    },
    {
      title: "FSSAI Compliant",
      description:
        "All products are fully compliant with FSSAI regulations — no compliance headaches.",
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-16">
          <h1 className="text-3xl md:text-4xl font-semibold text-black mb-3">
            Distributor & Franchise
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl">
            Partner with Gray Cup Enterprises and bring premium teas, coffees,
            and spices to your market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-black mb-2">
              Become a Distributor
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              For wholesalers, retailers, and businesses looking to carry Gray
              Cup products in their region. Ideal for supermarkets, specialty
              stores, restaurants, and HoReCa channels.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mb-6">
              <li>— Minimum order quantities apply</li>
              <li>— Pan-India distribution available</li>
              <li>— Bulk pricing and credit terms</li>
              <li>— Dedicated account manager</li>
            </ul>
            <a href="mailto:office@graycup.org">
              <Button variant="lightgraybg" size="minor">
                Apply as Distributor
              </Button>
            </a>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-black mb-2">
              Franchise Partner
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Open a Gray Cup branded outlet or café in your city. Leverage our
              brand, supply chain, and expertise to run a profitable specialty
              beverage business.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 mb-6">
              <li>— Kiosk and full café formats available</li>
              <li>— Complete setup and training support</li>
              <li>— Royalty-based model</li>
              <li>— Ongoing product & operational support</li>
            </ul>
            <a href="mailto:office@graycup.org">
              <Button variant="lightgraybg" size="minor">
                Apply for Franchise
              </Button>
            </a>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-medium text-neutral-800 mb-8">
            Why Partner With Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="space-y-1">
                <h3 className="text-sm font-semibold text-black">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="mb-12" />

        <div className="text-center">
          <h2 className="text-xl font-semibold text-black mb-3">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Reach out to us and our partnerships team will get back to you
            within 2 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:office@graycup.org">
              <Button>Email Us</Button>
            </a>
            <Link href="/contact">
              <Button variant="lightgraybg">Contact Page</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-6">
            Already a bulk buyer?{" "}
            <a
              href="https://b2b.graycup.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Visit our B2B portal →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
