"use client";

import { Archivo_Black } from "next/font/google";
import Image from "next/image";

import GlobeBackground from "@/components/globe-background";
import { useInView } from "@/components/viz-hooks";

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"] });

const QUICK_LINKS = [
  { label: "About Us", href: "#who-we-are" },
  { label: "Services", href: "#services" },
  { label: "Our Process", href: "#process" },
  { label: "What We Do", href: "#what-we-do" },
];

const SERVICE_LINKS = [
  { label: "Web Design & Development", href: "#services" },
  { label: "SEO", href: "#services" },
  { label: "Performance Marketing", href: "#services" },
  { label: "E-Commerce", href: "#what-we-do" },
];


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
    <footer
      ref={ref}
      className="relative z-30 overflow-hidden bg-black font-sans text-white"
    >
      {/* interactive dotted globe behind everything */}
      <GlobeBackground />

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
            <a
              href="mailto:hello@nexlytic.de"
              className="mt-10 inline-block rounded-[3px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
            >
              Get in touch now
            </a>
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
            <SpinBadge />
          </Rise>
        </div>
      </div>

      {/* link columns */}
      <div className="border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
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

          <nav aria-label="Quick links">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="mt-5 space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[15px] text-zinc-400 transition-all duration-200 hover:pl-1 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="text-lg font-medium">Services</h3>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-[15px] text-zinc-400 transition-all duration-200 hover:pl-1 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-lg font-medium">Contact</h3>
            <div className="mt-5 space-y-5 text-[15px]">
              <div>
                <div className="text-zinc-500">Call Us</div>
                <a
                  href="tel:+4917670767725"
                  className="mt-1 inline-block text-zinc-300 transition-colors hover:text-white"
                >
                  +49 176 70767725
                </a>
              </div>
              <div>
                <div className="text-zinc-500">Location</div>
                <p className="mt-1 text-zinc-300">81549 Munich-Ramersdorf-Perlach</p>
              </div>
            </div>
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
