"use client";

import Image from "next/image";

import { useCountUp, useInView } from "@/components/viz-hooks";

/* Meta/Instagram ad landing for Onélogy Alpha Arbutin 2%, styled after
   onelogy.com: near-black canvas, dark rounded panels, silver-gradient
   product tiles, colored ingredient chips, white pill CTAs, big grotesque
   headlines ending in a period. Swap BUY_URL for the real product /
   checkout link (keep the UTMs). */

const BUY_URL =
  "https://onelogy.com/?utm_source=instagram&utm_medium=paid&utm_campaign=alpha-arbutin-lp";

const STARS = "★★★★★";

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

function CtaButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={BUY_URL}
      className={`inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-[15px] font-semibold text-black transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] ${className}`}
    >
      {children}
    </a>
  );
}

/* light silver tile, like onelogy.com's product cards */
const TILE_BG = {
  background:
    "radial-gradient(130% 130% at 30% 12%, #ffffff 0%, #dededb 55%, #b9b9b6 100%)",
};

const STATS = [
  { n: 60, suffix: "x", label: "more concentrated", note: "up to" },
  { n: 7, suffix: "x", label: "more shelf stable", note: "up to" },
  { n: 4, suffix: "x", label: "less waste", note: "more than" },
  { n: 100, suffix: "%", label: "potent", note: "always" },
];

