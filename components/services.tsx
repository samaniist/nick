"use client";

import Image from "next/image";

import NodesBackground from "@/components/nodes-background";
import { useInView } from "@/components/viz-hooks";

const SERVICES = [
  {
    title: "Performance Marketing",
    text: "Growth through data-driven campaigns",
    image: "/services/performance-marketing.webp",
  },
  {
    title: "Search Engine Optimization",
    text: "Rank higher. Attract more customers.",
    image: "/services/seo.png",
  },
  {
    title: "Brand Identity & Design",
    text: "Brands that leave a lasting impression",
    image: "/services/branding.webp",
  },
  {
    title: "Web Development",
    text: "Websites that will boost your business",
    image: "/services/web-development.png",
  },
  {
    title: "Content Production",
    text: "Content that excites your target audience and strengthens your brand.",
    image: "/services/content-production.webp",
  },
  {
    title: "Social Media Management",
    text: "Build communities. Increase reach.",
    image: "/services/social-media.png",
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

export default function Services() {
  const { ref, inView } = useInView<HTMLElement>();

  return (
    <section
      ref={ref}
      id="services"
      className="relative z-30 overflow-hidden bg-black py-20 font-sans text-white sm:py-24"
    >
      <NodesBackground />

      <div className="relative z-10 px-6 sm:px-10 lg:px-14">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Our Services
            </span>
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-2xl text-center text-4xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            Everything Your Brand Needs to <span className="text-zinc-400">Grow.</span>
          </h2>
        </Rise>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Rise key={s.title} inView={inView} delay={160 + i * 80}>
              <div className="group flex h-full flex-col rounded-xl border border-white/10 bg-linear-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] p-6 pt-8 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:from-white/[0.13]">
                <h3 className="text-xl font-medium sm:text-2xl">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-relaxed text-zinc-400 sm:text-base">
                  {s.text}
                </p>
                <div className="mt-auto pt-6">
                  <Image
                    src={s.image}
                    alt={s.title}
                    width={600}
                    height={600}
                    className="mx-auto h-auto w-full max-w-[250px] transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                  />
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
