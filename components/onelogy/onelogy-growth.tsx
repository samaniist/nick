"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { useLang } from "@/components/onelogy/lang";
import { useInView } from "@/components/viz-hooks";

/* Growth-strategy section modeled on nikolaradeski.com's hero: giant split
   typography broken by a centered 3D tilt card, with tiny eyebrows above
   each half. */

/* Strategy chips floating around the card, each on its own depth plane. */
const CHIPS = [
  { en: "SEO", fr: "SEO", cls: "-left-14 top-6", z: 90, delay: 0 },
  { en: "Paid Ads", fr: "Publicité", cls: "-right-16 top-1/4", z: 120, delay: 1200 },
  { en: "Marketplaces", fr: "Marketplaces", cls: "-left-24 bottom-1/4", z: 70, delay: 2400 },
  { en: "Branding", fr: "Image de marque", cls: "-right-14 bottom-8", z: 100, delay: 600 },
];

const T = {
  en: {
    leftEyebrow: "Digital Growth Strategy for Onélogy",
    leftWord: "Growth",
    rightEyebrow:
      "From an Innovative Skincare Product to a Globally Recognized Beauty Brand",
    rightWord: "Strategy",
    roadmap:
      "A complete digital growth roadmap focused on brand positioning, organic visibility, paid acquisition, marketplace expansion, and long-term scalability.",
  },
  fr: {
    leftEyebrow: "Stratégie de croissance digitale pour Onélogy",
    leftWord: "Croissance",
    rightEyebrow:
      "D’un produit de soin innovant à une marque de beauté reconnue mondialement",
    rightWord: "Stratégie",
    roadmap:
      "Une feuille de route complète de croissance digitale, axée sur le positionnement de marque, la visibilité organique, l’acquisition payante, l’expansion sur les marketplaces et la scalabilité à long terme.",
  },
};

/* The centered product card: pointer-tracking 3D tilt + glare, same
   mechanics as the contact page's TiltCard, restyled for a light surface. */
function TiltPhoto() {
  const lang = useLang();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!frame || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 3D tilt is a hover affordance; skip it entirely on touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 16;
      tgt.rx = (0.5 - py) * 13;
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
      card.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      card.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      card.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
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
    <div ref={frameRef} className="viz-float [perspective:1400px]">
      <div
        ref={cardRef}
        className="relative will-change-transform [transform-style:preserve-3d]"
      >
        <div
          className="overflow-hidden rounded-[1.75rem]"
          style={{ boxShadow: "0 40px 80px -24px rgba(0,0,0,0.45)" }}
        >
          <Image
            src="/onelogy-retinoid.webp"
            alt="Onélogy HPR Retinoid 0.3% Megadose — renewing night serum box with two tablets"
            width={800}
            height={1067}
            className="h-auto w-full"
            sizes="(min-width: 1024px) 18rem, 62vw"
          />
          {/* pointer-tracking glare */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.75rem]"
            style={{
              background:
                "radial-gradient(380px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.22), transparent 65%)",
            }}
          />
        </div>
        {/* floating strategy chips, each on its own depth plane */}
        {CHIPS.map((c) => (
          <span
            key={c.en}
            aria-hidden
            className={`viz-float pointer-events-none absolute hidden select-none rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-600 shadow-[0_12px_28px_rgba(0,0,0,0.14)] lg:block ${c.cls}`}
            style={{
              transform: `translateZ(${c.z}px)`,
              animationDelay: `${c.delay}ms`,
            }}
          >
            {c[lang]}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OnelogyGrowth() {
  const lang = useLang();
  const t = T[lang];
  /* French words are longer — one size down so the row still fits. */
  const wordCls =
    lang === "fr"
      ? "text-[clamp(2.25rem,5vw,4.75rem)]"
      : "text-[clamp(2.75rem,6.2vw,5.75rem)]";
  const { ref, inView } = useInView<HTMLElement>();
  const fadeRef = useRef<HTMLDivElement | null>(null);

  /* The section is pinned (sticky). Scrolling on cross-fades the two
     sections: this one's content fades out over the first half of the
     transition, then #why-strategy fades in over the second half — no
     visible sliding edge, since the next section stays transparent until
     it has almost fully covered the viewport. */
  useEffect(() => {
    const el = fadeRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = document.getElementById("why-strategy");
        if (!next) return;
        const vh = window.innerHeight;
        const covered = Math.min(
          Math.max((vh - next.getBoundingClientRect().top) / vh, 0),
          1,
        );
        const fadeOut = Math.min(covered / 0.5, 1);
        const fadeIn = Math.min(Math.max((covered - 0.55) / 0.45, 0), 1);
        el.style.opacity = (1 - fadeOut).toFixed(3);
        next.style.opacity = fadeIn.toFixed(3);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const reveal = (hidden: string, delay: number) => ({
    className: `transition-all duration-700 ease-out ${
      inView ? "translate-x-0 translate-y-0 opacity-100" : `${hidden} opacity-0`
    }`,
    style: { transitionDelay: `${delay}ms` },
  });

  return (
    <section
      id="growth"
      ref={ref}
      className="sticky top-0 flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-neutral-100 py-20 text-neutral-900"
    >
      <div ref={fadeRef} className="flex w-full flex-col items-center will-change-[opacity]">
      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-6 lg:flex-row lg:items-center lg:justify-center lg:gap-0">
        {/* Left half */}
        <div
          {...reveal("lg:-translate-x-10 translate-y-6 lg:translate-y-0", 100)}
        >
          <div className="flex flex-col items-center text-center lg:mr-12 lg:items-end lg:text-right">
            <p className="mb-3 text-sm text-neutral-500 sm:text-base">
              {t.leftEyebrow}
            </p>
            <h2
              className={`select-none font-black uppercase leading-none tracking-[-0.03em] ${wordCls}`}
            >
              {t.leftWord}
            </h2>
          </div>
        </div>

        {/* Center: 3D tilt product card */}
        <div
          {...reveal("translate-y-14 scale-90", 0)}
        >
          <div className="relative z-10 w-[min(62vw,18rem)] shrink-0">
            <TiltPhoto />
          </div>
        </div>

        {/* Right half */}
        <div
          {...reveal("lg:translate-x-10 translate-y-6 lg:translate-y-0", 250)}
        >
          <div className="flex flex-col items-center text-center lg:ml-12 lg:items-start lg:text-left">
            <p className="mb-3 max-w-72 text-sm text-neutral-500 sm:text-base">
              {t.rightEyebrow}
            </p>
            <h2
              className={`select-none font-black uppercase leading-none tracking-[-0.03em] ${wordCls}`}
            >
              {t.rightWord}
            </h2>
          </div>
        </div>
      </div>

      {/* Roadmap line, centered under the composition */}
      <p
        {...reveal("translate-y-6", 400)}
      >
        <span className="mx-auto mt-14 block max-w-xl px-6 text-center text-sm leading-relaxed text-neutral-500 sm:text-base">
          {t.roadmap}
        </span>
      </p>
      </div>
    </section>
  );
}
