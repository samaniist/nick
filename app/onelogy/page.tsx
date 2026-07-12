import type { Metadata } from "next";

import { LangToggle, OnelogyLangProvider } from "@/components/onelogy/lang";
import OnelogyHero from "@/components/onelogy/onelogy-hero";
import OnelogyClosing from "@/components/onelogy/onelogy-closing";
import OnelogyGrowth from "@/components/onelogy/onelogy-growth";
import OnelogyOutcome from "@/components/onelogy/onelogy-outcome";
import OnelogyPhases from "@/components/onelogy/onelogy-phases";
import OnelogyWhy from "@/components/onelogy/onelogy-why";
import OnelogyWhyWorks from "@/components/onelogy/onelogy-why-works";

export const metadata: Metadata = {
  title: { absolute: "Onélogy — Alpha Arbutin 2%" },
  description:
    "Onélogy water-activated skincare. Alpha Arbutin 2% brightening tablets — one tablet, dissolved fresh.",
  // private client pitch — keep it out of search engines
  robots: { index: false, follow: false },
};

export default function OnelogyPage() {
  return (
    <OnelogyLangProvider>
      <LangToggle />
      <OnelogyHero />
      <OnelogyGrowth />
      <OnelogyWhy />
      <OnelogyPhases />
      <OnelogyWhyWorks />
      <OnelogyOutcome />
      <OnelogyClosing />
    </OnelogyLangProvider>
  );
}
