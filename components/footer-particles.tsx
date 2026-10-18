"use client";

import { useEffect, useRef } from "react";

/* Footer ambience: a slow constellation of cyan points that link up when they
   drift close, and gather and brighten around the mouse. Plain 2D canvas, so it
   costs no extra library. It sleeps offscreen, in hidden tabs and while paused,
   and draws a single still frame for reduced motion. */

type Point = { x: number; y: number; vx: number; vy: number; r: number; a: number };

const LINK = 120;  // px between points that draw a connecting line
const REACH = 170; // px of mouse influence

export default function FooterParticles({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let points: Point[] = [];
    let w = 0, h = 0, dpr = 1, frame = 0, visible = false;
    let mx = -1e4, my = -1e4;

    const seed = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = el.clientWidth; h = el.clientHeight;
      el.width = Math.round(w * dpr); el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.round((w * h) / 13000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: 0.6 + Math.random() * 1.3, a: 0.25 + Math.random() * 0.55,
      }));
    };

    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of points) {
        if (step) {
          const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
          // Drift toward the pointer, with a soft floor so points orbit instead of collapsing.
          if (d < REACH && d > 24) { p.vx += (dx / d) * 0.012; p.vy += (dy / d) * 0.012; }
          p.vx *= 0.985; p.vy *= 0.985;
          p.vx += (Math.random() - 0.5) * 0.006; p.vy += (Math.random() - 0.5) * 0.006;
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        }
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const q = points[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(168, 234, 244, ${((1 - d / LINK) * 0.22).toFixed(3)})`;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const near = Math.max(0, 1 - Math.hypot(mx - p.x, my - p.y) / REACH);
        if (near > 0) {
          ctx.strokeStyle = `rgba(193, 242, 255, ${(near * 0.35).toFixed(3)})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke();
        }
        ctx.fillStyle = `rgba(214, 246, 255, ${Math.min(1, p.a + near * 0.6).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near * 1.2, 0, Math.PI * 2); ctx.fill();
      }
    };

    const running = () => visible && !pausedRef.current && !reduced.matches && !document.hidden;
    const tick = () => { frame = 0; draw(true); if (running()) frame = requestAnimationFrame(tick); };
    const sync = () => {
      if (running()) { if (!frame) frame = requestAnimationFrame(tick); }
      else { cancelAnimationFrame(frame); frame = 0; draw(false); }
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      mx = event.clientX - r.left; my = event.clientY - r.top;
    };
    const leave = () => { mx = my = -1e4; };

    seed();
    const resize = new ResizeObserver(() => { seed(); sync(); });
    resize.observe(el);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { rootMargin: "100px" });
    observer.observe(el);
    const host = el.closest("footer") ?? window;
    host.addEventListener("pointermove", move as EventListener, { passive: true });
    host.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    const pauseSync = () => sync();
    el.addEventListener("pausechange", pauseSync);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect(); observer.disconnect();
      host.removeEventListener("pointermove", move as EventListener);
      host.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      el.removeEventListener("pausechange", pauseSync);
    };
  }, []);

  useEffect(() => {
    pausedRef.current = paused;
    canvas.current?.dispatchEvent(new Event("pausechange"));
  }, [paused]);

  return <canvas ref={canvas} />;
}
