"use client";

import Link from "next/link";

import { useInView } from "@/components/viz-hooks";

const STEPS = [
  {
    no: "01",
    title: "Analysis",
    text: "We understand your business, your goals, and the needs of your target audience in detail.",
  },
  {
    no: "02",
    title: "Strategy",
    text: "We develop a tailor-made digital strategy that delivers measurable results.",
  },
  {
    no: "03",
    title: "Implementation",
    text: "We implement our principles consistently with precision, creativity and modern technologies.",
  },
  {
    no: "04",
    title: "Growth",
    text: "We continuously measure, optimize, and scale for sustainable growth.",
  },
];

function Rise({
  inView,
  delay,
  children,
}: {
  inView: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={inView ? "viz-rise" : "opacity-0"}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Process() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id="process"
      className="relative z-30 bg-[#fafaf9] py-20 font-sans text-zinc-950 sm:py-24"
    >
      <div className="px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              Our Process
            </span>
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-2xl text-center text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            This Is How We Move Your Business{" "}
            <span className="text-zinc-400">Forward.</span>
          </h2>
        </Rise>

        {/* stacking deck: each card is sticky, later cards slide over earlier ones */}
        <div className="mx-auto mt-16 max-w-5xl">
          {STEPS.map((s, i) => {
            const dark = i === STEPS.length - 1;
            return (
              <article
                key={s.no}
                className={`sticky mb-8 flex min-h-[420px] flex-col rounded-2xl border p-7 last:mb-0 sm:p-10 lg:p-12 ${
                  dark
                    ? "border-zinc-800 bg-zinc-950 text-white shadow-[0_-16px_50px_-24px_rgba(0,0,0,0.5)]"
                    : "border-zinc-950/10 bg-white shadow-[0_-16px_50px_-30px_rgba(0,0,0,0.35)]"
                }`}
                style={{ top: `${88 + i * 16}px` }}
              >
                <div
                  className={`flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] ${
                    dark ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  <span>Step {s.no}</span>
                  <span>{s.no} / 04</span>
                </div>

                <div className="mt-8 flex flex-1 flex-col items-start gap-8 lg:mt-0 lg:flex-row lg:items-center lg:gap-14">
                  <span
                    className="shrink-0 text-8xl font-semibold leading-none tracking-tight text-transparent sm:text-[150px]"
                    style={{ WebkitTextStroke: dark ? "1.5px #52525b" : "1.5px #d4d4d8" }}
                    aria-hidden="true"
                  >
                    {s.no}
                  </span>

                  <div className="shrink-0 lg:w-72">
                    <h3 className="text-3xl font-medium tracking-[-0.01em] sm:text-4xl">
                      {s.title}
                    </h3>
                    <span
                      className={`mt-4 block h-px w-10 ${dark ? "bg-zinc-600" : "bg-zinc-950"}`}
                      aria-hidden="true"
                    />
                  </div>

                  <div className="max-w-lg lg:flex-1">
                    <p
                      className={`text-base leading-relaxed sm:text-lg ${
                        dark ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {s.text}
                    </p>
                    {dark && (
                      <Link
                        href="/contact"
                        className="mt-8 inline-block rounded-[3px] bg-white px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
                      >
                        Book Free Call
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
