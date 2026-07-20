"use client";

import { useEffect, useRef } from "react";

/**
 * Backdrop for the process section: a starfield over the glowing curved
 * limb of a planet, like a window looking down from orbit. Pure canvas,
 * monochrome to match the site. Fades in from black at the top (so the
 * heading reads clean) and tilts gently with the pointer.
 */
export default function ProcessBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = { x: number; y: number; r: number; a: number; tw: number; phase: number };
    type Light = { a: number; r: number; b: number };

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let lights: Light[] = [];
    let raf = 0;
    let running = false;
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h * 0.82,
        r: Math.random() < 0.15 ? 1.4 : 0.8,
        a: 0.15 + Math.random() * 0.55,
        tw: 0.6 + Math.random() * 1.8,
        phase: Math.random() * Math.PI * 2,
      }));
      // scattered "city light" specks just inside the horizon's arc
      lights = Array.from({ length: 46 }, () => ({
        a: Math.random() * Math.PI * 0.62 - Math.PI * 0.31,
        r: 0.94 + Math.random() * 0.045,
        b: 0.25 + Math.random() * 0.6,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // starfield
      ctx.fillStyle = "#ffffff";
      for (const s of stars) {
        const tw = reduced ? 1 : 0.75 + 0.25 * Math.sin(t * s.tw + s.phase);
        ctx.globalAlpha = s.a * tw;
        const px = s.x + cur.x * 6;
        const py = s.y + cur.y * 4;
        ctx.fillRect(px, py, s.r, s.r);
      }

      // planet limb: a huge circle whose top arc just breaks the horizon
      const R = w * 0.92;
      const cx = w / 2 + cur.x * 14;
      const cy = h * 0.86 + R * 0.62 + cur.y * 8;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      // atmosphere glow: a few soft strokes just outside the surface
      for (let i = 5; i >= 0; i--) {
        ctx.globalAlpha = 0.05 + i * 0.02;
        ctx.lineWidth = 2 + i * 3.2;
        ctx.strokeStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, R + i * 1.6, 0, Math.PI * 2);
        ctx.stroke();
      }
      // crisp bright rim
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // faint city-light specks along the inside of the rim
      ctx.clip();
      for (const l of lights) {
        const px = cx + Math.cos(Math.PI * 1.5 + l.a) * R * l.r;
        const py = cy + Math.sin(Math.PI * 1.5 + l.a) * R * l.r;
        ctx.globalAlpha = l.b * (reduced ? 1 : 0.7 + 0.3 * Math.sin(t * 1.2 + l.a * 9));
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(px, py, 1.1, 1.1);
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    let last = performance.now();
    const loop = (now: number) => {
      cur.x += (tgt.x - cur.x) * 0.05;
      cur.y += (tgt.y - cur.y) * 0.05;
      draw(now / 1000);
      last = now;
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

    resize();
    draw(0);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduced) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const parent = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      tgt.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      tgt.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (reduced) return;
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
    };
    parent?.addEventListener("pointermove", onMove);
    parent?.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      parent?.removeEventListener("pointermove", onMove);
      parent?.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 26%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 26%, black 100%)",
      }}
      aria-hidden="true"
    />
  );
}
