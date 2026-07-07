"use client";

import { useState } from "react";

import {
  EU_COUNTRIES,
  EU_MAP_VIEWBOX,
  NEIGHBOR_COUNTRIES,
} from "@/components/eu-map-data";
import { useCountUp, useInView } from "@/components/viz-hooks";

const HOVER_FILL = "#27272a";

const PAIN_POINTS = [
  {
    text: "Your website generates little or no leads.",
    icon: <path d="M3 5h18l-7 8v5l-4 3v-8L3 5Z" />,
  },
  {
    text: "Your competitors outrank you on Google.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4.35-4.35" />
        <path d="M8.5 11.5 11 14l3.5-4" />
      </>
    ),
  },
  {
    text: "Your advertising budget isn’t delivering results.",
    icon: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
        <path d="M6 12h.01M18 12h.01" />
      </>
    ),
  },
  {
    text: "Your online store isn’t reaching its full potential.",
    icon: (
      <>
        <path d="M6 8h12l1.2 12H4.8L6 8Z" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      </>
    ),
  },
];

function Drop({
  inView,
  delay,
  className = "",
  children,
}: {
  inView: boolean;
  delay: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inView ? "viz-drop" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function EuropeMap({ inView }: { inView: boolean }) {
  const [country, setCountry] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      /* capture phase: runs before the country path's own handler, so a tap
         on a country clears-then-sets while a tap on the sea just clears */
      onPointerDownCapture={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
        setCountry(null);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setCountry(null);
      }}
    >
      <svg
        viewBox={EU_MAP_VIEWBOX}
        className="block h-auto w-full"
        role="img"
        aria-label="Map of Europe highlighting the EU countries Nexlytic works across"
      >
        <g fill="#f0f0ee" stroke="#ffffff" strokeWidth="0.6">
          {NEIGHBOR_COUNTRIES.map((c) => (
            <path key={c.name} d={c.d} />
          ))}
        </g>
        <g stroke="#ffffff" strokeWidth="0.8">
          {EU_COUNTRIES.map((c, i) => (
            <path
              key={c.name}
              d={c.d}
              className={`cursor-pointer ${inView ? "viz-fade" : "opacity-0"}`}
              style={{
                fill: country === c.name ? HOVER_FILL : "#dededb",
                transition: "fill 150ms ease",
                animationDelay: `${200 + i * 25}ms`,
              }}
              onPointerEnter={() => setCountry(c.name)}
              onPointerDown={() => setCountry(c.name)}
            >
              <title>{c.name}</title>
            </path>
          ))}
        </g>
      </svg>

      {country && (
        <div
          className="pointer-events-none absolute z-10 whitespace-nowrap rounded-[4px] bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -160%)",
          }}
        >
          {country}
        </div>
      )}
    </div>
  );
}

export default function SoundFamiliar() {
  const { ref, inView } = useInView<HTMLElement>();
  const projects = useCountUp(20, inView, 1300);

  return (
    <section
      ref={ref}
      id="sound-familiar"
      className="relative z-30 border-t border-zinc-950/5 bg-[#fafaf9] py-20 font-sans text-zinc-950 sm:py-24"
    >
      <div className="grid gap-12 px-6 sm:px-10 lg:grid-cols-12 lg:gap-10 lg:px-14">
        <div className="lg:col-span-5">
          <Drop inView={inView} delay={0}>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-zinc-400" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                The Problem
              </span>
            </div>
          </Drop>
          <Drop inView={inView} delay={80}>
            <h2 className="mt-5 max-w-md text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
              Does This Sound <span className="text-zinc-400">Familiar?</span>
            </h2>
          </Drop>

          <ul className="mt-10 space-y-3">
            {PAIN_POINTS.map((p, i) => (
              <Drop key={p.text} inView={inView} delay={180 + i * 90}>
                <li className="group flex items-center gap-4 rounded-md border border-zinc-950/10 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-950/15 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)] sm:p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-zinc-950/10 text-zinc-500 transition-colors duration-300 group-hover:border-zinc-950 group-hover:bg-zinc-950 group-hover:text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {p.icon}
                    </svg>
                  </span>
                  <span className="text-base leading-snug text-zinc-700">
                    {p.text}
                  </span>
                  <span className="ml-auto text-xs font-medium text-zinc-300 tabular-nums">
                    0{i + 1}
                  </span>
                </li>
              </Drop>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <Drop inView={inView} delay={160}>
            <EuropeMap inView={inView} />
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight">
                +{projects}
              </span>
              <span className="text-base text-zinc-500">
                Projects delivered across the EU
              </span>
            </div>
          </Drop>
        </div>
      </div>
    </section>
  );
}
