/* Closing section: an endless marquee line + the static goal statement.
   The marquee reuses the gp-marquee keyframe (two identical halves sliding
   -50% for a seamless loop). */

const MARQUEE_HALF = Array(4).fill("SEE YOU SOON IN PARIS.");

export default function OnelogyClosing() {
  return (
    <section className="relative z-10 w-full overflow-hidden bg-white pb-32 pt-8 text-neutral-900">
      <div
        className="gp-marquee flex w-max items-center hover:[animation-play-state:paused]"
        style={{ animationDuration: "28s" }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {MARQUEE_HALF.map((text, i) => (
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
          Let’s Build the Future of Onélogy
        </h2>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
          <p>The goal isn’t simply to increase traffic.</p>
          <p>
            The goal is to build one of the strongest digital beauty brands in
            the industry.
          </p>
        </div>
      </div>
    </section>
  );
}
