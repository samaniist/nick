"use client";

import { useEffect, useRef } from "react";

import { useCountUp, useInView } from "@/components/viz-hooks";

/* Expected-outcome chain: the eight channels as animated cards linked by
   flowing ↓ connectors. Every card carries a live illustrative visual of
   the growth it stands for (Search-Console-style lines for SEO, growing
   bars for ads, radiating rings for awareness, …). Entrances are
   inView-driven transitions; the loops live in globals.css (onelogy-oc-*). */

/* ————— shared chart bits ————— */

const GRID_Y = [27, 55, 83];

function ChartGrid() {
  return (
    <>
      {GRID_Y.map((y) => (
        <line
          key={y}
          x1="0"
          x2="320"
          y1={y}
          y2={y}
          stroke="#e8e8e8"
          strokeWidth="1"
        />
      ))}
    </>
  );
}

function DrawnPath({
  d,
  stroke,
  on,
  delay = 0,
  fill,
}: {
  d: string;
  stroke: string;
  on: boolean;
  delay?: number;
  fill?: string;
}) {
  return (
    <>
      {fill && (
        <path
          d={`${d} L320,110 L0,110 Z`}
          fill={fill}
          className={on ? "viz-fade" : "opacity-0"}
          style={{ animationDelay: `${delay + 500}ms` }}
        />
      )}
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        className={on ? "viz-draw" : "opacity-0"}
        style={{ animationDelay: `${delay}ms` }}
      />
    </>
  );
}

function EndDot({ x, y, color, on }: { x: number; y: number; color: string; on: boolean }) {
  if (!on) return null;
  return <circle cx={x} cy={y} r="4" fill={color} className="onelogy-oc-pulse" />;
}

/* ————— per-channel visuals ————— */

