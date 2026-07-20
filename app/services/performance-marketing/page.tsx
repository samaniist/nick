import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import CampaignOrbit from "@/components/performance-marketing/campaign-orbit";
import PerformanceField from "@/components/performance-marketing/performance-field";
import ScrollFunnel from "@/components/performance-marketing/scroll-funnel";
import Magnetic from "@/components/magnetic";
import TiltHover from "@/components/tilt-hover";

export const metadata: Metadata = {
  title: "Performance Marketing",
  description:
    "Performance marketing built around profitable growth — paid media strategy, conversion tracking, creative testing and continuous optimization from Nexlytic.",
  alternates: {
    canonical: "/services/performance-marketing",
  },
};

const capabilities = [
  {
    number: "01",
    title: "Paid search",
    text: "Capture high-intent demand with a Google Ads structure built around margin, not vanity traffic.",
    tags: ["Google Ads", "Search", "Shopping"],
  },
  {
    number: "02",
    title: "Paid social",
    text: "Turn sharp creative angles into a repeatable testing system across Meta's discovery ecosystem.",
    tags: ["Meta Ads", "Creative testing", "Retargeting"],
  },
  {
    number: "03",
    title: "Measurement",
    text: "Build a reliable data layer so every decision connects ad spend to qualified leads and revenue.",
    tags: ["GA4", "GTM", "Attribution"],
  },
  {
    number: "04",
    title: "Conversion",
    text: "Improve the journey after the click with focused landing pages and an evidence-led CRO roadmap.",
    tags: ["Landing pages", "CRO", "A/B testing"],
  },
];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CapabilityVisual({ number }: { number: string }) {
  if (number === "01") {
    return (
      <div className="relative mt-9 h-20 overflow-hidden border-y border-black/10" aria-hidden="true">
        {[15, 38, 64, 87].map((left, index) => <span key={left} className={`absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-black/30 bg-[#f1f0ea] transition-all duration-500 group-hover:border-[#65733e] group-hover:bg-[#b9ff2b]`} style={{ left: `${left}%`, transitionDelay: `${index * 70}ms` }} />)}
        <span className="absolute left-[16%] right-[12%] top-1/2 h-px origin-left scale-x-0 bg-black/20 transition-transform duration-700 group-hover:scale-x-100" />
        <span className="absolute right-0 top-2 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Intent → action</span>
      </div>
    );
  }
  if (number === "02") {
    return (
      <div className="relative mt-9 h-20" aria-hidden="true">
        {[0, 1, 2].map((index) => <span key={index} className="absolute left-1/2 top-1/2 h-12 w-24 rounded-md border border-black/20 bg-[#f1f0ea] transition-all duration-500 group-hover:border-[#65733e] group-hover:shadow-[0_8px_20px_rgba(0,0,0,.08)]" style={{ transform: `translate(-50%, -50%) translateX(${(index - 1) * 38}px) rotate(${(index - 1) * 7}deg)`, transitionDelay: `${index * 50}ms` }}><i className={`absolute left-2 top-2 h-2 w-8 rounded-full ${index === 1 ? "bg-[#b9ff2b]" : "bg-black/15"}`} /><i className="absolute bottom-2 left-2 right-2 h-px bg-black/10" /></span>)}
        <span className="absolute right-0 top-0 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">A / B / Winner</span>
      </div>
    );
  }
  if (number === "03") {
    return (
      <div className="relative mt-9 flex h-20 items-center justify-between border-y border-black/10 px-3" aria-hidden="true">
        {["AD", "SITE", "CRM", "€"].map((item, index) => <span key={item} className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-black/20 bg-[#f1f0ea] font-mono text-[9px] transition-all duration-500 group-hover:-translate-y-1 ${index === 3 ? "group-hover:border-[#65733e] group-hover:bg-[#b9ff2b]" : ""}`} style={{ transitionDelay: `${index * 60}ms` }}>{item}</span>)}
        <span className="absolute left-8 right-8 top-1/2 h-px bg-black/20" />
      </div>
    );
  }
  return (
    <div className="relative mt-9 h-20 overflow-hidden border-y border-black/10" aria-hidden="true">
      <span className="absolute left-[8%] top-[24%] h-7 w-7 rounded-full bg-black/8 transition-transform duration-500 group-hover:translate-x-12 group-hover:translate-y-5" />
      <span className="absolute left-[34%] top-[52%] h-5 w-5 rounded-full bg-black/12 transition-transform duration-500 group-hover:translate-x-8 group-hover:-translate-y-4" />
      <span className="absolute right-[7%] top-1/2 flex h-10 w-28 -translate-y-1/2 items-center justify-center rounded-full bg-black text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 group-hover:bg-[#b9ff2b] group-hover:text-black">Convert</span>
      <span className="absolute right-[28%] top-[8%] font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-500">Friction ↓</span>
    </div>
  );
}

function TrendVisual() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#10110f] p-4 shadow-[0_40px_120px_-45px_rgba(185,255,43,0.35)] sm:p-6">
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#b9ff2b]/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Growth console</p>
          <p className="mt-1 text-sm font-medium text-zinc-200">Acquisition overview</p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-[#b9ff2b]/25 bg-[#b9ff2b]/8 px-3 py-1.5 text-[11px] font-medium text-[#d8ff83]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b] shadow-[0_0_12px_#b9ff2b]" />
          LIVE MODEL
        </span>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        {[
          ["ROAS", "4.82×", "+18.4%"],
          ["CPA", "€31.20", "−12.1%"],
          ["Revenue", "€84.6k", "+27.8%"],
        ].map(([label, value, change]) => (
          <div key={label} className="rounded-xl border border-white/8 bg-white/[0.035] p-3 sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500 sm:text-xs">{label}</p>
            <p className="mt-2 text-lg font-medium tracking-tight text-white sm:text-2xl">{value}</p>
            <p className="mt-1 text-[10px] font-medium text-[#b9ff2b] sm:text-xs">{change}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-3 rounded-2xl border border-white/8 bg-black/30 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">Revenue efficiency</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">Last 12 weeks</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-[#b9ff2b]" /> Revenue
            <span className="ml-2 h-px w-3 bg-zinc-600" /> Spend
          </div>
        </div>
        <svg viewBox="0 0 600 230" className="mt-3 h-auto w-full overflow-visible" role="img" aria-label="Illustrative chart showing revenue growing faster than advertising spend over twelve weeks">
          <defs>
            <linearGradient id="pm-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b9ff2b" stopOpacity="0.22" />
              <stop offset="1" stopColor="#b9ff2b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[42, 88, 134, 180].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="rgba(255,255,255,.07)" />)}
          <path d="M0 188 C45 183 53 160 104 165 S172 138 220 145 S289 116 336 124 S404 76 458 90 S540 45 600 42 L600 210 L0 210Z" fill="url(#pm-area)" />
          <path d="M0 188 C45 183 53 160 104 165 S172 138 220 145 S289 116 336 124 S404 76 458 90 S540 45 600 42" fill="none" stroke="#b9ff2b" strokeWidth="3" strokeLinecap="round" className="pm-line" pathLength="1" />
          <path d="M0 196 C78 194 120 184 172 186 S278 169 336 171 S443 154 505 157 S565 141 600 143" fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
          <circle cx="600" cy="42" r="5" fill="#b9ff2b" className="pm-dot" />
        </svg>
        <p className="sr-only">The dashboard values are illustrative and not a client performance claim.</p>
      </div>
      <p className="relative mt-3 text-right text-[10px] text-zinc-600">Illustrative model · not client results</p>
    </div>
  );
}

export default function PerformanceMarketingPage() {
  return (
    <main className="overflow-hidden bg-[#080908] font-sans text-white selection:bg-[#b9ff2b] selection:text-black">
      <section className="relative min-h-dvh border-b border-white/10">
        <div className="pm-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="absolute left-[12%] top-20 h-72 w-72 rounded-full bg-[#b9ff2b]/8 blur-[100px]" aria-hidden="true" />
        <PerformanceField />

        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
          <Link href="/" aria-label="Nexlytic home" className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]">
            <Image src="/logo.png" alt="Nexlytic" width={652} height={325} priority className="logo-neon h-8 w-auto sm:h-9" />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-7" aria-label="Page navigation">
            <a href="#approach" className="hidden min-h-11 items-center text-sm text-zinc-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b] sm:flex">Our approach</a>
            <Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#b9ff2b] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#d1ff72] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]">
              Start a project <Arrow className="h-4 w-4" />
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-14 sm:px-10 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:px-14 lg:pb-28 lg:pt-24">
          <div>
            <div className="pm-reveal inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b] shadow-[0_0_10px_#b9ff2b]" />
              Performance marketing
            </div>
            <h1 className="pm-reveal pm-delay-1 mt-7 max-w-3xl text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[0.9] tracking-[-0.055em]">
              Make every
              <span className="block text-zinc-500">click earn</span>
              its place.
            </h1>
            <p className="pm-reveal pm-delay-2 mt-7 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              Paid media designed as a profit system—not a collection of campaigns. We connect strategy, creative, tracking and conversion into one measurable growth loop.
            </p>
            <div className="pm-reveal pm-delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
              <Magnetic strength={0.18}>
                <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#b9ff2b] px-6 text-[15px] font-semibold text-black transition-all duration-200 hover:bg-[#d1ff72] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9ff2b]">
                  Get your growth audit <Arrow className="h-4 w-4" />
                </Link>
              </Magnetic>
              <a href="#capabilities" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 text-[15px] font-medium text-white transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Explore capabilities
              </a>
            </div>
            <div className="pm-reveal pm-delay-3 mt-10 grid max-w-xl grid-cols-3 border-y border-white/10 py-5">
              {[["01", "Clear targets"], ["02", "Clean data"], ["03", "Fast learning"]].map(([n, label]) => (
                <div key={n} className="border-r border-white/10 px-3 first:pl-0 last:border-0 last:pr-0">
                  <span className="font-mono text-[10px] text-[#b9ff2b]">{n}</span>
                  <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pm-reveal pm-delay-2 lg:pl-2"><CampaignOrbit /></div>
        </div>
      </section>

      <section className="overflow-hidden border-b border-white/10 bg-[#b9ff2b] py-5 text-black" aria-label="Performance marketing capabilities">
        <div className="pm-signal-rail flex w-max items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
              {["Google Ads", "Meta Ads", "Creative testing", "Tracking", "Conversion", "Attribution"].map((item, i) => (
                <div key={item} className="flex items-center gap-5 px-7 sm:px-10">
                  <span className="font-mono text-[10px] opacity-45">0{i + 1}</span>
                  <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.08em] sm:text-base">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-black/35" aria-hidden="true" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section id="capabilities" className="bg-[#f1f0ea] px-6 py-24 text-[#11120f] sm:px-10 sm:py-32 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#65733e]">One connected system</p>
              <h2 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.04em] sm:text-6xl">More than media buying.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-zinc-600 lg:justify-self-end">Growth stalls when media, creative and measurement live in separate rooms. We bring them together, so each week produces a clearer next decision.</p>
          </div>

          <div className="mt-14 grid border-l border-t border-black/15 sm:grid-cols-2 lg:mt-20">
            {capabilities.map((item) => (
              <TiltHover key={item.number} max={4} className="h-full">
                <article className="group h-full min-h-[410px] border-b border-r border-black/15 p-6 transition-colors duration-300 hover:bg-[#e7e8df] sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#65733e]">{item.number}</span>
                    <Arrow className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                  <CapabilityVisual number={item.number} />
                  <h3 className="mt-8 text-3xl font-medium tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">{item.text}</p>
                  <ul className="mt-8 flex flex-wrap gap-2" aria-label={`${item.title} services`}>
                    {item.tags.map((tag) => <li key={tag} className="rounded-full border border-black/15 px-3 py-1.5 text-xs text-zinc-600">{tag}</li>)}
                  </ul>
                </article>
              </TiltHover>
            ))}
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-[#0c0d0b] px-6 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(185,255,43,.07),transparent_34%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b9ff2b]">Live decision layer</p>
            <h2 className="mt-5 text-4xl font-medium leading-[1.03] tracking-[-0.04em] sm:text-6xl">See the signal.<br /><span className="text-zinc-500">Cut the noise.</span></h2>
            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">A reporting layer should answer the next business question—not bury it under twenty charts.</p>
            <div className="mt-9 flex flex-wrap gap-2">
              {["Spend → revenue", "Channel clarity", "Weekly decisions"].map((item) => <span key={item} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-zinc-300">{item}</span>)}
            </div>
          </div>
          <TiltHover max={5} glare glareClass="rounded-[28px]" className="w-full">
            <TrendVisual />
          </TiltHover>
        </div>
      </section>

      <ScrollFunnel />

      <section className="px-6 pb-6 sm:px-10 sm:pb-10 lg:px-14 lg:pb-14">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-[#b9ff2b] px-6 py-16 text-black sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div className="absolute -right-16 -top-28 text-[260px] font-semibold leading-none text-black/[0.05]" aria-hidden="true">+</div>
          <p className="relative text-xs font-semibold uppercase tracking-[0.22em]">Your next growth move</p>
          <div className="relative mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <h2 className="max-w-4xl text-4xl font-medium leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">Let&apos;s find where your ad spend can work harder.</h2>
            <Magnetic strength={0.18}>
              <Link href="/contact" className="inline-flex min-h-14 w-fit items-center gap-3 rounded-full bg-black px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                Book a free call <Arrow className="h-4 w-4" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
        <Link href="/" aria-label="Nexlytic home"><Image src="/logo.png" alt="Nexlytic" width={652} height={325} className="logo-neon h-7 w-auto" /></Link>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <a href="mailto:hello@nexlytic.de" className="transition-colors hover:text-white">hello@nexlytic.de</a>
          <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
          <span>© 2026 Nexlytic</span>
        </div>
      </footer>
    </main>
  );
}
