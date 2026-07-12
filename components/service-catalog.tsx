"use client";

import { useEffect, useRef } from "react";

import { useInView } from "@/components/viz-hooks";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/* ————— card visuals: monochrome UI mockups (white windows, zinc strokes),
   matching the site's black/white palette on both card tones ————— */

function Window({
  dark = false,
  className = "",
  children,
}: {
  dark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] ${
        dark
          ? "border-zinc-700 bg-zinc-950 text-white"
          : "border-zinc-950/10 bg-white text-zinc-950"
      } ${className}`}
    >
      <div
        className={`flex items-center gap-1.5 border-b px-3 py-2 ${
          dark ? "border-zinc-800" : "border-zinc-950/10"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${dark ? "bg-white/25" : "bg-zinc-300"}`} />
        <span className={`h-2 w-2 rounded-full ${dark ? "bg-white/25" : "bg-zinc-300"}`} />
        <span className={`h-2 w-2 rounded-full ${dark ? "bg-white/25" : "bg-zinc-300"}`} />
        <span className={`ml-2 h-3 flex-1 rounded-full ${dark ? "bg-white/10" : "bg-zinc-100"}`} />
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

function Cursor({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none absolute z-10 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="svc-cursor h-5 w-5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
        <path d="M5 3l14 8-6.5 1.5L9 19 5 3z" fill="#18181b" stroke="#ffffff" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-2 w-2 fill-current" aria-hidden="true">
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
    </svg>
  );
}

function WebdesignViz() {
  return (
    <div className="relative h-full min-h-[250px] w-full lg:min-h-[340px]">
      {/* main browser: a real miniature site */}
      <Window className="absolute left-0 top-1/2 w-[78%] -translate-y-1/2">
        {/* nav */}
        <div className="flex items-center justify-between px-0.5 pb-1.5">
          <span className="flex items-center gap-1">
            <span className="h-3 w-3 rounded-full bg-zinc-950" />
            <span className="text-[9px] font-bold tracking-tight">STUDIO</span>
          </span>
          <span className="flex items-center gap-2 text-[8px] text-zinc-500">
            <span>Work</span>
            <span>Services</span>
            <span>About</span>
            <span className="rounded-full bg-zinc-950 px-2 py-0.5 font-semibold text-white">
              Contact
            </span>
          </span>
        </div>
        {/* hero */}
        <div className="relative overflow-hidden rounded-lg bg-zinc-950 px-4 py-4 text-white">
          <span className="absolute -right-5 -top-8 h-24 w-24 rounded-full border border-white/15" aria-hidden="true" />
          <span className="absolute right-2 top-9 h-10 w-10 rounded-full border border-white/10" aria-hidden="true" />
          <p className="text-[7px] uppercase tracking-[0.22em] text-zinc-400">
            Digital studio
          </p>
          <p className="mt-1 text-[16px] font-bold leading-[1.05] tracking-tight">
            Websites that
            <br />
            convert visitors.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="svc-press rounded-full bg-white px-2.5 py-1 text-[7px] font-bold text-zinc-950">
              Start a project ↗
            </span>
            <span className="rounded-full border border-white/30 px-2.5 py-1 text-[7px] text-white/80">
              See work
            </span>
          </div>
          <span className="svc-sweep" />
        </div>
        {/* feature strip */}
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { t: "Design", d: "UI & brand" },
            { t: "Develop", d: "Fast builds" },
            { t: "Launch", d: "SEO-ready" },
          ].map((f) => (
            <div key={f.t} className="rounded-md border border-zinc-950/10 p-1.5">
              <span className="block text-[9px] font-bold">{f.t}</span>
              <span className="block text-[7px] text-zinc-500">{f.d}</span>
            </div>
          ))}
        </div>
        {/* social proof row */}
        <div className="mt-2 flex items-center justify-between rounded-md bg-zinc-100 px-2 py-1.5">
          <span className="flex items-center gap-0.5 text-zinc-950">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </span>
          <span className="text-[7px] font-medium text-zinc-500">
            Trusted by 130+ clients
          </span>
        </div>
      </Window>

      {/* phone mockup, floating in front */}
      <div className="viz-float absolute -right-1 top-1/2 z-10 w-[27%] -translate-y-1/2 rotate-3 rounded-[16px] bg-zinc-950 p-1 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
        <div className="overflow-hidden rounded-[12px] bg-white">
          <div className="mx-auto mt-1 h-0.5 w-7 rounded-full bg-zinc-300" aria-hidden="true" />
          <div className="p-1.5">
            <div className="relative overflow-hidden rounded-md bg-zinc-950 px-2 py-2.5 text-white">
              <p className="text-[8px] font-bold leading-tight">
                Mobile
                <br />
                first.
              </p>
              <span className="svc-sweep" />
            </div>
            <div className="mt-1.5 space-y-1">
              <span className="block h-1.5 w-full rounded bg-zinc-100" />
              <span className="block h-1.5 w-4/5 rounded bg-zinc-100" />
              <span className="block h-1.5 w-full rounded bg-zinc-100" />
            </div>
            <span className="svc-press mt-1.5 block rounded-full bg-zinc-950 py-1 text-center text-[7px] font-bold text-white">
              Get a quote
            </span>
          </div>
        </div>
      </div>

      {/* pagespeed gauge */}
      <div className="svc-pop absolute bottom-[12%] left-1 z-10 flex items-center gap-1.5 rounded-full bg-white py-1 pl-1 pr-2.5 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)] ring-1 ring-zinc-950/10">
        <span className="relative flex h-6 w-6 items-center justify-center">
          <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#e4e4e7" strokeWidth="2.5" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="63" />
          </svg>
          <span className="text-[8px] font-bold tabular-nums">100</span>
        </span>
        <span className="text-[8px] font-semibold text-zinc-600">PageSpeed</span>
      </div>

      <span className="svc-pop absolute right-[26%] top-0 z-10 rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg" style={{ animationDelay: "2.2s" }}>
        Site live ↗
      </span>
      <Cursor className="left-[46%] top-[52%]" />
    </div>
  );
}

function SeoViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="flex items-center gap-2 rounded-full border border-zinc-950/15 px-3 py-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="flex min-w-0 flex-1 items-center">
            <span className="svc-type overflow-hidden whitespace-nowrap text-[10px] text-zinc-700">
              web design agency munich
            </span>
            <span className="svc-caret ml-0.5 h-3 w-0.5 shrink-0 bg-zinc-950" />
          </span>
        </div>
        <p className="mt-2 px-1 text-[8px] text-zinc-400">
          About 2,410,000 results (0.42 seconds)
        </p>
        <div className="mt-1.5 space-y-2">
          <div className="relative rounded-lg bg-zinc-950 p-2.5 text-white">
            <div className="flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[8px] font-bold text-zinc-950">
                N
              </span>
              <span className="text-[8px] text-zinc-400">nexlytic.de</span>
              <span className="ml-auto flex h-5 w-6 items-center justify-center rounded bg-white text-[9px] font-bold text-zinc-950">
                #1
              </span>
            </div>
            <p className="mt-1.5 text-[10px] font-semibold leading-tight">
              Nexlytic — Web Design & Digital Growth Agency
            </p>
            <p className="mt-0.5 text-[8px] leading-snug text-zinc-400">
              Modern, high-performing websites that convert visitors into
              customers…
            </p>
            <span className="svc-pop absolute -right-2 -top-2 rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-zinc-950 shadow-md ring-1 ring-zinc-950/10">
              ▲ +6
            </span>
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-lg border border-zinc-950/10 p-2.5">
              <span className="svc-shimmer h-6 w-6 shrink-0 rounded-full" style={{ animationDelay: `${i * 0.4}s` }} />
              <span className="min-w-0 flex-1 space-y-1">
                <span className="block h-2 w-2/3 rounded bg-zinc-200" />
                <span className="block h-1.5 w-1/3 rounded bg-zinc-100" />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <svg viewBox="0 0 170 40" className="h-auto min-w-0 flex-1 overflow-visible" aria-hidden="true">
            <path
              d="M4 34 C34 32 50 27 74 23 C104 18 128 13 166 4"
              fill="none"
              stroke="#18181b"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
              className="svc-draw"
            />
            <circle cx="166" cy="4" r="3.5" fill="#18181b" />
            <circle cx="166" cy="4" fill="none" stroke="#18181b" strokeWidth="1.5" className="viz-pulse" />
          </svg>
          <span className="shrink-0 text-right">
            <span className="block text-sm font-bold tabular-nums leading-none">+312%</span>
            <span className="text-[8px] text-zinc-400">organic clicks</span>
          </span>
        </div>
      </Window>
    </div>
  );
}

const PM_BARS = [
  { h: 34, min: 0.5 },
  { h: 26, min: 0.65 },
  { h: 44, min: 0.55 },
  { h: 38, min: 0.7 },
  { h: 56, min: 0.5 },
  { h: 50, min: 0.65 },
  { h: 68, min: 0.6 },
  { h: 62, min: 0.75 },
  { h: 82, min: 0.55 },
];

function PerformanceViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="flex items-baseline justify-between">
          <span>
            <span className="block text-[10px] text-zinc-500">Campaign performance</span>
            <span className="text-base font-bold tabular-nums">
              4.6× <span className="text-[10px] font-medium text-zinc-400">ROAS</span>
            </span>
          </span>
          <span className="svc-pop rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold text-white">
            +214 conversions
          </span>
        </div>
        <div className="relative mt-3 flex h-24 items-end gap-1.5">
          <span className="absolute inset-x-0 top-1 flex items-center gap-1" aria-hidden="true">
            <span className="flex-1 border-t border-dashed border-zinc-300" />
            <span className="text-[7px] text-zinc-400">target</span>
          </span>
          {PM_BARS.map((b, i) => (
            <span
              key={i}
              className="svc-eq flex-1 rounded-t bg-zinc-950"
              style={{
                height: `${b.h}%`,
                opacity: 0.35 + (i / PM_BARS.length) * 0.65,
                ["--eq-min" as string]: b.min,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between px-0.5 pt-1 text-[7px] text-zinc-400" aria-hidden="true">
          <span>W1</span>
          <span>W3</span>
          <span>W5</span>
          <span>W7</span>
          <span>W9</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3 border-t border-zinc-950/10 pt-2.5">
          <div>
            <div className="text-[9px] text-zinc-500">Ad spend</div>
            <div className="text-[13px] font-semibold tabular-nums">€8,400</div>
          </div>
          <div className="border-l border-zinc-950/10 pl-3">
            <div className="text-[9px] text-zinc-500">Revenue</div>
            <div className="text-[13px] font-semibold tabular-nums">€38,650</div>
          </div>
          <div className="border-l border-zinc-950/10 pl-3">
            <div className="text-[9px] text-zinc-500">CPA</div>
            <div className="text-[13px] font-semibold tabular-nums">€12,40</div>
          </div>
        </div>
      </Window>
    </div>
  );
}

const FUNNEL_STEPS = [
  { label: "Visitors", n: "12,480", w: "100%" },
  { label: "Leads", n: "1,240", w: "68%" },
  { label: "Qualified", n: "410", w: "42%" },
  { label: "Deals", n: "96", w: "24%" },
];

function LeadGenViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="flex items-center justify-between pb-2">
          <span className="text-[10px] font-semibold">Pipeline</span>
          <span className="flex -space-x-1.5">
            {["SM", "JK", "AL", "+9"].map((t, i) => (
              <span
                key={t}
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-bold ring-2 ring-white ${
                  i === 3 ? "bg-zinc-200 text-zinc-600" : "bg-zinc-950 text-white"
                }`}
              >
                {t}
              </span>
            ))}
          </span>
        </div>
        <div className="relative space-y-2">
          {FUNNEL_STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="w-16 text-[10px] text-zinc-500">{s.label}</span>
              <div className="min-w-0 flex-1">
                <span
                  className="svc-fill flex h-7 items-center justify-end rounded-md bg-zinc-950 pr-2 text-[10px] font-semibold text-white tabular-nums"
                  style={{
                    ["--w" as string]: s.w,
                    opacity: 0.45 + i * 0.18,
                    animationDelay: `${i * 0.25}s`,
                  }}
                >
                  {s.n}
                </span>
              </div>
            </div>
          ))}
          {[0, 1.1, 2.2].map((d) => (
            <span
              key={d}
              className="svc-riseup absolute right-6 top-0 h-2 w-2 rounded-full bg-zinc-950"
              style={{ animationDelay: `${d}s`, animationDirection: "reverse" }}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-zinc-950/10 pt-2.5">
          <span className="text-[10px] text-zinc-500">
            Conversion <span className="font-semibold text-zinc-950">0.8%</span>
          </span>
          <span className="svc-pop rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-semibold text-white">
            +38 leads this week
          </span>
        </div>
      </Window>
    </div>
  );
}

function BrandingViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="grid grid-cols-3 gap-2">
          <div className="relative col-span-2 flex h-24 items-center justify-center overflow-hidden rounded-lg bg-zinc-950 text-white">
            <span className="viz-float text-center" style={{ animationDuration: "4s" }}>
              <span className="block text-2xl font-black tracking-tight">AURA</span>
              <span className="block text-[7px] uppercase tracking-[0.35em] text-zinc-400">
                Studio®
              </span>
            </span>
            <span className="svc-sweep" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="flex items-center justify-center rounded-lg border border-zinc-950/10 text-sm font-black">
              A
            </div>
            <div className="flex items-center justify-center rounded-lg bg-zinc-100 text-sm font-black text-zinc-950">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-950 text-[10px]">
                A
              </span>
            </div>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-5 gap-2">
          {[
            { c: "bg-zinc-950", n: "950" },
            { c: "bg-zinc-700", n: "700" },
            { c: "bg-zinc-400", n: "400" },
            { c: "bg-zinc-200", n: "200" },
            { c: "bg-white border border-zinc-950/15", n: "50" },
          ].map((s, i) => (
            <span key={s.n} className="text-center">
              <span
                className={`svc-swatch block h-8 rounded-md ${s.c}`}
                style={{ animationDelay: `${i * 0.55}s` }}
              />
              <span className="mt-0.5 block text-[7px] tabular-nums text-zinc-400">
                {s.n}
              </span>
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-end justify-between rounded-lg border border-zinc-950/10 px-3 py-2">
          <span>
            <span className="block text-lg font-semibold leading-none">Aa</span>
            <span className="text-[7px] text-zinc-400">Grotesk · 400—900</span>
          </span>
          <svg viewBox="0 0 80 6" className="mb-1 h-1.5 w-20" aria-hidden="true">
            <path d="M2 3h76" stroke="#18181b" strokeWidth="4" strokeLinecap="round" pathLength={1} className="svc-draw" />
          </svg>
        </div>
      </Window>
    </div>
  );
}

function AmazonViz() {
  return (
    <div className="relative h-full min-h-[250px] w-full lg:min-h-[330px]">
      <Window className="absolute left-0 top-0 w-[78%] -rotate-1">
        <div className="flex items-center justify-between pb-1.5">
          <span className="text-[10px] font-semibold">Seller Central</span>
          <span className="text-[8px] text-zinc-400">Last 30 days</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { l: "Sales", v: "€98,760", d: "↑ 14%" },
            { l: "Orders", v: "2,489", d: "↑ 9%" },
            { l: "ACOS", v: "22.4%", d: "↓ 3%" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg border border-zinc-950/10 p-2">
              <div className="text-[9px] text-zinc-500">{s.l}</div>
              <div className="text-[13px] font-semibold tabular-nums">{s.v}</div>
              <div className="text-[9px] font-medium text-zinc-950">{s.d}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 240 56" className="mt-2.5 h-auto w-full overflow-visible" aria-hidden="true">
          {[14, 28, 42].map((y) => (
            <line key={y} x1="4" x2="236" y1={y} y2={y} stroke="#f0f0ee" strokeWidth="1" />
          ))}
          <path
            d="M4 48 C30 46 50 38 80 36 C120 33 150 24 190 18 C210 15 224 10 236 6"
            fill="none"
            stroke="#18181b"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={1}
            className="svc-draw"
          />
          <circle cx="236" cy="6" r="4" fill="#18181b" />
          <circle cx="236" cy="6" fill="none" stroke="#18181b" strokeWidth="1.5" className="viz-pulse" />
        </svg>
        <span className="svc-pop absolute -right-2 -top-2 rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold text-white shadow-md">
          + new order
        </span>
      </Window>
      <Window className="viz-float absolute bottom-0 right-0 w-[48%] rotate-2">
        <div className="relative flex h-16 items-center justify-center overflow-hidden rounded-lg bg-zinc-100">
          <span className="h-9 w-9 rounded-full border-4 border-zinc-950" />
          <span
            className="svc-pop absolute left-1 top-1 rounded bg-zinc-950 px-1.5 py-0.5 text-[7px] font-bold text-white"
            style={{ animationDelay: "1.4s" }}
          >
            #1 Best Seller
          </span>
        </div>
        <p className="mt-1.5 text-[9px] font-semibold leading-tight">
          Wireless Headset Pro
        </p>
        <div className="mt-0.5 flex items-center gap-1">
          <span className="flex items-center gap-px text-zinc-950">
            <Star />
            <Star />
            <Star />
            <Star />
            <Star />
          </span>
          <span className="text-[8px] text-zinc-400">4.8 (2,314)</span>
        </div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-[12px] font-bold tabular-nums">€49,90</span>
          <span className="text-[7px] text-zinc-400 line-through">€69,90</span>
        </div>
        <span className="svc-press mt-1.5 block rounded-md bg-zinc-950 py-1.5 text-center text-[10px] font-semibold text-white">
          Add to Cart
        </span>
      </Window>
    </div>
  );
}

function ShopifyViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="relative grid grid-cols-2 gap-2.5">
          {[
            { name: "Linen Shirt", price: "€34,00" },
            { name: "Sneaker One", price: "€89,00" },
          ].map((p, i) => (
            <div key={p.name} className="rounded-lg border border-zinc-950/10 p-2">
              <div className="relative flex h-14 items-center justify-center overflow-hidden rounded-md bg-zinc-100">
                <span className={`rounded-md bg-zinc-950 ${i ? "h-8 w-5" : "h-6 w-8"}`} />
                <span className="svc-sweep" />
              </div>
              <p className="mt-1.5 text-[8px] font-semibold">{p.name}</p>
              <div className="flex items-center gap-0.5 text-zinc-950">
                <Star />
                <Star />
                <Star />
                <Star />
                <Star />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold tabular-nums">{p.price}</span>
                <span
                  className="svc-press rounded bg-zinc-950 px-1.5 py-0.5 text-[8px] font-semibold text-white"
                  style={{ animationDelay: `${i * 1.9}s` }}
                >
                  Buy
                </span>
              </div>
            </div>
          ))}
          <span className="svc-riseup absolute -top-1 left-1/4 rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold text-white shadow-md">
            +€34,00
          </span>
          <span
            className="svc-riseup absolute -top-1 right-1/4 rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold text-white shadow-md"
            style={{ animationDelay: "1.6s" }}
          >
            +€89,00
          </span>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg bg-zinc-950 px-3 py-2 text-white">
          <span className="text-[9px] text-zinc-400">Conversion rate</span>
          <span className="text-[11px] font-semibold tabular-nums">3.9% ↑</span>
        </div>
      </Window>
    </div>
  );
}

const WOO_ORDERS = [
  { name: "Sarah M.", id: "#2481", v: "€129,00" },
  { name: "Jonas K.", id: "#2482", v: "€54,90" },
  { name: "Amelie L.", id: "#2483", v: "€212,50" },
  { name: "Tom B.", id: "#2484", v: "€78,00" },
];

function WooViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold">Recent orders</span>
          <span className="svc-pop rounded-full bg-zinc-950 px-2 py-0.5 text-[10px] font-semibold text-white">
            + new order
          </span>
        </div>
        {/* endless order ticker: the list is rendered twice and slides -50% */}
        <div className="mt-2.5 h-[164px] overflow-hidden">
          <div className="svc-tick space-y-2">
            {[...WOO_ORDERS, ...WOO_ORDERS].map((o, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-zinc-950/10 p-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-[8px] font-bold text-white">
                  {o.name.split(" ")[0][0]}
                  {o.name.split(" ")[1][0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[9px] font-semibold">{o.name}</span>
                  <span className="block text-[8px] text-zinc-400">
                    {o.id} · Paid
                  </span>
                </span>
                <span className="text-[11px] font-bold tabular-nums">{o.v}</span>
              </div>
            ))}
          </div>
        </div>
      </Window>
    </div>
  );
}

function ShopwareViz() {
  return (
    <div className="w-full max-w-sm">
      <Window>
        <div className="rounded-lg bg-zinc-950 px-3 pb-1.5 pt-2 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-tight">MAISON</span>
            <span className="flex gap-2.5 text-[8px] text-zinc-400">
              <span>Shop</span>
              <span>New</span>
              <span>Sale</span>
            </span>
          </div>
          <div className="mt-1 flex justify-end">
            <span className="w-[76px]">
              <span className="svc-slide block h-0.5 w-6 rounded bg-white" />
            </span>
          </div>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {[
            { name: "Wool Coat", price: "€219" },
            { name: "Silk Scarf", price: "€59" },
            { name: "Leather Bag", price: "€349" },
            { name: "Knit Sweater", price: "€129" },
          ].map((p, i) => (
            <div key={p.name} className="rounded-lg border border-zinc-950/10 p-2">
              <div className="svc-shimmer h-10 rounded-md" style={{ animationDelay: `${i * 0.35}s` }} />
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[8px] font-semibold">{p.name}</span>
                <span className="text-[8px] font-bold tabular-nums">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
        <span className="svc-pop mt-2.5 block w-max rounded-full bg-zinc-950 px-2.5 py-1 text-[9px] font-semibold text-white">
          Storefront deployed ✓
        </span>
      </Window>
    </div>
  );
}

type Service = {
  title: string;
  desc: string;
  items: string[];
  icon: React.ReactNode;
  visual: React.ReactNode;
};

const IT_SERVICES: Service[] = [
  {
    title: "Web Design & Development",
    desc: "Fast, modern websites engineered to convert visitors into customers — designed, built and maintained by one team.",
    items: [
      "Business Websites",
      "Landing Pages",
      "WordPress Development",
      "Website Relaunch",
      "Website Maintenance",
    ],
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="m9 13-2 2 2 2" />
        <path d="m14 13 2 2-2 2" />
      </Icon>
    ),
    visual: <WebdesignViz />,
  },
  {
    title: "SEO",
    desc: "Sustainable visibility exactly where your customers are searching — from the technical foundation to content that ranks.",
    items: ["SEO Audit", "Local SEO", "Technical SEO", "SEO Content", "Ongoing SEO Care"],
    icon: (
      <Icon>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
        <path d="m7.5 12 2-2 1.5 1.5 2.5-2.5" />
      </Icon>
    ),
    visual: <SeoViz />,
  },
  {
    title: "Performance Marketing",
    desc: "Paid campaigns tuned relentlessly for measurable return — every euro of ad spend tracked and accounted for.",
    items: ["Google Ads", "Meta Ads", "Conversion Optimization", "Tracking & Analytics"],
    icon: (
      <Icon>
        <path d="M3 20h18" />
        <path d="m6 16 4-6 3 3 5-8" />
      </Icon>
    ),
    visual: <PerformanceViz />,
  },
  {
    title: "Lead Generation",
    desc: "A predictable pipeline of qualified prospects: AI-powered funnels, landing pages and campaigns that capture demand and turn strangers into sales conversations.",
    items: ["AI-Powered Funnels", "Lead Magnets", "Marketing Automation", "CRM & Follow-up"],
    icon: (
      <Icon>
        <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
      </Icon>
    ),
    visual: <LeadGenViz />,
  },
  {
    title: "Branding",
    desc: "A sharp identity that people recognize and remember — consistent from the logo to every touchpoint.",
    items: ["Logo Design", "Corporate Identity", "Brand Strategy"],
    icon: (
      <Icon>
        <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
        <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
        <path d="m2.3 2.3 7.286 7.286" />
        <circle cx="11" cy="11" r="2" />
      </Icon>
    ),
    visual: <BrandingViz />,
  },
];

const ECOM_SERVICES: Service[] = [
  {
    title: "Amazon Services",
    desc: "Full-service growth on the world's biggest marketplace — from account management to launch strategy.",
    items: [
      "Account Management",
      "Amazon PPC",
      "Amazon SEO",
      "Listing Optimization",
      "A+ Content",
      "Product Images",
      "Brand Store",
      "Launch Strategy",
    ],
    icon: (
      <Icon>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </Icon>
    ),
    visual: <AmazonViz />,
  },
  {
    title: "Shopify",
    desc: "High-converting Shopify stores, built end to end — setup, design and continuous optimization.",
    items: ["Shopify Setup", "Shopify Design", "Shopify Optimization"],
    icon: (
      <Icon>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </Icon>
    ),
    visual: <ShopifyViz />,
  },
  {
    title: "WooCommerce",
    desc: "Flexible WordPress commerce that scales with you — owned infrastructure, no platform lock-in.",
    items: ["WooCommerce Setup", "WooCommerce Optimization"],
    icon: (
      <Icon>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </Icon>
    ),
    visual: <WooViz />,
  },
  {
    title: "Shopware",
    desc: "Robust Shopware builds for ambitious brands — engineered for the European market.",
    items: ["Shopware Development"],
    icon: (
      <Icon>
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
      </Icon>
    ),
    visual: <ShopwareViz />,
  },
];

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

function BigCard({ service, index }: { service: Service; index: number }) {
  const dark = index % 2 === 1;
  return (
    <div
      data-spot
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 sm:p-10 lg:p-12 ${
        dark
          ? "border-zinc-800 bg-zinc-950 text-white shadow-[-24px_24px_80px_-32px_rgba(0,0,0,0.6)]"
          : "border-zinc-950/10 bg-white text-zinc-950 shadow-[-24px_24px_80px_-32px_rgba(0,0,0,0.45)]"
      }`}
    >
      {/* sheen that follows the pointer (per-card CSS vars set by the section listener) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${
            dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.045)"
          }, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute right-6 top-2 text-7xl font-semibold sm:right-10 sm:text-9xl ${
          dark ? "text-white/[0.07]" : "text-zinc-950/[0.05]"
        }`}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative grid h-full items-center gap-5 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* left: icon, title, copy, check-list */}
        <div className="flex flex-col lg:h-full">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14 ${
              dark
                ? "border-white/10 bg-white/[0.06] text-white"
                : "border-zinc-950/10 bg-zinc-950/[0.04] text-zinc-950"
            }`}
          >
            {service.icon}
          </span>

          <h4 className="mt-4 text-2xl font-medium tracking-[-0.02em] sm:mt-6 sm:text-4xl">
            {service.title}
          </h4>
          <p
            className={`mt-2.5 max-w-md text-[14px] leading-relaxed sm:mt-3 sm:text-base ${
              dark ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            {service.desc}
          </p>

          <ul
            className={`mt-4 gap-x-4 gap-y-2 sm:mt-6 sm:gap-x-6 sm:gap-y-2.5 ${
              service.items.length > 5 ? "grid grid-cols-2" : "space-y-2 sm:space-y-2.5"
            }`}
          >
            {service.items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] sm:gap-2.5 sm:text-[15px]">
                <span
                  className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full sm:h-5 sm:w-5 ${
                    dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"
                  }`}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
                <span className={dark ? "text-zinc-300" : "text-zinc-700"}>{item}</span>
              </li>
            ))}
          </ul>

        </div>

        {/* right (below on mobile): the service's UI mockup */}
        <div className="flex min-h-0 items-center justify-center lg:h-full">
          <div className="w-full max-w-[310px] sm:max-w-sm lg:max-w-none">
            {service.visual}
          </div>
        </div>
      </div>
    </div>
  );
}

/* A scroll-scrubbed deck: the group pins to the viewport while each card
   slides in from the right and lands on top of the previous one. */
function SlideDeck({
  no,
  title,
  count,
  services,
  fromLeft = false,
}: {
  no: string;
  title: string;
  count: number;
  services: Service[];
  fromLeft?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const n = cards.length;
    const seg = n - 1; // card 1 rides in while the deck approaches; the rest scrub the sticky range
    const dir = fromLeft ? -1 : 1;
    const tick = { on: false };

    const update = () => {
      tick.on = false;
      const vh = window.innerHeight;
      const rect = track.getBoundingClientRect();
      const total = rect.height - vh;
      if (total <= 0) return;
      const pre = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      cards.forEach((card, i) => {
        const t = i === 0 ? pre : Math.min(1, Math.max(0, progress * seg - (i - 1)));
        const e = 1 - Math.pow(1 - t, 3); // ease-out: fast entry, soft landing
        const covered =
          i < n - 1 ? Math.min(1, Math.max(0, progress * seg - i)) : 0;
        card.style.transform = `translateX(${((1 - e) * 108 * dir).toFixed(2)}%) rotate(${((1 - e) * 3 * dir).toFixed(2)}deg) scale(${(1 - covered * 0.05).toFixed(3)})`;
      });
    };
    const onScroll = () => {
      if (!tick.on) {
        tick.on = true;
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
  }, [fromLeft]);

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${(services.length - 1) * 60 + 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              {no}
            </span>
            <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{title}</h3>
            <span className="h-px flex-1 self-center bg-zinc-950/10" aria-hidden="true" />
            <span className="text-xs text-zinc-500 tabular-nums">{count} services</span>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto mt-6 h-[78svh] min-h-[660px] w-full max-w-6xl sm:mt-8 lg:h-[62svh] lg:min-h-[520px]"
        >
          {services.map((s, i) => (
            <div
              key={s.title}
              data-card
              className="absolute inset-0 will-change-transform"
              style={{ zIndex: i + 1 }}
            >
              <BigCard service={s} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceCatalog() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: headRef, inView } = useInView<HTMLDivElement>();

  // per-card pointer coords for the sheen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      const sr = section.getBoundingClientRect();
      section.style.setProperty("--gx", `${e.clientX - sr.left}px`);
      section.style.setProperty("--gy", `${e.clientY - sr.top}px`);
      for (const card of section.querySelectorAll<HTMLElement>("[data-spot]")) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative z-30 border-t border-zinc-950/5 bg-white font-sans text-zinc-950"
    >
      {/* dot grid: a stronger base layer + darker, bigger dots revealed around the pointer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(9,9,11,0.17) 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(9,9,11,0.6) 1.8px, transparent 1.8px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(240px circle at var(--gx, -999px) var(--gy, -999px), black 0%, rgba(0,0,0,0.35) 50%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(240px circle at var(--gx, -999px) var(--gy, -999px), black 0%, rgba(0,0,0,0.35) 50%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div ref={headRef} className="relative mx-auto max-w-6xl px-6 pt-24 sm:px-10 sm:pt-32">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              What We Do
            </span>
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-3xl text-center text-4xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-5xl">
            <span className="text-zinc-400">We are more than a service provider.</span>{" "}
            We are your growth partner.
          </h2>
        </Rise>
        <Rise inView={inView} delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-center text-base text-zinc-500 sm:text-lg">
            Whatever your goal is – we are here to make it happen.
          </p>
        </Rise>
      </div>

      <SlideDeck no="01" title="IT & Digital Services" count={21} services={IT_SERVICES} />
      <SlideDeck no="02" title="E-Commerce" count={14} services={ECOM_SERVICES} fromLeft />
    </section>
  );
}
