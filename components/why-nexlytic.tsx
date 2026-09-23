"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./why-nexlytic.css";

import WhyParticles from "@/components/why-particles";
import { useInView } from "@/components/viz-hooks";

const STEPS = [
  {
    no: "01",
    title: "Proven expertise",
    text: "Our experts have years of experience in digital marketing and web development – for results you can trust.",
  },
  {
    no: "02",
    title: "Results-oriented approach",
    text: "We measure our success by your success – with clear KPIs, transparent reporting and continuous optimization.",
  },
  {
    no: "03",
    title: "Dedicated team",
    text: "A well-coordinated team of strategists, designers and developers works together to achieve your goals.",
  },
  {
    no: "04",
    title: "Punctual implementation",
    text: "Reliable project planning and transparent communication ensure that your projects are delivered on time.",
  },
];

function Rise({ inView, delay, className = "", children }: { inView: boolean; delay: number; className?: string; children: React.ReactNode }) {
  return (
    <div className={`${inView ? "viz-rise" : "opacity-0"} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * "Why Nexlytic?" — a pinned, scroll-driven scene. While the stage is pinned,
 * scrolling walks through the four reasons and a 3D particle sculpture
 * (why-particles.tsx) morphs to match each one: medal → target → team →
 * stopwatch. The list on the left is clickable and jumps to a reason. With
 * reduced motion the section is not pinned and the list alone drives it.
 */
export default function WhyNexlytic() {
  const { ref, inView } = useInView<HTMLElement>();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let queued = false;
    const update = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setStep(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
      setStarted(p > 0.02);
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // jump to a reason: scroll to the middle of its slice of the pinned track
  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(i);
      return;
    }
    const top = track.getBoundingClientRect().top + window.scrollY;
    const total = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + total * ((i + 0.5) / STEPS.length), behavior: "smooth" });
  }, []);

  const current = STEPS[step];

  return (
    <section ref={ref} id="why-nexlytic" className="relative z-30 bg-white font-sans text-zinc-950">
      <div ref={trackRef} className="relative motion-safe:h-[340svh]">
        <div className="top-0 flex flex-col overflow-hidden px-6 py-16 motion-safe:sticky motion-safe:h-svh sm:px-10 lg:px-14 lg:py-0">
          <div className="mx-auto grid h-full w-full max-w-7xl grid-rows-[auto_1fr_auto] gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-12 lg:gap-y-0">
            {/* heading */}
            <div className="pt-2 lg:col-start-1 lg:row-start-2 lg:pt-0">
              <Rise inView={inView} delay={0}>
                <div className="flex items-center gap-4">
                  <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">Why Nexlytic?</span>
                </div>
              </Rise>
              <Rise inView={inView} delay={80}>
                <h2 className="mt-4 max-w-md text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
                  Your Partner for Digital <span className="text-zinc-400">Growth.</span>
                </h2>
              </Rise>
            </div>

            {/* the sculpture */}
            <div className="relative min-h-0 lg:col-start-2 lg:row-span-4 lg:row-start-1">
              {/* oversized step number behind the particles */}
              <span
                key={current.no}
                className="why-num pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[42vw] font-semibold leading-none tracking-[-0.06em] text-zinc-100 sm:text-[30vw] lg:text-[17vw]"
                aria-hidden="true"
              >
                {current.no}
              </span>
              {/* soft contact shadow */}
              <span
                className="pointer-events-none absolute bottom-[8%] left-1/2 h-8 w-1/2 -translate-x-1/2 rounded-[50%] bg-zinc-950/[0.07] blur-xl"
                aria-hidden="true"
              />
              <WhyParticles step={step} className="h-full min-h-[300px] w-full" />
              {/* scroll hint before the journey starts */}
              <span
                className={`pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 transition-opacity duration-500 motion-safe:flex ${
                  started ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden="true"
              >
                <span className="relative h-7 w-4 rounded-full border-[1.5px] border-zinc-400">
                  <span className="why-wheel absolute left-1/2 top-1.5 h-1.5 w-[2px] -translate-x-1/2 rounded-full bg-zinc-400" />
                </span>
                Scroll to explore
              </span>
            </div>

            {/* reasons */}
            <div className="lg:col-start-1 lg:row-start-3 lg:mt-12">
              {/* desktop: full list with a progress rail */}
              <Rise inView={inView} delay={160} className="hidden lg:block">
                <div className="relative pl-7">
                  <span className="absolute bottom-2 left-0 top-2 w-px bg-zinc-200" aria-hidden="true" />
                  <span
                    ref={fillRef}
                    className="absolute bottom-2 left-0 top-2 w-px origin-top bg-zinc-950 motion-reduce:hidden"
                    style={{ transform: "scaleY(0)" }}
                    aria-hidden="true"
                  />
                  <ol className="space-y-1">
                    {STEPS.map((s, i) => {
                      const on = i === step;
                      return (
                        <li key={s.no}>
                          <button
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={on ? "step" : undefined}
                            className="group w-full rounded-md py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-950"
                          >
                            <span className="flex items-baseline gap-4">
                              <span className={`text-xs font-semibold tabular-nums transition-colors duration-300 ${on ? "text-zinc-950" : "text-zinc-400"}`}>
                                {s.no}
                              </span>
                              <span
                                className={`text-xl font-medium tracking-[-0.01em] transition-colors duration-300 xl:text-2xl ${
                                  on ? "text-zinc-950" : "text-zinc-400 group-hover:text-zinc-700"
                                }`}
                              >
                                {s.title}
                              </span>
                            </span>
                            <span className={`grid transition-[grid-template-rows] duration-500 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                              <span className="overflow-hidden">
                                <span className={`block max-w-md pl-9 pt-2 text-base leading-relaxed text-zinc-600 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`}>
                                  {s.text}
                                </span>
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </Rise>

              {/* mobile/tablet: the active reason + step dots */}
              <div className="lg:hidden">
                <div key={current.no} className="why-in min-h-[150px]">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-semibold tabular-nums text-zinc-400">{current.no}</span>
                    <h3 className="text-2xl font-medium tracking-[-0.01em]">{current.title}</h3>
                  </div>
                  <p className="mt-2 text-base leading-relaxed text-zinc-600">{current.text}</p>
                </div>
                <div className="mt-4 flex items-center gap-2" role="group" aria-label="Choose a reason">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.no}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`${s.no}: ${s.title}`}
                      aria-current={i === step ? "step" : undefined}
                      className="flex h-11 items-center"
                    >
                      <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-8 bg-zinc-950" : "w-4 bg-zinc-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
