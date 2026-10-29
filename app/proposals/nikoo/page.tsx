import type { Metadata } from "next";
import Experience from "./experience";
import Connection from "./connection";
import Acquisition from "./acquisition";
import Roadmap from "./roadmap";
import Partnership from "./partnership";

export const metadata: Metadata = {
  title: "Nikoo — Nik Supports Proposal",
  description: "A starting point for the Nik Supports proposal, prepared by Nexlytic.",
  alternates: { canonical: "/proposals/nikoo" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Nikoo — Nik Supports Proposal",
    description: "Prepared for Nikoo by Nexlytic.",
    url: "/proposals/nikoo",
  },
};

export default function NikooProposalPage() { return <><Experience /><Connection /><Acquisition /><Roadmap /><Partnership /></>; }
