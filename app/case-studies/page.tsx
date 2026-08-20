import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  capabilities,
  webProjects,
} from "@/components/case-studies/case-study-data";
import HeroWorkStack from "@/components/case-studies/hero-work-stack";
import LiveSiteImage from "@/components/case-studies/live-site-image";
import ProjectPreview from "@/components/case-studies/project-preview";
import Footer from "@/components/footer";
import Magnetic from "@/components/magnetic";
import TiltHover from "@/components/tilt-hover";

export const metadata: Metadata = {
  title: {
    absolute: "Case Studies & Selected Work | Nexlytic",
  },
  description:
    "Explore Nexlytic’s selected web design, development, Amazon growth, and performance marketing projects—including a campaign that generated more than 200% sales growth.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies & Selected Work | Nexlytic",
    description:
      "Selected web design, development, Amazon growth, and performance marketing work from Nexlytic.",
    url: "https://nexlytic.de/case-studies",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nexlytic selected work and case studies",
      },
    ],
  },
};

const CASE_STUDIES_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Case Studies & Selected Work",
  description:
    "Selected web design, development, Amazon growth, and performance marketing projects from Nexlytic.",
  url: "https://nexlytic.de/case-studies",
  isPartOf: {
    "@type": "WebSite",
    name: "Nexlytic",
    url: "https://nexlytic.de",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      "Fiberglas Discount",
      ...webProjects.map((project) => project.name),
    ].map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
    })),
  },
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 10h11M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 14 14 6M8 6h6v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Tag({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li
      className={`rounded-full border px-3 py-1.5 text-[11px] font-medium ${
        light
          ? "border-black/15 text-black/60"
          : "border-white/12 bg-white/[0.025] text-zinc-400"
      }`}
    >
      {children}
    </li>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="overflow-hidden bg-[#080908] font-sans text-white selection:bg-[#b9ff2b] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CASE_STUDIES_JSON_LD) }}
      />

      <section className="relative min-h-dvh border-b border-white/10">
        <div className="work-hero-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#b9ff2b]/6 blur-[110px]" aria-hidden="true" />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
          <Link
            href="/"
            aria-label="Nexlytic home"
            className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]"
          >
            <Image
              src="/logo.png"
              alt="Nexlytic"
              width={652}
              height={325}
              priority
              className="logo-neon h-8 w-auto sm:h-9"
            />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-7" aria-label="Page navigation">
            <span className="hidden min-h-11 items-center border-b border-[#b9ff2b] text-sm text-white sm:flex" aria-current="page">
              Our work
            </span>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors duration-200 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start a project <Arrow className="h-4 w-4" />
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-12 sm:px-10 sm:pt-20 lg:min-h-[calc(100dvh-92px)] lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:gap-8 lg:px-14 lg:pb-24 lg:pt-10">
          <div className="relative z-10">
            <div className="work-reveal inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400">
              <span className="h-px w-8 bg-[#b9ff2b]" />
              Selected work
            </div>
            <h1 className="work-reveal work-delay-1 mt-7 max-w-4xl text-[clamp(3.25rem,7vw,6.7rem)] font-medium leading-[0.91] tracking-[-0.058em]">
              Exceptional
              <span className="block text-zinc-500">by design.</span>
              Built to grow.
            </h1>
            <p className="work-reveal work-delay-2 mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              We combine strategy, design, development, and performance marketing to turn ambitious ideas into measurable digital outcomes.
            </p>
            <div className="work-reveal work-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic strength={0.18}>
                <a
                  href="#selected-work"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#b9ff2b] px-6 text-[15px] font-semibold text-black transition-colors duration-200 hover:bg-[#d1ff72] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]"
                >
                  Explore our work <Arrow className="h-4 w-4" />
                </a>
              </Magnetic>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Start a project
              </Link>
            </div>
          </div>

          <div className="work-reveal work-delay-2">
            <HeroWorkStack />
          </div>
        </div>
      </section>

      <section id="selected-work" className="scroll-mt-8 bg-[#f1f0ea] px-6 py-24 text-[#11120f] sm:px-10 sm:py-32 lg:px-14 lg:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 border-b border-black/15 pb-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20 lg:pb-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65733e]">Featured impact / 01</p>
              <h2 className="mt-5 text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">Growth you can measure.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-600 lg:justify-self-end">
              For Fiberglas Discount, the work connected Amazon growth, performance marketing, conversion optimization, and e-commerce growth around one commercial objective.
            </p>
          </div>

          <div className="grid gap-10 py-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:py-20">
            <div className="flex flex-col justify-between">
              <div>
                <Image
                  src="/clients/fiberglasdiscount.svg"
                  alt="Fiberglas Discount"
                  width={990}
                  height={199}
                  unoptimized
                  className="h-auto w-full max-w-[430px]"
                />
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Fiberglas Discount services">
                  {["Amazon Growth", "Performance Marketing", "Conversion Optimization", "E-commerce Growth"].map((service) => (
                    <Tag key={service} light>{service}</Tag>
                  ))}
                </ul>
              </div>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#fiberglas-approach"
                  className="group inline-flex min-h-12 w-fit items-center gap-3 rounded-full border border-black/20 px-6 text-sm font-semibold transition-colors duration-200 hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  View the approach <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://fiberglas-discount.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Fiberglas Discount website (opens in a new tab)"
                  className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full border border-black/20 px-6 text-sm font-semibold transition-colors duration-200 hover:border-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                >
                  Visit website <ExternalArrow className="h-4 w-4" />
                </a>
              </div>
            </div>

            <TiltHover max={4} glare glareClass="rounded-[28px]" className="w-full">
              <div className="relative overflow-hidden rounded-[28px] bg-[#10110f] text-white shadow-[0_36px_90px_-35px_rgba(0,0,0,.45)]">
                <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#11120f] px-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b]" />
                  <span className="ml-2 font-mono text-[8px] tracking-[0.12em] text-white/40">fiberglas-discount.de</span>
                </div>
                <div className="relative h-[260px] bg-white sm:h-[350px]">
                  <LiveSiteImage
                    src="/case-studies/fiberglas-scroll.png"
                    alt="Fiberglas Discount website homepage"
                    width={1440}
                    height={3600}
                    sizes="(max-width: 1023px) 100vw, 58vw"
                  />
                </div>
                <div className="relative grid gap-8 overflow-hidden bg-[#10110f] p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
                  <div className="work-result-grid absolute inset-0 opacity-50" aria-hidden="true" />
                  <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[#b9ff2b]/10 blur-[70px]" aria-hidden="true" />
                  <div className="relative">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Verified client result</span>
                    <strong className="mt-3 block text-[clamp(4.2rem,10vw,7.5rem)] font-medium leading-[0.78] tracking-[-0.08em] text-white">200%+</strong>
                  </div>
                  <div className="relative sm:text-right">
                    <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#d8ff83] sm:justify-end">
                      <i className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b] shadow-[0_0_12px_#b9ff2b]" />
                      Sales Growth
                    </span>
                    <span className="mt-3 block text-xs text-zinc-500">Amazon marketplace · Commercial performance</span>
                  </div>
                </div>
              </div>
            </TiltHover>
          </div>

          <div id="fiberglas-approach" className="scroll-mt-8 grid border-y border-black/15 lg:grid-cols-2">
            <article className="border-b border-black/15 py-10 lg:border-b-0 lg:border-r lg:pr-12">
              <span className="font-mono text-[10px] text-[#65733e]">01 / Challenge</span>
              <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Turn marketplace activity into a stronger growth engine.</h3>
              <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">The project called for a connected view of Amazon performance, customer decisions, and the conversion journey—not isolated marketing activity.</p>
            </article>
            <article className="py-10 lg:pl-12">
              <span className="font-mono text-[10px] text-[#65733e]">02 / Approach</span>
              <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">Align acquisition, conversion, and e-commerce growth.</h3>
              <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">A focused performance approach brought the marketplace and conversion disciplines together around sustained sales growth.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-36" aria-labelledby="web-experiences-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9ff2b]">Selected web experiences / 02—06</p>
              <h2 id="web-experiences-title" className="mt-5 max-w-3xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl">
                Different stories.<br /><span className="text-zinc-500">One standard of craft.</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-400 lg:justify-self-end">
              From healthcare and wellness to product innovation and mission-led storytelling, each experience is shaped around the audience it needs to move.
            </p>
          </div>

          <div className="mt-16 grid gap-x-5 gap-y-14 lg:mt-24 lg:grid-cols-12 lg:gap-y-20">
            {webProjects.map((project, index) => {
              const columnClass = project.size === "full" ? "lg:col-span-12" : project.size === "wide" ? "lg:col-span-7" : "lg:col-span-5";
              const previewHeight = project.size === "full" ? "h-[255px] sm:h-[470px]" : "h-[255px] sm:h-[430px]";

              return (
                <article key={project.name} className={`${columnClass} group min-w-0`}>
                  <TiltHover max={3.5} glare glareClass="rounded-[22px]" className="w-full">
                    <div className={`${previewHeight} relative overflow-hidden rounded-[22px] border border-white/12 bg-white/[0.025] shadow-[0_30px_80px_-34px_rgba(0,0,0,.8)] transition-colors duration-300 group-hover:border-white/25`}>
                      <ProjectPreview preview={project.preview} index={index} />
                    </div>
                  </TiltHover>
                  <div className="mt-6 flex items-start gap-5 border-t border-white/10 pt-6 sm:mt-7 sm:pt-7">
                    <span className="shrink-0 font-mono text-[10px] text-[#b9ff2b]">0{index + 2}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                        <div>
                          <h3 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{project.name}</h3>
                          <p className="mt-1 break-all font-mono text-[10px] tracking-[0.08em] text-zinc-600">{project.domain}</p>
                        </div>
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${project.name} website (opens in a new tab)`}
                          className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-4 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-white/40 hover:bg-white/[0.05] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]"
                        >
                          Visit website <ExternalArrow className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400 sm:text-base">{project.description}</p>
                      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.name} services`}>
                        {project.services.map((service) => <Tag key={service}>{service}</Tag>)}
                      </ul>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0e100d] px-6 py-20 sm:px-10 sm:py-24 lg:px-14" aria-labelledby="capabilities-title">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 border-b border-white/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9ff2b]">Connected capabilities</p>
              <h2 id="capabilities-title" className="mt-4 text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Built across the whole growth journey.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-500 sm:text-right">Strategy, craft, and performance—connected from the first idea to the next commercial decision.</p>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => (
              <li key={capability} className="group flex min-h-32 items-end justify-between border-b border-white/10 py-7 pr-5 sm:border-r sm:px-5 sm:first:pl-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(4)]:pl-0">
                <span className="text-lg font-medium tracking-[-0.02em] text-zinc-300 transition-colors duration-200 group-hover:text-white">{capability}</span>
                <span className="font-mono text-[10px] text-zinc-600 transition-colors duration-200 group-hover:text-[#b9ff2b]">0{index + 1}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-6 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#b9ff2b] px-6 py-16 text-black sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div className="absolute -right-16 -top-28 text-[260px] font-semibold leading-none text-black/[0.05]" aria-hidden="true">+</div>
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em]">The next chapter</p>
          <div className="relative mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Your next growth story could start here.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-black/65 sm:text-lg">Let&apos;s build a digital experience that earns attention, creates trust, and drives measurable results.</p>
            </div>
            <Magnetic strength={0.18}>
              <Link href="/contact" className="inline-flex min-h-14 w-fit items-center gap-3 rounded-full bg-black px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                Start a project <Arrow className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer showCta={false} />
    </main>
  );
}
