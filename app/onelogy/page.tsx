import type { Metadata } from "next";

import OnelogyHero from "@/components/onelogy/onelogy-hero";
import OnelogyClosing from "@/components/onelogy/onelogy-closing";
import OnelogyGrowth from "@/components/onelogy/onelogy-growth";
import OnelogyOutcome from "@/components/onelogy/onelogy-outcome";
import OnelogyPhases from "@/components/onelogy/onelogy-phases";
import OnelogyWhy from "@/components/onelogy/onelogy-why";
import OnelogyWhyWorks from "@/components/onelogy/onelogy-why-works";

export const metadata: Metadata = {
  title: "Onélogy — Alpha Arbutin 2%",
  description:
    "Onélogy water-activated skincare. Alpha Arbutin 2% brightening tablets — one tablet, dissolved fresh.",
};

export default function OnelogyPage() {
  return (
    <>
      <OnelogyHero />
      <OnelogyGrowth />
      <OnelogyWhy />
      <OnelogyPhases />
      <OnelogyWhyWorks />
      <OnelogyOutcome />
      <OnelogyClosing />
    </>
  );
}
