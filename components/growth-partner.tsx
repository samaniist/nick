"use client";

import { Archivo_Black } from "next/font/google";
import Image from "next/image";
import { useEffect, useRef } from "react";

import NodesBackground from "@/components/nodes-background";
import { useInView } from "@/components/viz-hooks";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

/* Catmull-Rom → bézier, for the small monochrome chart card. */
function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6} ${p2.x} ${p2.y}`;
  }
  return d;
}

function chartPoints(vals: number[], w: number, h: number, pad: number) {
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  return vals.map((v, i) => ({
    x: pad + (i * (w - pad * 2)) / (vals.length - 1),
    y: pad + (h - pad * 2) * (1 - (v - min) / (max - min)),
  }));
}

const PRODUCT = [30, 46, 38, 62, 55, 74, 84];
const COMPETITOR = [42, 36, 52, 44, 60, 53, 62];
const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];

function ChartCard() {
  const W = 240;
  const H = 104;
  const product = chartPoints(PRODUCT, W, H, 10);
  const competitor = chartPoints(COMPETITOR, W, H, 10);
  const last = product[product.length - 1];
  return (
    <div className="rounded-lg bg-white p-4 text-zinc-950 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-4 text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-zinc-950" /> My Product
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0 w-3 border-t-2 border-dashed border-zinc-400" /> Competitor
        </span>
        <span className="ml-auto rounded-[3px] bg-zinc-950 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
          820
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 block h-auto w-full" aria-hidden="true">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="10" x2={W - 10} y1={H * f} y2={H * f} stroke="#f0f0ee" strokeWidth="1" />
        ))}
        <path d={smoothPath(competitor)} fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d={smoothPath(product)} fill="none" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
        <circle cx={last.x} cy={last.y} r="4" fill="#18181b" stroke="#ffffff" strokeWidth="2" />
      </svg>
      <div className="mt-1 flex justify-between px-1 text-[10px] text-zinc-400">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function StatsCard() {
  return (
    <div className="rounded-lg bg-white p-5 text-zinc-950 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <div className="text-[11px] text-zinc-500">Sales</div>
          <div className="mt-1 text-xl font-semibold tracking-tight tabular-nums">$31,092</div>
          <div className="mt-1 text-[11px]">
            <span className="font-medium" style={{ color: "#006300" }}>
              ↑ +4.2%
            </span>{" "}
            <span className="text-zinc-400">from last year</span>
          </div>
        </div>
        <div className="border-l border-zinc-950/10 pl-5">
          <div className="text-[11px] text-zinc-500">Marketing</div>
          <div className="mt-1 text-xl font-semibold tracking-tight tabular-nums">$29,128</div>
          <div className="mt-1 text-[11px]">
            <span className="font-medium" style={{ color: "#d03b3b" }}>
              ↓ −1.2%
            </span>{" "}
            <span className="text-zinc-400">from last year</span>
          </div>
        </div>
      </div>
    </div>
  );
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

export default function GrowthPartner() {
  const { ref, inView } = useInView<HTMLElement>();
  const photoRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  // gentle depth parallax: photo leans with the pointer, cards drift against it
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tgt.x = (e.clientX / window.innerWidth) * 2 - 1;
      tgt.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      if (photoRef.current) {
        photoRef.current.style.transform = `translate(${(cur.x * 10).toFixed(1)}px, ${(cur.y * 6).toFixed(1)}px)`;
      }
      if (cardsRef.current) {
        cardsRef.current.style.transform = `translate(${(-cur.x * 16).toFixed(1)}px, ${(-cur.y * 10).toFixed(1)}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} id="growth-partner" className="relative z-30 font-sans">
      {/* giant outlined headline — an endless slow marquee drifting left; the
          bottom of the letters tucks under the dark stage */}
      <div className="overflow-hidden bg-[#fafaf9] pt-2">
        <h2
          className={`${archivoBlack.className} gp-marquee -mb-[0.21em] flex w-max select-none whitespace-nowrap text-[9vw] uppercase leading-[0.95] tracking-[-0.02em] text-transparent will-change-transform`}
          style={{ WebkitTextStroke: "2px #09090b" }}
        >
          <span className="pr-[0.5em]">Growth Partner</span>
          <span className="pr-[0.5em]" aria-hidden="true">
            Growth Partner
          </span>
        </h2>
      </div>

      {/* dark stage */}
      <div className="relative z-10 overflow-hidden bg-black text-white">
        <NodesBackground />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/60 to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-10 lg:min-h-[720px] lg:grid-cols-[minmax(280px,360px)_1fr_minmax(280px,340px)] lg:items-center lg:gap-8 lg:py-0 lg:pt-10">
          <Rise inView={inView} delay={80}>
            <p className="max-w-sm text-xl font-medium leading-relaxed tracking-[-0.01em] text-zinc-400 sm:text-2xl">
              We help ambitious companies to{" "}
              <span className="text-white">grow sustainably</span> with smart
              strategy, compelling design and{" "}
              <span className="text-white">measurable results</span>.
            </p>
            <a
              href="#"
              className="mt-8 inline-block rounded-[3px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Book Free Call
            </a>
          </Rise>

          <div className="relative flex items-end justify-center lg:h-full">
            <Rise inView={inView} delay={0} className="lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2">
              <div ref={photoRef} className="will-change-transform">
                <Image
                  src="/founder.png"
                  alt="Nexlytic founder holding a laptop"
                  width={1414}
                  height={2000}
                  priority={false}
                  className="mx-auto h-[420px] w-auto max-w-none sm:h-[520px] lg:h-[620px]"
                />
              </div>
            </Rise>
          </div>

          <div className="lg:justify-self-end">
            <div ref={cardsRef} className="space-y-5 will-change-transform">
              <Rise inView={inView} delay={200}>
                <div className="viz-float">
                  <ChartCard />
                </div>
              </Rise>
              <Rise inView={inView} delay={320}>
                <div className="viz-float" style={{ animationDelay: "1.2s", animationDuration: "7s" }}>
                  <StatsCard />
                </div>
              </Rise>
            </div>
            <Rise inView={inView} delay={440}>
              <p className="mt-10 text-right text-[15px] text-zinc-400 lg:mt-16">
                Clear, built to deliver.
              </p>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}
