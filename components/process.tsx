"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import styles from "./process.module.css";

import Magnetic from "@/components/magnetic";
import ProcessBackground from "@/components/process-background";
import {
  AnalysisViz,
  GrowthViz,
  ImplementationViz,
  StrategyViz,
} from "@/components/process-visuals";
import { useInView } from "@/components/viz-hooks";

const STEPS = [
  {
    no: "01",
    title: "Analysis",
    text: "We understand your business, your goals, and the needs of your target audience in detail.",
    Viz: AnalysisViz,
  },
  {
    no: "02",
    title: "Strategy",
    text: "We develop a tailor-made digital strategy that delivers measurable results.",
    Viz: StrategyViz,
  },
  {
    no: "03",
    title: "Implementation",
    text: "We implement our principles consistently with precision, creativity and modern technologies.",
    Viz: ImplementationViz,
  },
  {
    no: "04",
    title: "Growth",
    text: "We continuously measure, optimize, and scale for sustainable growth.",
    Viz: GrowthViz,
  },
];

function Rise({
  inView,
  delay,
  children,
}: {
  inView: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={inView ? "viz-rise" : "opacity-0"}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Process() {
  const { ref, inView } = useInView<HTMLElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Keep scroll work to compositor-friendly transforms and opacity.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const deck = window.matchMedia(
      "(min-width: 768px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    let spacing = 360;
    let previous = -1;

    const update = () => {
      frame = 0;
      if (!deck.matches) return;
      const rect = track.getBoundingClientRect();
      const stageHeight = track.firstElementChild?.clientHeight ?? window.innerHeight;
      const total = rect.height - stageHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      if (progress === previous) return;
      previous = progress;
      const active = progress * (STEPS.length - 1);

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        const offset = i - active;
        const abs = Math.min(Math.abs(offset), 3);
        const ry = Math.max(-48, Math.min(48, -offset * 26));
        const scale = Math.max(0.74, 1 - abs * 0.14);
        card.style.transform = `translate3d(${(offset * spacing).toFixed(1)}px, 0, ${(-abs * 140).toFixed(0)}px) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.zIndex = String(Math.round(100 - abs * 10));
        card.style.opacity = String(Math.max(0.2, 1 - abs * 0.3));
      });
    };
    const onScroll = () => {
      if (deck.matches && !frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = -1;
      if (!deck.matches) {
        cardsRef.current.forEach((card) => {
          if (!card) return;
          card.style.transform = "";
          card.style.opacity = "";
          card.style.zIndex = "";
        });
        return;
      }
      spacing = (cardsRef.current[0]?.offsetWidth ?? 304) + 56;
      update();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    deck.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      deck.removeEventListener("change", measure);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="process"
      className="relative z-30 bg-black py-20 font-sans text-white sm:py-24"
    >
      <div className="relative px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Our Process
            </span>
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-2xl text-center text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            This Is How We Move Your Business{" "}
            <span className="text-zinc-400">Forward.</span>
          </h2>
        </Rise>
      </div>

      {/* horizontal, scroll-scrubbed 3D deck: fanned glass cards that pass
          through center one at a time as the page scrolls */}
      <div ref={trackRef} className={`${styles.track} relative mt-16 sm:mt-20`}>
        <div
          className={styles.stage}
        >
          <div className={styles.background}><ProcessBackground /></div>

          {STEPS.map((s, i) => {
            const last = i === STEPS.length - 1;
            const Viz = s.Viz;
            return (
              <div
                key={s.no}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={`${styles.card} flex w-[280px] shrink-0 flex-col rounded-[28px] border border-white/10 bg-linear-to-b from-white/[0.1] via-white/[0.05] to-white/[0.02] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] sm:w-[400px] sm:p-7 lg:w-[500px] lg:p-8 xl:w-[560px] xl:p-9`}
              >
                <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-sm">
                  <span>Step {s.no}</span>
                  <span>{s.no} / 04</span>
                </div>

                <div className="mt-4 h-[190px] shrink-0 sm:h-[220px] lg:mt-6 lg:h-[260px] xl:h-[300px]">
                  <Viz />
                </div>

                <div className="mt-6 lg:mt-8">
                  <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl lg:text-4xl">
                    {s.title}
                  </h3>
                  <span className="mt-4 block h-px w-12 bg-white/40" aria-hidden="true" />
                  <p className="mt-4 text-base leading-relaxed text-zinc-300 lg:text-lg">{s.text}</p>
                  {last && (
                    <Magnetic className="mt-6">
                      <Link
                        href="/contact"
                        className="inline-block rounded-[3px] bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-zinc-200"
                      >
                        Book Free Call
                      </Link>
                    </Magnetic>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
