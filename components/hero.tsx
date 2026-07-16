import Image from "next/image";
import Link from "next/link";

import KeyboardBall from "@/components/keyboard-ball";

/* Client logos, all rendered as flat light-gray marks on transparent
   backgrounds via brightness-0 invert. */
const clients = [
  { name: "PHM Connect", src: "/clients/phm.png", width: 500, height: 500, size: "h-13" },
  { name: "Mondzorg Haveneiland", src: "/clients/haveneiland.png", width: 800, height: 200, size: "h-10" },
  { name: "Fiberglasdiscount", src: "/clients/fiberglasdiscount.svg", width: 990, height: 199, size: "h-8" },
  { name: "Mondzorgpraktijk Veenendaal", src: "/clients/veenendaal.png", width: 347, height: 60, size: "h-8" },
  { name: "Smoke Gigant", src: "/clients/smoke-gigant.png", width: 180, height: 50, size: "h-8" },
  { name: "Onelogy", src: "/clients/onelogy.png", width: 400, height: 82, size: "h-7" },
  { name: "Atlantis Integrative Medicine & Psychiatry", src: "/clients/atlantis.png", width: 2992, height: 620, size: "h-9" },
];

export default function Hero() {
  return (
    // sticky: the next section slides up over the hero on scroll
    <section className="sticky top-0 flex min-h-svh flex-col overflow-hidden bg-black font-sans text-white">
      {/* faint wash of the keyword neon over the whole section */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <a href="/" aria-label="Nexlytic home">
          <Image
            src="/logo.png"
            alt="Nexlytic"
            width={652}
            height={325}
            priority
            className="logo-neon h-9 w-auto"
          />
        </a>
        <div className="flex items-center gap-7">
          <Link
            href="/contact"
            className="rounded-[3px] bg-white px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Book Free Call
          </Link>
          <Link
            href="/contact"
            className="hidden text-[15px] text-white transition-colors hover:text-zinc-300 sm:block"
          >
            Contact
          </Link>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-6 sm:px-10 lg:pl-28 lg:pr-14">
        <h1 className="hero-title max-w-4xl text-[48px] font-medium leading-[1.08] tracking-[-0.02em] sm:text-[64px] lg:text-[80px]">
          <span className="text-zinc-400">Built for</span>{" "}
          <span className="hero-neon">Growth.</span>
          <br />
          <span className="text-zinc-400">Driven by</span>{" "}
          <span className="hero-neon">Data.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
          Your digital growth agency — web design, SEO and performance
          marketing built for measurable, long-term success.
        </p>
        <div className="mt-8">
          <Link
            href="/contact"
            className="inline-block rounded-[3px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Book Free Call
          </Link>
        </div>
      </div>

      {/* keycap ball: in the flow below the copy on mobile/tablet, pinned to
          the right third on desktop; keys type themselves and react to the pointer */}
      <div className="relative flex h-[300px] items-center justify-center sm:h-[460px] lg:absolute lg:inset-y-0 lg:right-[9%] lg:h-auto lg:w-1/3">
        {/* white neon lamp behind the ball (desktop only); on mobile the
            headline's own neon wash is enough light */}
        <div
          aria-hidden
          className="ball-backlight absolute left-1/2 top-1/2 hidden h-[760px] w-[760px] rounded-full lg:block"
        />
        <KeyboardBall />
      </div>

      <div className="relative z-10 flex flex-col gap-y-4 px-6 pb-12 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-12 sm:gap-y-5 sm:px-10 lg:px-14">
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
      </div>
    </section>
  );
}
