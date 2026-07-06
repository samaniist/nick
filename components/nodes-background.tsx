"use client";

import { useEffect, useRef } from "react";

/**
 * Connected-nodes canvas background (shared by the dark sections). Nodes
 * drift slowly, link up when close, and react to the pointer: nearby nodes
 * are gently pushed, highlighted, and picked up by brighter "grab" lines.
 * Attaches pointer listeners to its parent element; runs only while visible.
 */
export default function NodesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Node = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      bvx: number;
      bvy: number;
      r: number;
    };
    let nodes: Node[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    const mouse = { x: -1e4, y: -1e4 };
    const LINK = 150;
    const GRAB = 260;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(Math.max((w * h) / 18000, 34), 100));
      nodes = Array.from({ length: count }, () => {
        const bvx = (Math.random() - 0.5) * 0.5;
        const bvy = (Math.random() - 0.5) * 0.5;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: bvx,
          vy: bvy,
          bvx,
          bvy,
          r: 1.4 + Math.random() * 1.4,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // soft glow around the pointer so its presence is unmistakable
      if (mouse.x > -1e3) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        glow.addColorStop(0, "rgba(255,255,255,0.10)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(mouse.x - 150, mouse.y - 150, 300, 300);
      }

      for (const n of nodes) {
        const dxm = n.x - mouse.x;
        const dym = n.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (!reduced) {
          // push away from the pointer, then relax back to the base drift
          if (dm < 180 && dm > 0.1) {
            const f = (1 - dm / 180) * 0.5;
            n.vx += (dxm / dm) * f;
            n.vy += (dym / dm) * f;
          }
          n.vx += (n.bvx - n.vx) * 0.02;
          n.vy += (n.bvy - n.vy) * 0.02;
          n.vx = Math.max(-1.6, Math.min(1.6, n.vx));
          n.vy = Math.max(-1.6, Math.min(1.6, n.vy));
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        const near = dm < GRAB;
        ctx.beginPath();
        ctx.arc(n.x, n.y, near ? n.r + 0.8 : n.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - d / LINK) * 0.22})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        // brighter "grab" lines toward the pointer
        const dmx = nodes[i].x - mouse.x;
        const dmy = nodes[i].y - mouse.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < GRAB) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dm / GRAB) * 0.5})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }
    };

    const loop = () => {
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
    if (reduced) {
      draw(); // static render, no motion
    }

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
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
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
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
