"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import GrowthEngine from "./growth-simulator-engine";
import { ChoiceIcon } from "./growth-simulator-icons";
import {
  BUSINESSES,
  DEFAULT_INPUT,
  GOALS,
  SERVICES,
  STAGES,
  buildPlan,
  type Choice,
  type Input,
} from "./growth-simulator-data";
import "./growth-simulator.css";

/* Chapter 07 — growth simulator. The visitor describes their situation
   with three radio groups; the engine visual, curve and plan card update
   live. The CTA carries the plan into the footer contact form. */

function ChoiceGroup<T extends string>({
  n,
  legend,
  name,
  options,
  value,
  onChange,
  onPick,
  active,
  variant,
}: {
  n: string;
  legend: string;
  name: string;
  options: Choice<T>[];
  value: T;
  onChange: (v: T) => void;
  /** Pointer tap on any option, including the already-selected one (drives the mobile step flow). */
  onPick?: () => void;
  active?: boolean;
  variant?: "stage";
}) {
  return (
    <fieldset className={`gs-group${variant ? ` gs-group--${variant}` : ""}`} data-active={active || undefined} tabIndex={-1}>
      <legend>
        <span>{n}</span>
        {legend}
      </legend>
      <div className="gs-chips">
        {options.map((o) => (
          <label key={o.value} className="gs-chip">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              onClick={(e) => { if (e.detail > 0) onPick?.(); }}
              className="gs-radio"
            />
            <span className="gs-chip-box">
              <span className="gs-chip-icon"><ChoiceIcon value={o.value} /></span>
              <span className="gs-chip-check" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 12.5 4 4 8-9" /></svg>
              </span>
              <span className="gs-chip-text">
                {o.label}
                {o.hint ? <small>{o.hint}</small> : null}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function sendToContact(topic: string, summary: string) {
  const select = document.getElementById("home-topic") as HTMLSelectElement | null;
  if (select && Array.from(select.options).some((o) => o.value === topic)) {
    select.value = topic;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }
  const message = document.getElementById("home-message") as HTMLTextAreaElement | null;
  if (message && !message.value.trim()) {
    message.value = summary;
    message.dispatchEvent(new Event("input", { bubbles: true }));
  }

  const name = document.getElementById("home-name") as HTMLInputElement | null;
  const target = (name?.closest(".footer-form") as HTMLElement | null) ?? document.getElementById("contact");
  if (!target) {
    window.location.hash = "contact";
    return;
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY - Math.min(96, window.innerHeight * 0.08);
  const focus = () => name?.focus({ preventScroll: true });
  if (reduced) {
    window.scrollTo({ top, behavior: "auto" });
    focus();
    return;
  }
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener("scrollend", finish);
    focus();
  };
  window.addEventListener("scrollend", finish, { once: true });
  window.setTimeout(finish, 1600);
  window.scrollTo({ top, behavior: "smooth" });
}

export default function GrowthSimulator() {
  const [input, setInput] = useState<Input>(DEFAULT_INPUT);
  const plan = useMemo(() => buildPlan(input), [input]);
  const set = <K extends keyof Input>(k: K) => (v: Input[K]) => setInput((p) => ({ ...p, [k]: v }));

  /* Phones get a step flow: one question per screen, then the plan. Desktop shows everything at once. */
  const [wizard, setWizard] = useState(false);
  // `user` marks steps the visitor took, so only those scroll and move focus.
  const [nav, setNav] = useState({ step: 0, user: false });
  const step = nav.step;
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)");
    const sync = () => setWizard(narrow.matches);
    sync();
    narrow.addEventListener("change", sync);
    return () => narrow.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!wizard || !nav.user) return;
    const root = section.current!;
    const target = root.querySelector<HTMLElement>(step === 3 ? ".gs-summary" : ".gs-wizard");
    if (!target) return;
    const top = target.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.5) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: window.scrollY + top - 24, behavior: reduced ? "auto" : "smooth" });
    }
    (step === 3 ? root.querySelector<HTMLElement>(".gs-summary") : root.querySelectorAll<HTMLElement>(".gs-group")[step])?.focus({ preventScroll: true });
  }, [nav, step, wizard]);
  const go = (next: number) => setNav({ step: next, user: true });
  const pick = (i: number) => () => { if (wizard) window.setTimeout(() => go(i + 1), 220); };
  const QUESTIONS = ["Business type", "Main goal", "Current state"];
  const answers = [
    BUSINESSES.find((c) => c.value === input.business)!.label,
    GOALS.find((c) => c.value === input.goal)!.label,
    STAGES.find((c) => c.value === input.stage)!.label,
  ];

  return (
    <section ref={section} id="plan" className="gs" aria-labelledby="gs-title" data-wizard={wizard || undefined} data-step={wizard ? step : undefined}>
      <div className="gs-bg" aria-hidden="true" />
      <div className="gs-inner">
        <div className="gs-left">
          <header className="gs-head">
            <p className="gs-eyebrow">
              <span>07</span> / YOUR GROWTH PLAN
            </p>
            <h2 id="gs-title">
              Plan your
              <br />
              <em>next move.</em>
            </h2>
            <p className="gs-intro">
              Tell us where you stand. The engine maps the services, sequence and outlook we would start with — live, in
              seconds, no email needed.
            </p>
          </header>

          <form className="gs-controls" onSubmit={(e) => e.preventDefault()} aria-label="Your situation">
            {wizard && step < 3 && (
              <div className="gs-wizard">
                <span className="gs-wizard-count">Step {step + 1} of 3 · {QUESTIONS[step]}</span>
                <span className="gs-wizard-bar" aria-hidden="true">{[0, 1, 2].map((i) => <i key={i} data-done={i <= step || undefined} />)}</span>
              </div>
            )}
            <ChoiceGroup n="01" legend="Business type" name="gs-business" options={BUSINESSES} value={input.business} onChange={set("business")} onPick={pick(0)} active={step === 0} />
            <ChoiceGroup n="02" legend="Main goal" name="gs-goal" options={GOALS} value={input.goal} onChange={set("goal")} onPick={pick(1)} active={step === 1} />
            <ChoiceGroup n="03" legend="Current state" name="gs-stage" options={STAGES} value={input.stage} onChange={set("stage")} onPick={pick(2)} active={step === 2} variant="stage" />
            {wizard && step < 3 && (
              <div className="gs-wizard-nav">
                {step > 0 ? <button type="button" className="gs-wizard-back" onClick={() => go(step - 1)}>Back</button> : <span />}
                <button type="button" className="gs-wizard-next" onClick={() => go(step + 1)}>{step === 2 ? "See my plan" : "Next"} <ArrowUpRight /></button>
              </div>
            )}
            {wizard && step === 3 && (
              <div className="gs-summary" tabIndex={-1}>
                <span className="gs-label">Your answers</span>
                <p>{answers.join(" · ")}</p>
                <button type="button" onClick={() => go(0)}>Edit answers</button>
              </div>
            )}
          </form>
        </div>

        <div className="gs-console">
          <div className="gs-console-bar" aria-hidden="true">
            <span>
              <i /> GROWTH ENGINE
            </span>
            <span>LIVE PREVIEW</span>
          </div>

          <GrowthEngine input={input} plan={plan} />

          <section className="gs-plan" aria-labelledby="gs-plan-title">
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {plan.announce}
            </p>
            <div key={plan.key} className="gs-plan-body">
              <div className="gs-plan-top">
                <h3 id="gs-plan-title" className="gs-label">
                  Recommended focus
                </h3>
                <ol className="gs-focus">
                  {plan.services.map((s, i) => (
                    <li key={s} className={i === 0 ? "is-lead" : undefined} style={{ ["--i" as string]: i }}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {SERVICES[s].name}
                    </li>
                  ))}
                </ol>
                <p className="gs-why">{plan.why}</p>
              </div>

              <ol className="gs-phases" aria-label="Phases">
                {plan.phases.map((p, i) => (
                  <li key={p.when} style={{ ["--i" as string]: i }}>
                    <span className="gs-label">{p.when}</span>
                    <strong>{p.title}</strong>
                    <p>{p.text}</p>
                  </li>
                ))}
              </ol>

              <div className="gs-outlook">
                <div className="gs-outlook-main">
                  <span className="gs-tag">Illustrative outlook</span>
                  <p>{plan.outlook}</p>
                </div>
                <dl>
                  <div>
                    <dt>First signals</dt>
                    <dd>
                      {plan.signals}
                      <small> illustrative range</small>
                    </dd>
                  </div>
                  <div>
                    <dt>We would track</dt>
                    <dd>{plan.metric}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="gs-cta-row">
              <a
                href="#contact"
                className="gs-cta"
                onClick={(e) => {
                  e.preventDefault();
                  sendToContact(plan.topic, plan.summary);
                }}
              >
                <span className="gs-cta-label">Build this plan with us</span>
                <span className="gs-cta-arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
              <p className="gs-disclaimer">
                Directional only, based on typical projects — not a forecast or guarantee. We confirm your real plan in a
                free first conversation.
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
