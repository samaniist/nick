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

const SOCIALS = [
  {
    label: "X",
    icon: (
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.23l-4.88-6.38L6.5 22H3.34l7.24-8.28L2.8 2h6.39l4.41 5.83L18.9 2Zm-1.09 18.13h1.72L7.98 3.77H6.13l11.68 16.36Z" />
    ),
  },
  {
    label: "Instagram",
    icon: (
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.15a4 4 0 1 1 0-8 4 4 0 0 1 0 8ZM19.85 5.6a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    ),
  },
  {
    label: "Dribbble",
    icon: (
      <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0Zm7.93 5.53a10.2 10.2 0 0 1 2.3 6.37c-.34-.07-3.7-.75-7.09-.32-.07-.18-.15-.36-.23-.54-.22-.5-.45-1-.7-1.49 3.75-1.53 5.45-3.72 5.72-4.02ZM12 1.77c2.6 0 4.98.98 6.79 2.58-.23.32-1.77 2.37-5.39 3.73a53.87 53.87 0 0 0-3.86-6.02A10.3 10.3 0 0 1 12 1.77ZM7.6 2.77a64.7 64.7 0 0 1 3.84 5.97A40.4 40.4 0 0 1 1.9 10a10.28 10.28 0 0 1 5.7-7.23ZM1.75 12.02v-.32c.33.01 5.94.13 10.72-1.48.27.53.53 1.07.77 1.61-.12.04-.25.08-.37.12-5.06 1.63-7.74 6.1-7.96 6.47a10.2 10.2 0 0 1-3.16-6.4Zm10.25 10.2c-2.36 0-4.54-.8-6.27-2.16.17-.36 2.17-4.19 7.7-6.12l.06-.02a42.6 42.6 0 0 1 2.19 7.78 10.2 10.2 0 0 1-3.68.53Zm5.42-1.31a44.4 44.4 0 0 0-2-7.32c3.2-.51 6 .33 6.35.44a10.25 10.25 0 0 1-4.35 6.88Z" />
    ),
  },
  {
    label: "YouTube",
    icon: (
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    ),
  },
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
      id="contact"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row sm:px-10">
          <p className="text-sm text-zinc-500">
            Copyright © 2026 Nexlytic | All rights reserved
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden="true">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
