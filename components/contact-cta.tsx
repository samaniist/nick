"use client";

import ContactForm from "@/components/contact/contact-form";
import TiltCard from "@/components/contact/tilt-card";
import { useInView } from "@/components/viz-hooks";

/* Homepage contact section, right before the footer — same dark glass
   language as the /contact page, sharing the same ContactForm. */
export default function ContactCta() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id="contact"
      className="relative font-sans text-white"
    >
      {/* faint dot field, same light language as the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 45%, black, transparent 78%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 sm:px-10 sm:py-24 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* left: headline + reassurance */}
        <div
          className={`transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Contact
            </span>
          </div>
          <h2 className="mt-6 text-4xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            <span className="text-zinc-400">Ready to grow?</span>
            <br />
            <span className="hero-neon">Tell us about your project.</span>
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
            Tell us where your business should be in twelve months — we&apos;ll
            answer within one business day with a plan to get there.
          </p>
          <ul className="mt-8 space-y-2.5 text-[15px] text-zinc-400">
            {[
              "Free first consultation",
              "Reply within one business day",
              "No obligations, no jargon",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4.5 w-4.5 shrink-0 text-white"
                  aria-hidden="true"
                >
                  <path d="m5 13 4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* right: the shared form on a glass card */}
        <div
          className={`transition-all duration-700 ease-out ${
            inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <TiltCard>
            <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
              Start your project
            </h3>
            <p className="mt-2 text-[15px] text-zinc-400">
              A few details — the conversation does the rest.
            </p>
            <ContactForm idPrefix="home" />
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
