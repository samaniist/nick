"use client";

import { useEffect, useRef } from "react";

/* Glass card with pointer-tracking 3D tilt, glare and floating neon
   glyphs — shared by the /contact page and the homepage contact section. */

/* Neon glyphs floating around the card at different 3D depths. */
const GLYPHS = [
  { sym: "@", cls: "-left-10 top-6 text-4xl", z: 90, delay: 0 },
  { sym: "✉", cls: "-right-7 top-1/4 text-3xl", z: 120, delay: 1200 },
  { sym: "{ }", cls: "-left-14 bottom-1/4 text-2xl", z: 70, delay: 2400 },
  { sym: "↗", cls: "-right-10 bottom-10 text-4xl", z: 100, delay: 600 },
  { sym: "+49", cls: "left-1/4 -top-9 text-xl", z: 110, delay: 1800 },
];

export default function TiltCard({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!frame || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 3D tilt is a hover affordance; skip it entirely on touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 14; // rotateY follows horizontal
      tgt.rx = (0.5 - py) * 12; // rotateX follows vertical
      tgt.gx = px * 100;
      tgt.gy = py * 100;
    };
    const onLeave = () => {
      tgt.rx = 0;
      tgt.ry = 0;
    };
    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.09;
      cur.ry += (tgt.ry - cur.ry) * 0.09;
      cur.gx += (tgt.gx - cur.gx) * 0.12;
      cur.gy += (tgt.gy - cur.gy) * 0.12;
      card.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      card.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      card.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={frameRef} className="[perspective:1400px]">
      <div
        ref={cardRef}
        className="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] p-7 backdrop-blur-xl will-change-transform [transform-style:preserve-3d] sm:p-9"
        style={{
          boxShadow:
            "0 40px 80px -24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* pointer-tracking glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.1), transparent 65%)",
          }}
        />
        {/* floating neon glyphs, each on its own depth plane */}
        {GLYPHS.map((g) => (
          <span
            key={g.sym}
            aria-hidden
            className={`viz-float pointer-events-none absolute hidden select-none font-semibold text-white lg:block ${g.cls}`}
            style={{
              transform: `translateZ(${g.z}px)`,
              animationDelay: `${g.delay}ms`,
              textShadow:
                "0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.25)",
            }}
          >
            {g.sym}
          </span>
        ))}
        {/* content rides slightly above the glass */}
        <div className="relative [transform-style:preserve-3d]" style={{ transform: "translateZ(36px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
