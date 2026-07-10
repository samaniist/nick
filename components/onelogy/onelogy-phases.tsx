"use client";

import { useLang } from "@/components/onelogy/lang";

/* Five roadmap phases as a scroll stack: each card pins below the top of
   the viewport and the next one scrolls up over it, landing slightly lower
   so the stacked edges stay visible. Pure CSS (position: sticky) — later
   siblings naturally paint above earlier ones. */

const T = {
  en: {
    phaseLabel: (n: number) => `Phase 0${n}`,
    deliverables: "Deliverables",
    phases: [
      {
        title: "Brand Foundation",
        text: "Building a premium digital experience that communicates the science, innovation and story behind Onélogy.",
        deliverables: [
          "Brand Storytelling",
          "Website UX Improvements",
          "Science & Technology Pages",
          "Sustainability Pages",
          "Educational Content Structure",
          "Landing Page Framework",
          "Shopify Integration",
          "Conversion-focused User Journey",
        ],
      },
      {
        title: "Organic Growth",
        text: "Creating sustainable organic visibility across Google and AI-powered search engines.",
        deliverables: [
          "Technical SEO",
          "On-page SEO",
          "GEO (AI Search Optimization)",
          "Content Strategy",
          "Educational Articles",
          "Keyword Research",
          "Internal Linking",
          "Structured Data",
          "Performance Monitoring",
        ],
      },
      {
        title: "Paid Acquisition",
        text: "Building scalable advertising systems that generate qualified traffic and measurable revenue.",
        deliverables: [
          "Google Ads",
          "Meta Ads",
          "Campaign Strategy",
          "Landing Pages",
          "Conversion Tracking",
          "Remarketing",
          "Creative Testing",
          "Campaign Optimization",
        ],
      },
      {
        title: "Marketplace Expansion",
        text: "Expanding Onélogy’s presence through Amazon with a scalable marketplace strategy.",
        deliverables: [
          "Marketplace Strategy",
          "Amazon Launch Support",
          "Listing Optimization",
          "Amazon SEO",
          "A+ Content",
          "Brand Store",
          "Product Images",
          "Amazon PPC",
          "Marketplace Optimization",
        ],
      },
      {
        title: "Brand Scaling & International Expansion",
        text: "Scaling the brand beyond its initial channels and building a long-term international growth engine.",
        deliverables: [
          "Social Media Strategy",
          "Content Planning",
          "UGC Strategy",
          "Influencer Collaborations",
          "Community Building",
          "Email Marketing Optimization",
          "Analytics & Reporting",
          "Expansion to Additional Amazon Marketplaces",
          "International SEO & Localization",
          "Continuous Growth Optimization",
        ],
      },
    ],
  },
  fr: {
    phaseLabel: (n: number) => `Phase 0${n}`,
    deliverables: "Livrables",
    phases: [
      {
        title: "Fondation de la marque",
        text: "Construire une expérience digitale premium qui communique la science, l’innovation et l’histoire derrière Onélogy.",
        deliverables: [
          "Storytelling de marque",
          "Améliorations UX du site",
          "Pages science & technologie",
          "Pages durabilité",
          "Structure de contenu éducatif",
          "Framework de landing pages",
          "Intégration Shopify",
          "Parcours utilisateur orienté conversion",
        ],
      },
      {
        title: "Croissance organique",
        text: "Créer une visibilité organique durable sur Google et les moteurs de recherche propulsés par l’IA.",
        deliverables: [
          "SEO technique",
          "SEO on-page",
          "GEO (optimisation pour la recherche IA)",
          "Stratégie de contenu",
          "Articles éducatifs",
          "Recherche de mots-clés",
          "Maillage interne",
          "Données structurées",
          "Suivi des performances",
        ],
      },
      {
        title: "Acquisition payante",
        text: "Construire des systèmes publicitaires scalables qui génèrent un trafic qualifié et des revenus mesurables.",
        deliverables: [
          "Google Ads",
          "Meta Ads",
          "Stratégie de campagne",
          "Landing pages",
          "Suivi des conversions",
          "Remarketing",
          "Tests créatifs",
          "Optimisation des campagnes",
        ],
      },
      {
        title: "Expansion marketplace",
        text: "Étendre la présence d’Onélogy via Amazon avec une stratégie marketplace scalable.",
        deliverables: [
          "Stratégie marketplace",
          "Accompagnement au lancement Amazon",
          "Optimisation des fiches produits",
          "SEO Amazon",
          "Contenu A+",
          "Boutique de marque",
          "Images produits",
          "PPC Amazon",
          "Optimisation marketplace",
        ],
      },
      {
        title: "Scaling de marque & expansion internationale",
        text: "Faire grandir la marque au-delà de ses canaux initiaux et construire un moteur de croissance internationale à long terme.",
        deliverables: [
          "Stratégie réseaux sociaux",
          "Planification de contenu",
          "Stratégie UGC",
          "Collaborations influenceurs",
          "Construction de communauté",
          "Optimisation de l’email marketing",
          "Analytics & reporting",
          "Expansion vers d’autres marketplaces Amazon",
          "SEO international & localisation",
          "Optimisation continue de la croissance",
        ],
      },
    ],
  },
};

export default function OnelogyPhases() {
  const lang = useLang();
  const t = T[lang];
  return (
    <section className="relative z-10 w-full bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 pb-32">
        {t.phases.map((p, i) => (
          <div
            key={i}
            className="sticky"
            style={{ top: `${72 + i * 28}px`, marginTop: i === 0 ? 0 : "18vh" }}
          >
            <article className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_36px_80px_rgba(0,0,0,0.18)] sm:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
                {t.phaseLabel(i + 1)}
              </p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.02em] sm:text-4xl">
                {p.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
                {p.text}
              </p>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                {t.deliverables}
              </p>
              <ul className="mt-4 gap-x-10 space-y-2.5 text-[15px] text-neutral-600 sm:columns-2 sm:text-base">
                {p.deliverables.map((d) => (
                  <li key={d} className="flex items-baseline gap-3 break-inside-avoid">
                    <span
                      className="h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-neutral-300"
                      aria-hidden
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
