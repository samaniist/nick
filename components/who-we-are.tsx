"use client";

import Image from "next/image";
import Link from "next/link";
import { Mrs_Saint_Delafield } from "next/font/google";

import "./who-we-are.css";

import { ArrowUpRight } from "@/components/icons";
import Magnetic from "@/components/magnetic";
import TiltHover from "@/components/tilt-hover";
import { useCountUp, useInView } from "@/components/viz-hooks";
import WhoTunnel from "@/components/who-tunnel";

const signatureFont = Mrs_Saint_Delafield({ weight: "400", subsets: ["latin"], display: "swap" });

/* Founder shown in the personal note — change here if needed. */
const FOUNDER = { name: "Saman Pouryaghma", first: "Saman", role: "Founder, Nexlytic" };

/* Facts taken from the site itself (contact promise, service catalog) — no
   invented numbers. The "+20 projects" stat lives in the next section. */
const FACTS = [
  { value: 35, suffix: "", label: "Services under one roof" },
  { value: 6, suffix: "", label: "Core disciplines, one team" },
  { value: 1, suffix: " day", label: "Until you hear back from us" },
];

function Fact({ f, active, delay }: { f: (typeof FACTS)[number]; active: boolean; delay: number }) {
  const n = useCountUp(f.value, active, 1400);
  return (
    <div className={`${active ? "viz-rise" : "opacity-0"} border-t border-zinc-950/10 pt-5`} style={{ animationDelay: `${delay}ms` }}>
      <div className="text-4xl font-medium tracking-[-0.03em] tabular-nums sm:text-5xl">
        {active ? n : f.value}
        <span className="text-zinc-400">{f.suffix}</span>
      </div>
      <p className="mt-2 max-w-[14rem] text-sm leading-snug text-zinc-500 sm:text-[15px]">{f.label}</p>
    </div>
  );
}

/**
 * "Who we are": a pinned flight through a tunnel of words in which the studio
 * statement assembles itself (who-tunnel.tsx), a row of counting facts, and a personal note from the founder
 * with an animated signature.
 */
export default function WhoWeAre() {
  const { ref, inView } = useInView<HTMLElement>();
  const { ref: factsRef, inView: factsIn } = useInView<HTMLDivElement>();
  const { ref: noteRef, inView: noteIn } = useInView<HTMLDivElement>();

  return (
    <section ref={ref} id="who-we-are" className="relative z-30 bg-white py-24 font-sans text-zinc-950 sm:py-32">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className={`${inView ? "viz-rise" : "opacity-0"} flex items-center gap-4`}>
          <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">Who We Are</span>
        </div>
      </div>

      {/* pinned flight through a tunnel of words (who-tunnel.tsx) */}
      <WhoTunnel />

      <div className="mx-auto max-w-6xl px-6 sm:px-10">

        {/* facts */}
        <div ref={factsRef} className="grid grid-cols-3 gap-x-6 gap-y-10">
          {FACTS.map((f, i) => (
            <Fact key={f.label} f={f} active={factsIn} delay={i * 110} />
          ))}
        </div>

        {/* founder note */}
        <div ref={noteRef} className={`${noteIn ? "viz-rise" : "opacity-0"} mt-16 sm:mt-20`}>
        <TiltHover max={4} glare glareClass="rounded-3xl">
        <div className="grid items-center gap-8 rounded-3xl border border-zinc-950/10 bg-[#fafaf9] p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-10 lg:p-12">
          <div className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0 sm:h-44 sm:w-44">
            <Image
              src="/founder-avatar.jpg"
              alt={`${FOUNDER.name}, ${FOUNDER.role}`}
              width={480}
              height={480}
              className="h-full w-full rounded-full object-cover grayscale"
            />
            <span className="absolute bottom-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white" aria-hidden="true">
              <span className="who-online h-2.5 w-2.5 rounded-full bg-zinc-950" />
            </span>
          </div>
          <div>
            <p className="text-xl font-medium leading-snug tracking-[-0.01em] sm:text-2xl">
              “Hi, I’m {FOUNDER.first}. You work directly with me — from the first call to launch and beyond. If an idea
              won’t move your numbers, I’ll tell you before you pay for it.”
            </p>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span
                  className={`${signatureFont.className} who-sign block text-5xl leading-none text-zinc-950 sm:text-6xl ${noteIn ? "is-on" : ""}`}
                  aria-hidden="true"
                >
                  {FOUNDER.name}
                </span>
                <span className="mt-2 block text-sm text-zinc-500">
                  {FOUNDER.name} · {FOUNDER.role}
                </span>
              </div>
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-[3px] bg-zinc-950 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Book a call with {FOUNDER.first} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
        </TiltHover>
        </div>
      </div>
    </section>
  );
}
