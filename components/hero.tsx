import { ArrowUpRight } from "./icons";
import Image from "next/image";
import Link from "next/link";

import HeroFilm from "@/components/hero-film";
import Magnetic from "@/components/magnetic";
import ReactiveTitle from "@/components/reactive-title";

/* Client logos, all rendered as flat light-gray marks on transparent
   backgrounds via brightness-0 invert. */
const clients = [
  { name: "PHM Connect", src: "/clients/phm.png", width: 500, height: 500, size: "h-13" },
  { name: "Mondzorg Haveneiland", src: "/clients/haveneiland.png", width: 800, height: 200, size: "h-10" },
  { name: "Fiberglasdiscount", src: "/clients/fiberglasdiscount.svg", width: 990, height: 199, size: "h-8" },
  { name: "Mondzorgpraktijk Veenendaal", src: "/clients/veenendaal.png", width: 347, height: 60, size: "h-8" },
  { name: "Smoke Gigant", src: "/clients/smoke-gigant.png", width: 180, height: 50, size: "h-8" },
  { name: "Atlantis Integrative Medicine & Psychiatry", src: "/clients/atlantis.png", width: 2992, height: 620, size: "h-9" },
];

export default function Hero({ showClients = true }: { showClients?: boolean }) {
  return (
    <>
    <HeroFilm>

      <header className="relative z-10 flex flex-col items-stretch gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6 lg:px-14">
        <Link href="/" aria-label="Nexlytic home" className="w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <Image
            src="/logo.png"
            alt="Nexlytic"
            width={652}
            height={325}
            priority
            className="logo-neon h-9 w-auto"
          />
        </Link>
        <nav
          aria-label="Primary navigation"
          className="grid w-full grid-cols-[1fr_1fr_1.4fr_1fr] items-center gap-1.5 sm:flex sm:w-auto sm:gap-7"
        >
          <Link
            href="/services"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[3px] border border-white/15 px-2 text-xs text-white transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0 sm:rounded-none sm:border-0 sm:px-0 sm:text-[15px] sm:hover:bg-transparent sm:hover:text-zinc-300"
          >
            Services
          </Link>
          <Link
            href="/case-studies"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[3px] border border-white/15 px-2 text-xs text-white transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0 sm:rounded-none sm:border-0 sm:px-0 sm:text-[15px] sm:hover:bg-transparent sm:hover:text-zinc-300"
          >
            Our Work
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[3px] bg-white px-2 text-xs font-medium text-black transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-[15px]"
          >
            Book Free Call
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[3px] border border-white/15 px-2 text-xs text-white transition-colors hover:border-white/35 hover:bg-white/[0.05] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0 sm:rounded-none sm:border-0 sm:px-0 sm:text-[15px] sm:hover:bg-transparent sm:hover:text-zinc-300"
          >
            Contact
          </Link>
        </nav>
      </header>

      <div className="hero-film-copy relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-10 lg:pl-20">
        <p className="hero-film-eyebrow">Munich · Digital growth studio</p>
        <ReactiveTitle className="hero-film-title" lines={[{ text: "Built for" }, { text: "what’s" }, { text: "next.", accent: true }]} />
        <p className="hero-film-tags">Brand. Web. Performance.</p>
        <div className="hero-film-cta mt-7">
          <Magnetic>
            <Link href="/contact" className="inline-flex items-center gap-8 rounded-[3px] bg-white px-6 py-3.5 text-[14px] font-medium text-black transition-colors hover:bg-zinc-200">Build your next chapter <span aria-hidden="true"><ArrowUpRight/></span></Link>
          </Magnetic>
        </div>
      </div>

    </HeroFilm>
      {showClients && <div id="hero-clients" className="hero-film-clients relative z-10 flex flex-col gap-y-4 px-6 pb-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-12 sm:gap-y-5 sm:px-10 lg:px-14">
        <span className="text-[17px] font-semibold">Trusted By:</span>

        {/* mobile: one endless sliding row (same seamless two-copy marquee as
            the growth-partner strip), edges faded out with a mask */}
        <div
          className="overflow-hidden sm:hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <ul className="gp-marquee flex w-max items-center">
            {[...clients, ...clients].map((c, i) => (
              <li key={`${c.name}-${i}`} className="mr-8" aria-hidden={i >= clients.length}>
                <Image
                  src={c.src}
                  alt={i < clients.length ? c.name : ""}
                  width={c.width}
                  height={c.height}
                  unoptimized={c.src.endsWith(".svg")}
                  className="h-6 w-auto max-w-none brightness-0 invert opacity-55"
                />
              </li>
            ))}
          </ul>
        </div>

        {/* tablet/desktop: the wrapping list as before */}
        <ul className="hidden flex-wrap items-center gap-x-10 gap-y-6 sm:flex">
          {clients.map((c) => (
            <li key={c.name}>
              <Image
                src={c.src}
                alt={c.name}
                width={c.width}
                height={c.height}
                unoptimized={c.src.endsWith(".svg")}
                className={`${c.size} w-auto max-w-none brightness-0 invert opacity-55 transition-opacity duration-300 hover:opacity-90`}
              />
            </li>
          ))}
        </ul>
      </div>}
    </>
  );
}
