"use client";

import Image from "next/image";
import Link from "next/link";

import ContactForm from "@/components/contact/contact-form";
import TiltCard from "@/components/contact/tilt-card";

/* ————— shared bits ————— */

const CHANNELS = [
  {
    label: "Email us",
    value: "hello@nexlytic.de",
    href: "mailto:hello@nexlytic.de",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    label: "Call us",
    value: "+49 176 70767725",
    href: "tel:+4917670767725",
    icon: (
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    ),
  },
  {
    label: "Visit us",
    value: "81549 Munich-Ramersdorf-Perlach",
    href: "https://maps.google.com/?q=81549+Munich",
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
];

/* ————— the page ————— */

export default function ContactExperience() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-black font-sans text-white">
      {/* faint dot field + neon wash, same light language as the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)",
        }}
      />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" aria-label="Nexlytic home">
          <Image src="/logo.png" alt="Nexlytic" width={652} height={325} priority className="logo-neon h-8 w-auto" />
        </Link>
        <Link
          href="/"
          className="text-[15px] text-zinc-400 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 pb-20 pt-8 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* left: headline + direct channels */}
        <div className="hero-title">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Contact
            </span>
          </div>
          <h1 className="mt-6 text-5xl font-medium leading-[1.06] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            <span className="text-zinc-400">Let&apos;s build</span>
            <br />
            <span className="hero-neon">something big.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
            Tell us where your business should be in twelve months — we&apos;ll
            answer within one business day with a plan to get there.
          </p>

          <ul className="mt-10 space-y-3">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="group flex min-h-[44px] items-center gap-4 rounded-xl border border-white/0 px-3 py-2.5 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.15em] text-zinc-500">
                      {c.label}
                    </span>
                    <span className="block text-[15px] text-zinc-200 transition-colors group-hover:text-white">
                      {c.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* right: the 3D form card */}
        <TiltCard>
          <h2 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
            Start your project
          </h2>
          <p className="mt-2 text-[15px] text-zinc-400">
            A few details — the conversation does the rest.
          </p>

          <ContactForm idPrefix="c" />
        </TiltCard>
      </div>
    </section>
  );
}
