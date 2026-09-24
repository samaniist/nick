"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import "./process.css";

import Magnetic from "@/components/magnetic";
import ProcessBackground from "@/components/process-background";
import {
  AnalysisViz,
  GrowthViz,
  ImplementationViz,
  StrategyViz,
} from "@/components/process-visuals";
import { useInView } from "@/components/viz-hooks";
import { ArrowRight } from "@/components/icons";

const STEPS = [
  {
    no: "01",
    title: "Analysis",
    text: "We understand your business, your goals, and the needs of your target audience in detail.",
    Viz: AnalysisViz,
    icon: ["M4 10.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0 -13 0", "m15.5 15.5 5 5"],
  },
  {
    no: "02",
    title: "Strategy",
    text: "We develop a tailor-made digital strategy that delivers measurable results.",
    Viz: StrategyViz,
    icon: ["M3 17l6-6 4 4 8-8", "M15 7h6v6"],
  },
  {
    no: "03",
    title: "Build",
    fullTitle: "Implementation",
    text: "We implement our principles consistently with precision, creativity and modern technologies.",
    Viz: ImplementationViz,
    icon: ["m8 9-3 3 3 3", "m16 9 3 3-3 3", "m13.5 6-3 12"],
  },
  {
    no: "04",
    title: "Growth",
    text: "We continuously measure, optimize, and scale for sustainable growth.",
    Viz: GrowthViz,
    icon: ["M3 20h18", "M6 16l4-5 3 3 6-8"],
  },
];

/* ---- wheel geometry (SVG units, viewBox 0 0 440 440) ----------------------
   Four ring segments, Step 01 starting at 12 o'clock, clockwise. The whole
   wheel rotates so the selected segment always faces the panel (3 o'clock
   on desktop); labels counter-rotate to stay upright. */
const C = 220;
const R_OUT = 180;
const R_IN = 88;
const GAP = 3;
const PUSH = 10; // selected segment slides out
const LIFT = 4; // hovered segment lifts
const AUTOPLAY_MS = 6000;

const rad = (deg: number) => ((deg - 90) * Math.PI) / 180; // 0° = 12 o'clock
// rounded so server and client render identical attribute strings (hydration)
const round = (v: number) => Math.round(v * 100) / 100;
const pt = (r: number, deg: number) => [round(C + r * Math.cos(rad(deg))), round(C + r * Math.sin(rad(deg)))] as const;

function segmentPath(i: number) {
  const a0 = i * 90 + GAP / 2;
  const a1 = (i + 1) * 90 - GAP / 2;
  const [x0, y0] = pt(R_OUT, a0);
  const [x1, y1] = pt(R_OUT, a1);
  const [x2, y2] = pt(R_IN, a1);
  const [x3, y3] = pt(R_IN, a0);
  return `M ${x0} ${y0} A ${R_OUT} ${R_OUT} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${R_IN} ${R_IN} 0 0 0 ${x3} ${y3} Z`;
}

function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
}

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

