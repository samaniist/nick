import type { Metadata } from "next";

import {
  LegalPage,
  LegalSection,
  legalLinkClass,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von Nexlytic, Inhaber Ali Pouryaghma, München.",
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum | Nexlytic",
    description: "Anbieterkennzeichnung von Nexlytic.",
    url: "https://nexlytic.de/impressum",
    locale: "de_DE",
  },
};

const navItems = [
  { href: "#anbieter", label: "Anbieter" },
  { href: "#kontakt", label: "Kontakt" },
  { href: "#register", label: "Registerangaben" },
  { href: "#redaktion", label: "Inhaltlich verantwortlich" },
];

export default function ImpressumPage() {
  return (
    <LegalPage
      eyebrow="Rechtliche Angaben / 01"
      title="Impressum"
      intro="Anbieterkennzeichnung und Pflichtangaben für das digitale Angebot von Nexlytic."
      updated="22. September 2026"
      navItems={navItems}
      siblingHref="/datenschutz"
      siblingLabel="Datenschutz"
    >
      <LegalSection id="anbieter" index="01" title="Angaben gemäß § 5 DDG">
        <address className="not-italic">
          <strong className="font-semibold text-black">Nexlytic</strong>
          <br />
          Einzelunternehmen
          <br />
          Inhaber: Ali Pouryaghma
          <br />
          München, Deutschland
        </address>
        <p>
          Website: <span className="font-medium text-black">nexlytic.de</span>
        </p>
      </LegalSection>

      <LegalSection id="kontakt" index="02" title="Kontakt">
        <p>
          Telefon:{" "}
          <a className={legalLinkClass} href="tel:+4917670767725">
            +49 176 70767725
          </a>
          <br />
          E-Mail:{" "}
          <a className={legalLinkClass} href="mailto:hello@nexlytic.de">
            hello@nexlytic.de
          </a>
        </p>
      </LegalSection>

      <LegalSection id="register" index="03" title="Registerangaben">
        <p>Das Einzelunternehmen ist nicht im Handelsregister eingetragen.</p>
      </LegalSection>

      <LegalSection id="redaktion" index="04" title="Verantwortlich für redaktionelle Inhalte">
        <p>Verantwortlich gemäß § 18 Abs. 2 Medienstaatsvertrag (MStV):</p>
        <address className="not-italic">
          Ali Pouryaghma
          <br />
          München, Deutschland
        </address>
      </LegalSection>
    </LegalPage>
  );
}
