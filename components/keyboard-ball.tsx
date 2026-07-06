"use client";

import { useEffect, useRef } from "react";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function Word({ children }: { children: string }) {
  return <span className="text-[13px] font-bold tracking-[0.08em]">{children}</span>;
}

/* 6×5 grid wrapped onto a sphere; null = skipped corner for a rounder ball. */
const COLS = 6;
const ROWS = 5;
const STEP = 19; // degrees between keys
const R = 285; // sphere radius in px

const KEYS: (React.ReactNode | null)[] = [
  null,
  "</>",
  "{ }",
  "“",
  "@",
  null,

  <Icon key="pen">
    <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
    <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
    <circle cx="11" cy="11" r="2" />
  </Icon>,
  "#",
  "/",
  "⌘",
  <Word key="seo">SEO</Word>,
  ";",

  "*",
  <Word key="html">HTML</Word>,
  <Word key="css">CSS</Word>,
  <Word key="js">JS</Word>,
  <Icon key="check">
    <path d="M20 6 9 17l-5-5" />
  </Icon>,
  <Word key="ads">ADS</Word>,

  <Icon key="search">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </Icon>,
  <Icon key="box">
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </Icon>,
  <Icon key="bolt">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </Icon>,
  <Icon key="gear">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>,
  <Icon key="shield">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
  </Icon>,
  "±",

  null,
  "{ }",
  <Icon key="folder">
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </Icon>,
  <Word key="404">404</Word>,
  "</",
  null,
];

/* Coins orbiting the ball on a tilted ring; each face counter-rotates
   (see .coin keyframes) so the symbol keeps facing the viewer. */
const COINS = ["$", "€", "$", "$", "€", "$", "€", "$", "$", "€", "$", "€"];
const RING_R = 395; // orbit radius in px, clear of the keycaps

/* One uniform MacBook-style charcoal cap: soft top highlight, chunky
   extruded sides like an old mechanical keycap, deep drop shadow. The
   legends glow white-neon via .gk-face rules in globals.css. */
const CAP =
  "border-white/10 bg-linear-to-b from-[#2c2c31] via-[#1d1d21] to-[#141417] text-white " +
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_-5px_8px_rgba(0,0,0,0.45),0_7px_0_#0b0b0c,0_14px_0_#060607,0_28px_44px_rgba(0,0,0,0.72)]";

/**
 * A sphere of chunky charcoal keycaps. Keys press in and pop back out on
 * their own (as if a finger were typing) and under the pointer; the whole
 * ball tilts gently toward the cursor.
 */
export default function KeyboardBall() {
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // endless finger-press loop: push a key in, hold briefly, release
    const faces = Array.from(ball.querySelectorAll<HTMLElement>(".gk-face"));
    const timers: number[] = [];
    const type = () => {
      const n = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < n; i++) {
        const f = faces[Math.floor(Math.random() * faces.length)];
        f.classList.add("gk-down");
        timers.push(
          window.setTimeout(() => f.classList.remove("gk-down"), 260 + Math.random() * 240),
        );
      }
      timers.push(window.setTimeout(type, 320 + Math.random() * 480));
    };
    timers.push(window.setTimeout(type, 500));

    // gentle tilt toward the pointer
    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tgt.x = (e.clientX / window.innerWidth) * 2 - 1;
      tgt.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.05;
      cur.y += (tgt.y - cur.y) * 0.05;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateY(${(cur.x * 8).toFixed(2)}deg) rotateX(${(-cur.y * 8).toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scale-[0.78] [perspective:1300px] xl:scale-100">
      <div ref={tiltRef} className="will-change-transform [transform-style:preserve-3d]">
        {/* orbiting dollar/euro coins */}
        <div
          aria-hidden
          className="coin-ring absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
        >
          <div className="coin-ring-spin [transform-style:preserve-3d]">
            {COINS.map((sym, i) => {
              const a = (360 / COINS.length) * i;
              return (
                <div
                  key={i}
                  className="absolute [transform-style:preserve-3d]"
                  style={{ transform: `rotate(${a}deg) translateX(${RING_R}px)` }}
                >
                  <div
                    className="coin -ml-7 -mt-7 flex h-14 w-14 items-center justify-center text-4xl font-semibold"
                    style={{ "--coin-a": `${a}deg` } as React.CSSProperties}
                  >
                    {sym}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          ref={ballRef}
          className="viz-float relative h-[560px] w-[560px] [transform-style:preserve-3d] motion-reduce:animate-none"
        >
          {KEYS.map((g, i) => {
            if (g === null) return null;
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const yaw = (col - (COLS - 1) / 2) * STEP;
            const pitch = (row - (ROWS - 1) / 2) * STEP;
            return (
              <div
                key={i}
                className="gk-key absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${yaw}deg) rotateX(${-pitch}deg) translateZ(${R}px)`,
                }}
              >
                <div
                  className={`gk-face flex h-20 w-20 items-center justify-center rounded-[14px] border text-2xl font-semibold sm:h-[88px] sm:w-[88px] ${CAP}`}
                >
                  {g}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
