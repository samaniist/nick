"use client";

import { useEffect, useRef } from "react";
import "./live-build.css";
import BuildFrame, { type Phases } from "./live-build-frame";

const STEPS = [
  { no: "01", title: "Strategy", text: "We learn your business, goals and audience, then map a plan built for measurable results." },
  { no: "02", title: "Design", text: "Structure becomes layout, type and colour that guide every visitor toward the goal." },
  { no: "03", title: "Build", text: "Implemented with precision, creativity and modern technologies: fast, accessible, ready to scale." },
  { no: "04", title: "Grow", text: "Live is the start. We continuously measure, optimize and scale for sustainable growth." },
];

/* Final visual state of each step, used for the static (reduced-motion / no-JS) layout. */
const FINAL: Phases[] = [
  { s: 1, d: 0, b: 0, g: 0 },
  { s: 1, d: 1, b: 0, g: 0 },
  { s: 1, d: 1, b: 1, g: 0 },
  { s: 1, d: 1, b: 1, g: 1 },
];

const SPAN = 4; // scroll progress runs 0 → 4, one unit per step
const START = [0, 0.9, 1.9, 2.9]; // where each step's animation begins
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };

export default function LiveBuild() {
  const scene = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const goTo = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const root = scene.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = 0, displayed = 0, frame = 0, lastTime = 0, active = false, step = -1, disposed = false;

    const distance = () => Math.max(1, root.offsetHeight - (root.firstElementChild as HTMLElement).offsetHeight);
    const paint = () => {
      const p = displayed;
      root.style.setProperty("--s", smooth((p + 0.35) / 0.95).toFixed(4));
      root.style.setProperty("--d", smooth((p - START[1]) / 0.8).toFixed(4));
      root.style.setProperty("--b", smooth((p - START[2]) / 0.75).toFixed(4));
      root.style.setProperty("--g", smooth((p - START[3]) / 0.75).toFixed(4));
      const next = p < START[1] - 0.05 ? 0 : p < START[2] - 0.05 ? 1 : p < START[3] - 0.05 ? 2 : 3;
      items.current.forEach((li, i) => li?.style.setProperty("--f", clamp(p - i).toFixed(3)));
      if (next !== step) {
        step = next;
        root.dataset.step = String(step);
        items.current.forEach((li, i) => {
          if (!li) return;
          li.dataset.on = String(i === step);
          if (i === step) li.setAttribute("aria-current", "step");
          else li.removeAttribute("aria-current");
        });
      }
    };
    const tick = (now: number) => {
      frame = 0;
      if (disposed || !active || document.hidden) { lastTime = 0; return; }
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      displayed += (target - displayed) * (1 - Math.exp(-dt / 110));
      if (Math.abs(target - displayed) < 0.0005) displayed = target;
      paint();
      if (displayed !== target) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };
    const schedule = () => { if (!frame && active && !disposed) frame = requestAnimationFrame(tick); };
    const measure = () => {
      if (reduced.matches) return;
      target = clamp(-root.getBoundingClientRect().top / distance()) * SPAN;
      schedule();
    };
    const configure = () => {
      cancelAnimationFrame(frame); frame = 0;
      root.dataset.enhanced = String(!reduced.matches);
      if (reduced.matches) {
        for (const k of ["--s", "--d", "--b", "--g"]) root.style.removeProperty(k);
        items.current.forEach((li) => { li?.removeAttribute("data-on"); li?.removeAttribute("aria-current"); li?.style.removeProperty("--f"); });
        step = -1;
        return;
      }
      target = clamp(-root.getBoundingClientRect().top / distance()) * SPAN;
      displayed = target;
      paint();
    };
    goTo.current = (i: number) => {
      if (reduced.matches) { items.current[i]?.scrollIntoView({ block: "start" }); return; }
      // Land where that step's visual has fully formed.
      const top = window.scrollY + root.getBoundingClientRect().top + distance() * (START[i] + 0.8) / SPAN;
      window.scrollTo({ top, behavior: "smooth" });
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      root.dataset.active = String(active);
      if (active) { measure(); if (!reduced.matches) { displayed = target; paint(); } }
      else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
    });
    const visibility = () => { if (!document.hidden) measure(); };
    observer.observe(root);
    reduced.addEventListener("change", configure);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", visibility);
    configure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", configure);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      delete root.dataset.enhanced;
    };
  }, []);

  return (
    <section ref={scene} id="process" className="live-build" data-scroll-scene aria-labelledby="live-build-title">
      <div className="lb-stage">
        <div className="lb-copy">
          <p className="lb-eyebrow"><span>06</span> / How we build</p>
          <h2 id="live-build-title" className="lb-title">
            Watch it get built.<span>Blueprint to live.</span>
          </h2>
          <ol className="lb-steps">
            {STEPS.map((s, i) => (
              <li
                key={s.no}
                ref={(el) => { items.current[i] = el; }}
                className="lb-step"
              >
                <button type="button" className="lb-step-btn" onClick={() => goTo.current(i)}>
                  <span className="lb-step-no">{s.no}</span>
                  <span className="lb-step-title">{s.title}</span>
                  <span className="lb-step-bar" aria-hidden="true"><i /></span>
                </button>
                <p className="lb-step-text">{s.text}</p>
                <div className="lb-step-visual">
                  <BuildFrame phases={FINAL[i]} withShot={i >= 2} />
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lb-visual">
          <BuildFrame live />
        </div>
      </div>
    </section>
  );
}
