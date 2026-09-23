"use client";

import Matter from "matter-js";
import { useEffect, useRef } from "react";

import { ArrowUpRight } from "@/components/icons";

/* ---------------------------------------------------------------------------
   "What we are" as a pile of physical tags. When the box scrolls into view
   the tags drop in one by one, bounce and stack up. Visitors can grab a tag
   and throw it (mouse or finger — only the tag itself captures the touch, so
   the page still scrolls everywhere else); a flick of the page scroll gives
   the whole pile a little jolt. Physics: matter-js. Rendering: plain DOM
   elements (crisp text, styled with CSS) moved by transform each frame. */

type Tag = { label: React.ReactNode; tone: "ink" | "paper" | "outline"; shape?: "pill" | "circle"; key: string; wide?: boolean };

const TAGS: Tag[] = [
  { key: "studio", label: "Growth studio", tone: "ink" },
  { key: "munich", label: "Munich", tone: "outline" },
  { key: "convert", label: "Websites that convert", tone: "ink" },
  { key: "seo", label: "SEO", tone: "paper" },
  { key: "geo", label: "GEO", tone: "outline", wide: true },
  { key: "gads", label: "Google Ads", tone: "paper" },
  { key: "meta", label: "Meta Ads", tone: "paper", wide: true },
  { key: "brand", label: "Branding", tone: "outline" },
  { key: "arrow", label: <ArrowUpRight className="h-[1.1em] w-[1.1em]" />, tone: "ink", shape: "circle" },
  { key: "leads", label: "Lead Generation", tone: "paper" },
  { key: "euro", label: "Measured to the last euro", tone: "ink" },
  { key: "shopify", label: "Shopify", tone: "outline" },
  { key: "amazon", label: "Amazon", tone: "paper", wide: true },
  { key: "eur", label: "€", tone: "outline", shape: "circle", wide: true },
  { key: "fluff", label: "No fluff", tone: "paper" },
  { key: "guess", label: "No guesswork", tone: "outline" },
  { key: "analytics", label: "Tracking & Analytics", tone: "paper", wide: true },
  { key: "social", label: "Social Media", tone: "outline", wide: true },
  { key: "see", label: "Growth you can see", tone: "ink" },
];

const TONE: Record<Tag["tone"], string> = {
  ink: "bg-zinc-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_14px_30px_-12px_rgba(0,0,0,0.55)]",
  paper:
    "bg-white text-zinc-950 border border-zinc-950/10 shadow-[inset_0_-3px_0_rgba(0,0,0,0.05),0_12px_26px_-14px_rgba(0,0,0,0.35)]",
  outline: "bg-[#f4f4f2] text-zinc-700 border border-zinc-950/15 shadow-[0_10px_22px_-16px_rgba(0,0,0,0.3)]",
};

