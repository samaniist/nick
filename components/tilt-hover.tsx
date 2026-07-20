"use client";

import { useEffect, useRef } from "react";

/* Lightweight pointer-tracking 3D tilt for cards. Unlike the contact
   TiltCard this is meant for many instances on one page: the rAF loop only
   runs while the pointer is engaged with the card and stops once the card
   has settled back. Desktop-pointer only; never wrap interactive controls
   whose clicks must not miss (see contact/tilt-card.tsx for why). */
export default function TiltHover({
  max = 6,
  glare = false,
  glareClass = "rounded-xl",
  className = "",
  children,
}: {
  /** peak tilt in degrees */
  max?: number;
  /** pointer-following sheen for dark cards */
  glare?: boolean;
  /** border radius of the glare overlay — match the card's rounding */
  glareClass?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50, o: 0 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50, o: 0 };
    let raf = 0;
    let running = false;

    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.14;
      cur.ry += (tgt.ry - cur.ry) * 0.14;
      cur.gx += (tgt.gx - cur.gx) * 0.16;
      cur.gy += (tgt.gy - cur.gy) * 0.16;
      cur.o += (tgt.o - cur.o) * 0.14;
      inner.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      inner.style.setProperty("--thx", `${cur.gx.toFixed(1)}%`);
      inner.style.setProperty("--thy", `${cur.gy.toFixed(1)}%`);
      inner.style.setProperty("--tho", cur.o.toFixed(3));
      const settled =
        tgt.o === 0 &&
        Math.abs(cur.rx) < 0.02 &&
        Math.abs(cur.ry) < 0.02 &&
        cur.o < 0.02;
      if (settled) {
        inner.style.transform = "";
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 2 * max;
      tgt.rx = (0.5 - py) * 2 * max;
      tgt.gx = px * 100;
      tgt.gy = py * 100;
      tgt.o = 1;
      start();
    };
    const onLeave = () => {
      tgt.rx = 0;
      tgt.ry = 0;
      tgt.o = 0;
      start();
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={frameRef} className={`[perspective:900px] ${className}`}>
      <div ref={innerRef} className="relative h-full will-change-transform">
        {children}
        {glare && (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 ${glareClass}`}
            style={{
              opacity: "var(--tho, 0)",
              background:
                "radial-gradient(320px circle at var(--thx, 50%) var(--thy, 50%), rgba(255,255,255,0.1), transparent 65%)",
            }}
          />
        )}
      </div>
    </div>
  );
}
