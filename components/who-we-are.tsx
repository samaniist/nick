"use client";

import { useMemo, useState } from "react";

import TiltHover from "@/components/tilt-hover";
import { useCountUp, useInView } from "@/components/viz-hooks";

/* ---------------------------------------------------------------------------
 * Light-mode palette — validated with the dataviz six-checks script on #fff:
 * CVD worst adjacent ΔE 47.2. Aqua/yellow sit below 3:1 on white, so the
 * relief rule applies: tooltips + the Data Details table carry every value.
 * ------------------------------------------------------------------------- */
const SURFACE = "#ffffff";
const INK = {
  secondary: "#52514e",
  muted: "#898781",
  grid: "#e7e6e0",
  axis: "#c3c2b7",
  up: "#006300",
  down: "#d03b3b",
};
const SERIES = [
  { key: "followers", label: "Followers", color: "#2a78d6" },
  { key: "reached", label: "Account Reached", color: "#1baf7a" },
  { key: "activity", label: "Post Activity", color: "#eda100" },
] as const;
type SeriesKey = (typeof SERIES)[number]["key"];
const REVENUE_COLOR = "#2a78d6";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const nf = new Intl.NumberFormat("en-US");
const compact = (v: number) => (v === 0 ? "0" : `${v / 1000}K`);
const sum = (a: readonly number[]) => a.reduce((x, y) => x + y, 0);

type TableRow = {
  no: string;
  date: string;
  likes: number;
  dLikes: number;
  reached: number;
  dReached: number;
  activity: number;
  dActivity: number;
};

type Period = {
  label: string;
  revenue: number[];
  stats: Record<SeriesKey, number[]>;
  rows: TableRow[];
};

const PERIODS: Record<"this" | "last", Period> = {
  this: {
    label: "This week",
    revenue: [450, 890, 720, 1600, 1280, 2400, 4650],
    stats: {
      followers: [640, 880, 540, 1120, 1880, 980, 1240],
      reached: [8600, 12400, 4800, 9800, 14630, 11200, 12900],
      activity: [6200, 9400, 8800, 7600, 11045, 9800, 13400],
    },
    rows: [
      { no: "01", date: "18 Feb 2022", likes: 1678, dLikes: 56, reached: 5678, dReached: -13, activity: 8678, dActivity: 113 },
      { no: "02", date: "17 Feb 2022", likes: 1522, dLikes: 41, reached: 6104, dReached: 87, activity: 7940, dActivity: -24 },
      { no: "03", date: "16 Feb 2022", likes: 1481, dLikes: -18, reached: 5017, dReached: 52, activity: 8121, dActivity: 66 },
    ],
  },
  last: {
    label: "Last week",
    revenue: [380, 540, 900, 760, 1500, 1900, 2800],
    stats: {
      followers: [420, 560, 730, 480, 1150, 860, 940],
      reached: [6200, 8800, 7400, 5600, 10900, 9400, 8100],
      activity: [4800, 7200, 6600, 8200, 9100, 7800, 10200],
    },
    rows: [
      { no: "01", date: "11 Feb 2022", likes: 1390, dLikes: 34, reached: 4980, dReached: 61, activity: 7410, dActivity: -19 },
      { no: "02", date: "10 Feb 2022", likes: 1344, dLikes: -12, reached: 5216, dReached: -44, activity: 7602, dActivity: 88 },
      { no: "03", date: "09 Feb 2022", likes: 1301, dLikes: 27, reached: 4735, dReached: 29, activity: 6987, dActivity: 41 },
    ],
  },
};

/* Catmull-Rom → cubic bézier for a smooth line through all points. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

/* Column with a 4px rounded data-end and a square baseline. */
function barPath(x: number, y: number, w: number, baseline: number) {
  const r = Math.min(4, Math.max(baseline - y, 0), w / 2);
  return `M ${x} ${baseline} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${baseline} Z`;
}