export default function WhoPhysics({ className = "" }: { className?: string }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      box.dataset.static = "true"; // CSS lays the tags out as a wrapped list
      return;
    }

    const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 1.1;
    const world = engine.world;

    let W = box.clientWidth;
    let H = box.clientHeight;
    const WALL = 200;
    let walls: Matter.Body[] = [];
    const makeWalls = () => {
      Composite.remove(world, walls);
      walls = [
        Bodies.rectangle(W / 2, H + WALL / 2, W * 3, WALL, { isStatic: true, friction: 0.9 }),
        Bodies.rectangle(-WALL / 2, H / 2 - H, WALL, H * 4, { isStatic: true }),
        Bodies.rectangle(W + WALL / 2, H / 2 - H, WALL, H * 4, { isStatic: true }),
      ];
      Composite.add(world, walls);
    };
    makeWalls();

    // one body per tag, sized from its rendered element
    const els = (tagRefs.current.filter(Boolean) as HTMLDivElement[]).filter((el) => el.offsetWidth > 0);
    const bodies: (Matter.Body | null)[] = els.map(() => null);
    const sizes = els.map((el) => ({ w: el.offsetWidth, h: el.offsetHeight }));

    const spawn = (i: number) => {
      const { w, h } = sizes[i];
      const x = w / 2 + Math.random() * Math.max(1, W - w);
      const y = -h - Math.random() * 120;
      const circle = els[i].dataset.shape === "circle";
      const b = circle
        ? Bodies.circle(x, y, w / 2, { restitution: 0.45, friction: 0.5, density: 0.0016 })
        : Bodies.rectangle(x, y, w, h, {
            chamfer: { radius: h / 2 - 1 },
            restitution: 0.3,
            friction: 0.55,
            frictionAir: 0.012,
            density: 0.0012,
          });
      Body.setAngle(b, (Math.random() - 0.5) * 0.9);
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.08);
      Composite.add(world, b);
      bodies[i] = b;
      els[i].style.visibility = "visible";
    };

    // ---- drag & throw (pointer events on the tag itself)
    let drag: { i: number; c: Matter.Constraint; id: number } | null = null;
    const toLocal = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const downHandlers = els.map((el, i) => (e: PointerEvent) => {
      const b = bodies[i];
      if (!b || drag) return;
      e.preventDefault();
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone — the window listeners still track it */
      }
      const p = toLocal(e);
      Sleeping.set(b, false);
      const c = Constraint.create({
        pointA: p,
        bodyB: b,
        pointB: { x: p.x - b.position.x, y: p.y - b.position.y },
        stiffness: 0.2,
        damping: 0.1,
        length: 0,
      });
      Composite.add(world, c);
      drag = { i, c, id: e.pointerId };
      el.classList.add("is-grabbed");
    });
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const p = toLocal(e);
      drag.c.pointA = p;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      Composite.remove(world, drag.c);
      els[drag.i].classList.remove("is-grabbed");
      drag = null;
    };
    els.forEach((el, i) => el.addEventListener("pointerdown", downHandlers[i]));
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // ---- a flick of the page scroll jolts the pile
    let lastY = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (Math.abs(dy) < 18) return;
      const k = Math.max(-1, Math.min(1, dy / 120)) * 0.018;
      bodies.forEach((b) => {
        if (!b) return;
        Sleeping.set(b, false);
        Body.applyForce(b, b.position, { x: (Math.random() - 0.5) * 0.004 * b.mass, y: -Math.abs(k) * b.mass });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ---- loop
    let raf = 0;
    let running = false;
    let last = 0;
    const frame = (now: number) => {
      const dt = Math.min(1000 / 30, now - last || 16.7);
      last = now;
      Engine.update(engine, dt);
      for (let i = 0; i < els.length; i++) {
        const b = bodies[i];
        if (!b) continue;
        // anything thrown out of the box comes back from the top
        if (b.position.y > H + 400 || b.position.x < -300 || b.position.x > W + 300) {
          Body.setPosition(b, { x: W / 2, y: -80 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
        const { w, h } = sizes[i];
        els[i].style.transform = `translate(${(b.position.x - w / 2).toFixed(1)}px, ${(b.position.y - h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(4)}rad)`;
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // drop the tags in the first time the box is seen
    let dropped = false;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          start();
          if (!dropped) {
            dropped = true;
            els.forEach((_, i) => timers.push(window.setTimeout(() => spawn(i), 120 + i * 110)));
          }
        } else stop();
      },
      { threshold: 0.25 },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => {
      const nw = box.clientWidth;
      const nh = box.clientHeight;
      if (nw === W && nh === H) return;
      W = nw;
      H = nh;
      makeWalls();
      bodies.forEach((b) => b && Sleeping.set(b, false));
    });
    ro.observe(box);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      timers.forEach(clearTimeout);
      els.forEach((el, i) => el.removeEventListener("pointerdown", downHandlers[i]));
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      Composite.clear(world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`who-pile relative overflow-hidden ${className}`}
      aria-label="What Nexlytic is about"
      role="list"
    >
      {TAGS.map((t, i) => (
        <div
          key={t.key}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          role="listitem"
          data-shape={t.shape ?? "pill"}
          className={`who-tag absolute left-0 top-0 ${t.wide ? "hidden sm:flex" : "flex"} cursor-grab select-none items-center justify-center whitespace-nowrap font-medium tracking-[-0.01em] ${
            TONE[t.tone]
          } ${t.shape === "circle" ? "h-12 w-12 rounded-full text-lg sm:h-16 sm:w-16 sm:text-2xl" : "rounded-full px-3.5 py-2 text-sm sm:px-5 sm:py-3 sm:text-lg lg:px-6 lg:text-xl"}`}
        >
          {t.label}
        </div>
      ))}
    </div>
  );
}
