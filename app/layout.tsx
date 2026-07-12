import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nexlytic.de"),
  title: {
    default: "Nexlytic — Digital Growth Agency in Munich",
    template: "%s | Nexlytic",
  },
  description:
    "Your digital growth agency in Munich — web design, SEO and performance marketing built for measurable, long-term success.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://nexlytic.de",
    siteName: "Nexlytic",
    locale: "en_US",
    title: "Nexlytic — Digital Growth Agency in Munich",
    description:
      "Web design, SEO and performance marketing built for measurable, long-term success.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nexlytic — Web Design, SEO & Performance Marketing, Munich",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexlytic — Digital Growth Agency in Munich",
    description:
      "Web design, SEO and performance marketing built for measurable, long-term success.",
    images: ["/og.png"],
  },
};

/* Local-business schema for Munich local search. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nexlytic",
  description:
    "Digital growth agency — web design, SEO and performance marketing.",
  url: "https://nexlytic.de",
  logo: "https://nexlytic.de/logo.png",
  image: "https://nexlytic.de/og.png",
  email: "hello@nexlytic.de",
  telephone: "+49 176 70767725",
  address: {
    "@type": "PostalAddress",
    addressLocality: "München",
    postalCode: "81549",
    addressCountry: "DE",
  },
  areaServed: "EU",
  priceRange: "$$",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
