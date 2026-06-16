import Link from "next/link";

export default function Footer() {
  const mainLinks = [
    { href: "/about", label: "About" },
    { href: "/track-order", label: "Track Your Order" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
    { href: "/distributor-franchise", label: "Distributor & Franchise" },
  ];

  const socialLinks = [
    { href: "https://x.com/TheGrayCup", label: "Twitter" },
    { href: "https://github.com/Gray-Cup", label: "GitHub" },
    { href: "https://discord.gg/gpRxmW63JW", label: "Discord" },
    { href: "https://instagram.com/thegraycup", label: "Instagram" },
  ];

  const resourceLinks = [
    { href: "https://graycup.com", label: "GrayCup" },
    { href: "https://graycup.org", label: "Company Site" },
    { href: "https://b2b.graycup.in/", label: "Buy Bulk" },
    { href: "https://bulkgreencoffee.com", label: "Bulk Green Coffee" },
    { href: "https://status.graycup.org/", label: "Status" },
    { href: "/sitemap.xml", label: "Sitemap" },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Top links */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:underline hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:underline hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Legal text (Apple-style) */}
        <div className="mt-6 text-xs leading-relaxed text-muted-foreground space-y-2">
          <p>
            Gray Cup Enterprises Private Limited is a company incorporated in
            India under the Companies Act, 2013. Corporate Identification Number
            (CIN):{" "}
            <span className="whitespace-nowrap">U47211DL2025PTC457808</span>.
          </p>

          <p>
            GST Registration Number:{" "}
            <span className="whitespace-nowrap">07AAMCG4985H1Z2</span>. Product
            availability, pricing, and specifications are subject to change
            without notice.
          </p>

          <p>
            Gray Cup Enterprises Private Limited is engaged in the sourcing,
            packaging, trading, and export of tea, coffee, and spices. Export of
            products is subject to applicable laws, customs regulations, and
            foreign trade policies. International shipments may be subject to
            duties and taxes imposed by destination authorities.
          </p>

          <p>
            Importer Exporter Code (IEC):{" "}
            <span className="whitespace-nowrap">AAMCG4985H</span>. Exports are
            carried out in accordance with the Foreign Trade Policy of India and
            applicable export regulations.
          </p>

          <p>
            Food Safety and Standards Authority of India (FSSAI) License:{" "}
            <span className="whitespace-nowrap">23326008000195</span>. All food
            products are handled, packaged, and supplied in compliance with
            FSSAI regulations and food safety standards.
          </p>

          <p>
            Product images and descriptions are for illustrative purposes only.
            Actual products may vary. Use of this website constitutes acceptance
            of our Terms of Use, Privacy Policy, and Sales & Shipping Policy.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Gray Cup Enterprises Pvt. Ltd. All
            rights reserved.
          </p>

          <nav className="flex items-center gap-x-6 text-sm">
            {resourceLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="hover:text-foreground hover:underline transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
