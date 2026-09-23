import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ContactCta from "@/components/contact-cta";
import Footer from "@/components/footer";
import GlobeBackground from "@/components/globe-background";
import ServiceCatalog from "@/components/service-catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Every Nexlytic service in one place — web design & development, SEO, performance marketing, lead generation, branding and e-commerce (Shopify, Amazon, WooCommerce, Shopware).",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | Nexlytic",
    description: "Web design, SEO, performance marketing, lead generation, branding and e-commerce.",
    url: "https://nexlytic.de/services",
  },
};

const navLink =
  "min-h-11 items-center whitespace-nowrap text-[15px] text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950";

/* Full service catalog (moved off the homepage, which now shows the six
   core services and links here). */
export default function ServicesPage() {
  return (
    <main className="bg-white font-sans">
      <header className="relative z-40 flex items-center justify-between gap-4 bg-white px-6 py-5 sm:px-10 sm:py-6 lg:px-14">
        <Link
          href="/"
          aria-label="Nexlytic home"
          className="w-fit shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
        >
          <Image src="/logo.png" alt="Nexlytic" width={652} height={325} priority className="h-9 w-auto brightness-0" />
        </Link>
        <nav aria-label="Primary navigation" className="flex items-center gap-3 sm:gap-7">
          <Link href="/" className={`${navLink} hidden sm:inline-flex`}>
            Home
          </Link>
          <Link href="/case-studies" className={`${navLink} hidden sm:inline-flex`}>
            Our Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-[3px] bg-zinc-950 px-5 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800 sm:min-h-0 sm:py-2.5"
          >
            Book Free Call
          </Link>
          <Link href="/contact" className={`${navLink} hidden sm:inline-flex`}>
            Contact
          </Link>
        </nav>
      </header>

      <ServiceCatalog headingAs="h1" />

      <div className="relative z-30 overflow-hidden bg-black">
        <GlobeBackground />
        <ContactCta />
        <Footer />
      </div>
    </main>
  );
}
