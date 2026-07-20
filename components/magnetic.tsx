"use client";

import { useEffect, useRef } from "react";

/* Magnetic hover: the wrapped element leans toward the pointer and springs
   back on leave. The element only ever moves TOWARD the cursor, so unlike a
   scale/hover transition it can never slide out from under a click. */
export default function Magnetic({
  strength = 0.25,
  className = "",
  children,
}: {
  /** how far the element follows, as a fraction of the pointer offset */
  strength?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    let running = false;

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.18;
      cur.y += (tgt.y - cur.y) * 0.18;
      el.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px)`;
      if (tgt.x === 0 && tgt.y === 0 && Math.hypot(cur.x, cur.y) < 0.1) {
        el.style.transform = "";
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
      const r = el.getBoundingClientRect();
      tgt.x = (e.clientX - (r.left + r.width / 2)) * strength;
      tgt.y = (e.clientY - (r.top + r.height / 2)) * strength;
      start();
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
      start();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
