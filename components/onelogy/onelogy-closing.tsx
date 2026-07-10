"use client";

import { useLang } from "@/components/onelogy/lang";

/* Closing section: an endless marquee line + the static goal statement.
   The marquee reuses the gp-marquee keyframe (two identical halves sliding
   -50% for a seamless loop). */

const T = {
  en: {
    marquee: "SEE YOU SOON IN PARIS.",
    heading: "Let’s Build the Future of Onélogy",
    lines: [
      "The goal isn’t simply to increase traffic.",
      "The goal is to build one of the strongest digital beauty brands in the industry.",
    ],
  },
  fr: {
    marquee: "À TRÈS VITE À PARIS.",
    heading: "Construisons le futur d’Onélogy",
    lines: [
      "L’objectif n’est pas simplement d’augmenter le trafic.",
      "L’objectif est de construire l’une des marques de beauté digitales les plus fortes du secteur.",
    ],
  },
};

export default function OnelogyClosing() {
  const lang = useLang();
  const t = T[lang];
  const half = Array(4).fill(t.marquee);
  return (
    <section className="relative z-10 w-full overflow-hidden bg-white pb-32 pt-8 text-neutral-900">
      <div
        className="gp-marquee flex w-max items-center hover:[animation-play-state:paused]"
        style={{ animationDuration: "28s" }}
      >
        {[0, 1].map((h) => (
          <div key={h} className="flex items-center" aria-hidden={h === 1}>
            {half.map((text, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap px-6 font-black uppercase leading-none tracking-[-0.03em] text-[clamp(3rem,8vw,7rem)] transition-colors duration-300 hover:text-violet-600"
              >
                {text}
                <span className="ml-12 h-3 w-3 rounded-full bg-neutral-300 sm:h-4 sm:w-4" aria-hidden />
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-24 text-center sm:pt-32">
        <h2 className="text-3xl font-black tracking-[-0.02em] sm:text-5xl">
          {t.heading}
        </h2>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
          {t.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
