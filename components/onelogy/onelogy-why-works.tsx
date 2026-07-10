"use client";

import { useEffect, useRef } from "react";

import { useLang } from "@/components/onelogy/lang";
import { useInView } from "@/components/viz-hooks";

/* Glass panel that enters from the right edge of the page on scroll.
   The pastel washes behind the section give the frosted glass its color;
   the channel rows fade in staggered once the panel has arrived. */

const T = {
  en: {
    kicker: "Why This Approach",
    heading: "Why This Strategy Works",
    intro:
      "Instead of relying on a single traffic source, this strategy creates multiple growth channels working together.",
    channels: [
      { title: "Organic Search", text: "Long-term traffic and authority." },
      {
        title: "AI Search",
        text: "Visibility inside ChatGPT, Gemini, Perplexity and future AI search platforms.",
      },
      { title: "Paid Media", text: "Predictable customer acquisition." },
      { title: "Marketplace", text: "Additional revenue through Amazon." },
      {
        title: "Brand",
        text: "Higher customer trust, stronger positioning and better retention.",
      },
    ],
  },
  fr: {
    kicker: "Pourquoi cette approche",
    heading: "Pourquoi cette stratégie fonctionne",
    intro:
      "Au lieu de dépendre d’une seule source de trafic, cette stratégie crée plusieurs canaux de croissance qui travaillent ensemble.",
    channels: [
      {
        title: "Recherche organique",
        text: "Trafic et autorité à long terme.",
      },
      {
        title: "Recherche IA",
        text: "Visibilité dans ChatGPT, Gemini, Perplexity et les futures plateformes de recherche IA.",
      },
      { title: "Média payant", text: "Acquisition client prévisible." },
      { title: "Marketplace", text: "Revenus supplémentaires via Amazon." },
      {
        title: "Marque",
        text: "Plus de confiance client, un positionnement plus fort et une meilleure rétention.",
      },
    ],
  },
};

export default function OnelogyWhyWorks() {
  const lang = useLang();
  const t = T[lang];
  const { ref, inView } = useInView<HTMLElement>();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* Gentle 3D tilt + pointer-tracking glare on the glass panel — the same
     mechanics as the growth card, with smaller angles so the blurred text
     stays readable. */
  useEffect(() => {
    const frame = frameRef.current;
    const panel = panelRef.current;
    if (!frame || !panel) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 6;
      tgt.rx = (0.5 - py) * 5;
      tgt.gx = px * 100;
      tgt.gy = py * 100;
    };
    const onLeave = () => {
      tgt.rx = 0;
      tgt.ry = 0;
    };
    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.09;
      cur.ry += (tgt.ry - cur.ry) * 0.09;
      cur.gx += (tgt.gx - cur.gx) * 0.12;
      cur.gy += (tgt.gy - cur.gy) * 0.12;
      panel.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      panel.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      panel.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative z-10 w-full overflow-hidden bg-white py-24 text-neutral-900 sm:py-32"
    >
      {/* color behind the glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-violet-300/50 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-teal-200/60 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-1/2 h-72 w-72 rounded-full bg-amber-100/70 blur-[90px]"
      />

      <div
        ref={frameRef}
        className={`relative mx-auto max-w-3xl px-6 transition-all duration-1000 ease-out [perspective:1600px] ${
          inView ? "translate-x-0 opacity-100" : "translate-x-[70vw] opacity-0"
        }`}
      >
        <div
          ref={panelRef}
          className="relative rounded-[1.75rem] border border-white/60 bg-white/40 p-8 shadow-[0_24px_70px_rgba(0,0,0,0.10)] backdrop-blur-xl will-change-transform sm:p-12"
        >
          {/* pointer-tracking glare */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
            style={{
              background:
                "radial-gradient(460px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.35), transparent 65%)",
            }}
          />
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            {t.kicker}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-5xl">
            {t.heading}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            {t.intro}
          </p>

          <div className="mt-10 divide-y divide-neutral-900/10">
            {t.channels.map((c, i) => (
              <div
                key={c.title}
                className={`group -mx-3 flex flex-col gap-1 rounded-xl px-3 py-5 transition-all duration-700 ease-out hover:bg-white/50 sm:flex-row sm:items-baseline sm:gap-6 ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${500 + i * 120}ms` }}
              >
                <h3 className="w-44 shrink-0 text-lg font-bold tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-1.5 sm:text-xl">
                  {c.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-600 sm:text-base">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
