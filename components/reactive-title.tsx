"use client";

import { useEffect, useRef } from "react";

/* Hero headline whose letters swell in weight and glow as the pointer passes
   (Geist is a variable font, so weight moves continuously). Screen readers get
   the plain sentence; the per-letter spans are presentation only. */

type Line = { text: string; accent?: boolean };

const REACH = 190; // px of pointer influence around each letter

export default function ReactiveTitle({ lines, className }: { lines: Line[]; className: string }) {
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;
    const letters = Array.from(title.current!.querySelectorAll<HTMLElement>("[data-letter]"));
    const value = new Float32Array(letters.length);
    let centers: { x: number; y: number }[] | null = null;
    let px = -1e4, py = -1e4, frame = 0;

    const measure = () => {
      centers = letters.map(letter => {
        const r = letter.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    const tick = () => {
      frame = 0;
      if (!centers) measure();
      let moving = false;
      letters.forEach((letter, i) => {
        const { x, y } = centers![i];
        const d = Math.hypot(px - x, py - y);
        const target = d < REACH ? (1 - d / REACH) ** 2 : 0;
        value[i] += (target - value[i]) * 0.16;
        if (Math.abs(target - value[i]) < 0.004) value[i] = target;
        else moving = true;
        letter.style.setProperty("--swell", value[i].toFixed(3));
      });
      if (moving) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      px = event.clientX; py = event.clientY;
      schedule();
    };
    const leave = () => { px = py = -1e4; schedule(); };
    const invalidate = () => { centers = null; };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  let index = 0;
  return (
    <h1 ref={title} className={className}>
      <span className="sr-only">{lines.map(line => line.text).join(" ")}</span>
      {lines.map((line, i) => {
        const letters = Array.from(line.text).map(char => (
          char === " " ? " " : <span key={index++} data-letter className="hero-title-letter">{char}</span>
        ));
        return (
          <span key={i} aria-hidden="true">
            {line.accent ? <span className="hero-title-accent">{letters}</span> : letters}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </h1>
  );
}