function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const values = [
    useCountUp(60, inView, 1200),
    useCountUp(7, inView, 1200),
    useCountUp(4, inView, 1200),
    useCountUp(100, inView, 1200),
  ];
  return (
    <div ref={ref} className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
      {STATS.map((s, i) => (
        <div key={s.label}>
          <p className="text-xs text-zinc-500">{s.note}</p>
          <p className="mt-1 text-5xl font-semibold tracking-tight text-white tabular-nums sm:text-6xl">
            {values[i]}
            {s.suffix}
          </p>
          <p className="mt-2 text-sm text-zinc-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

const TICKER = [
  "Water-activated",
  "Freeze-dried at peak potency",
  "No preservatives",
  "TSA-friendly",
  "32 tablets · 32 doses",
  "Made in France",
];

const STEPS = [
  {
    n: "01",
    title: "Drop",
    text: "Drop one tablet into a splash of water.",
  },
  {
    n: "02",
    title: "Dissolve",
    text: "It dissolves in seconds into a fresh serum.",
  },
  {
    n: "03",
    title: "Apply",
    text: "Apply nightly. Brighter, more even skin in weeks.",
  },
];

const REVIEWS = [
  {
    title: "One of my favs",
    text: "This is so innovative! Never seen anything like that before. I travel a lot and I can take it anywhere with me! The packaging is so cute.",
    name: "Brittany A.",
    about: "Alpha Arbutin 2%",
  },
  {
    title: "Truly more effective than others.",
    text: "I had not used any serums before this one. Now I have. And I am sold on Onelogy. I noticed a big difference — no comparison with the typical dropper serum, who knows how old on the shelf.",
    name: "Mary F.",
    about: "Megadose® serums",
  },
  {
    title: "The only one I can tolerate!",
    text: "I have tried SEVERAL products and this is the *only* one that I can use nightly without any irritation. It significantly reduced my hyperpigmentation and sun spots.",
    name: "Katie",
    about: "Megadose® serums",
  },
];

const FAQS = [
  {
    q: "What is freeze-drying technology?",
    a: "Active ingredients are freeze-dried into a tablet at peak potency — no water, no preservatives. The serum comes to life the moment you dissolve it.",
  },
  {
    q: "What makes Megadose® better than traditional skincare?",
    a: "Bottled serums can lose up to 50% of their efficacy within 60 days of opening. A Megadose® tablet is activated fresh, so every single dose is applied at full strength.",
  },
  {
    q: "What type of water should I use?",
    a: "Regular tap or bottled water at room temperature is all you need.",
  },
  {
    q: "Can I dissolve it in something else?",
    a: "Yes — you can also drop it into your favorite toner or essence.",
  },
  {
    q: "How long does one pack last?",
    a: "Each pack holds 32 tablets — one fresh dose a night for a full month.",
  },
];

export default function OnelogyLp() {
  return (
    <main className="min-h-svh bg-[#0b0b0b] font-sans text-white">
      {/* announcement bar */}
      <p className="bg-[#2563eb] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-[13px]">
        Limited launch offer — save 20% on your first order · Free shipping on
        orders $50+
      </p>

      {/* sticky header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0b]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
          <span className="text-lg font-bold tracking-tight">
            ONÉLOGY<span className="align-super text-[9px]">®</span>
          </span>
          <a
            href={BUY_URL}
            className="rounded-full bg-white px-5 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
          >
            Shop now
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:pb-24 lg:pt-20">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-medium text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              Water-activated skincare
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-5 text-[42px] font-semibold leading-[1.04] tracking-[-0.02em] sm:text-6xl">
              Brighter skin.
              <br />
              One tablet
              <br />a night.
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
              Alpha Arbutin 2% Megadose® — a brightening serum, freeze-dried
              into a tablet. Just add water. Fades dark spots, evens tone,
              full potency in every dose.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="tracking-tight text-teal-400">{STARS}</span>
              <span className="font-medium text-white">4.8</span>
              <span className="text-zinc-500">· 2,300+ reviews</span>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <CtaButton>Get 20% off — Shop now</CtaButton>
              <span className="text-xs leading-relaxed text-zinc-500">
                Free shipping $50+
                <br />
                30-day money-back guarantee
              </span>
            </div>
          </Reveal>
        </div>

        {/* product tile */}
        <Reveal delay={150}>
          <div className="relative">
            <div
              className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px]"
              style={TILE_BG}
            >
              <div className="viz-float w-[72%]">
                <Image
                  src="/onelogy-product.webp"
                  alt="Onélogy Alpha Arbutin 2% — water-activated brightening tablet in its blister"
                  width={416}
                  height={400}
                  priority
                  className="h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.35)]"
                />
              </div>
              <span className="absolute left-4 top-4 rounded-full bg-[#2563eb] px-3 py-1 text-xs font-semibold text-white">
                Save 20%
              </span>
              <span className="absolute bottom-4 left-4 rounded-full bg-teal-300 px-3 py-1 text-xs font-bold uppercase tracking-wide text-teal-950">
                Alpha Arbutin 2%
              </span>
              <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur">
                32 tablets
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ticker */}
      <div className="overflow-hidden border-y border-white/10 bg-[#111] py-3.5">
        <div className="gp-marquee flex w-max items-center" style={{ animationDuration: "30s" }}>
          {[0, 1].map((half) => (
            <div key={half} className="flex items-center" aria-hidden={half === 1}>
              {TICKER.map((t) => (
                <span key={t} className="flex items-center whitespace-nowrap px-5 text-sm text-zinc-400">
                  {t}
                  <span className="ml-10 h-1 w-1 rounded-full bg-teal-400" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* stats — "pure power" */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <Reveal>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
            Not your typical serum.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Most bottled skincare loses up to 50% efficacy in just 60 days.
            Onélogy tablets are freeze-dried at peak potency and activated the
            moment you use them.
          </p>
        </Reveal>
        <Reveal delay={150} className="mt-12">
          <Stats />
        </Reveal>
      </section>

      {/* how it works */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:pb-24">
        <div className="rounded-[28px] bg-[#161616] p-6 sm:p-10">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
              Just add water.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-sm font-semibold text-teal-400 tabular-nums">
                    {s.n}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {s.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ingredient block */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-2 lg:gap-14 lg:pb-24">
        <Reveal className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[28px]">
            <Image
              src="/onelogy-retinoid.webp"
              alt="Onélogy Megadose box with tablets"
              width={800}
              height={1067}
              className="h-auto w-full"
            />
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-block rounded-full bg-teal-300 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-teal-950">
              The ingredient
            </span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
              Alpha Arbutin.
              <br />
              The gentle brightener.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <ul className="mt-7 space-y-4">
              {[
                "Visibly fades dark spots and post-acne marks",
                "Evens skin tone without irritation",
                "Gentle enough for nightly use — all skin types",
                "2% concentration, delivered at full potency",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-zinc-300 sm:text-base">
                  <span className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-400/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={250}>
            <CtaButton className="mt-8">Try it — 20% off</CtaButton>
          </Reveal>
        </div>
      </section>

      {/* reviews */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 lg:pb-24">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
            Fan favorites, for a reason.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 120}>
              <figure className="flex h-full flex-col rounded-[24px] bg-[#161616] p-6">
                <span className="text-sm tracking-tight text-teal-400">{STARS}</span>
                <p className="mt-3 text-lg font-semibold leading-snug">{r.title}</p>
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {r.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-400 text-[9px] font-bold text-teal-950">
                    ✓
                  </span>
                  <span className="font-medium text-zinc-300">{r.name}</span>
                  · about {r.about}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 pb-16 sm:px-8 lg:pb-24">
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-[-0.01em] sm:text-4xl">
            Got questions?
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-8 divide-y divide-white/10 rounded-[24px] border border-white/10 bg-[#141414] px-6">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium text-white sm:text-base [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 text-zinc-500 transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-zinc-400">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="relative overflow-hidden rounded-[28px] bg-[#161616] px-6 py-14 text-center sm:py-20">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 110%, rgba(45,212,191,0.25), transparent 70%)",
            }}
            aria-hidden
          />
          <Reveal>
            <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
              Radically different. Wildly effective skincare.
            </h2>
            <p className="relative mt-4 text-base text-zinc-400 sm:text-lg">
              32 tablets. 32 nights of brighter skin.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="relative mt-8">
              <CtaButton>Get 20% off — Shop now</CtaButton>
            </div>
            <p className="relative mt-4 text-xs text-zinc-500">
              Free shipping on orders $50+ · 30-day money-back guarantee
            </p>
          </Reveal>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10 px-5 pb-10 pt-12 sm:px-8">
        <p className="text-center text-[13vw] font-bold leading-none tracking-tight text-white/95 sm:text-[10vw]">
          ONÉLOGY<span className="align-super text-[0.2em]">®</span>
        </p>
        <p className="mt-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Onelogy Inc. — Made in France · Brooklyn
          NY 11222
        </p>
      </footer>

      {/* mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0b0b]/90 p-3 backdrop-blur-md sm:hidden">
        <a
          href={BUY_URL}
          className="flex min-h-12 items-center justify-center rounded-full bg-white text-[15px] font-semibold text-black"
        >
          Get 20% off — Shop now
        </a>
      </div>
    </main>
  );
}
