"use client";

import { useState } from "react";

/* The contact form itself — shared between the /contact page (inside the
   3D tilt card) and the homepage contact section. Submits to
   /api/contact (IONOS SMTP → hello@nexlytic.de) and falls back to a
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

/* Submit button. Deliberately NO transform animations: inside the tilt
   card's preserve-3d context, a hover/press scale transition makes
   Chrome's hit-testing miss the button mid-animation and the click is
   lost. Feedback is color-only — this button must never miss a click. */
function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="min-h-[48px] w-full cursor-pointer rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-black transition-colors duration-200 hover:bg-zinc-300 active:bg-zinc-400 disabled:cursor-default disabled:opacity-50 sm:w-auto"
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
    if (name === "message" && value.trim() && value.trim().length < 10)
      return "Give us a sentence or two, or leave it blank.";
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
    const phone = String(fd.get("phone") ?? "");
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
        body: JSON.stringify({ name, email, topic, phone, message }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      /* delivery API unavailable — fall back to a prefilled mail draft so
         the lead is never lost */
      const subject = encodeURIComponent(`Project inquiry${topic ? ` — ${topic}` : ""} (${name})`);
      const body = encodeURIComponent(
        `${message}\n\n— ${name}\n${email}${phone ? `\n${phone}` : ""}`,
      );
      window.location.href = `mailto:hello@nexlytic.de?subject=${subject}&body=${body}`;
      setStatus("fallback");
    }
  };

  const p = idPrefix;

  /* Loud, unmissable confirmation: the form is replaced by a success panel. */
  if (status === "sent") {
    return (
      <div className="mt-7 flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="m5 13 4 4L19 7" />
          </svg>
        </span>
        <p className="mt-5 text-xl font-medium text-white sm:text-2xl" role="status">
          Message sent!
        </p>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-zinc-400">
          Thanks for reaching out — we&apos;ll reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 cursor-pointer text-sm text-zinc-500 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

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

      <div className="grid gap-5 sm:grid-cols-2">
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
          <label htmlFor={`${p}-phone`} className="mb-2 block text-sm text-zinc-300">
            Phone <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            id={`${p}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+49 176 70767725"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${p}-message`} className="mb-2 block text-sm text-zinc-300">
          Your project <span className="text-zinc-500">(optional)</span>
        </label>
        <textarea
          id={`${p}-message`}
          name="message"
          rows={4}
          onBlur={onBlur}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${p}-message-err` : undefined}
          placeholder="What are you building, and what should it achieve?"
          className={`${inputCls} resize-none`}
        />
        {errors.message && <FieldError id={`${p}-message-err`} msg={errors.message} />}
      </div>

      {status === "fallback" && (
        <div
          className="flex items-start gap-3 rounded-lg border border-white/20 bg-white/[0.07] px-4 py-3.5"
          role="status"
          aria-live="polite"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-5 w-5 shrink-0 text-white"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <p className="text-sm leading-relaxed text-zinc-300">
            We opened your email app with your message ready — just hit send
            there. Nothing opened? Email us directly at{" "}
            <a href="mailto:hello@nexlytic.de" className="font-medium text-white underline underline-offset-4">
              hello@nexlytic.de
            </a>
            .
          </p>
        </div>
      )}

      <div className="flex flex-col items-start gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message ↗"}
        </SubmitButton>
        <p className="text-[13px] text-zinc-500" role="status" aria-live="polite">
          {status === "sending"
            ? "Sending your message…"
            : "Goes straight to our inbox — we reply within one business day."}
        </p>
      </div>
    </form>
  );
}
