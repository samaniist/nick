"use client";

import { useEffect, useRef, useState } from "react";

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

/* Percent coordinates inside the middle connector column (desktop). */
const BADGES = [
  { x: 8, y: 8 },
  { x: 92, y: 8 },
  { x: 8, y: 76 },
  { x: 92, y: 90 },
];
const RINGS = [
  { x: 38, y: 18 },
  { x: 62, y: 18 },
  { x: 38, y: 66 },
  { x: 62, y: 66 },
];
const PATHS = ["M8 8 L38 18 L62 18 L92 8", "M8 76 L38 66 L62 66 L92 90"];

/**
 * The floating visual in the connector's empty middle. Expects the image at
 * public/brain.png; if it still has a dark background it is keyed out on a
 * canvas (near-black pixels turn transparent) — an image that already ships
 * an alpha channel is left untouched. Tilts in 3D toward the pointer and
 * floats idly. Renders nothing until the file exists and loads.
 */
function BrainVisual({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new window.Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      try {
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        const corners = [3, (w - 1) * 4 + 3, (h - 1) * w * 4 + 3, (w * h - 1) * 4 + 3];
        const hasAlpha = corners.some((idx) => px[idx] < 250);
        if (!hasAlpha) {
          const LO = 16;
          const HI = 52;
          for (let i = 0; i < px.length; i += 4) {
            const lum = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
            if (lum < HI) {
              const a = lum <= LO ? 0 : (lum - LO) / (HI - LO);
              px[i + 3] = Math.min(px[i + 3], Math.round(a * 255));
            }
          }
          ctx.putImageData(data, 0, 0);
        }
      } catch {
        // pixel access failed — show the image as-is
      }
      setLoaded(true);
    };
    img.src = "/brain.png";
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    const onMove = (e: PointerEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / 320;
      const ny = (e.clientY - (r.top + r.height / 2)) / 320;
      // fade the influence out when the pointer is far away
      if (Math.hypot(nx, ny) > 1.6) {
        tgt.x = 0;
        tgt.y = 0;
      } else {
        tgt.x = Math.max(-1, Math.min(1, nx));
        tgt.y = Math.max(-1, Math.min(1, ny));
      }
    };
    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;
      const el = tiltRef.current;
      if (el) {
        el.style.transform = `perspective(900px) rotateX(${(-cur.y * 10).toFixed(2)}deg) rotateY(${(cur.x * 10).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    io.observe(wrap);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none ${className}`} aria-hidden={!loaded}>
      <div className={`viz-float ${loaded ? "viz-fade" : "opacity-0"}`}>
        <div ref={tiltRef} className="will-change-transform">
          <canvas
            ref={canvasRef}
            role="img"
            aria-label="AI brain held by a robotic hand"
            className="h-auto w-full drop-shadow-[0_24px_40px_rgba(0,0,0,0.18)]"
          />
        </div>
        <span
          className="mx-auto mt-4 block h-5 w-3/5 rounded-full bg-zinc-900/10 blur-md"
          aria-hidden="true"
        />
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

export default function WhyNexlytic() {
  const { ref, inView } = useInView<HTMLElement>();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // walk through the steps on its own; hovering pauses and takes over
  useEffect(() => {
    if (!inView || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 2800);
    return () => clearInterval(id);
  }, [inView, paused]);

  const textBlock = (i: number, className = "") => {
    const s = STEPS[i];
    const on = active === i;
    return (
      <div
        onPointerEnter={() => setActive(i)}
        className={`transition-opacity duration-300 ${on ? "opacity-100" : "opacity-50"} ${className}`}
      >
        <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-[28px] sm:leading-9">
          {s.title}
        </h3>
        <span
          className={`mt-3 block h-px bg-zinc-950 transition-all duration-500 ${on ? "w-10" : "w-0"}`}
          aria-hidden="true"
        />
        <p className="mt-3 max-w-sm text-base leading-relaxed text-zinc-600">{s.text}</p>
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="why-nexlytic"
      className="relative z-30 bg-white py-20 font-sans text-zinc-950 sm:py-24"
    >
      <div className="px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              Why Nexlytic?
            </span>
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-2xl text-center text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            Your Partner for Digital <span className="text-zinc-400">Growth.</span>
          </h2>
        </Rise>

        {/* desktop: 2×2 blocks around a connector column, like the original */}
        <div
          className="relative mx-auto mt-20 hidden max-w-6xl lg:grid lg:grid-cols-[1fr_minmax(300px,420px)_1fr] lg:gap-x-12 lg:gap-y-32"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
        >
          <Rise inView={inView} delay={160}>{textBlock(0)}</Rise>

          <div className="relative row-span-2">
            <BrainVisual className="absolute left-1/2 top-[42%] w-[76%] max-w-[350px] -translate-x-1/2 -translate-y-1/2" />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {PATHS.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  fill="none"
                  stroke="#d4d4d8"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  pathLength={1}
                  className={inView ? "viz-draw" : "opacity-0"}
                  style={{ animationDelay: `${400 + i * 350}ms` }}
                />
              ))}
              {/* data pulses traveling along the drawn connectors */}
              {inView &&
                PATHS.map((d, i) => (
                  <path
                    key={`comet-${d}`}
                    d={d}
                    fill="none"
                    stroke="#18181b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    className="path-comet"
                    style={{ animationDelay: `${1600 + i * 1700}ms` }}
                  />
                ))}
            </svg>

            {RINGS.map((r, i) => (
              <span
                key={i}
                className={`absolute flex h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-zinc-800 bg-white ${inView ? "viz-fade" : "opacity-0"}`}
                style={{ left: `${r.x}%`, top: `${r.y}%`, animationDelay: `${700 + i * 120}ms` }}
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
              </span>
            ))}

            {STEPS.map((s, i) => {
              const on = active === i;
              return (
                <button
                  key={s.no}
                  type="button"
                  onClick={() => setActive(i)}
                  onPointerEnter={() => setActive(i)}
                  aria-label={`Step ${s.no}: ${s.title}`}
                  aria-pressed={on}
                  className={`absolute flex h-13 w-13 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-semibold text-white transition-all duration-300 ${inView ? "viz-fade" : "opacity-0"} ${
                    on
                      ? "scale-110 bg-zinc-950 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]"
                      : "bg-zinc-400 hover:bg-zinc-500"
                  }`}
                  style={{
                    left: `${BADGES[i].x}%`,
                    top: `${BADGES[i].y}%`,
                    animationDelay: `${500 + i * 150}ms`,
                  }}
                >
                  {on && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full bg-zinc-950/25 motion-reduce:hidden"
                      aria-hidden="true"
                    />
                  )}
                  {s.no}
                </button>
              );
            })}
          </div>

          <Rise inView={inView} delay={240} className="lg:mt-10">{textBlock(1)}</Rise>
          <Rise inView={inView} delay={320}>{textBlock(2)}</Rise>
          <Rise inView={inView} delay={400} className="lg:mt-16">{textBlock(3)}</Rise>
        </div>

        {/* mobile: visual on top, then a vertical numbered timeline */}
        <BrainVisual className="mx-auto mt-12 w-60 lg:hidden" />
        <ol className="mx-auto mt-12 max-w-md space-y-10 lg:hidden">
          {STEPS.map((s, i) => {
            const on = active === i;
            return (
              <Rise key={s.no} inView={inView} delay={160 + i * 90}>
                <li
                  className="relative pl-16"
                  onPointerEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                >
                  {i < STEPS.length - 1 && (
                    <span
                      className="absolute left-[21px] top-12 -bottom-10 w-px bg-zinc-200"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold text-white transition-colors duration-300 ${on ? "bg-zinc-950" : "bg-zinc-400"}`}
                  >
                    {s.no}
                  </span>
                  <h3 className="text-xl font-medium">{s.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-zinc-600">{s.text}</p>
                </li>
              </Rise>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
