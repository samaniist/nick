/* One animated scene per process step — monochrome, pure SVG/CSS (keyframes
   in components/process.css, all prefixed "pv-"). The process panel remounts
   the scene whenever the step changes, so every scene plays its intro from
   the start and then keeps looping gently. */

import { ArrowUp } from "@/components/icons";

function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(255,255,255,0.07),rgba(0,0,0,0.35)_60%)] ${className}`}
    >
      {/* faint dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function Dots() {
  return (
    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      <span className="ml-2 h-2.5 flex-1 rounded-full bg-white/[0.07]" />
    </div>
  );
}

/* ---- 01 Analysis: a website gets scanned; findings drop into insight cards */
export function AnalysisViz() {
  const insights = [
    { label: "Target audience", w: "82%" },
    { label: "Search intent", w: "64%" },
    { label: "Competitors", w: "91%" },
  ];
  return (
    <Frame className="grid grid-cols-[1.15fr_1fr] gap-3 p-3 sm:gap-4 sm:p-4">
      {/* scanned site */}
      <div className="pv-in relative overflow-hidden rounded-lg border border-white/12 bg-black/40">
        <Dots />
        <div className="space-y-2 p-3">
          <div className="h-10 rounded-md bg-white/[0.08] sm:h-14" />
          <div className="h-1.5 w-4/5 rounded-full bg-white/15" />
          <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="h-7 rounded bg-white/[0.07] sm:h-9" />
            <div className="h-7 rounded bg-white/[0.07] sm:h-9" />
            <div className="h-7 rounded bg-white/[0.07] sm:h-9" />
          </div>
        </div>
        {/* hotspots light up as the beam passes */}
        {[
          { l: "22%", t: "34%", d: "0.5s" },
          { l: "68%", t: "56%", d: "1.3s" },
          { l: "40%", t: "80%", d: "2.1s" },
        ].map((h) => (
          <span
            key={h.l}
            className="pv-hot absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            style={{ left: h.l, top: h.t, animationDelay: h.d }}
          />
        ))}
        {/* scan beam */}
        <span className="pv-scan pointer-events-none absolute inset-x-0 h-12 bg-linear-to-b from-transparent to-white/25">
          <span className="absolute inset-x-0 bottom-0 h-px bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.7)]" />
        </span>
      </div>

      {/* insights */}
      <div className="flex flex-col justify-center gap-2 sm:gap-2.5">
        {insights.map((it, i) => (
          <div
            key={it.label}
            className="pv-in rounded-lg border border-white/12 bg-white/[0.05] p-2 sm:p-2.5"
            style={{ animationDelay: `${0.35 + i * 0.25}s` }}
          >
            <div className="flex items-center justify-between text-[10px] text-zinc-400 sm:text-[11px]">
              <span>{it.label}</span>
              <span className="pv-blink h-1.5 w-1.5 rounded-full bg-white" style={{ animationDelay: `${i * 0.6}s` }} />
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="pv-meter h-full rounded-full bg-white"
                style={{ ["--w" as string]: it.w, animationDelay: `${0.6 + i * 0.25}s` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---- 02 Strategy: a roadmap draws itself; milestones pop; a token travels */
export function StrategyViz() {
  const path = "M 24 160 C 70 160, 70 96, 118 104 S 176 150, 214 96 S 262 36, 296 40";
  const stops = [
    { x: 24, y: 160, label: "Goals", d: 0.2 },
    { x: 118, y: 104, label: "Channels", d: 0.8 },
    { x: 214, y: 96, label: "Budget", d: 1.4 },
    { x: 296, y: 40, label: "KPIs", d: 2 },
  ];
  return (
    <Frame>
      <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {/* ghost route + drawn route */}
        <path d={path} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="3 6" />
        <path d={path} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" pathLength={1} className="pv-draw" />

        {/* target rings at the finish */}
        {[0, 0.8, 1.6].map((d) => (
          <circle key={d} cx="296" cy="40" r="10" fill="none" stroke="#fff" className="pv-ring" style={{ animationDelay: `${2.2 + d}s` }} />
        ))}

        {stops.map((s) => (
          <g key={s.label} className="pv-pop" style={{ animationDelay: `${s.d}s` }}>
            <circle cx={s.x} cy={s.y} r="7" fill="#000" stroke="#fff" strokeWidth="2" />
            <circle cx={s.x} cy={s.y} r="2.6" fill="#fff" />
            <text
              x={s.x}
              y={s.y > 120 ? s.y - 16 : s.y + 24}
              textAnchor={s.x < 40 ? "start" : s.x > 280 ? "end" : "middle"}
              className="fill-zinc-300 text-[11px] font-medium"
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* token riding the route */}
        <circle r="4.5" fill="#fff" className="pv-fadein" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.9))" }}>
          <animateMotion dur="4.8s" begin="2.2s" repeatCount="indefinite" path={path} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
        </circle>
      </svg>
    </Frame>
  );
}

/* ---- 03 Implementation: code types itself while the live preview assembles */
export function ImplementationViz() {
  const code = [
    { w: "70%", indent: 0 },
    { w: "54%", indent: 1 },
    { w: "78%", indent: 2 },
    { w: "46%", indent: 2 },
    { w: "60%", indent: 1 },
    { w: "36%", indent: 0 },
  ];
  return (
    <Frame className="grid grid-cols-2 gap-3 p-3 sm:gap-4 sm:p-4">
      {/* editor */}
      <div className="pv-in flex flex-col overflow-hidden rounded-lg border border-white/12 bg-black/50">
        <Dots />
        <div className="flex flex-1 flex-col justify-center gap-2 px-3 py-2">
          {code.map((l, i) => (
            <div key={i} className="flex items-center gap-2" style={{ paddingLeft: `${l.indent * 10}px` }}>
              <span className="w-2.5 text-right text-[8px] text-zinc-600 tabular-nums">{i + 1}</span>
              <span
                className="pv-type h-1.5 rounded-full bg-white/40"
                style={{ ["--w" as string]: l.w, animationDelay: `${i * 0.45}s` }}
              />
            </div>
          ))}
        </div>
        {/* build bar */}
        <div className="border-t border-white/10 px-3 py-2">
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="pv-build h-full rounded-full bg-white" />
          </div>
        </div>
      </div>

      {/* live preview */}
      <div className="pv-in relative flex flex-col overflow-hidden rounded-lg border border-white/12 bg-white/[0.04]" style={{ animationDelay: "0.2s" }}>
        <Dots />
        <div className="flex-1 space-y-1.5 p-2.5">
          <div className="pv-block h-8 rounded-md bg-white/85 sm:h-11" style={{ animationDelay: "0.5s" }} />
          <div className="pv-block h-1.5 w-3/4 rounded-full bg-white/30" style={{ animationDelay: "1.1s" }} />
          <div className="pv-block grid grid-cols-3 gap-1.5 pt-1" style={{ animationDelay: "1.7s" }}>
            <div className="h-6 rounded bg-white/20 sm:h-8" />
            <div className="h-6 rounded bg-white/20 sm:h-8" />
            <div className="h-6 rounded bg-white/20 sm:h-8" />
          </div>
          <div className="pv-block h-4 w-1/3 rounded bg-white/60" style={{ animationDelay: "2.3s" }} />
        </div>
        <span className="pv-live absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold text-black sm:text-[10px]">
          <span className="h-1.5 w-1.5 rounded-full bg-black" /> Live
        </span>
      </div>
    </Frame>
  );
}

/* ---- 04 Growth: the chart climbs, the peak pulses, KPI tiles rise */
export function GrowthViz() {
  const pts = [
    [16, 128],
    [60, 112],
    [104, 118],
    [148, 86],
    [192, 92],
    [236, 56],
    [280, 30],
  ];
  const line = `M ${pts.map((p) => p.join(" ")).join(" L ")}`;
  const area = `${line} L 280 150 L 16 150 Z`;
  const kpis = [
    { label: "Leads", h: "78%" },
    { label: "Traffic", h: "64%" },
    { label: "Revenue", h: "88%" },
  ];
  return (
    <Frame className="flex flex-col">
      <div className="relative min-h-0 flex-1">
        <svg viewBox="0 0 296 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="pv-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[45, 85, 125].map((y) => (
            <line key={y} x1="0" x2="296" y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={area} fill="url(#pv-area)" className="pv-fadein" style={{ animationDelay: "1.2s" }} />
          <path d={line} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="pv-draw" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* peak marker (HTML so it stays round on the stretched chart) */}
        <span className="pv-pop absolute" style={{ left: `${(280 / 296) * 100}%`, top: `${(30 / 160) * 100}%`, animationDelay: "1.9s" }}>
          <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
          <span className="pv-ping absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-white" />
        </span>
        <span className="pv-pop absolute right-3 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-black sm:text-[11px]" style={{ animationDelay: "2.1s" }}>
          <ArrowUp className="h-3 w-3" /> Growing
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-white/10 p-2.5 sm:gap-3 sm:p-3">
        {kpis.map((k, i) => (
          <div key={k.label} className="pv-in flex items-end justify-between gap-2 rounded-md bg-white/[0.05] px-2 py-1.5" style={{ animationDelay: `${0.4 + i * 0.2}s` }}>
            <span className="inline-flex items-center gap-0.5 text-[10px] text-zinc-400 sm:text-[11px]">{k.label} <ArrowUp className="h-2.5 w-2.5" /></span>
            <span className="flex h-6 w-6 items-end sm:h-7">
              <span className="pv-grow w-full rounded-sm bg-white" style={{ ["--h" as string]: k.h, animationDelay: `${0.8 + i * 0.25}s` }} />
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