function Rise({
  inView,
  delay,
  className = "",
  children,
}: {
  inView: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inView ? "viz-rise" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Like Rise, but the card tips in from below in 3D — the grid parent
   carries the perspective. */
function Land({
  inView,
  delay,
  className = "",
  children,
}: {
  inView: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inView ? "viz-land" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-zinc-950/10 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-950/15 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] sm:p-6 ${className}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-medium text-zinc-950">{title}</h3>
        <span className="text-xs text-zinc-400">{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function Tooltip({
  x,
  y,
  flip,
  children,
}: {
  x: number;
  y: number;
  flip: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-md border border-zinc-950/10 bg-white px-3 py-2 shadow-xl shadow-zinc-950/10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(${flip ? "-108%" : "8%"}, -50%)`,
      }}
    >
      {children}
    </div>
  );
}

/* -------------------------------- Stat tiles ------------------------------ */

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 96;
  const h = 30;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => ({
    x: 4 + (i * (w - 8)) / (data.length - 1),
    y: 4 + (h - 8) * (1 - (v - min) / Math.max(max - min, 1)),
  }));
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[30px] w-24 shrink-0" aria-hidden="true">
      <path d={smoothPath(pts)} fill="none" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={last.x} cy={last.y} r="3" fill={color} stroke={SURFACE} strokeWidth="1.5" />
    </svg>
  );
}

function StatTile({
  label,
  prefix = "",
  data,
  color,
  deltaPct,
  active,
}: {
  label: string;
  prefix?: string;
  data: number[];
  color: string;
  deltaPct: number | null;
  active: boolean;
}) {
  const total = sum(data);
  const display = useCountUp(total, active);
  const up = (deltaPct ?? 0) >= 0;
  return (
    <div className="rounded-md border border-zinc-950/10 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)]">
      <div className="text-[13px] text-zinc-500">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold tracking-tight text-zinc-950">
          {prefix}
          {nf.format(display)}
        </span>
        <Sparkline data={data} color={color} />
      </div>
      <div className="mt-2 h-4 text-xs">
        {deltaPct !== null && (
          <>
            <span className="font-medium" style={{ color: up ? INK.up : INK.down }}>
              {up ? "↑" : "↓"} {up ? "+" : "−"}
              {Math.abs(deltaPct).toFixed(1)}%
            </span>
            <span className="text-zinc-400"> vs last week</span>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- Revenue -------------------------------- */

function RevenueChart({ data, periodKey, inView }: { data: number[]; periodKey: string; inView: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const VB = { w: 560, h: 232 };
  const pad = { l: 44, r: 52, t: 18, b: 26 };
  const max = 5000;
  const ticks = [0, 2500, 5000];

  const pts = useMemo(
    () =>
      data.map((v, i) => ({
        x: pad.l + (i * (VB.w - pad.l - pad.r)) / (data.length - 1),
        y: pad.t + (VB.h - pad.t - pad.b) * (1 - v / max),
      })),
    [data, pad.l, pad.r, pad.t, pad.b, VB.w, VB.h],
  );
  const line = smoothPath(pts);
  const baseline = VB.h - pad.b;
  const area = `${line} L ${pts[pts.length - 1].x} ${baseline} L ${pts[0].x} ${baseline} Z`;
  const last = pts[pts.length - 1];

  const nearest = (clientX: number, el: SVGSVGElement) => {
    const rect = el.getBoundingClientRect();
    const vx = ((clientX - rect.left) / rect.width) * VB.w;
    let best = 0;
    pts.forEach((p, i) => {
      if (Math.abs(p.x - vx) < Math.abs(pts[best].x - vx)) best = i;
    });
    return best;
  };

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block h-auto w-full touch-pan-y select-none focus:outline-none"
        role="img"
        aria-label={`Revenue by day, ${periodKey === "this" ? "this week" : "last week"}. ${data.map((v, i) => `${DAYS[i]} $${nf.format(v)}`).join(", ")}.`}
        tabIndex={0}
        onPointerMove={(e) => setHover(nearest(e.clientX, e.currentTarget))}
        onPointerDown={(e) => setHover(nearest(e.clientX, e.currentTarget))}
        // on touch, leave fires right after the tap — keep the tooltip up
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHover(null);
        }}
        onBlur={() => setHover(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h) => Math.min((h ?? -1) + 1, data.length - 1));
          if (e.key === "ArrowLeft") setHover((h) => Math.max((h ?? data.length) - 1, 0));
          if (e.key === "Escape") setHover(null);
        }}
      >
        <defs>
          <linearGradient id="rev-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={REVENUE_COLOR} stopOpacity="0.15" />
            <stop offset="100%" stopColor={REVENUE_COLOR} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((t) => {
          const y = pad.t + (VB.h - pad.t - pad.b) * (1 - t / max);
          return (
            <g key={t}>
              <line x1={pad.l} x2={VB.w - pad.r} y1={y} y2={y} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth="1" />
              <text x={pad.l - 8} y={y + 3.5} textAnchor="end" fontSize="11" fill={INK.muted} className="tabular-nums">
                {t === 0 ? "$0" : `$${compact(t)}`}
              </text>
            </g>
          );
        })}
        {pts.map((p, i) => (
          <text key={DAYS[i]} x={p.x} y={VB.h - 8} textAnchor="middle" fontSize="11" fill={INK.muted}>
            {DAYS[i]}
          </text>
        ))}

        {inView && (
          <g key={periodKey}>
            <path d={area} fill="url(#rev-wash)" className="viz-fade" style={{ animationDelay: "500ms" }} />
            <path
              d={line}
              fill="none"
              stroke={REVENUE_COLOR}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="viz-draw"
            />
            <g className="viz-fade" style={{ animationDelay: "800ms" }}>
              <circle cx={last.x} cy={last.y} r="5" fill={REVENUE_COLOR} className="viz-pulse" />
              <circle cx={last.x} cy={last.y} r="4.5" fill={REVENUE_COLOR} stroke={SURFACE} strokeWidth="2" />
              <text x={last.x + 10} y={last.y + 4} fontSize="12" fontWeight="600" fill="#0b0b0b" className="tabular-nums">
                ${nf.format(data[data.length - 1])}
              </text>
            </g>
          </g>
        )}

        {hover !== null && (
          <g>
            <line x1={pts[hover].x} x2={pts[hover].x} y1={pad.t} y2={baseline} stroke={INK.axis} strokeWidth="1" />
            <circle cx={pts[hover].x} cy={pts[hover].y} r="4.5" fill={REVENUE_COLOR} stroke={SURFACE} strokeWidth="2" />
          </g>
        )}
      </svg>

      {hover !== null && (
        <Tooltip x={(pts[hover].x / VB.w) * 100} y={(pts[hover].y / VB.h) * 100} flip={hover > data.length / 2}>
          <div className="text-xs text-zinc-500">{DAYS[hover]}</div>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="h-0.5 w-2.5 rounded-full" style={{ background: REVENUE_COLOR }} />
            <span className="text-sm font-semibold text-zinc-950 tabular-nums">${nf.format(data[hover])}</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

/* -------------------------------- Statistics ------------------------------ */

function StatsChart({
  stats,
  visible,
  inView,
}: {
  stats: Record<SeriesKey, number[]>;
  visible: Set<SeriesKey>;
  inView: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const VB = { w: 640, h: 316 };
  const pad = { l: 42, r: 8, t: 14, b: 26 };
  const max = 16000;
  const ticks = [0, 4000, 8000, 12000, 16000];
  const baseline = VB.h - pad.b;
  const band = (VB.w - pad.l - pad.r) / DAYS.length;
  const active = SERIES.filter((s) => visible.has(s.key));
  const barW = 13;
  const gap = 2; // surface gap between touching bars
  const trioW = active.length * barW + (active.length - 1) * gap;
  const y = (v: number) => pad.t + (baseline - pad.t) * (1 - v / max);

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block h-auto w-full touch-pan-y select-none focus:outline-none"
        role="img"
        aria-label={`Statistics by day: ${active.map((s) => s.label).join(", ")}. Values also shown in the data details table.`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setHover((h) => Math.min((h ?? -1) + 1, DAYS.length - 1));
          if (e.key === "ArrowLeft") setHover((h) => Math.max((h ?? DAYS.length) - 1, 0));
          if (e.key === "Escape") setHover(null);
        }}
        onBlur={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={VB.w - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? INK.axis : INK.grid} strokeWidth="1" />
            <text x={pad.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="11" fill={INK.muted} className="tabular-nums">
              {compact(t)}
            </text>
          </g>
        ))}

        {DAYS.map((day, i) => {
          const cx = pad.l + i * band + band / 2;
          const x0 = cx - trioW / 2;
          const dimmed = hover !== null && hover !== i;
          return (
            <g
              key={day}
              className={inView ? "viz-rise" : ""}
              style={{
                animationDelay: `${i * 70}ms`,
                opacity: inView ? undefined : 0,
                transition: "opacity 200ms ease",
                ...(dimmed ? { opacity: 0.4 } : null),
              }}
            >
              {active.map((s, j) => {
                const v = stats[s.key][i];
                return (
                  <path
                    key={s.key}
                    d={barPath(x0 + j * (barW + gap), y(v), barW, baseline)}
                    fill={s.color}
                    style={{
                      filter: hover === i ? "brightness(0.92) saturate(1.15)" : undefined,
                      transition: "filter 150ms ease",
                    }}
                  />
                );
              })}
              <text x={cx} y={VB.h - 8} textAnchor="middle" fontSize="11" fill={hover === i ? INK.secondary : INK.muted}>
                {day}
              </text>
            </g>
          );
        })}

        {/* full-height hit targets, wider than the marks */}
        {DAYS.map((day, i) => (
          <rect
            key={day}
            x={pad.l + i * band}
            y={pad.t}
            width={band}
            height={baseline - pad.t}
            fill="transparent"
            onPointerMove={() => setHover(i)}
            onPointerDown={() => setHover(i)}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setHover(null);
            }}
          />
        ))}
      </svg>

      {hover !== null && (
        <Tooltip
          x={((pad.l + hover * band + band / 2) / VB.w) * 100}
          y={((pad.t + baseline) / 2 / VB.h) * 100}
          flip={hover > DAYS.length / 2 - 1}
        >
          <div className="text-xs text-zinc-500">{DAYS[hover]}</div>
          <div className="mt-1 space-y-1">
            {active.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <span className="h-0.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
                <span className="text-sm font-semibold text-zinc-950 tabular-nums">{nf.format(stats[s.key][hover])}</span>
                <span className="text-xs text-zinc-500">{s.label}</span>
              </div>
            ))}
          </div>
        </Tooltip>
      )}
    </div>
  );
}

/* --------------------------------- Section -------------------------------- */

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className="text-xs font-medium tabular-nums" style={{ color: up ? INK.up : INK.down }}>
      {up ? "+" : "−"}
      {Math.abs(value)}
    </span>
  );
}

export default function WhoWeAre() {
  const [periodKey, setPeriodKey] = useState<"this" | "last">("this");
  const [visible, setVisible] = useState<Set<SeriesKey>>(new Set(SERIES.map((s) => s.key)));
  const { ref, inView } = useInView<HTMLElement>();
  const period = PERIODS[periodKey];

  const deltas = useMemo(() => {
    if (periodKey !== "this") return { revenue: null, followers: null, reached: null };
    const pct = (t: number[], l: number[]) => ((sum(t) - sum(l)) / sum(l)) * 100;
    return {
      revenue: pct(PERIODS.this.revenue, PERIODS.last.revenue),
      followers: pct(PERIODS.this.stats.followers, PERIODS.last.stats.followers),
      reached: pct(PERIODS.this.stats.reached, PERIODS.last.stats.reached),
    };
  }, [periodKey]);

  const toggleSeries = (key: SeriesKey) => {
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size === 1) return prev; // keep at least one series
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <section
      ref={ref}
      id="who-we-are"
      className="relative z-20 rounded-t-[32px] bg-white py-20 font-sans text-zinc-950 shadow-[0_-32px_64px_-24px_rgba(0,0,0,0.5)] sm:py-24"
    >
      <div className="px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-zinc-400" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              Who We Are
            </span>
          </div>
        </Rise>
        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Rise inView={inView} delay={80}>
            <h2 className="max-w-2xl text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              Accelerate Your Company&apos;s <span className="text-zinc-400">Revenue Growth.</span>
            </h2>
          </Rise>
          <Rise inView={inView} delay={160}>
            <p className="max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg">
              Creative design, robust development and strong brands — that is
              our promise of exceptional digital solutions. We pair innovative
              design with high-performance engineering to build products that
              don&apos;t just impress, they deliver measurable results.
            </p>
          </Rise>
        </div>

        <div className="mt-12">
          <Rise inView={inView} delay={220}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div
                className="inline-flex rounded-[3px] border border-zinc-950/10 p-1"
                role="group"
                aria-label="Time range"
              >
                {(Object.keys(PERIODS) as ("this" | "last")[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPeriodKey(key)}
                    aria-pressed={periodKey === key}
                    className={`rounded-[2px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                      periodKey === key
                        ? "bg-zinc-950 text-white"
                        : "text-zinc-500 hover:text-zinc-950"
                    }`}
                  >
                    {PERIODS[key].label}
                  </button>
                ))}
              </div>
              <span className="text-xs text-zinc-400">Sample data for illustration</span>
            </div>
          </Rise>

          <div className="mt-4 grid gap-4 [perspective:1200px] sm:grid-cols-3">
            <Land inView={inView} delay={280}>
              <TiltHover max={5}>
                <StatTile label="Weekly revenue" prefix="$" data={period.revenue} color={REVENUE_COLOR} deltaPct={deltas.revenue} active={inView} />
              </TiltHover>
            </Land>
            <Land inView={inView} delay={360}>
              <TiltHover max={5}>
                <StatTile label="New followers" data={period.stats.followers} color={SERIES[0].color} deltaPct={deltas.followers} active={inView} />
              </TiltHover>
            </Land>
            <Land inView={inView} delay={440}>
              <TiltHover max={5}>
                <StatTile label="Accounts reached" data={period.stats.reached} color={SERIES[1].color} deltaPct={deltas.reached} active={inView} />
              </TiltHover>
            </Land>
          </div>

          <div className="mt-4 grid gap-4 [perspective:1600px] lg:grid-cols-12">
            {/* min-w-0: let the tracks shrink below the table's min width on
                phones so the table scrolls inside its card instead of
                stretching the page */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
              <Land inView={inView} delay={520}>
                <Card title="Revenue" subtitle={period.label}>
                  <RevenueChart data={period.revenue} periodKey={periodKey} inView={inView} />
                </Card>
              </Land>

              <Land inView={inView} delay={600} className="flex-1">
                <Card title="Data Details" subtitle="Daily engagement" className="h-full">
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[380px] text-left text-[13px]">
                      <thead>
                        <tr className="border-b border-zinc-950/10 text-xs text-zinc-400">
                          <th className="pb-2 pr-3 font-normal">No</th>
                          <th className="pb-2 pr-3 font-normal">Date</th>
                          <th className="pb-2 pr-3 font-normal">Likes</th>
                          <th className="pb-2 pr-3 font-normal">Reached</th>
                          <th className="pb-2 font-normal">Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {period.rows.map((row) => (
                          <tr
                            key={row.no}
                            className="border-b border-zinc-950/5 transition-colors last:border-0 hover:bg-zinc-950/[0.03]"
                          >
                            <td className="py-2.5 pr-3 text-zinc-400 tabular-nums">{row.no}</td>
                            <td className="py-2.5 pr-3 text-zinc-600">{row.date}</td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {nf.format(row.likes)} <Delta value={row.dLikes} />
                            </td>
                            <td className="py-2.5 pr-3 tabular-nums">
                              {nf.format(row.reached)} <Delta value={row.dReached} />
                            </td>
                            <td className="py-2.5 tabular-nums">
                              {nf.format(row.activity)} <Delta value={row.dActivity} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </Land>
            </div>

            <Land inView={inView} delay={680} className="min-w-0 lg:col-span-7">
              <Card title="Statistics" subtitle={period.label} className="flex h-full flex-col">
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Toggle series">
                  {SERIES.map((s) => {
                    const on = visible.has(s.key);
                    return (
                      <button
                        key={s.key}
                        type="button"
                        onClick={() => toggleSeries(s.key)}
                        aria-pressed={on}
                        className={`flex items-center gap-2 rounded-[3px] border px-2.5 py-1 text-xs transition-colors ${
                          on
                            ? "border-zinc-950/10 text-zinc-600 hover:border-zinc-950/25"
                            : "border-zinc-950/5 text-zinc-300 hover:text-zinc-500"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-[2px]"
                          style={{
                            background: on ? s.color : "transparent",
                            boxShadow: on ? undefined : `inset 0 0 0 1.5px ${s.color}`,
                          }}
                        />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <StatsChart stats={period.stats} visible={visible} inView={inView} />
                </div>
              </Card>
            </Land>
          </div>
        </div>
      </div>
    </section>
  );
}
