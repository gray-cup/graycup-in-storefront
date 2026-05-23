"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart-button";
import { ChevronDown } from "lucide-react";

const dropdowns: Record<string, [string, string][]> = {
  Others: [
    ["Feedback", "/feedback"],
  ],
  Learn: [
    ["Guides", "/guides"],
  ],
};

function NavDropdown({ label, items }: { label: string; items: [string, string][] }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-0.5 rounded-md px-2 py-2 hover:bg-neutral-100 text-sm font-medium cursor-pointer">
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 mt-0.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-1 z-50">
          <div className="bg-white rounded-md shadow-lg border border-neutral-200 py-1 min-w-[160px]">
            {items.map(([itemLabel, href]) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 text-sm hover:bg-neutral-100"
              >
                {itemLabel}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Gray Cup"
                width={45}
                height={45}
                draggable={false}
              />
              <span className="text-xl font-semibold text-nowrap tracking-tight">
                Gray Cup
              </span>
            </Link>
            <p className="opacity-20">|</p>

            {/* Tablet-visible links */}
            <nav className="hidden md:flex gap-1 text-sm font-medium items-center">
              {[
                ["Products", "/products"],
                ["Accessories", "/accessories"],
                ["Wholesale", "/wholesale"],
                ["New Product Request", "/new-product-request"],
                ["About Us", "/about"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-2 py-2 hover:bg-neutral-100"
                >
                  {label}
                </Link>
              ))}

              {Object.entries(dropdowns).map(([label, items]) => (
                <NavDropdown key={label} label={label} items={items} />
              ))}
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <a
              href="https://fast.graycup.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Buy via Fast
            </a>
            <CartButton />
            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-md p-2 hover:bg-neutral-100 cursor-pointer"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect y="3" width="20" height="2" rx="1" />
                <rect y="9" width="20" height="2" rx="1" />
                <rect y="15" width="20" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer */}
        <aside
          className={`absolute right-0 top-0 h-full w-72 bg-white p-6 shadow-xl
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
        >
          <button
            className="mb-4 self-end rounded-md cursor-pointer p-2 hover:bg-neutral-100"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          {/* Buy via Fast — mobile */}
          <a
            href="https://fast.graycup.in"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Buy via Fast
          </a>

          {/* All links */}
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {[
              ["Products", "/products"],
              ["Accessories", "/accessories"],
              ["Wholesale", "/wholesale"],
              ["New Product Request", "/new-product-request"],
              ["Feedback", "/feedback"],
              ["About Us", "/about"],
              ["Guides", "/guides"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 hover:bg-neutral-100"
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}
