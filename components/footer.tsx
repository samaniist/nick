"use client";

import { Archivo_Black } from "next/font/google";
import Image from "next/image";

import Magnetic from "@/components/magnetic";
import { useInView } from "@/components/viz-hooks";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

function Rise({
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
      className={`${inView ? "viz-rise" : "opacity-0"} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Slowly spinning "start a project" badge; spins faster on hover. */
function SpinBadge() {
  return (
    <a
      href="mailto:hello@nexlytic.de"
      aria-label="Start a project"
      className="group relative block h-40 w-40 sm:h-44 sm:w-44"
    >
      <svg
        viewBox="0 0 160 160"
        className="h-full w-full animate-[spin_16s_linear_infinite] motion-reduce:animate-none group-hover:[animation-duration:6s]"
        aria-hidden="true"
      >
        <defs>
          <path
            id="badge-circle"
            d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0"
          />
        </defs>
        <text
          className="fill-zinc-300 uppercase transition-colors group-hover:fill-white"
          style={{ fontSize: "10px", letterSpacing: "1.5px" }}
        >
          {/* textLength pins the text to the full circumference so the loop has no seam */}
          <textPath href="#badge-circle" textLength="389" lengthAdjust="spacingAndGlyphs">
            Start a project • Start a project • Start a project •{" "}
          </textPath>
        </text>
      </svg>
      <span
        className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/15 text-2xl text-white transition-all duration-300 group-hover:bg-white group-hover:text-black"
        aria-hidden="true"
      >
        ↗
      </span>
    </a>
  );
}

export default function Footer() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <footer ref={ref} className="relative font-sans text-white">

      {/* CTA band */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-24 sm:px-10 lg:grid-cols-[1fr_minmax(280px,380px)] lg:items-center lg:gap-8">
        <div>
          <Rise inView={inView} delay={0}>
            <p className="text-base font-medium text-zinc-400">Ready for real growth?</p>
          </Rise>
          <Rise inView={inView} delay={80}>
            <h2
              className={`${archivoBlack.className} mt-4 text-4xl uppercase leading-[1.02] tracking-[-0.01em] text-transparent sm:text-6xl lg:text-7xl`}
              style={{ WebkitTextStroke: "2px #fafafa" }}
            >
              Let&apos;s Work
              <br />
              Together
            </h2>
          </Rise>
          <Rise inView={inView} delay={160}>
            <Magnetic className="mt-10">
              <a
                href="mailto:hello@nexlytic.de"
                className="inline-block rounded-[3px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
              >
                Get in touch now
              </a>
            </Magnetic>
          </Rise>
        </div>

        <div className="flex flex-col gap-10 lg:items-end">
          <Rise inView={inView} delay={240}>
            <p className="max-w-sm text-base leading-relaxed text-zinc-400 sm:text-lg">
              Nexlytic stands for data-driven marketing and strategic growth. We
              combine creativity with measurable results – for your sustainable
              success.
            </p>
          </Rise>
          <Rise inView={inView} delay={320}>
            <Magnetic strength={0.35}>
              <SpinBadge />
            </Magnetic>
          </Rise>
        </div>
      </div>

      {/* link columns */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[1fr_auto]">
          <div>
            <Image
              src="/logo.png"
              alt="Nexlytic"
              width={652}
              height={325}
              className="logo-neon h-9 w-auto"
            />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-zinc-400">
              Your digital agency for measurable growth and sustainable results.
            </p>
            <a
              href="mailto:hello@nexlytic.de"
              className="mt-4 inline-block text-[15px] text-zinc-400 transition-colors hover:text-white"
            >
              hello@nexlytic.de
            </a>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8 sm:justify-self-end lg:gap-10">
            <a href="tel:+4917670767725" className="group flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                </svg>
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Call us
                </span>
                <span className="mt-0.5 block text-[15px] text-zinc-200 transition-colors group-hover:text-white">
                  +49 176 70767725
                </span>
              </span>
            </a>

            <span className="hidden h-10 w-px bg-white/10 sm:block" aria-hidden="true" />

            <a
              href="https://maps.google.com/?q=81549+Munich"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-zinc-300 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-[18px] w-[18px]"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>
                <span className="block text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Location
                </span>
                <span className="mt-0.5 block text-[15px] text-zinc-200 transition-colors group-hover:text-white">
                  81549 Munich-Ramersdorf-Perlach
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
          <p className="text-center text-sm text-zinc-500">
            Copyright © 2026 Nexlytic | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
