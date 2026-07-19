"use client";

import { useEffect, useRef, useState } from "react";

/* The contact form itself — shared between the /contact page (inside the
   3D tilt card) and the homepage contact section. Submits to
   /api/contact (Resend → hello@nexlytic.de) and falls back to a
   prefilled mailto: draft if the delivery API is unavailable. */

function FieldError({ id, msg }: { id: string; msg: string }) {
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] text-zinc-400">
      {msg}
    </p>
  );
}

const inputCls =
  "w-full min-h-[44px] rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-white/40 focus:bg-white/[0.07] focus:shadow-[0_0_24px_rgba(255,255,255,0.08)]";

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

type Errors = Partial<Record<"name" | "email" | "message", string>>;

type Status = "idle" | "sending" | "sent" | "fallback";

export default function ContactForm({ idPrefix = "c" }: { idPrefix?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
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

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      /* delivery API unavailable — fall back to a prefilled mail draft so
         the lead is never lost */
      const subject = encodeURIComponent(`Project inquiry${topic ? ` — ${topic}` : ""} (${name})`);
      const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
      window.location.href = `mailto:hello@nexlytic.de?subject=${subject}&body=${body}`;
      setStatus("fallback");
    }
  };

  const p = idPrefix;
  return (
    <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${p}-name`} className="mb-2 block text-sm text-zinc-300">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${p}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            onBlur={onBlur}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${p}-name-err` : undefined}
            placeholder="Jane Doe"
            className={inputCls}
          />
          {errors.name && <FieldError id={`${p}-name-err`} msg={errors.name} />}
        </div>
        <div>
          <label htmlFor={`${p}-email`} className="mb-2 block text-sm text-zinc-300">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            id={`${p}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            onBlur={onBlur}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${p}-email-err` : undefined}
            placeholder="jane@company.com"
            className={inputCls}
          />
          {errors.email && <FieldError id={`${p}-email-err`} msg={errors.email} />}
        </div>
      </div>

      <div>
        <label htmlFor={`${p}-topic`} className="mb-2 block text-sm text-zinc-300">
          What do you need?
        </label>
        <select id={`${p}-topic`} name="topic" defaultValue="" className={`${inputCls} appearance-none`}>
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
        <label htmlFor={`${p}-message`} className="mb-2 block text-sm text-zinc-300">
          Your project <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={`${p}-message`}
          name="message"
          rows={4}
          required
          onBlur={onBlur}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${p}-message-err` : undefined}
          placeholder="What are you building, and what should it achieve?"
          className={`${inputCls} resize-none`}
        />
        {errors.message && <FieldError id={`${p}-message-err`} msg={errors.message} />}
      </div>

      <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <MagneticButton disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message ↗"}
        </MagneticButton>
        <p className="text-[13px] text-zinc-500" role="status" aria-live="polite">
          {status === "sent"
            ? "Message sent — we'll reply within one business day."
            : status === "fallback"
              ? "Your email app just opened — hit send and we're on it."
              : status === "sending"
                ? "Sending your message…"
                : "Goes straight to our inbox — we reply within one business day."}
        </p>
      </div>
    </form>
  );
}
