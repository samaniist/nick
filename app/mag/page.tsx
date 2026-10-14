import type { Metadata } from "next";
import MagExperience from "./mag-experience";

export const metadata: Metadata = {
  title: "MAG Rénovation — L’art de tout réinventer",
  description: "Rénovation intérieure et extérieure à Bordeaux. Découvrez une nouvelle vision de votre espace avec MAG Rénovation.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "/mag",
  },
};

export default function MagPage() {
  return <MagExperience />;
}
