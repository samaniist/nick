import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import Footer from "@/components/footer";

type LegalNavItem = {
  href: string;
  label: string;
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  navItems: LegalNavItem[];
  siblingHref: string;
  siblingLabel: string;
  children: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  navItems,
  siblingHref,
  siblingLabel,
  children,
}: LegalPageProps) {
  return (
    <>
      <main lang="de" className="bg-black font-sans text-white selection:bg-white selection:text-black">
        <section className="relative overflow-hidden border-b border-white/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-55"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse 80% 92% at 55% 15%, black, transparent 78%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 92% at 55% 15%, black, transparent 78%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] top-[-8rem] h-80 w-80 rounded-full bg-white/[0.055] blur-[110px]"
          />

          <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-14">
            <Link
              href="/"
              aria-label="Nexlytic Startseite"
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
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
            <nav aria-label="Rechtliche Seiten" className="flex items-center gap-2 sm:gap-3">
              <Link
                href={siblingHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-4 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-white/35 hover:bg-white/[0.05] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm"
              >
                {siblingLabel}
              </Link>
              <Link
                href="/"
                className="hidden min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors duration-200 hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Zur Startseite
              </Link>
            </nav>
          </header>

          <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-14 sm:px-10 sm:pb-28 sm:pt-20 lg:px-14 lg:pb-32">
            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400">
              <span className="h-px w-8 bg-white/55" aria-hidden="true" />
              {eyebrow}
            </div>
            <h1 className="mt-7 max-w-5xl text-[clamp(3.5rem,9vw,8.2rem)] font-medium leading-[0.88] tracking-[-0.065em]">
              {title}
            </h1>
            <div className="mt-9 grid gap-6 border-t border-white/12 pt-7 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
                {intro}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Stand: {updated}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f1f0ea] px-6 py-16 text-[#11120f] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-20">
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#65733e]">
                Auf dieser Seite
              </p>
              <nav aria-label={"Inhaltsverzeichnis " + title} className="mt-5">
                <ol className="border-t border-black/15">
                  {navItems.map((item, index) => (
                    <li key={item.href} className="border-b border-black/15">
                      <a
                        href={item.href}
                        className="group flex min-h-12 items-center gap-4 py-2 text-sm text-zinc-600 transition-colors duration-200 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        <span className="font-mono text-[9px] text-[#65733e]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <article className="min-w-0 rounded-[28px] border border-black/10 bg-white/55 px-6 py-3 shadow-[0_30px_90px_-60px_rgba(0,0,0,.4)] sm:px-10 lg:px-14">
              {children}
            </article>
          </div>
        </section>
      </main>
      <Footer showCta={false} />
    </>
  );
}

export function LegalSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 border-b border-black/12 py-10 last:border-b-0 sm:py-12">
      <div className="grid gap-5 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-7">
        <span className="font-mono text-[10px] text-[#65733e]">{index}</span>
        <div className="min-w-0">
          <h2 className="text-2xl font-medium tracking-[-0.03em] text-black sm:text-3xl">{title}</h2>
          <div className="mt-5 space-y-4 text-[15px] leading-7 text-zinc-700 sm:text-base sm:leading-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export const legalLinkClass =
  "font-medium text-black underline decoration-black/30 underline-offset-4 transition-colors duration-200 hover:decoration-black focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";