function Rise({ inView, delay, children }: { inView: boolean; delay: number; children: React.ReactNode }) {
  return (
    <div className={inView ? "viz-rise" : "opacity-0"} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * "Our Process": an interactive wheel. Selecting a segment (click, tap or
 * arrow keys) rotates the wheel so that step faces the panel, slides it out
 * and lights it up; the panel on the right plays that step's scene. Until the
 * visitor interacts, the wheel advances on its own with a progress arc. The
 * wheel also tilts toward the pointer, segments lift on hover, a node orbits
 * the rim and a radar sweep turns in the core.
 */
export default function Process() {
  const { ref, inView } = useInView<HTMLElement>();
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(false);
  // cumulative wheel angle so it always turns the short way round
  const [spin, setSpin] = useState(0);
  const tabsRef = useRef<(SVGGElement | null)[]>([]);
  const mobileTabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const swipeX = useRef<number | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  const activeRef = useRef(0);
  const goTo = useCallback((i: number) => {
    const delta = (((i - activeRef.current) * -90 + 540) % 360) - 180; // shortest turn
    activeRef.current = i;
    setSpin((s) => s + delta);
    setActive(i);
  }, []);

  useEffect(() => {
    if (!auto || !visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => goTo((active + 1) % STEPS.length), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [auto, visible, active, goTo]);

  const select = useCallback(
    (i: number) => {
      setAuto(false);
      goTo(i);
    },
    [goTo],
  );

  // shared by the wheel (desktop) and the compact tab bar (mobile)
  const onKeyDown = (e: React.KeyboardEvent, i: number, tabs: React.RefObject<(HTMLElement | SVGGElement | null)[]>) => {
    const n = STEPS.length;
    const map: Record<string, number> = {
      ArrowRight: (i + 1) % n,
      ArrowDown: (i + 1) % n,
      ArrowLeft: (i - 1 + n) % n,
      ArrowUp: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key]);
      tabs.current[map[e.key]]?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select(i);
    }
  };

  // 3D tilt toward the pointer (desktop pointers only)
  const onWheelMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 14).toFixed(2)}deg) rotateY(${(x * 14).toFixed(2)}deg)`;
  };
  // mobile: swipe the panel to change step
  const onSwipeStart = (e: React.TouchEvent) => {
    swipeX.current = e.touches[0].clientX;
  };
  const onSwipeEnd = (e: React.TouchEvent) => {
    if (swipeX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) < 50) return;
    const n = STEPS.length;
    select(dx < 0 ? (active + 1) % n : (active - 1 + n) % n);
  };

  const onWheelLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    setHover(-1);
  };

  const step = STEPS[active];
  const Viz = step.Viz;
  // base orientation puts Step 01's centre (45°) at 3 o'clock (90°)
  const wheelRot = 45 + spin;

  return (
    <section ref={ref} id="process" className="relative z-30 isolate overflow-hidden bg-black py-20 font-sans text-white sm:py-28">
      <ProcessBackground />

      <div className="relative px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">Our Process</span>
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-2xl text-center text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            This Is How We Move Your Business <span className="text-zinc-400">Forward.</span>
          </h2>
        </Rise>

        <div className="mx-auto mt-10 grid max-w-6xl items-center gap-10 sm:mt-14 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* ---- left: the wheel (desktop; mobile uses the tab bar in the panel) ---- */}
          <Rise inView={inView} delay={160}>
            <div className="mx-auto hidden w-full max-w-[460px] lg:block" onPointerMove={onWheelMove} onPointerLeave={onWheelLeave}>
              <div
                ref={tiltRef}
                className="will-change-transform"
                style={{ transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)" }}
              >
                <svg viewBox="0 0 440 440" className="block h-auto w-full overflow-visible" role="tablist" aria-label="Process steps">
                  <defs>
                    <radialGradient id="pw-core" cx="50%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#232327" />
                      <stop offset="100%" stopColor="#060607" />
                    </radialGradient>
                    <linearGradient id="pw-sweep" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                      <stop offset="100%" stopColor="#fff" stopOpacity="0.28" />
                    </linearGradient>
                    <clipPath id="pw-core-clip">
                      <circle cx={C} cy={C} r={R_IN - 16} />
                    </clipPath>
                  </defs>

                  {/* orbit rings with travelling nodes (independent of selection) */}
                  <g className="pv-orbit" aria-hidden="true">
                    <circle cx={C} cy={C} r={R_OUT + 30} fill="none" stroke="rgba(255,255,255,0.09)" strokeDasharray="1 7" />
                    <circle cx={C} cy={C - R_OUT - 30} r="3.5" fill="#fff" style={{ filter: "drop-shadow(0 0 6px #fff)" }} />
                  </g>
                  <g className="pv-orbit pv-orbit-rev" aria-hidden="true">
                    <circle cx={C} cy={C} r={R_OUT + 30} fill="none" stroke="transparent" />
                    <circle cx={C} cy={C + R_OUT + 30} r="2.2" fill="rgba(255,255,255,0.7)" />
                  </g>

                  {/* the rotating wheel */}
                  <g
                    style={{
                      transform: `rotate(${wheelRot}deg)`,
                      transformOrigin: `${C}px ${C}px`,
                      transformBox: "view-box",
                      transition: `transform 900ms ${EASE}`,
                    }}
                  >
                    {/* tick ring: the selected quadrant lights up */}
                    {TICKS.map((a) => {
                      const lit = a >= active * 90 && a < (active + 1) * 90;
                      const [x0, y0] = pt(R_OUT + 12, a);
                      const [x1, y1] = pt(R_OUT + (a % 15 === 0 ? 20 : 16), a);
                      return (
                        <line
                          key={a}
                          x1={x0}
                          y1={y0}
                          x2={x1}
                          y2={y1}
                          stroke={lit ? "#fff" : "rgba(255,255,255,0.18)"}
                          strokeWidth={a % 15 === 0 ? 1.6 : 1}
                          style={{ transition: "stroke 500ms ease" }}
                        />
                      );
                    })}

                    {STEPS.map((s, i) => {
                      const on = i === active;
                      const hov = i === hover && !on;
                      const mid = i * 90 + 45;
                      const push = on ? PUSH : hov ? LIFT : 0;
                      const [dx, dy] = [round(Math.cos(rad(mid)) * push), round(Math.sin(rad(mid)) * push)];
                      const [lx, ly] = pt((R_OUT + R_IN) / 2 + 4, mid);
                      return (
                        <g
                          key={s.no}
                          ref={(el) => {
                            tabsRef.current[i] = el;
                          }}
                          role="tab"
                          id={`proc-tab-${i}`}
                          aria-selected={on}
                          aria-controls="proc-panel"
                          aria-label={`Step ${s.no}: ${s.fullTitle ?? s.title}`}
                          tabIndex={on ? 0 : -1}
                          onClick={() => select(i)}
                          onKeyDown={(e) => onKeyDown(e, i, tabsRef)}
                          onPointerEnter={() => setHover(i)}
                          onPointerLeave={() => setHover(-1)}
                          className="group cursor-pointer outline-none"
                          style={{
                            transform: `translate(${dx}px, ${dy}px)`,
                            transition: "transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)",
                          }}
                        >
                          <path
                            d={segmentPath(i)}
                            className={`transition-[fill,stroke] duration-500 ${
                              on ? "fill-white stroke-white" : hov ? "fill-white/[0.14] stroke-white/45" : "fill-white/[0.05] stroke-white/15"
                            } group-focus-visible:stroke-white`}
                            strokeWidth={1}
                            style={on ? { filter: "drop-shadow(0 0 26px rgba(255,255,255,0.4))" } : undefined}
                          />
                          {/* upright label: counter-rotates against the wheel */}
                          <g
                            className="pointer-events-none select-none"
                            style={{
                              transform: `rotate(${-wheelRot}deg)`,
                              transformOrigin: `${lx}px ${ly}px`,
                              transformBox: "view-box",
                              transition: `transform 900ms ${EASE}`,
                            }}
                          >
                            <g
                              transform={`translate(${lx - 9} ${ly - 36}) scale(0.75)`}
                              fill="none"
                              stroke={on ? "#000" : "#fff"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity={on ? 0.85 : hov ? 0.9 : 0.55}
                              style={{ transition: "stroke 500ms ease, opacity 300ms ease" }}
                            >
                              {s.icon.map((d) => (
                                <path key={d} d={d} />
                              ))}
                            </g>
                            <text
                              x={lx}
                              y={ly + 4}
                              textAnchor="middle"
                              className={`text-[10px] font-medium tracking-[0.2em] transition-colors duration-500 ${on ? "fill-black/55" : "fill-zinc-500"}`}
                            >
                              STEP {s.no}
                            </text>
                            <text
                              x={lx}
                              y={ly + 24}
                              textAnchor="middle"
                              className={`text-[17px] font-medium transition-colors duration-500 ${on ? "fill-black" : "fill-white"}`}
                            >
                              {s.title}
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* autoplay progress on the rim of the selected segment */}
                    {auto && visible && (
                      <path
                        key={`p-${active}`}
                        d={arcPath(R_OUT + 24, active * 90 + GAP / 2, (active + 1) * 90 - GAP / 2)}
                        fill="none"
                        stroke="#fff"
                        strokeWidth={2}
                        strokeLinecap="round"
                        pathLength={1}
                        className="proc-wheel-progress"
                        style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                        aria-hidden="true"
                      />
                    )}
                  </g>

                  {/* pointer from the wheel toward the panel */}
                  <path
                    d={`M ${C + R_OUT + 36} ${C - 7} L ${C + R_OUT + 46} ${C} L ${C + R_OUT + 36} ${C + 7}`}
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="hidden lg:block"
                    aria-hidden="true"
                  />

                  {/* core: radar sweep + current step number */}
                  <circle cx={C} cy={C} r={R_IN - 16} fill="url(#pw-core)" stroke="rgba(255,255,255,0.14)" />
                  <g clipPath="url(#pw-core-clip)" aria-hidden="true">
                    <g className="pv-sweep">
                      <circle cx={C} cy={C} r={R_IN - 16} fill="transparent" />
                      <path d={`M ${C} ${C} L ${C + R_IN} ${C} A ${R_IN} ${R_IN} 0 0 0 ${round(C + R_IN * Math.cos(-0.9))} ${round(C + R_IN * Math.sin(-0.9))} Z`} fill="url(#pw-sweep)" />
                    </g>
                  </g>
                  <circle cx={C} cy={C} r={R_IN - 26} fill="none" stroke="rgba(255,255,255,0.07)" />
                  <text
                    key={`n-${active}`}
                    x={C}
                    y={C + 8}
                    textAnchor="middle"
                    className="proc-wheel-num pointer-events-none select-none fill-white text-[46px] font-medium tracking-[-0.02em]"
                  >
                    {step.no}
                  </text>
                  <text x={C} y={C + 32} textAnchor="middle" className="pointer-events-none select-none fill-zinc-500 text-[10px] tracking-[0.25em]">
                    OF 04
                  </text>
                </svg>
              </div>

              {/* call to action for the wheel */}
              <div className="mt-8 flex justify-center">
                <span className="pv-hint inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="pv-hint-hand h-4 w-4" aria-hidden="true">
                    <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
                    <path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2" />
                    <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1.2a6 6 0 0 1-4.9-2.6L3.6 15a1.5 1.5 0 0 1 2.4-1.8L9 16" />
                  </svg>
                  Tap a step to explore it
                </span>
              </div>
            </div>
          </Rise>

          {/* ---- right: the selected step ---- */}
          <Rise inView={inView} delay={260}>
            <div
              id="proc-panel"
              role="tabpanel"
              aria-labelledby={`proc-tab-${active}`}
              onTouchStart={onSwipeStart}
              onTouchEnd={onSwipeEnd}
              className="rounded-[28px] border border-white/10 bg-[#0b0b0c]/90 bg-linear-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] p-5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] sm:p-8 lg:p-9"
            >
              {/* compact step tabs: keep steps and scene in one view on mobile */}
              <div role="tablist" aria-label="Process steps" className="mb-5 grid grid-cols-4 gap-1.5 lg:hidden">
                {STEPS.map((s, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={s.no}
                      ref={(el) => {
                        mobileTabsRef.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      aria-controls="proc-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(i)}
                      onKeyDown={(e) => onKeyDown(e, i, mobileTabsRef)}
                      className={`relative flex flex-col items-center gap-1 overflow-hidden rounded-xl border px-1 pt-2.5 pb-2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        on ? "border-white bg-white text-black" : "border-white/10 bg-white/[0.04] text-white"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${on ? "opacity-85" : "opacity-55"}`} aria-hidden="true">
                        {s.icon.map((d) => (
                          <path key={d} d={d} />
                        ))}
                      </svg>
                      <span className={`text-[9px] font-medium tracking-[0.18em] ${on ? "text-black/55" : "text-zinc-500"}`}>{s.no}</span>
                      <span className="text-[13px] font-medium leading-none">{s.title}</span>
                      {/* autoplay progress */}
                      {on && auto && visible && (
                        <span
                          key={`mp-${active}`}
                          className="proc-bar-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-black/40"
                          style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* key → remount: the scene replays and the copy slides in */}
              <div key={active} className="proc-panel-in">
                <div className="hidden items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-sm lg:flex">
                  <span>Step {step.no}</span>
                  {/* step dots */}
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    {STEPS.map((s, i) => (
                      <span key={s.no} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-white" : "w-1.5 bg-white/25"}`} />
                    ))}
                  </span>
                </div>
                <div className="h-[220px] lg:mt-5 sm:h-[260px] lg:h-[290px]">
                  <Viz />
                </div>
                <h3 className="mt-5 text-2xl sm:text-3xl lg:mt-7 font-medium tracking-[-0.01em] lg:text-4xl">{step.fullTitle ?? step.title}</h3>
                <span className="mt-4 block h-px w-12 bg-white/40" aria-hidden="true" />
                <p className="mt-4 min-h-[3.5em] text-[15px] sm:text-base leading-relaxed text-zinc-300 lg:text-lg">{step.text}</p>
                {active === STEPS.length - 1 ? (
                  <Magnetic className="mt-6">
                    <Link
                      href="/contact"
                      className="inline-block rounded-[3px] bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-zinc-200"
                    >
                      Book Free Call
                    </Link>
                  </Magnetic>
                ) : (
                  <button
                    type="button"
                    onClick={() => select(active + 1)}
                    className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-white/20 px-5 py-2.5 text-[15px] text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    Next: {STEPS[active + 1].fullTitle ?? STEPS[active + 1].title} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Rise>
        </div>
      </div>
    </section>
  );
}
