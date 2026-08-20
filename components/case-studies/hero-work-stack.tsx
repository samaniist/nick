"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroWorkStack() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    let running = false;

    const draw = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      scene.style.setProperty("--work-x", current.x.toFixed(2));
      scene.style.setProperty("--work-y", current.y.toFixed(2));

      if (
        Math.abs(target.x - current.x) > 0.01 ||
        Math.abs(target.y - current.y) > 0.01
      ) {
        frame = requestAnimationFrame(draw);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      target.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      target.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      start();
    };

    const onPointerLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };

    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", onPointerLeave);
    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className="work-stack relative mx-auto aspect-[0.92] w-full max-w-[590px] [perspective:1300px]"
      aria-label="A layered composition highlighting Nexlytic work across commerce, wellness, and healthcare"
      role="img"
    >
      <div className="work-stack-grid absolute inset-[8%] rounded-[32px] border border-white/8" aria-hidden="true" />

      <div className="work-layer work-layer-back absolute left-[8%] top-[13%] w-[70%] overflow-hidden rounded-2xl border border-white/12 bg-[#151714] shadow-2xl">
        <div className="flex h-9 items-center gap-1.5 border-b border-white/8 px-3">
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b]" />
          <span className="ml-2 font-mono text-[8px] tracking-[0.16em] text-zinc-600">atlantiswellnesscenters.com</span>
        </div>
        <div className="relative aspect-[1.48] bg-[#e7ece7]">
          <Image
            src="/case-studies/atlantis-home.png"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 1023px) 70vw, 390px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="work-layer work-layer-mid absolute bottom-[13%] right-[3%] w-[67%] overflow-hidden rounded-2xl border border-white/12 bg-[#11120f] shadow-2xl">
        <div className="flex h-9 items-center justify-between border-b border-white/10 px-3">
          <span className="font-mono text-[8px] tracking-[0.16em] text-white/40">onelogy.com</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b]" />
        </div>
        <div className="relative aspect-[1.48]">
          <Image
            src="/case-studies/onelogy-home.png"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 1023px) 67vw, 370px"
            className="object-cover object-top"
          />
        </div>
      </div>

      <div className="work-layer work-layer-front absolute right-[7%] top-[5%] flex h-28 w-28 flex-col justify-between rounded-2xl border border-[#b9ff2b]/35 bg-black/85 p-4 shadow-[0_24px_70px_rgba(0,0,0,.55)] backdrop-blur-xl sm:h-36 sm:w-36 sm:p-5">
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#b9ff2b]">Verified result</span>
        <div>
          <strong className="block text-3xl font-medium tracking-[-0.06em] text-white sm:text-4xl">200%+</strong>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.14em] text-zinc-500">Sales growth</span>
        </div>
      </div>

      <div className="work-layer work-layer-chip absolute bottom-[5%] left-[5%] flex items-center gap-3 rounded-full border border-white/12 bg-black/75 px-4 py-3 backdrop-blur-xl">
        <span className="h-2 w-2 rounded-full bg-[#b9ff2b] shadow-[0_0_14px_rgba(185,255,43,.7)]" />
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-300">Design meets growth</span>
      </div>
    </div>
  );
}
