"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  ["01", "Find the constraint", "We audit the account, offer, tracking and funnel to locate the real growth bottleneck."],
  ["02", "Build the system", "Campaign architecture, measurement and creative hypotheses are designed as one operating system."],
  ["03", "Test with discipline", "Every experiment has a reason, a success metric and a clear decision at the end."],
  ["04", "Scale what earns it", "Budget moves toward proven combinations while weak signals are cut before they become expensive."],
] as const;

/** A native-scroll story: no scroll hijacking, only a sticky visual that follows progress. */
export default function ScrollFunnel() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let queued = false;
    const update = () => {
      queued = false;
      const rect = section.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      setActive(Math.min(3, Math.floor(progress * 4)));
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    update();
    if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} id="approach" className="pm-scroll-funnel relative bg-[#080908] px-6 py-24 sm:px-10 sm:py-32 lg:min-h-[260vh] lg:px-14 lg:py-0">
      <div className="pm-grid absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="pm-scroll-stage relative mx-auto max-w-7xl lg:sticky lg:top-0 lg:grid lg:min-h-dvh lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9ff2b]">The operating loop</p>
          <h2 className="mt-5 max-w-xl text-4xl font-medium leading-[1.03] tracking-[-0.04em] sm:text-6xl">No black box.<br />Just better decisions.</h2>
          <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">Scroll through the system. You see what we tested, what we learned and where the next euro should go.</p>

          <div className="relative mx-auto my-14 aspect-square w-full max-w-[430px] lg:mx-0 lg:mb-0">
            <div className="absolute inset-[8%] rounded-full border border-white/10" />
            <div className="pm-flow-orbit absolute inset-[18%] rounded-full border border-dashed border-white/15" />
            <div className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#dcff94,#b9ff2b_17%,#354c05_55%,#090b07_75%)] shadow-[0_0_60px_rgba(185,255,43,.22)]">
              <div key={active} className="pm-metric-swap flex h-full flex-col items-center justify-center text-black">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">Phase</span>
                <strong className="mt-1 text-5xl font-semibold">{STEPS[active][0]}</strong>
                <span className="mt-1 text-xs font-semibold">{STEPS[active][1]}</span>
              </div>
            </div>
            {STEPS.map((step, index) => {
              const angle = -90 + index * 90;
              const x = 50 + Math.cos((angle * Math.PI) / 180) * 43;
              const y = 50 + Math.sin((angle * Math.PI) / 180) * 43;
              return <button key={step[0]} type="button" onClick={() => setActive(index)} aria-label={`Show phase ${step[0]}: ${step[1]}`} aria-pressed={active === index} className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border font-mono text-[10px] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ff2b] ${active === index ? "scale-110 border-[#b9ff2b] bg-[#b9ff2b] text-black shadow-[0_0_30px_rgba(185,255,43,.35)]" : "border-white/15 bg-black text-zinc-500 hover:border-white/40 hover:text-white"}`} style={{ left: `${x}%`, top: `${y}%` }}>{step[0]}</button>;
            })}
          </div>
        </div>

        <ol className="border-t border-white/10">
          {STEPS.map(([number, title, text], index) => {
            const on = active === index;
            return (
              <li key={number} className={`grid gap-3 border-b border-white/10 py-7 transition-all duration-500 sm:grid-cols-[54px_1fr] sm:gap-5 sm:py-8 lg:px-5 ${on ? "opacity-100 lg:translate-x-0" : "opacity-35 lg:translate-x-4"}`} onPointerEnter={() => setActive(index)}>
                <span className={`font-mono text-xs ${on ? "text-[#b9ff2b]" : "text-zinc-600"}`}>{number}</span>
                <div><h3 className="text-xl font-medium tracking-tight sm:text-2xl">{title}</h3><p className="mt-3 max-w-xl text-base leading-7 text-zinc-400">{text}</p></div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
