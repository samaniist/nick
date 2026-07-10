"use client";

import { useInView } from "@/components/viz-hooks";

/* "Why This Strategy?" — scrolls up over the pinned growth section
   (onelogy-growth.tsx fades itself out as this one covers it). Inner
   blocks rise in as they reach the viewport. */

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const OPPORTUNITIES = [
  {
    title: "Organic Visibility",
    text: "Organic search visibility can be significantly expanded through a structured SEO and GEO strategy.",
  },
  {
    title: "Brand Storytelling",
    text: "The current experience is primarily transactional and doesn’t fully communicate the innovation behind Onélogy’s technology.",
  },
  {
    title: "Paid Acquisition",
    text: "Dedicated campaign funnels and landing pages can improve advertising performance and conversion rates.",
  },
  {
    title: "Marketplace Presence",
    text: "Amazon represents an additional revenue channel that has not yet been fully utilized.",
  },
  {
    title: "Social Presence",
    text: "Building stronger brand awareness through educational and community-driven content.",
  },
];

export default function OnelogyWhy() {
  return (
    <section
      id="why-strategy"
      className="relative z-10 w-full bg-white text-neutral-900"
    >
      <div className="mx-auto max-w-2xl px-6 py-24 sm:py-32">
        <Reveal>
          <h2 className="text-4xl font-black tracking-[-0.02em] sm:text-5xl">
            Why This Strategy?
          </h2>
        </Reveal>
        <Reveal delay={150} className="mt-8 space-y-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
          <p>Onélogy already has something that most beauty brands don’t.</p>
          <p>You have an innovative product.</p>
          <p>
            The next challenge is making sure the world understands why it’s
            different.
          </p>
          <p>
            The objective isn’t simply to redesign a website or launch
            advertisements.
          </p>
          <p>
            The objective is to build a digital ecosystem that consistently
            attracts, educates and converts customers across multiple
            acquisition channels.
          </p>
        </Reveal>

        <hr className="my-16 border-neutral-200" />

        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Current Growth Opportunities
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            Current Growth Opportunities
          </h3>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Based on my initial review, I identified several opportunities
            that could significantly improve Onélogy’s long-term digital
            growth.
          </p>
        </Reveal>

        <div className="mt-6 divide-y divide-neutral-200">
          {OPPORTUNITIES.map((o, i) => (
            <Reveal key={o.title} delay={i * 80}>
              <div className="group py-8">
                <h4 className="flex items-center gap-0 text-xl font-bold tracking-[-0.01em] transition-all duration-300 group-hover:gap-3 sm:text-2xl">
                  <span
                    className="h-2 w-0 rounded-full bg-violet-500 transition-all duration-300 group-hover:w-2"
                    aria-hidden
                  />
                  {o.title}
                </h4>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {o.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <hr className="my-16 border-neutral-200" />

        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Vision
          </p>
          <h3 className="mt-3 text-3xl font-black tracking-[-0.02em] sm:text-4xl">
            The Vision
          </h3>
          <p className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg">
            Transform Onélogy from an online store into a premium digital
            skincare brand with multiple acquisition channels and a scalable
            international growth system.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
