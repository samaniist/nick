"use client";

import { useEffect, useRef, useState } from "react";

import "./scroll-cue.css";

/* ---------------------------------------------------------------------------
   Site-wide "keep scrolling" affordance.

   • A floating pill at the bottom centre: "Scroll to explore" at the top of
     the page, "Keep scrolling" whenever the visitor pauses inside one of the
     pinned scroll scenes (elements marked data-scroll-scene), where the page
     stops moving and it isn't obvious that scrolling continues the story.
     It hides the moment the visitor scrolls. Mouse icon on desktop, swipe
     gesture on touch screens.
   • A hairline progress bar across the top of the viewport. */

const IDLE_MS = 1500;

export default function ScrollCue() {
  const [mode, setMode] = useState<"hidden" | "start" | "scene">("hidden");
  const barRef = useRef<HTMLDivElement | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const syncPointer = () => setTouch(coarse.matches);
    syncPointer();
    coarse.addEventListener("change", syncPointer);

    let idle = 0;
    let queued = false;

    const inScene = () => {
      const vh = window.innerHeight;
      for (const el of document.querySelectorAll<HTMLElement>("[data-scroll-scene]")) {
        const r = el.getBoundingClientRect();
        const total = r.height - vh;
        if (total <= 0) continue;
        const p = -r.top / total;
        if (p > 0.02 && p < 0.92) return true;
      }
      return false;
    };

    const evaluate = () => {
      if (window.scrollY < 40) setMode("start");
      else if (inScene()) setMode("scene");
      else setMode("hidden");
    };

    const onScroll = () => {
      setMode("hidden");
      window.clearTimeout(idle);
      idle = window.setTimeout(evaluate, IDLE_MS);
      if (!queued) {
        queued = true;
        requestAnimationFrame(() => {
          queued = false;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? window.scrollY / max : 0;
          if (barRef.current) barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
        });
      }
    };

    idle = window.setTimeout(evaluate, 1200); // first hint shortly after load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      coarse.removeEventListener("change", syncPointer);
    };
  }, []);

  const label = mode === "scene" ? "Keep scrolling" : touch ? "Swipe up to explore" : "Scroll to explore";

  return (
    <>
      {/* reading progress */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] mix-blend-difference">
        <div ref={barRef} className="h-full origin-left bg-white" style={{ transform: "scaleX(0)" }} />
      </div>

      {/* floating cue */}
      <div
        aria-hidden="true"
        className={`scroll-cue pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 transition-all duration-500 ease-out ${
          mode === "hidden" ? "translate-y-3 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-3 rounded-full border border-white/30 bg-zinc-950/90 py-2 pl-2.5 pr-4 text-[13px] font-medium text-white shadow-[0_0_24px_-4px_rgba(255,255,255,0.25),0_12px_32px_-10px_rgba(0,0,0,0.6)]">
          {touch ? (
            <span className="relative flex h-7 w-7 items-center justify-center">
              {/* swipe: a fingertip travelling up */}
              <span className="sc-swipe absolute h-2.5 w-2.5 rounded-full bg-white" />
              <span className="absolute h-5 w-px bg-linear-to-t from-white/0 to-white/40" />
            </span>
          ) : (
            <span className="relative h-7 w-[18px] rounded-full border-[1.5px] border-white/80">
              <span className="sc-wheel absolute left-1/2 top-1.5 h-1.5 w-[2px] -translate-x-1/2 rounded-full bg-white" />
            </span>
          )}
          <span>{label}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sc-chevron h-4 w-4 opacity-70">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </>
  );
}
