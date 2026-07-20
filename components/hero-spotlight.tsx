"use client";

import { useEffect, useRef } from "react";

/* Soft white spotlight that trails the pointer across the hero. Purely
   decorative — pointer-events pass straight through. */
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    let seen = false;

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.09;
      cur.y += (tgt.y - cur.y) * 0.09;
      el.style.background = `radial-gradient(480px circle at ${cur.x.toFixed(0)}px ${cur.y.toFixed(0)}px, rgba(255,255,255,0.07), transparent 70%)`;
      if (Math.hypot(tgt.x - cur.x, tgt.y - cur.y) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tgt.x = e.clientX - r.left;
      tgt.y = e.clientY - r.top;
      if (!seen) {
        // first sighting: jump straight to the pointer instead of sweeping in
        seen = true;
        cur.x = tgt.x;
        cur.y = tgt.y;
        el.style.opacity = "1";
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
    />
  );
}
