"use client";

import { useLang } from "@/components/onelogy/lang";
import { useInView } from "@/components/viz-hooks";

/* "Why This Strategy?" — scrolls up over the pinned growth section
   (onelogy-growth.tsx fades itself out as this one covers it). Inner
   blocks rise in as they reach the viewport. */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const T = {
  en: {
    heading: "Why This Strategy?",
    intro: [
      "Onélogy already has something that most beauty brands don’t.",
      "You have an innovative product.",
      "The next challenge is making sure the world understands why it’s different.",
      "The objective isn’t simply to redesign a website or launch advertisements.",
      "The objective is to build a digital ecosystem that consistently attracts, educates and converts customers across multiple acquisition channels.",
    ],
    oppKicker: "Current Growth Opportunities",
    oppHeading: "Current Growth Opportunities",
    oppIntro:
      "Based on my initial review, I identified several opportunities that could significantly improve Onélogy’s long-term digital growth.",
    opportunities: [
      {
        title: "Organic Visibility",
        text: "Organic search visibility can be significantly expanded through a structured SEO and GEO strategy.",
      },
      {
        title: "Brand Storytelling",
        text: "The current experience is primarily transactional and doesn’t fully communicate the innovation behind Onélogy’s technology.",
      },
      {
        title: "Paid Acquisition",
        text: "Dedicated campaign funnels and landing pages can improve advertising performance and conversion rates.",
      },
      {
        title: "Marketplace Presence",
        text: "Amazon represents an additional revenue channel that has not yet been fully utilized.",
      },
      {
        title: "Social Presence",
        text: "Building stronger brand awareness through educational and community-driven content.",
      },
    ],
    visionKicker: "Vision",
    visionHeading: "The Vision",
    visionText:
      "Transform Onélogy from an online store into a premium digital skincare brand with multiple acquisition channels and a scalable international growth system.",
  },
  fr: {
    heading: "Pourquoi cette stratégie ?",
    intro: [
      "Onélogy possède déjà ce que la plupart des marques de beauté n’ont pas.",
      "Vous avez un produit innovant.",
      "Le prochain défi est de faire comprendre au monde pourquoi il est différent.",
      "L’objectif n’est pas simplement de refondre un site web ou de lancer des publicités.",
      "L’objectif est de construire un écosystème digital qui attire, éduque et convertit les clients de manière constante, à travers plusieurs canaux d’acquisition.",
    ],
    oppKicker: "Opportunités de croissance actuelles",
    oppHeading: "Opportunités de croissance actuelles",
    oppIntro:
      "Suite à ma première analyse, j’ai identifié plusieurs opportunités qui pourraient améliorer significativement la croissance digitale d’Onélogy à long terme.",
    opportunities: [
      {
        title: "Visibilité organique",
        text: "La visibilité en recherche organique peut être considérablement étendue grâce à une stratégie SEO et GEO structurée.",
      },
      {
        title: "Storytelling de marque",
        text: "L’expérience actuelle est principalement transactionnelle et ne communique pas pleinement l’innovation derrière la technologie d’Onélogy.",
      },
      {
        title: "Acquisition payante",
        text: "Des tunnels de campagne et des landing pages dédiés peuvent améliorer la performance publicitaire et les taux de conversion.",
      },
      {
        title: "Présence marketplace",
        text: "Amazon représente un canal de revenus supplémentaire qui n’a pas encore été pleinement exploité.",
      },
      {
        title: "Présence sociale",
        text: "Renforcer la notoriété de la marque grâce à un contenu éducatif et communautaire.",
      },
    ],
    visionKicker: "Vision",
    visionHeading: "La vision",
    visionText:
      "Transformer Onélogy d’une boutique en ligne en une marque de skincare digitale premium, avec plusieurs canaux d’acquisition et un système de croissance internationale scalable.",
  },
};

export default function OnelogyWhy() {
  const lang = useLang();
  const t = T[lang];
  return (
    <section
      id="why-strategy"
      className="relative z-10 w-full bg-white text-neutral-900"
    >
      <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.02em] sm:text-5xl">
            {t.heading}
          </h2>
        </Reveal>
        <Reveal delay={150} className="mt-8 space-y-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
          {t.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </Reveal>

        <hr className="my-16 border-neutral-200" />

        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            {t.oppKicker}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            {t.oppHeading}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.oppIntro}
          </p>
        </Reveal>

        <div className="mt-6 divide-y divide-neutral-200">
          {t.opportunities.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <div className="group py-8">
                <h4 className="flex items-center gap-0 text-xl font-bold tracking-[-0.01em] transition-all duration-300 group-hover:gap-3 sm:text-2xl">
                  <span
                    className="h-2 w-0 rounded-full bg-violet-500 transition-all duration-300 group-hover:w-2"
                    aria-hidden
                  />
                  {o.title}
                </h4>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {o.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <hr className="my-16 border-neutral-200" />

        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            {t.visionKicker}
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            {t.visionHeading}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.visionText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
