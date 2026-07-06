"use client";

import { useEffect, useRef } from "react";

import { useInView } from "@/components/viz-hooks";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type Service = {
  title: string;
  desc: string;
  items: string[];
  icon: React.ReactNode;
};

const IT_SERVICES: Service[] = [
  {
    title: "Web Design & Development",
    desc: "Fast, modern websites engineered to convert visitors into customers — designed, built and maintained by one team.",
    items: [
      "Business Websites",
      "Landing Pages",
      "WordPress Development",
      "Website Relaunch",
      "Website Maintenance",
    ],
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="m9 13-2 2 2 2" />
        <path d="m14 13 2 2-2 2" />
      </Icon>
    ),
  },
  {
    title: "SEO",
    desc: "Sustainable visibility exactly where your customers are searching — from the technical foundation to content that ranks.",
    items: ["SEO Audit", "Local SEO", "Technical SEO", "SEO Content", "Ongoing SEO Care"],
    icon: (
      <Icon>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
        <path d="m7.5 12 2-2 1.5 1.5 2.5-2.5" />
      </Icon>
    ),
  },
  {
    title: "Performance Marketing",
    desc: "Paid campaigns tuned relentlessly for measurable return — every euro of ad spend tracked and accounted for.",
    items: ["Google Ads", "Meta Ads", "Conversion Optimization", "Tracking & Analytics"],
    icon: (
      <Icon>
        <path d="M3 20h18" />
        <path d="m6 16 4-6 3 3 5-8" />
      </Icon>
    ),
  },
  {
    title: "Lead Generation",
    desc: "A predictable pipeline of qualified prospects: AI-powered funnels, landing pages and campaigns that capture demand and turn strangers into sales conversations.",
    items: ["AI-Powered Funnels", "Lead Magnets", "Marketing Automation", "CRM & Follow-up"],
    icon: (
      <Icon>
        <path d="M3 4h18l-7 8v6l-4 2v-8L3 4Z" />
      </Icon>
    ),
  },
  {
    title: "Branding",
    desc: "A sharp identity that people recognize and remember — consistent from the logo to every touchpoint.",
    items: ["Logo Design", "Corporate Identity", "Brand Strategy"],
    icon: (
      <Icon>
        <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
        <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
        <path d="m2.3 2.3 7.286 7.286" />
        <circle cx="11" cy="11" r="2" />
      </Icon>
    ),
  },
];

