"use client";

import { useEffect, useRef } from "react";

/**
 * Perspective data field for the performance hero. Signals travel toward the
 * viewer, bend around the pointer and occasionally connect to the campaign
 * core. It sleeps outside the viewport and becomes a static frame when the
 * visitor asks for reduced motion.
 */
export default function PerformanceField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    type Signal = { x: number; y: number; z: number; speed: number; green: boolean; size: number };
    let signals: Signal[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let intersecting = false;
    let lastFrame = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, visible: false };

    const makeSignal = (z = Math.random()) => ({
      x: (Math.random() - 0.5) * 2.4,
      y: (Math.random() - 0.5) * 1.55,
      z,
      speed: 0.0015 + Math.random() * 0.0025,
      green: Math.random() > 0.76,
      size: 0.7 + Math.random() * 1.4,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(70, Math.min(150, Math.round((width * height) / 10500)));
      signals = Array.from({ length: count }, (_, i) => makeSignal(i / count));
    };

    const project = (signal: Signal) => {
      const depth = 0.22 + signal.z * 1.45;
      const pull = Math.max(0, 1 - signal.z) * 0.06;
      return {
        x: width * 0.67 + ((signal.x + pointer.x * pull) / depth) * Math.min(width, height) * 0.34,
        y: height * 0.49 + ((signal.y + pointer.y * pull) / depth) * Math.min(width, height) * 0.34,
        alpha: Math.min(1, 0.12 + signal.z * 0.88),
        scale: 0.5 + signal.z * 1.8,
      };
    };

    const draw = (advance = true, frameScale = 1) => {
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.055;
      pointer.y += (pointer.ty - pointer.y) * 0.055;

      const centerX = width * (0.67 + pointer.x * 0.015);
      const centerY = height * (0.49 + pointer.y * 0.015);
      const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.42);
      glow.addColorStop(0, "rgba(185,255,43,0.075)");
      glow.addColorStop(0.45, "rgba(185,255,43,0.018)");
      glow.addColorStop(1, "rgba(185,255,43,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < signals.length; i++) {
        const signal = signals[i];
        const point = project(signal);
        if (advance) {
          signal.z += signal.speed * frameScale;
          if (signal.z > 1) signals[i] = makeSignal(0.02);
        }

        if (point.x < -20 || point.x > width + 20 || point.y < -20 || point.y > height + 20) continue;
        ctx.globalAlpha = point.alpha;
        ctx.fillStyle = signal.green ? "#b9ff2b" : "#ffffff";
        ctx.beginPath();
        ctx.arc(point.x, point.y, signal.size * point.scale, 0, Math.PI * 2);
        ctx.fill();

        if (signal.green && signal.z > 0.42) {
          ctx.globalAlpha = point.alpha * 0.2;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = "#b9ff2b";
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      const frameScale = Math.min(2, Math.max(0.35, (now - lastFrame) / 16.67));
      lastFrame = now;
      draw(true, frameScale);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      lastFrame = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const onMove = (event: PointerEvent) => {
      if (!finePointer) return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      pointer.visible = true;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
      pointer.visible = false;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (intersecting) start();
    };

    resize();
    draw(false);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      if (intersecting) start();
      else stop();
    });
    observer.observe(canvas);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      observer.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}
