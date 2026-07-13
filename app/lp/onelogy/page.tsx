import type { Metadata } from "next";

import OnelogyLp from "@/components/onelogy/onelogy-lp";

export const metadata: Metadata = {
  title: { absolute: "Onélogy — Brighter Skin. One Tablet a Night." },
  description:
    "Alpha Arbutin 2% Megadose® — a brightening serum freeze-dried into a tablet. Just add water. Save 20% on your first order.",
  // paid-traffic landing page — keep it out of search engines
  robots: { index: false, follow: false },
};

export default function OnelogyLpPage() {
  return <OnelogyLp />;
}
