import Image from "next/image";

import KeyboardBall from "@/components/keyboard-ball";

const navLinks = [
  { label: "Home", href: "#", dropdown: false },
  { label: "Services", href: "#", dropdown: true },
  { label: "E-Commerce", href: "#", dropdown: true },
];

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

/* Deterministic market chart drawn behind the keyboard ball (must render
   identically on server and client): gridlines + candlesticks like a
   trading terminal, and a rising analytics trend line like an SEO
   dashboard. Rally, sell-off, brief recovery, then a deep slide. */
const CANDLES = Array.from({ length: 26 }, (_, i) => {
  const rnd = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const trend =
    i < 9 ? 300 - i * 20 : i < 16 ? 120 + (i - 9) * 32 : i < 21 ? 344 - (i - 16) * 14 : 274 + (i - 21) * 60;
  const open = trend + (rnd(1) - 0.5) * 40;
  const close = trend + (rnd(2) - 0.5) * 40;
  const top = Math.min(open, close);
  const bottom = Math.max(open, close);
  return {
    x: 24 + i * 30,
    up: close < open,
    wickTop: top - 8 - rnd(3) * 30,
    wickBottom: bottom + 8 + rnd(4) * 30,
    bodyY: top,
    bodyH: Math.max(bottom - top, 6),
  };
});

/* SEO-dashboard trend: climbs left to right with gentle dips. */
const TREND = Array.from({ length: 18 }, (_, i) => ({
  x: 30 + i * 45,
  y: 580 - i * 25 + Math.sin(i * 1.7) * 28,
}));
const TREND_LINE = TREND.map((p) => `${p.x},${p.y.toFixed(1)}`).join(" ");
const TREND_AREA = `M${TREND[0].x},640 L${TREND_LINE.replaceAll(" ", " L")} L${TREND[TREND.length - 1].x},640 Z`;

const PRICES: [string, number][] = [
  ["117.23", 104],
  ["103.39", 252],
  ["89.54", 400],
  ["75.70", 548],
];

export default function Hero() {
  return (
    // sticky: the next section slides up over the hero on scroll
    <section className="sticky top-0 flex min-h-svh flex-col overflow-hidden bg-black font-sans text-white">
      {/* keycap ball on the right third; keys type themselves and react to the pointer */}
      <div className="absolute inset-y-0 right-[9%] hidden w-1/3 items-center justify-center lg:flex">
        {/* white neon lamp behind the ball; its light washes over the hero */}
        <div
          aria-hidden
          className="ball-backlight absolute left-1/2 top-1/2 h-[760px] w-[760px] rounded-full"
        />
        {/* gray market chart behind the ball: grid + candles + trend line */}
        <svg
          aria-hidden
          viewBox="0 0 820 680"
          className="absolute left-1/2 top-1/2 h-[680px] w-[820px] -translate-x-1/2 -translate-y-1/2"
        >
          <defs>
            <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
          </defs>
          {PRICES.map(([, y]) => (
            <line key={y} x1={16} x2={744} y1={y} y2={y} stroke="#ffffff" strokeOpacity={0.07} />
          ))}
          {CANDLES.map((c, i) => (
            <g key={i}>
              <line
                x1={c.x}
                x2={c.x}
                y1={c.wickTop}
                y2={c.wickBottom}
                stroke="#b6b6bf"
                strokeWidth={2}
                strokeOpacity={0.42}
              />
              <rect
                x={c.x - 7}
                width={14}
                y={c.bodyY}
                height={c.bodyH}
                rx={1.5}
                fill={c.up ? "#d9d9df" : "#83838c"}
                fillOpacity={0.45}
              />
            </g>
          ))}
          <path d={TREND_AREA} fill="url(#trend-fill)" />
          <polyline
            points={TREND_LINE}
            fill="none"
            stroke="#e4e4e7"
            strokeOpacity={0.55}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle
            cx={TREND[TREND.length - 1].x}
            cy={TREND[TREND.length - 1].y}
            r={10}
            fill="#ffffff"
            fillOpacity={0.15}
          />
          <circle
            cx={TREND[TREND.length - 1].x}
            cy={TREND[TREND.length - 1].y}
            r={4.5}
            fill="#ffffff"
            fillOpacity={0.9}
          />
          {PRICES.map(([label, y]) => (
            <text
              key={label}
              x={812}
              y={y + 4}
              textAnchor="end"
              fill="#8f8f98"
              fontSize={14}
              className="font-mono"
            >
              {label}
            </text>
          ))}
        </svg>
        <KeyboardBall />
      </div>

      {/* faint wash of the keyword neon over the whole section */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <div className="flex items-center gap-12">
          <a href="#" aria-label="Nexlytic home">
            <Image
              src="/logo.png"
              alt="Nexlytic"
              width={652}
              height={325}
              priority
              className="h-9 w-auto brightness-0 invert"
            />
          </a>
          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-[15px] text-white transition-colors hover:text-zinc-300"
              >
                {link.label}
                {link.dropdown && <ChevronDown />}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-7">
          <a
            href="#"
            className="rounded-[3px] bg-white px-5 py-2.5 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Book Free Call
          </a>
          <a
            href="#"
            className="hidden text-[15px] text-white transition-colors hover:text-zinc-300 sm:block"
          >
            Contact
          </a>
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
          <a
            href="#"
            className="inline-block rounded-[3px] bg-white px-6 py-3 text-[15px] font-medium text-black transition-colors hover:bg-zinc-200"
          >
            Book Free Call
          </a>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap items-center gap-x-12 gap-y-5 px-6 pb-12 sm:px-10 lg:px-14">
        <span className="text-[17px] font-semibold">Trusted By:</span>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
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
