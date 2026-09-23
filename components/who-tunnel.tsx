"use client";

import { useEffect, useRef } from "react";

/* ---------------------------------------------------------------------------
   "Who we are" as a flight through a tunnel of words (pinned, scroll-driven,
   CSS 3D — real text, no canvas).

   While the stage is pinned, scrolling moves the camera forward: ambient
   words (what we do) stream past on every side and vanish behind the viewer,
   and the words of the statement fly out of the vanishing point one by one
   and land in their reading position until the sentence stands complete.
   The pointer shifts the perspective origin, so the whole tunnel parallaxes. */

const STATEMENT = "We’re a Munich-based growth studio. We design, build and grow digital businesses — and measure every euro.";
const STRONG = new Set(["growth", "studio.", "measure", "every", "euro."]);

const AMBIENT = [
  "SEO", "Web Design", "Google Ads", "Branding", "Meta Ads", "GEO", "Shopify", "Lead Generation",
  "Conversion", "Analytics", "UX", "Amazon", "Content", "Strategy", "Performance", "WooCommerce",
  "Landing Pages", "Local SEO", "Tracking", "ROAS", "Funnels", "Social Media", "Relaunch", "Shopware",
  "KPIs", "Automation", "Growth", "Design Systems", "CRO", "Reporting", "Identity", "Campaigns",
];

const DEPTH = 5200; // how far the camera travels through the ambient field
const LAND_FROM = 0.1; // statement starts landing …
const LAND_SPAN = 0.6; // … and is complete by LAND_FROM + LAND_SPAN + FLIGHT
const FLIGHT = 0.16; // progress one word needs to fly in

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function WhoTunnel() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rnd = mulberry32(11);
    const words = Array.from(stage.querySelectorAll<HTMLElement>("[data-sw]"));
    const ambient = Array.from(stage.querySelectorAll<HTMLElement>("[data-aw]"));

    // ambient field: fixed tunnel positions (ring around the axis), random depth
    const field = ambient.map(() => {
      const a = rnd() * Math.PI * 2;
      const r = 0.38 + rnd() * 0.5; // × half the stage diagonal-ish
      return { a, r, z0: -DEPTH + rnd() * (DEPTH - 200), spin: (rnd() - 0.5) * 30 };
    });

    // statement: each word starts near the vanishing point, deep in the tunnel
    const starts = words.map(() => {
      const a = rnd() * Math.PI * 2;
      return { a, r: 0.15 + rnd() * 0.35, rot: (rnd() - 0.5) * 40 };
    });
    let centers: { x: number; y: number }[] = [];
    let W = 0;
    let H = 0;
    const measure = () => {
      const sr = stage.getBoundingClientRect();
      W = sr.width;
      H = sr.height;
      // layout position of each word's centre, relative to the stage centre
      // (transforms don't affect layout, so this is the landed position)
      centers = words.map((w) => ({
        x: w.offsetLeft + w.offsetWidth / 2 - W / 2 + (w.offsetParent as HTMLElement).offsetLeft,
        y: w.offsetTop + w.offsetHeight / 2 - H / 2 + (w.offsetParent as HTMLElement).offsetTop,
      }));
    };

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    let p = 0;
    const render = () => {
      const R = Math.hypot(W, H) / 2;
      // ambient words stream toward and past the camera
      ambient.forEach((el, i) => {
        const f = field[i];
        const z = f.z0 + p * DEPTH;
        const x = Math.cos(f.a) * f.r * R;
        const y = Math.sin(f.a) * f.r * R * 0.8;
        const fogIn = Math.min(1, Math.max(0, (z + DEPTH) / (DEPTH * 0.55)));
        const pass = z > 250 ? Math.max(0, 1 - (z - 250) / 350) : 1;
        // clear the stage once the sentence has landed
        const outro = 1 - Math.min(1, Math.max(0, (p - 0.8) / 0.12));
        const o = fogIn * pass * outro;
        el.style.opacity = o.toFixed(3);
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) translate(-50%, -50%) rotate(${f.spin.toFixed(1)}deg)`;
      });
      // statement words land in order
      const n = words.length;
      words.forEach((el, i) => {
        const t0 = LAND_FROM + (i / Math.max(1, n - 1)) * LAND_SPAN;
        const f = Math.min(1, Math.max(0, (p - t0) / FLIGHT));
        const e = ease(f);
        const s = starts[i];
        const c = centers[i] ?? { x: 0, y: 0 };
        // start: near the tunnel axis, deep; end: own layout slot, z = 0
        const sx = -c.x + Math.cos(s.a) * s.r * R;
        const sy = -c.y + Math.sin(s.a) * s.r * R * 0.7;
        const x = sx * (1 - e);
        const y = sy * (1 - e);
        const z = -2600 * (1 - e);
        const rot = s.rot * (1 - e);
        el.style.opacity = Math.min(1, f * 3).toFixed(3);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)`;
      });
    };

    let queued = false;
    const update = () => {
      queued = false;
      const r = track.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      render();
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    // pointer parallax: move the perspective origin (eased)
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    const onMove = (e: PointerEvent) => {
      tgt.x = (e.clientX / window.innerWidth) * 2 - 1;
      tgt.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.06;
      cur.y += (tgt.y - cur.y) * 0.06;
      stage.style.perspectiveOrigin = `${(50 + cur.x * 14).toFixed(2)}% ${(50 + cur.y * 12).toFixed(2)}%`;
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      measure();
      update();
    });
    ro.observe(stage);
    measure();
    update();
    document.fonts?.ready.then(() => {
      measure();
      update();
    });
    stage.dataset.live = "true";
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      delete stage.dataset.live;
    };
  }, []);

  const words = STATEMENT.split(" ");

  return (
    <div ref={trackRef} data-scroll-scene className="relative motion-safe:h-[280svh]">
      <div
        ref={stageRef}
        className="who-stage top-0 flex items-center justify-center overflow-hidden px-6 py-24 motion-safe:sticky motion-safe:h-svh motion-safe:py-0 sm:px-10"
        style={{ perspective: "900px" }}
      >
        {/* ambient words (decorative) */}
        <div aria-hidden="true" className="who-field pointer-events-none absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
          {AMBIENT.map((w, i) => (
            <span
              key={w}
              data-aw
              className="absolute left-0 top-0 whitespace-nowrap font-medium tracking-[-0.02em] text-zinc-300 will-change-transform"
              style={{ fontSize: `${[22, 34, 48, 28, 40][i % 5]}px` }}
            >
              {w}
            </span>
          ))}
        </div>

        {/* the statement */}
        <p className="relative mx-auto max-w-5xl text-center text-[34px] font-medium leading-[1.12] tracking-[-0.03em] text-zinc-900 [transform-style:preserve-3d] sm:text-6xl lg:text-7xl">
          {words.map((w, i) => (
            <span
              key={i}
              data-sw
              className={`who-sw inline-block will-change-transform ${STRONG.has(w.toLowerCase()) ? "text-zinc-950" : "text-zinc-400"}`}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>

      </div>
    </div>
  );
}
