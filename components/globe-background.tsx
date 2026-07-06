"use client";

import { useEffect, useRef } from "react";

import { GLOBE_FILL, GLOBE_OUTLINE } from "@/components/globe-data";

/* Faint telemetry labels that rotate with the globe, like readouts on a
   satellite feed. [lat, lon, text] */
const LABELS: [number, number, string][] = [
  [48.1, 11.6, "48.14N 11.58E"],
  [52.4, 4.9, "5029B"],
  [40.7, -74.0, "7B21"],
  [1.3, 103.8, "0103E"],
  [-23.5, -46.6, "S23.55"],
  [30.0, 31.2, "6X08"],
];

/**
 * Dotted world globe on canvas: coast outlines bright, landmass fill faint,
 * plus scattered background specks. Auto-rotates slowly; pointer position
 * steers spin speed/direction and tilts the axis. Runs only while visible.
 */
export default function GlobeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Dot = { x: number; y: number; z: number; coast: boolean };
    const dots: Dot[] = [];
    const toDot = (lat: number, lon: number, coast: boolean): Dot => {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      return {
        x: Math.cos(la) * Math.cos(lo),
        y: Math.sin(la),
        z: Math.cos(la) * Math.sin(lo),
        coast,
      };
    };
    for (let i = 0; i < GLOBE_OUTLINE.length; i += 2)
      dots.push(toDot(GLOBE_OUTLINE[i], GLOBE_OUTLINE[i + 1], true));
    for (let i = 0; i < GLOBE_FILL.length; i += 2)
      dots.push(toDot(GLOBE_FILL[i], GLOBE_FILL[i + 1], false));
    const labels = LABELS.map(([lat, lon, text]) => ({ ...toDot(lat, lon, false), text }));

    // static background specks, positioned once per resize
    let specks: { x: number; y: number; a: number }[] = [];

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const rot = { y: 0.6 };
    const spin = { bias: 0, biasTgt: 0 };
    const tilt = { cur: -0.32, tgt: -0.32 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      specks = Array.from({ length: 140 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        a: 0.04 + Math.random() * 0.1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.46;
      const cx = w / 2;
      const cy = h * 0.54;

      ctx.fillStyle = "#ffffff";
      for (const s of specks) {
        ctx.globalAlpha = s.a;
        ctx.fillRect(s.x, s.y, 1, 1);
      }

      const cosY = Math.cos(rot.y);
      const sinY = Math.sin(rot.y);
      const cosT = Math.cos(tilt.cur);
      const sinT = Math.sin(tilt.cur);

      for (const d of dots) {
        const x1 = d.x * cosY + d.z * sinY;
        const z1 = -d.x * sinY + d.z * cosY;
        const y2 = d.y * cosT - z1 * sinT;
        const z2 = d.y * sinT + z1 * cosT;
        if (z2 <= 0.04) continue; // back hemisphere
        const px = cx + x1 * R;
        const py = cy - y2 * R;
        const depth = 0.2 + 0.8 * z2;
        if (d.coast) {
          ctx.globalAlpha = 0.85 * depth;
          ctx.fillRect(px, py, 1.6, 1.6);
        } else {
          ctx.globalAlpha = 0.4 * depth;
          ctx.fillRect(px, py, 1.2, 1.2);
        }
      }

      ctx.font = "9px ui-monospace, monospace";
      for (const l of labels) {
        const x1 = l.x * cosY + l.z * sinY;
        const z1 = -l.x * sinY + l.z * cosY;
        const y2 = l.y * cosT - z1 * sinT;
        const z2 = l.y * sinT + z1 * cosT;
        if (z2 <= 0.25) continue;
        ctx.globalAlpha = 0.3 * z2;
        ctx.fillText(l.text, cx + x1 * R + 6, cy - y2 * R - 4);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      rot.y += 0.0016 + spin.bias * 0.006;
      spin.bias += (spin.biasTgt - spin.bias) * 0.04;
      tilt.cur += (tilt.tgt - tilt.cur) * 0.05;
      draw();
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
    if (reduced) draw(); // static frame, no motion

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
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      spin.biasTgt = nx; // pointer left/right steers the spin
      tilt.tgt = -0.32 + ny * 0.22; // pointer up/down tips the axis
    };
    const onLeave = () => {
      spin.biasTgt = 0;
      tilt.tgt = -0.32;
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
      className="absolute inset-0 -z-10 h-full w-full"
      aria-hidden="true"
    />
  );
}