const ECOM_SERVICES: Service[] = [
  {
    title: "Amazon Services",
    desc: "Full-service growth on the world's biggest marketplace — from account management to launch strategy.",
    items: [
      "Account Management",
      "Amazon PPC",
      "Amazon SEO",
      "Listing Optimization",
      "A+ Content",
      "Product Images",
      "Brand Store",
      "Launch Strategy",
    ],
    icon: (
      <Icon>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </Icon>
    ),
  },
  {
    title: "Shopify",
    desc: "High-converting Shopify stores, built end to end — setup, design and continuous optimization.",
    items: ["Shopify Setup", "Shopify Design", "Shopify Optimization"],
    icon: (
      <Icon>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </Icon>
    ),
  },
  {
    title: "WooCommerce",
    desc: "Flexible WordPress commerce that scales with you — owned infrastructure, no platform lock-in.",
    items: ["WooCommerce Setup", "WooCommerce Optimization"],
    icon: (
      <Icon>
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </Icon>
    ),
  },
  {
    title: "Shopware",
    desc: "Robust Shopware builds for ambitious brands — engineered for the European market.",
    items: ["Shopware Development"],
    icon: (
      <Icon>
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
      </Icon>
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

function BigCard({ service, index }: { service: Service; index: number }) {
  const dark = index % 2 === 1;
  return (
    <div
      data-spot
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-10 lg:p-12 ${
        dark
          ? "border-zinc-800 bg-zinc-950 text-white shadow-[-24px_24px_80px_-32px_rgba(0,0,0,0.6)]"
          : "border-zinc-950/10 bg-white text-zinc-950 shadow-[-24px_24px_80px_-32px_rgba(0,0,0,0.45)]"
      }`}
    >
      {/* sheen that follows the pointer (per-card CSS vars set by the section listener) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${
            dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.045)"
          }, transparent 70%)`,
        }}
        aria-hidden="true"
      />
      <span
        className={`pointer-events-none absolute right-6 top-2 text-7xl font-semibold sm:right-10 sm:text-9xl ${
          dark ? "text-white/[0.07]" : "text-zinc-950/[0.05]"
        }`}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 sm:h-14 sm:w-14 ${
          dark ? "border-white/10 bg-white/[0.06] text-white" : "border-zinc-950/10 bg-zinc-950/[0.04] text-zinc-950"
        }`}
      >
        {service.icon}
      </span>

      <h4 className="relative mt-6 max-w-2xl text-3xl font-medium tracking-[-0.02em] sm:mt-8 sm:text-5xl">
        {service.title}
      </h4>
      <p
        className={`relative mt-4 max-w-2xl text-[15px] leading-relaxed sm:text-lg ${
          dark ? "text-zinc-400" : "text-zinc-600"
        }`}
      >
        {service.desc}
      </p>

      <ul className="relative mt-auto flex flex-wrap gap-2 pt-8 sm:gap-2.5">
        {service.items.map((item) => (
          <li
            key={item}
            className={`cursor-default rounded-full border px-3.5 py-2 text-[13px] transition-all duration-200 hover:-translate-y-0.5 sm:text-sm ${
              dark
                ? "border-white/10 bg-white/[0.05] text-zinc-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
                : "border-zinc-950/10 bg-zinc-950/[0.03] text-zinc-700 hover:border-zinc-950/30 hover:bg-zinc-950/[0.07] hover:text-zinc-950"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* A scroll-scrubbed deck: the group pins to the viewport while each card
   slides in from the right and lands on top of the previous one. */
function SlideDeck({
  no,
  title,
  count,
  services,
  fromLeft = false,
}: {
  no: string;
  title: string;
  count: number;
  services: Service[];
  fromLeft?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
    const n = cards.length;
    const seg = n - 1; // card 1 rides in while the deck approaches; the rest scrub the sticky range
    const dir = fromLeft ? -1 : 1;
    const tick = { on: false };

    const update = () => {
      tick.on = false;
      const vh = window.innerHeight;
      const rect = track.getBoundingClientRect();
      const total = rect.height - vh;
      if (total <= 0) return;
      const pre = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      cards.forEach((card, i) => {
        const t = i === 0 ? pre : Math.min(1, Math.max(0, progress * seg - (i - 1)));
        const e = 1 - Math.pow(1 - t, 3); // ease-out: fast entry, soft landing
        const covered =
          i < n - 1 ? Math.min(1, Math.max(0, progress * seg - i)) : 0;
        card.style.transform = `translateX(${((1 - e) * 108 * dir).toFixed(2)}%) rotate(${((1 - e) * 3 * dir).toFixed(2)}deg) scale(${(1 - covered * 0.05).toFixed(3)})`;
      });
    };
    const onScroll = () => {
      if (!tick.on) {
        tick.on = true;
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
  }, [fromLeft]);

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${(services.length - 1) * 60 + 100}svh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden px-6 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              {no}
            </span>
            <h3 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">{title}</h3>
            <span className="h-px flex-1 self-center bg-zinc-950/10" aria-hidden="true" />
            <span className="text-xs text-zinc-500 tabular-nums">{count} services</span>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto mt-6 h-[62svh] min-h-[520px] w-full max-w-6xl sm:mt-8"
        >
          {services.map((s, i) => (
            <div
              key={s.title}
              data-card
              className="absolute inset-0 will-change-transform"
              style={{ zIndex: i + 1 }}
            >
              <BigCard service={s} index={i} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServiceCatalog() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { ref: headRef, inView } = useInView<HTMLDivElement>();

  // per-card pointer coords for the sheen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e: PointerEvent) => {
      const sr = section.getBoundingClientRect();
      section.style.setProperty("--gx", `${e.clientX - sr.left}px`);
      section.style.setProperty("--gy", `${e.clientY - sr.top}px`);
      for (const card of section.querySelectorAll<HTMLElement>("[data-spot]")) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
    };
    section.addEventListener("pointermove", onMove);
    return () => section.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative z-30 border-t border-zinc-950/5 bg-white font-sans text-zinc-950"
    >
      {/* dot grid: a stronger base layer + darker, bigger dots revealed around the pointer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(9,9,11,0.17) 1.2px, transparent 1.2px)",
          backgroundSize: "26px 26px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(9,9,11,0.6) 1.8px, transparent 1.8px)",
          backgroundSize: "26px 26px",
          maskImage:
            "radial-gradient(240px circle at var(--gx, -999px) var(--gy, -999px), black 0%, rgba(0,0,0,0.35) 50%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(240px circle at var(--gx, -999px) var(--gy, -999px), black 0%, rgba(0,0,0,0.35) 50%, transparent 72%)",
        }}
        aria-hidden="true"
      />

      <div ref={headRef} className="relative mx-auto max-w-6xl px-6 pt-24 sm:px-10 sm:pt-32">
        <Rise inView={inView} delay={0}>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
              What We Do
            </span>
            <span className="h-px w-8 bg-zinc-300" aria-hidden="true" />
          </div>
        </Rise>
        <Rise inView={inView} delay={80}>
          <h2 className="mx-auto mt-5 max-w-3xl text-center text-4xl font-medium leading-[1.12] tracking-[-0.02em] sm:text-5xl">
            <span className="text-zinc-400">We are more than a service provider.</span>{" "}
            We are your growth partner.
          </h2>
        </Rise>
        <Rise inView={inView} delay={160}>
          <p className="mx-auto mt-5 max-w-xl text-center text-base text-zinc-500 sm:text-lg">
            Whatever your goal is – we are here to make it happen.
          </p>
        </Rise>
      </div>

      <SlideDeck no="01" title="IT & Digital Services" count={21} services={IT_SERVICES} />
      <SlideDeck no="02" title="E-Commerce" count={14} services={ECOM_SERVICES} fromLeft />
    </section>
  );
}
