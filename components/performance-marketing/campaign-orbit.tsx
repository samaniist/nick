"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CHANNELS = {
  google: { label: "Google", roas: "5.16×", cpa: "€28.40", delta: "+22.6%", data: [18, 26, 24, 38, 43, 51, 58, 72, 68, 84] },
  meta: { label: "Meta", roas: "4.42×", cpa: "€34.10", delta: "+17.2%", data: [14, 20, 31, 27, 42, 39, 54, 61, 73, 79] },
  creative: { label: "Creative", roas: "6.08×", cpa: "€24.80", delta: "+31.4%", data: [12, 18, 17, 29, 36, 48, 45, 63, 77, 91] },
} as const;

type Channel = keyof typeof CHANNELS;

function linePath(data: readonly number[]) {
  return data.map((value, index) => {
    const x = 12 + index * (276 / (data.length - 1));
    const y = 94 - value * 0.78;
    return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

/** Pointer-reactive campaign command core with real selectable channel views. */
export default function CampaignOrbit() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [channel, setChannel] = useState<Channel>("google");
  const selected = CHANNELS[channel];
  const path = useMemo(() => linePath(selected.data), [selected.data]);

  useEffect(() => {
    const frame = frameRef.current;
    const scene = sceneRef.current;
    if (!frame || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let raf = 0;
    let running = false;
    const loop = () => {
      current.x += (target.x - current.x) * 0.075;
      current.y += (target.y - current.y) * 0.075;
      scene.style.transform = `rotateX(${(-current.y * 8).toFixed(2)}deg) rotateY(${(current.x * 10).toFixed(2)}deg)`;
      scene.style.setProperty("--pmx", `${(50 + current.x * 18).toFixed(1)}%`);
      scene.style.setProperty("--pmy", `${(50 + current.y * 18).toFixed(1)}%`);
      const settled = Math.abs(target.x - current.x) < 0.002 && Math.abs(target.y - current.y) < 0.002;
      if (settled && target.x === 0 && target.y === 0) {
        scene.style.transform = "";
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
    const onMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      start();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      start();
    };
    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={frameRef} className="relative mx-auto w-full max-w-[620px] [perspective:1100px]">
      <div ref={sceneRef} className="pm-command-scene relative aspect-[1/1.02] w-full will-change-transform [transform-style:preserve-3d]">
        <div className="absolute inset-[9%] rounded-full border border-white/10 [transform:translateZ(-80px)]" aria-hidden="true" />
        <div className="pm-orbit-ring absolute inset-[16%] rounded-full border border-dashed border-[#b9ff2b]/35 [transform:translateZ(-35px)_rotateX(67deg)]" aria-hidden="true" />
        <div className="pm-orbit-ring pm-orbit-reverse absolute inset-[24%] rounded-full border border-white/20 [transform:translateZ(10px)_rotateY(69deg)]" aria-hidden="true" />
        <div className="absolute inset-[28%] rounded-full bg-[radial-gradient(circle_at_38%_32%,#eaffb6_0%,#b9ff2b_13%,#4d6d0b_44%,#0c0f07_70%)] shadow-[0_0_35px_rgba(185,255,43,.32),0_0_110px_rgba(185,255,43,.16)] [transform:translateZ(42px)]" aria-hidden="true">
          <span className="absolute inset-[17%] rounded-full border border-white/20" />
          <span className="pm-core-scan absolute inset-[28%] rounded-full border border-[#eaffb6]/60" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(86px)]">
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-black/60 sm:text-[10px]">Active ROAS</p>
            <p key={selected.roas} className="pm-metric-swap mt-1 text-3xl font-semibold tracking-[-0.05em] text-black sm:text-5xl">{selected.roas}</p>
          </div>
        </div>

        <div className="pm-float-a absolute left-[2%] top-[19%] w-[37%] rounded-2xl border border-white/12 bg-black/75 p-3 shadow-2xl backdrop-blur-xl [transform:translateZ(115px)] sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.18em] text-zinc-500 sm:text-[10px]">Signal quality</span>
            <span className="flex items-center gap-1.5 text-[9px] text-[#b9ff2b]"><i className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b] shadow-[0_0_8px_#b9ff2b]" /> LIVE</span>
          </div>
          <div className="mt-3 flex h-10 items-end gap-1">
            {[38, 58, 44, 70, 61, 84, 72, 93, 80, 100].map((height, index) => <span key={index} className="flex-1 rounded-t-sm bg-[#b9ff2b]" style={{ height: `${height}%`, opacity: 0.25 + index * 0.065 }} />)}
          </div>
        </div>

        <div className="pm-float-b absolute bottom-[10%] right-[1%] w-[44%] rounded-2xl border border-white/12 bg-[#11120f]/85 p-3 shadow-2xl backdrop-blur-xl [transform:translateZ(135px)] sm:p-4">
          <div className="flex items-end justify-between gap-2">
            <div><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500 sm:text-[10px]">Cost / action</p><p key={selected.cpa} className="pm-metric-swap mt-1 text-lg font-medium sm:text-2xl">{selected.cpa}</p></div>
            <span className="text-[10px] font-medium text-[#b9ff2b]">{selected.delta}</span>
          </div>
          <svg viewBox="0 0 300 110" className="mt-2 h-auto w-full overflow-visible" aria-hidden="true">
            <path d={path} fill="none" stroke="#b9ff2b" strokeWidth="3" strokeLinecap="round" className="pm-mini-line" pathLength="1" />
            <path d="M12 100H288" stroke="rgba(255,255,255,.1)" />
          </svg>
        </div>

        {[
          ["DATA", "right-[1%] top-[12%]"],
          ["LEARN", "bottom-[19%] left-[7%]"],
          ["SCALE", "right-[11%] top-[45%]"],
        ].map(([label, position]) => <span key={label} className={`absolute ${position} font-mono text-[8px] tracking-[0.24em] text-[#b9ff2b]/60 [transform:translateZ(20px)] sm:text-[9px]`}>{label}</span>)}
      </div>

      <div className="relative z-20 mx-auto -mt-3 flex w-fit gap-1 rounded-full border border-white/10 bg-black/70 p-1.5 backdrop-blur-xl" role="group" aria-label="Campaign view">
        {(Object.keys(CHANNELS) as Channel[]).map((key) => {
          const active = key === channel;
          return <button key={key} type="button" onClick={() => setChannel(key)} aria-pressed={active} className={`min-h-10 cursor-pointer rounded-full px-4 text-xs font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9ff2b] ${active ? "bg-[#b9ff2b] text-black" : "text-zinc-400 hover:bg-white/8 hover:text-white"}`}>{CHANNELS[key].label}</button>;
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-zinc-600">Interactive model · move your pointer and switch channels</p>
    </div>
  );
}