function WebsiteViz({ on }: { on: boolean }) {
  const block = (extra: string, delay: number) =>
    `transition-all duration-500 ease-out ${
      on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
    } ${extra}`;
  const blockStyle = (delay: number) => ({ transitionDelay: `${delay}ms` });

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-white px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 h-4 flex-1 rounded-full bg-neutral-100 px-2 text-[9px] leading-4 text-neutral-400">
          onelogy.com
        </span>
      </div>
      <div className="space-y-2 p-3">
        <div className={block("flex items-center justify-between", 100)} style={blockStyle(100)}>
          <span className="h-2 w-14 rounded bg-neutral-300" />
          <span className="flex gap-2">
            <span className="h-2 w-8 rounded bg-neutral-200" />
            <span className="h-2 w-8 rounded bg-neutral-200" />
            <span className="h-2 w-8 rounded bg-neutral-200" />
          </span>
        </div>
        <div
          className={block(
            "flex h-16 items-center justify-center rounded-lg bg-gradient-to-r from-violet-100 via-white to-teal-100",
            250,
          )}
          style={blockStyle(250)}
        >
          <span className="h-2.5 w-28 rounded bg-neutral-800" />
        </div>
        <div className={block("grid grid-cols-3 gap-2", 400)} style={blockStyle(400)}>
          <span className="h-10 rounded-lg border border-neutral-200 bg-white" />
          <span className="h-10 rounded-lg border border-neutral-200 bg-white" />
          <span className="h-10 rounded-lg border border-neutral-200 bg-white" />
        </div>
        <div className={block("flex items-center gap-3", 550)} style={blockStyle(550)}>
          <span className="rounded-full bg-violet-600 px-3 py-1.5 text-[10px] font-semibold text-white">
            Add to cart
          </span>
          {on && (
            <span className="onelogy-oc-pop rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              ✓ +1 order
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SeoViz({ on }: { on: boolean }) {
  const clicks = useCountUp(12400, on, 1400);
  const impressions = useCountUp(348000, on, 1400);
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-[#4285f4] px-3 py-2 text-white">
          <p className="text-[10px] uppercase tracking-wide opacity-80">Total clicks</p>
          <p className="text-lg font-bold tabular-nums">
            {(clicks / 1000).toFixed(1)}K
          </p>
        </div>
        <div className="flex-1 rounded-lg bg-[#7b1fa2] px-3 py-2 text-white">
          <p className="text-[10px] uppercase tracking-wide opacity-80">Total impressions</p>
          <p className="text-lg font-bold tabular-nums">
            {Math.round(impressions / 1000)}K
          </p>
        </div>
      </div>
      <svg viewBox="0 0 320 110" className="mt-3 h-auto w-full overflow-visible" aria-hidden>
        <ChartGrid />
        <DrawnPath
          on={on}
          delay={200}
          stroke="#7b1fa2"
          d="M0,72 C25,62 40,68 65,60 C95,52 110,57 140,47 C170,38 200,40 230,28 C260,20 285,16 320,9"
        />
        <DrawnPath
          on={on}
          delay={0}
          stroke="#4285f4"
          d="M0,88 C30,86 45,78 60,80 C90,82 105,68 135,66 C165,63 180,53 215,48 C250,42 285,34 320,24"
        />
        <EndDot x={320} y={24} color="#4285f4" on={on} />
        <EndDot x={320} y={9} color="#7b1fa2" on={on} />
      </svg>
      <p className="mt-2 text-[11px] text-neutral-400">
        Search performance — 12-month projection
      </p>
    </div>
  );
}

const AD_BARS = [18, 26, 22, 34, 30, 42, 38, 52, 58, 54, 70, 84];

function PaidViz({ on }: { on: boolean }) {
  const roas = useCountUp(42, on, 1400);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] text-neutral-400">Conversions per week</p>
        <p className="text-lg font-bold tabular-nums text-violet-700">
          {(roas / 10).toFixed(1)}×{" "}
          <span className="text-[11px] font-medium text-neutral-400">ROAS</span>
        </p>
      </div>
      <div className="mt-3 flex h-28 items-end gap-1.5">
        {AD_BARS.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-violet-600 transition-all duration-700 ease-out"
            style={{
              height: on ? `${h}%` : "0%",
              transitionDelay: `${i * 60}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-1.5 h-px bg-neutral-200" />
    </div>
  );
}

function AmazonViz({ on }: { on: boolean }) {
  const sales = useCountUp(182, on, 1400);
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold tabular-nums text-amber-700">
          +{sales}%{" "}
          <span className="text-[11px] font-medium text-neutral-400">sales</span>
        </p>
        <span
          className={`rounded-md bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white transition-all duration-500 ${
            on ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ transitionDelay: "1300ms" }}
        >
          #1 Best Seller
        </span>
      </div>
      <svg viewBox="0 0 320 110" className="mt-3 h-auto w-full overflow-visible" aria-hidden>
        <ChartGrid />
        <defs>
          <linearGradient id="oc-amz" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
        </defs>
        <DrawnPath
          on={on}
          stroke="#d97706"
          fill="url(#oc-amz)"
          d="M0,95 C40,93 70,88 100,80 C140,70 160,62 200,48 C240,34 280,24 320,12"
        />
        <EndDot x={320} y={12} color="#d97706" on={on} />
      </svg>
      <p className="mt-2 text-[11px] text-neutral-400">
        Marketplace revenue — first year on Amazon
      </p>
    </div>
  );
}

const HEARTS = [
  { left: "6%", delay: 0, char: "♥" },
  { left: "22%", delay: 1100, char: "👍" },
  { left: "38%", delay: 400, char: "♥" },
  { left: "58%", delay: 1600, char: "✦" },
  { left: "74%", delay: 800, char: "♥" },
  { left: "90%", delay: 2100, char: "👍" },
];

function SocialViz({ on }: { on: boolean }) {
  const followers = useCountUp(48200, on, 1600);
  return (
    <div className="relative flex items-end justify-between">
      <div>
        <p className="text-3xl font-black tabular-nums tracking-tight">
          {(followers / 1000).toFixed(1)}K
        </p>
        <p className="text-[11px] text-neutral-400">Followers — community growth</p>
      </div>
      <div className="relative h-24 w-1/2" aria-hidden>
        {on &&
          HEARTS.map((h, i) => (
            <span
              key={i}
              className="onelogy-oc-heart absolute bottom-0 text-base text-pink-500"
              style={{ left: h.left, animationDelay: `${h.delay}ms` }}
            >
              {h.char}
            </span>
          ))}
      </div>
    </div>
  );
}

function AwarenessViz({ on }: { on: boolean }) {
  const lift = useCountUp(34, on, 1400);
  return (
    <div className="flex items-center gap-6">
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center" aria-hidden>
        {on &&
          [0, 900, 1800].map((d) => (
            <span
              key={d}
              className="onelogy-oc-ring absolute inset-0 rounded-full border-2 border-teal-600"
              style={{ animationDelay: `${d}ms` }}
            />
          ))}
        <span className="h-3.5 w-3.5 rounded-full bg-teal-600" />
      </div>
      <div>
        <p className="text-3xl font-black tabular-nums tracking-tight text-teal-700">
          {(lift / 10).toFixed(1)}×
        </p>
        <p className="text-[11px] text-neutral-400">Branded search volume</p>
      </div>
    </div>
  );
}

const FUNNEL = [
  { label: "Visitors", w: 100, color: "#ddd6fe" },
  { label: "Carts", w: 62, color: "#c4b5fd" },
  { label: "Checkout", w: 38, color: "#a78bfa" },
  { label: "Orders", w: 24, color: "#7c3aed" },
];

function ConversionViz({ on }: { on: boolean }) {
  const rate = useCountUp(38, on, 1400);
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1 space-y-2">
        {FUNNEL.map((f, i) => (
          <div key={f.label} className="flex items-center gap-3">
            <span className="w-16 text-[11px] text-neutral-400">{f.label}</span>
            <div className="flex-1">
              <div
                className="h-6 rounded-r-md transition-all duration-700 ease-out"
                style={{
                  width: on ? `${f.w}%` : "0%",
                  backgroundColor: f.color,
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="shrink-0 text-right">
        <p className="text-3xl font-black tabular-nums tracking-tight text-violet-700">
          {(rate / 10).toFixed(1)}%
        </p>
        <p className="text-[11px] text-neutral-400">Conversion rate</p>
      </div>
    </div>
  );
}

function GrowthViz({ on }: { on: boolean }) {
  return (
    <div>
      <svg viewBox="0 0 320 110" className="h-auto w-full overflow-visible" aria-hidden>
        <ChartGrid />
        <defs>
          <linearGradient id="oc-growth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0" />
          </linearGradient>
        </defs>
        <DrawnPath
          on={on}
          stroke="#059669"
          fill="url(#oc-growth)"
          d="M0,104 C60,102 120,97 170,86 C220,74 260,48 320,8"
        />
        <EndDot x={320} y={8} color="#059669" on={on} />
      </svg>
      <p className="mt-2 text-[11px] text-neutral-400">
        Compounding revenue — every channel feeding the next
      </p>
    </div>
  );
}

/* Pointer-tracking 3D tilt for a chain card: the card leans toward the
   cursor and an accent-tinted sheen follows it (--gx/--gy). The rAF loop
   only runs while the pointer is over the card (plus the settle-back). */
function useCardTilt(
  frameRef: React.RefObject<HTMLDivElement | null>,
  cardRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!frame || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50 };
    let raf = 0;
    let hovering = false;

    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.1;
      cur.ry += (tgt.ry - cur.ry) * 0.1;
      cur.gx += (tgt.gx - cur.gx) * 0.14;
      cur.gy += (tgt.gy - cur.gy) * 0.14;
      card.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      card.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      card.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
      const settled =
        !hovering && Math.abs(cur.rx) < 0.02 && Math.abs(cur.ry) < 0.02;
      if (settled) {
        card.style.transform = "";
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      hovering = true;
      start();
    };
    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 8;
      tgt.rx = (0.5 - py) * 6;
      tgt.gx = px * 100;
      tgt.gy = py * 100;
    };
    const onLeave = () => {
      hovering = false;
      tgt.rx = 0;
      tgt.ry = 0;
      start();
    };

    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [frameRef, cardRef]);
}

/* ————— the chain ————— */

const CHAIN: {
  title: string;
  accent: string;
  Viz: ({ on }: { on: boolean }) => React.ReactNode;
}[] = [
  { title: "Website", accent: "#7c3aed", Viz: WebsiteViz },
  { title: "SEO & GEO", accent: "#4285f4", Viz: SeoViz },
  { title: "Paid Ads", accent: "#7c3aed", Viz: PaidViz },
  { title: "Amazon", accent: "#d97706", Viz: AmazonViz },
  { title: "Social Media", accent: "#ec4899", Viz: SocialViz },
  { title: "Brand Awareness", accent: "#0d9488", Viz: AwarenessViz },
  { title: "Higher Conversion", accent: "#7c3aed", Viz: ConversionViz },
  { title: "Sustainable Growth.", accent: "#059669", Viz: GrowthViz },
];

function ChainItem({
  title,
  accent,
  index,
  last,
  Viz,
}: (typeof CHAIN)[number] & { index: number; last: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  useCardTilt(frameRef, cardRef);
  return (
    <div ref={ref} className="flex flex-col items-center">
      <div
        ref={frameRef}
        className={`w-full transition-all duration-700 ease-out [perspective:1400px] ${
          inView ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <article
          ref={cardRef}
          className={`relative rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-[translate,rotate,box-shadow] duration-300 will-change-transform [transform-style:preserve-3d] hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_30px_70px_rgba(0,0,0,0.13)] sm:p-7 ${
            index % 2 ? "lg:rotate-[0.6deg]" : "lg:-rotate-[0.6deg]"
          }`}
        >
          {/* accent sheen following the pointer */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background: `radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), ${accent}14, transparent 65%)`,
            }}
          />
          <div style={{ transform: "translateZ(24px)" }}>
            <div className="mb-5 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden
              />
              <h3 className="text-xl font-bold tracking-[-0.01em] sm:text-2xl">
                {title}
              </h3>
              <span className="ml-auto text-xs font-semibold tabular-nums text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <Viz on={inView} />
          </div>
        </article>
      </div>
      {!last && (
        <div className="flex flex-col items-center py-1 text-neutral-300" aria-hidden>
          <span className="onelogy-oc-flow h-12 w-0.5" />
          <svg viewBox="0 0 12 8" className="h-2 w-3 fill-current">
            <path d="M0 0h12L6 8z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function OnelogyOutcome() {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      ref={ref}
      className="relative z-10 w-full bg-white pb-32 pt-8 text-neutral-900"
    >
      <div className="mx-auto max-w-xl px-6">
        <div
          className={`transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Expected Outcome
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-5xl">
            Expected Outcome
          </h2>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            A scalable digital ecosystem where every channel supports the
            others.
          </p>
        </div>

        <div className="mt-14">
          {CHAIN.map((c, i) => (
            <ChainItem
              key={c.title}
              {...c}
              index={i}
              last={i === CHAIN.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
