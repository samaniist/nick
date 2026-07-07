"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ————— shared bits ————— */

function FieldError({ id, msg }: { id: string; msg: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-zinc-400">
      {msg}
    </p>
  );
}

const inputCls =
  "w-full min-h-[44px] rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-white/40 focus:bg-white/[0.07] focus:shadow-[0_0_24px_rgba(255,255,255,0.08)]";

/* Neon glyphs floating around the card at different 3D depths. */
const GLYPHS = [
  { sym: "@", cls: "-left-10 top-6 text-4xl", z: 90, delay: 0 },
  { sym: "✉", cls: "-right-7 top-1/4 text-3xl", z: 120, delay: 1200 },
  { sym: "{ }", cls: "-left-14 bottom-1/4 text-2xl", z: 70, delay: 2400 },
  { sym: "↗", cls: "-right-10 bottom-10 text-4xl", z: 100, delay: 600 },
  { sym: "+49", cls: "left-1/4 -top-9 text-xl", z: 110, delay: 1800 },
];

const CHANNELS = [
  {
    label: "Email us",
    value: "hello@nexlytic.de",
    href: "mailto:hello@nexlytic.de",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  },
  {
    label: "Call us",
    value: "+49 176 70767725",
    href: "tel:+4917670767725",
    icon: (
      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
    ),
  },
  {
    label: "Visit us",
    value: "81549 Munich-Ramersdorf-Perlach",
    href: "https://maps.google.com/?q=81549+Munich",
    icon: (
      <>
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
  },
];

/* ————— the 3D card ————— */

function TiltCard({ children }: { children: React.ReactNode }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const card = cardRef.current;
    if (!frame || !card) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // 3D tilt is a hover affordance; skip it entirely on touch devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cur = { rx: 0, ry: 0, gx: 50, gy: 50 };
    const tgt = { rx: 0, ry: 0, gx: 50, gy: 50 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width; // 0..1
      const py = (e.clientY - r.top) / r.height;
      tgt.ry = (px - 0.5) * 14; // rotateY follows horizontal
      tgt.rx = (0.5 - py) * 12; // rotateX follows vertical
      tgt.gx = px * 100;
      tgt.gy = py * 100;
    };
    const onLeave = () => {
      tgt.rx = 0;
      tgt.ry = 0;
    };
    const loop = () => {
      cur.rx += (tgt.rx - cur.rx) * 0.09;
      cur.ry += (tgt.ry - cur.ry) * 0.09;
      cur.gx += (tgt.gx - cur.gx) * 0.12;
      cur.gy += (tgt.gy - cur.gy) * 0.12;
      card.style.transform = `rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)`;
      card.style.setProperty("--gx", `${cur.gx.toFixed(1)}%`);
      card.style.setProperty("--gy", `${cur.gy.toFixed(1)}%`);
      raf = requestAnimationFrame(loop);
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={frameRef} className="[perspective:1400px]">
      <div
        ref={cardRef}
        className="relative rounded-3xl border border-white/10 bg-linear-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] p-7 backdrop-blur-xl will-change-transform [transform-style:preserve-3d] sm:p-9"
        style={{
          boxShadow:
            "0 40px 80px -24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* pointer-tracking glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background:
              "radial-gradient(420px circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.1), transparent 65%)",
          }}
        />
        {/* floating neon glyphs, each on its own depth plane */}
        {GLYPHS.map((g) => (
          <span
            key={g.sym}
            aria-hidden
            className={`viz-float pointer-events-none absolute hidden select-none font-semibold text-white lg:block ${g.cls}`}
            style={{
              transform: `translateZ(${g.z}px)`,
              animationDelay: `${g.delay}ms`,
              textShadow:
                "0 0 6px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.25)",
            }}
          >
            {g.sym}
          </span>
        ))}
        {/* content rides slightly above the glass */}
        <div className="relative [transform-style:preserve-3d]" style={{ transform: "translateZ(36px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* Submit button that leans toward the cursor (magnetic). */
function MagneticButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const reach = 120;
      if (dist < reach) {
        const pull = (1 - dist / reach) * 0.35;
        btn.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else {
        btn.style.transform = "";
      }
    };
    const onLeave = () => (btn.style.transform = "");
    window.addEventListener("pointermove", onMove, { passive: true });
    btn.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <button
      ref={ref}
      type="submit"
      disabled={disabled}
      className="min-h-[48px] w-full cursor-pointer rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-black transition-colors duration-200 hover:bg-zinc-200 disabled:cursor-default disabled:opacity-50 sm:w-auto"
      style={{ transition: "transform 180ms cubic-bezier(0.34, 1.4, 0.44, 1), background-color 200ms" }}
    >
      {children}
    </button>
  );
}

/* ————— the page ————— */

type Errors = Partial<Record<"name" | "email" | "message", string>>;

export default function ContactExperience() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    if (name === "name" && !value.trim()) return "Please tell us your name.";
    if (name === "email") {
      if (!value.trim()) return "We need your email to reply.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "That email doesn't look right — check for typos.";
    }
    if (name === "message" && value.trim().length < 10)
      return "Give us a sentence or two about your project.";
    return undefined;
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const topic = String(fd.get("topic") ?? "");
    const message = String(fd.get("message") ?? "");

    const next: Errors = {
      name: validateField("name", name),
      email: validateField("email", email),
      message: validateField("message", message),
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    const subject = encodeURIComponent(`Project inquiry${topic ? ` — ${topic}` : ""} (${name})`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    window.location.href = `mailto:hello@nexlytic.de?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-black font-sans text-white">
      {/* faint dot field + neon wash, same light language as the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black, transparent 78%)",
        }}
      />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" aria-label="Nexlytic home">
          <Image src="/logo.png" alt="Nexlytic" width={652} height={325} priority className="logo-neon h-8 w-auto" />
        </Link>
        <Link
          href="/"
          className="text-[15px] text-zinc-400 transition-colors hover:text-white"
        >
          ← Back to home
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-14 px-6 pb-20 pt-8 sm:px-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* left: headline + direct channels */}
        <div className="hero-title">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-zinc-600" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">
              Contact
            </span>
          </div>
          <h1 className="mt-6 text-5xl font-medium leading-[1.06] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
            <span className="text-zinc-400">Let&apos;s build</span>
            <br />
            <span className="hero-neon">something big.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
            Tell us where your business should be in twelve months — we&apos;ll
            answer within one business day with a plan to get there.
          </p>

          <ul className="mt-10 space-y-3">
            {CHANNELS.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className="group flex min-h-[44px] items-center gap-4 rounded-xl border border-white/0 px-3 py-2.5 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      {c.icon}
                    </svg>
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.15em] text-zinc-500">
                      {c.label}
                    </span>
                    <span className="block text-[15px] text-zinc-200 transition-colors group-hover:text-white">
                      {c.value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* right: the 3D form card */}
        <TiltCard>
          <h2 className="text-2xl font-medium tracking-[-0.01em] sm:text-3xl">
            Start your project
          </h2>
          <p className="mt-2 text-[15px] text-zinc-400">
            A few details — the conversation does the rest.
          </p>

          <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="c-name" className="mb-2 block text-sm text-zinc-300">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="c-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  onBlur={onBlur}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "c-name-err" : undefined}
                  placeholder="Jane Doe"
                  className={inputCls}
                />
                {errors.name && <FieldError id="c-name-err" msg={errors.name} />}
              </div>
              <div>
                <label htmlFor="c-email" className="mb-2 block text-sm text-zinc-300">
                  Email <span aria-hidden="true">*</span>
                </label>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onBlur={onBlur}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "c-email-err" : undefined}
                  placeholder="jane@company.com"
                  className={inputCls}
                />
                {errors.email && <FieldError id="c-email-err" msg={errors.email} />}
              </div>
            </div>

            <div>
              <label htmlFor="c-topic" className="mb-2 block text-sm text-zinc-300">
                What do you need?
              </label>
              <select id="c-topic" name="topic" defaultValue="" className={`${inputCls} appearance-none`}>
                <option value="" className="bg-zinc-900">
                  Choose a service (optional)
                </option>
                {[
                  "Web Design & Development",
                  "SEO",
                  "Performance Marketing",
                  "E-Commerce",
                  "Branding",
                  "Something else",
                ].map((o) => (
                  <option key={o} value={o} className="bg-zinc-900">
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="c-message" className="mb-2 block text-sm text-zinc-300">
                Your project <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="c-message"
                name="message"
                rows={4}
                required
                onBlur={onBlur}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "c-message-err" : undefined}
                placeholder="What are you building, and what should it achieve?"
                className={`${inputCls} resize-none`}
              />
              {errors.message && <FieldError id="c-message-err" msg={errors.message} />}
            </div>

            <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <MagneticButton>Send message ↗</MagneticButton>
              <p className="text-[13px] text-zinc-500">
                {sent
                  ? "Your email app just opened — hit send and we're on it."
                  : "Opens your email app — no forms lost in the void."}
              </p>
            </div>
          </form>
        </TiltCard>
      </div>
    </section>
  );
}
