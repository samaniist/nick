"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import NodesBackground from "@/components/nodes-background";
import { ZOOM_HANDOFF_SVH, ZOOM_REVEAL_AT } from "@/components/sound-familiar";
import TiltHover from "@/components/tilt-hover";
import { useInView } from "@/components/viz-hooks";
import { ArrowUpRight } from "@/components/icons";

const SERVICES = [
  {
    title: "Performance Marketing",
    text: "Growth through data-driven campaigns",
    image: "/services/performance-marketing.webp",
    href: "/services/performance-marketing",
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

/**
 * `emergeFromZoom`: this section follows the "+20" zoom (sound-familiar.tsx)
 * and overlaps its pinned stage by ZOOM_HANDOFF_SVH. Its top part is then
 * transparent (the stage behind is black by the time it matters) and the
 * whole content layer is gated by scroll position — hidden while the zoom is
 * still running, faded in the moment the black fill completes (when this
 * section's top reaches ZOOM_REVEAL_AT of the viewport). Scroll-linked, so it
 * also hides again when scrolling back up into the zoom.
 */
export default function Services({ emergeFromZoom = false }: { emergeFromZoom?: boolean }) {
  const { ref, inView } = useInView<HTMLElement>(
    emergeFromZoom
      ? { threshold: 0, rootMargin: `0px 0px -${100 - ZOOM_REVEAL_AT * 100}% 0px` }
      : { threshold: 0 },
  );
  const gateRef = useRef<HTMLDivElement | null>(null);
  const handoff = `${ZOOM_HANDOFF_SVH}svh`;

  useEffect(() => {
    if (!emergeFromZoom) return;
    const section = ref.current;
    const gate = gateRef.current;
    if (!section || !gate) return;
    let queued = false;
    const update = () => {
      queued = false;
      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top;
      // 0 while the top is below (REVEAL_AT + 6%) of the viewport, 1 at REVEAL_AT
      const o = Math.min(1, Math.max(0, ((ZOOM_REVEAL_AT + 0.06) * vh - top) / (0.06 * vh)));
      gate.style.opacity = o.toFixed(3);
      gate.style.visibility = o === 0 ? "hidden" : "visible";
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [emergeFromZoom, ref]);

  return (
    <section
      ref={ref}
      id="services"
      className={`relative z-30 overflow-hidden font-sans text-white ${emergeFromZoom ? "" : "bg-black"}`}
      style={
        emergeFromZoom
          ? { background: `linear-gradient(to bottom, transparent ${handoff}, #000 ${handoff})` }
          : undefined
      }
    >
      {/* content gate (see above); the node canvas lives inside it so its
          pointer listeners (attached to its parent) still cover the section */}
      <div ref={gateRef} className="relative py-20 sm:py-24">
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
            <Rise key={s.title} inView={inView} delay={160 + i * 80} className="h-full">
              <TiltHover max={6} glare glareClass="rounded-xl" className="h-full">
                <div className="group relative flex h-full flex-col rounded-xl border border-white/10 bg-linear-to-b from-white/[0.09] via-white/[0.04] to-white/[0.02] p-6 pt-8 text-center backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:from-white/[0.13] hover:shadow-[0_32px_70px_-24px_rgba(0,0,0,0.85)]">
                  <span className="card-shine rounded-xl" aria-hidden="true" />
                  {s.href && (
                    <Link
                      href={s.href}
                      aria-label={`Explore ${s.title}`}
                      className="absolute inset-0 z-20 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    />
                  )}
                  <h3 className="text-xl font-medium sm:text-2xl">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-[280px] text-[15px] leading-relaxed text-zinc-400 sm:text-base">
                    {s.text}
                  </p>
                  {s.href && (
                    <span className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:text-white">
                      Explore service <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                  <div className="mt-auto pt-6">
                    <Image
                      src={s.image}
                      alt={s.title}
                      width={600}
                      height={600}
                      className="mx-auto h-auto w-full max-w-[250px] transition-transform duration-500 ease-out group-hover:rotate-2 group-hover:scale-[1.07]"
                    />
                  </div>
                </div>
              </TiltHover>
            </Rise>
          ))}
        </div>

        <Rise inView={inView} delay={700} className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-[3px] border border-white/20 px-6 py-3 text-[15px] font-medium text-white transition-colors hover:border-white/40 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            View all services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Rise>
      </div>
      </div>
    </section>
  );
}
