"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { useLang } from "@/components/onelogy/lang";

const WORDMARK = "ONÉLOGY".split("");

const T = {
  en: {
    eyebrow: "Water-activated skincare",
    caption: "Alpha Arbutin 2% — one tablet, dissolved fresh.",
    meta: "12 mg · 32 tablets",
  },
  fr: {
    eyebrow: "Soin activé à l’eau",
    caption: "Alpha Arbutine 2 % — un comprimé, dissous à la demande.",
    meta: "12 mg · 32 comprimés",
  },
};

export default function OnelogyHero() {
  const lang = useLang();
  const t = T[lang];
  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxRef = useRef<HTMLSpanElement | null>(null);

  /* Cursor parallax: the product leans toward the pointer anywhere on the
     hero. Lives on its own wrapper so it never fights the drop animation
     (below it) or the endless spin (above it). */
  useEffect(() => {
    const section = sectionRef.current;
    const el = parallaxRef.current;
    if (!section || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, tx: 0, ty: 0 };
    const tgt = { rx: 0, ry: 0, tx: 0, ty: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 14;
      tgt.rx = (0.5 - py) * 10;
      tgt.tx = (px - 0.5) * 18;
      tgt.ty = (py - 0.5) * 12;
    };
    const onLeave = () => {
      tgt.rx = tgt.ry = tgt.tx = tgt.ty = 0;
    };
    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.08;
      cur.ry += (tgt.ry - cur.ry) * 0.08;
      cur.tx += (tgt.tx - cur.tx) * 0.08;
      cur.ty += (tgt.ty - cur.ty) * 0.08;
      el.style.transform = `translate3d(${cur.tx.toFixed(2)}px, ${cur.ty.toFixed(2)}px, 0) rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="onelogy-hero relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-white text-neutral-900"
    >
      {/* Animated white backdrop: drifting pastel washes + faint dot grid */}
      <div className="onelogy-blob onelogy-blob-a" aria-hidden />
      <div className="onelogy-blob onelogy-blob-b" aria-hidden />
      <div className="onelogy-grid absolute inset-0" aria-hidden />

      <div className="relative flex flex-col items-center px-6">
        <p className="onelogy-eyebrow mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-neutral-400 sm:text-xs">
          {t.eyebrow}
        </p>

        {/* Wordmark — jolts when the product lands on it */}
        <h1 className="onelogy-wordmark relative select-none text-center font-black leading-none tracking-[-0.045em] text-[clamp(3.25rem,13vw,10.5rem)]">
          {WORDMARK.map((letter, i) => (
            <span
              key={i}
              className="onelogy-letter inline-block"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
          <span className="onelogy-letter absolute -right-4 top-2 text-[0.16em] font-bold tracking-normal sm:-right-6 sm:top-3">
            ®
          </span>

          {/* Product: drops from above the viewport onto the exact center of
              the wordmark, bounces, then spins forever on the inner wrapper
              so the two transforms never fight. */}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1200px]">
            <span
              ref={parallaxRef}
              className="block w-[clamp(11rem,32vw,20rem)] will-change-transform [transform-style:preserve-3d]"
            >
              <span className="onelogy-drop block">
              <span className="onelogy-spin block">
                <Image
                  src="/onelogy-product.webp"
                  alt="Onélogy Alpha Arbutin 2% water-activated tablet in its blister pack"
                  width={416}
                  height={400}
                  priority
                  className="h-auto w-full drop-shadow-[0_24px_48px_rgba(0,0,0,0.28)]"
                />
              </span>
              </span>
            </span>
            {/* Impact shockwave ring */}
            <span className="onelogy-ring absolute h-40 w-40 rounded-full border border-neutral-300 sm:h-56 sm:w-56" />
          </span>
        </h1>

        <p className="onelogy-caption mt-8 max-w-md text-center text-sm text-neutral-500 sm:text-base">
          {t.caption}
          <span className="mx-2 inline-block h-3 w-px translate-y-0.5 bg-neutral-300" />
          <span className="font-medium text-teal-600">{t.meta}</span>
        </p>
      </div>
    </section>
  );
}
