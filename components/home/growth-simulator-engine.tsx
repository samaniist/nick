"use client";

import { useEffect, useRef, useState } from "react";
import { CURVE_POINTS, SERVICES, curveFor, type EngineNode, type Input, type Plan } from "./growth-simulator-data";

/* The live visual: a node graph ("growth engine") whose nodes light up for
   the recommended services, plus an illustrative growth curve that morphs
   between shapes. One rAF loop drives idle float, link pulses and the
   curve morph by writing SVG attributes directly (no React re-render per
   frame). Reduced motion: no loop, states snap. Static SSR markup shows
   the default plan when JS is off. Purely decorative → aria-hidden. */

const W = 440;
const H = 300;
const HUB: [number, number] = [220, 142];
const NODES: { id: EngineNode; name: string; idle: string; at: [number, number] }[] = [
  { id: "brand", name: "Brand", idle: "Identity", at: [92, 58] },
  { id: "web", name: "Web", idle: "Site & store", at: [348, 58] },
  { id: "perf", name: "Performance", idle: "SEO & ads", at: [348, 218] },
  { id: "auto", name: "Automation", idle: "Workflows", at: [92, 218] },
];
type End = EngineNode | "hub";
const LINKS: [End, End][] = [
  ["hub", "brand"], ["hub", "web"], ["hub", "perf"], ["hub", "auto"],
  ["brand", "web"], ["web", "perf"], ["perf", "auto"], ["auto", "brand"],
];
const PHASE: Record<End, number> = { hub: 0, brand: 0.7, web: 2.1, perf: 3.6, auto: 5 };

/* Curve canvas */
const CW = 480;
const CH = 250;
const cx = (i: number) => 12 + (i / (CURVE_POINTS - 1)) * (CW - 24);
const cy = (v: number) => CH - 20 - v * (CH - 44);

function smooth(vals: number[]) {
  const p = vals.map((v, i) => [cx(i), cy(v)] as const);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
const area = (line: string) => `${line} L${cx(CURVE_POINTS - 1)} ${CH - 20} L${cx(0)} ${CH - 20} Z`;

export default function GrowthEngine({ input, plan }: { input: Input; plan: Plan }) {
  const root = useRef<HTMLDivElement>(null);
  const target = useRef(curveFor(input));
  const cur = useRef<{ plan: number[]; base: number[] } | null>(null);
  const kick = useRef<() => void>(() => {});

  /* First-render geometry (also the no-JS picture). */
  const [init] = useState(() => {
    const c = curveFor(input);
    return { line: smooth(c.plan), base: smooth(c.base), end: [cx(CURVE_POINTS - 1), cy(c.plan[CURVE_POINTS - 1])] as const };
  });

  useEffect(() => {
    target.current = curveFor(input);
    kick.current();
  }, [input]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));
    const nodeEls = q<SVGGElement>("[data-node]");
    const linkEls = q<SVGGElement>("[data-link]");
    const line = el.querySelector<SVGPathElement>("[data-curve=line]")!;
    const glow = el.querySelector<SVGPathElement>("[data-curve=glow]")!;
    const fill = el.querySelector<SVGPathElement>("[data-curve=area]")!;
    const base = el.querySelector<SVGPathElement>("[data-curve=base]")!;
    const end = q<SVGCircleElement>("[data-curve=end]");
    const spark = el.querySelector<SVGCircleElement>("[data-curve=spark]")!;
    const labels = q<HTMLElement>("[data-label]");

    const graph = el.querySelector<HTMLElement>(".gs-graph")!;
    let scale = graph.clientWidth / W;
    const ro = new ResizeObserver(() => { scale = graph.clientWidth / W; });
    ro.observe(graph);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const drawCurve = (c: { plan: number[]; base: number[] }) => {
      const d = smooth(c.plan);
      line.setAttribute("d", d);
      glow.setAttribute("d", d);
      fill.setAttribute("d", area(d));
      base.setAttribute("d", smooth(c.base));
      const ex = cx(CURVE_POINTS - 1);
      const ey = cy(c.plan[CURVE_POINTS - 1]);
      end.forEach((e) => { e.setAttribute("cx", String(ex)); e.setAttribute("cy", ey.toFixed(1)); });
    };

    const pos = (id: End, t: number): [number, number] => {
      const [x, y] = id === "hub" ? HUB : NODES.find((n) => n.id === id)!.at;
      if (!t) return [x, y];
      const ph = PHASE[id];
      const amp = id === "hub" ? 1.5 : 3.4;
      return [x + Math.sin(t * 0.00055 + ph) * amp, y + Math.cos(t * 0.00047 + ph * 1.3) * amp];
    };

    const drawGraph = (t: number) => {
      const P: Partial<Record<End, [number, number]>> = {};
      (["hub", "brand", "web", "perf", "auto"] as End[]).forEach((id) => (P[id] = pos(id, t)));
      nodeEls.forEach((g) => {
        const id = g.dataset.node as End;
        const [x, y] = P[id]!;
        g.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      });
      labels.forEach((l) => {
        const id = l.dataset.label as End;
        const [x, y] = P[id]!;
        const [bx, by] = id === "hub" ? HUB : NODES.find((n) => n.id === id)!.at;
        l.style.transform = `translate(${((x - bx) * scale).toFixed(2)}px, ${((y - by) * scale).toFixed(2)}px)`;
      });
      linkEls.forEach((g, i) => {
        const [a, b] = LINKS[i];
        const [x1, y1] = P[a]!;
        const [x2, y2] = P[b]!;
        g.querySelectorAll("line").forEach((ln) => {
          ln.setAttribute("x1", x1.toFixed(2)); ln.setAttribute("y1", y1.toFixed(2));
          ln.setAttribute("x2", x2.toFixed(2)); ln.setAttribute("y2", y2.toFixed(2));
        });
        g.querySelectorAll("circle").forEach((c, k) => {
          const p = t ? ((t / 1900 + i * 0.23 + k * 0.5) % 1) : 0.5;
          c.setAttribute("cx", (x1 + (x2 - x1) * p).toFixed(2));
          c.setAttribute("cy", (y1 + (y2 - y1) * p).toFixed(2));
          c.setAttribute("opacity", t ? Math.sin(p * Math.PI).toFixed(3) : "0");
        });
      });
    };

    const frame = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      const k = 1 - Math.exp(-dt / 150);
      const c = cur.current!;
      const tg = target.current;
      let moving = false;
      for (let i = 0; i < CURVE_POINTS; i++) {
        const dp = tg.plan[i] - c.plan[i];
        const db = tg.base[i] - c.base[i];
        if (Math.abs(dp) > 1e-4 || Math.abs(db) > 1e-4) moving = true;
        c.plan[i] += dp * k;
        c.base[i] += db * k;
      }
      if (moving) drawCurve(c);
      drawGraph(now);
      /* Spark travelling along the plan curve. */
      const len = line.getTotalLength();
      const sp = (now / 3200) % 1;
      const pt = line.getPointAtLength(len * sp);
      spark.setAttribute("cx", pt.x.toFixed(1));
      spark.setAttribute("cy", pt.y.toFixed(1));
      spark.setAttribute("opacity", Math.min(1, Math.sin(sp * Math.PI) * 1.6).toFixed(2));
      raf = requestAnimationFrame(frame);
    };

    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const start = () => {
      if (raf || mq.matches || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const snap = () => {
      cur.current = { plan: [...target.current.plan], base: [...target.current.base] };
      drawCurve(cur.current);
      drawGraph(0);
      spark.setAttribute("opacity", "0");
    };

    cur.current = { plan: [...target.current.plan], base: [...target.current.base] };
    kick.current = () => { if (mq.matches || !raf) snap(); };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }, { rootMargin: "120px" });
    io.observe(el);
    const onVis = () => (document.hidden ? stop() : start());
    const onMq = () => { if (mq.matches) { stop(); snap(); } else start(); };
    document.addEventListener("visibilitychange", onVis);
    mq.addEventListener("change", onMq);
    return () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); mq.removeEventListener("change", onMq); };
  }, []);

  const on = new Set(plan.nodes);
  const lead = SERVICES[plan.services[0]].node;
  const rankOf = (id: EngineNode) => plan.services.findIndex((s) => SERVICES[s].node === id);
  const linkOn = ([a, b]: [End, End]) => (a === "hub" || on.has(a as EngineNode)) && on.has(b as EngineNode);

  return (
    <div ref={root} className="gs-engine" aria-hidden="true">
      <div className="gs-graph">
        <svg viewBox={`0 0 ${W} ${H}`} className="gs-graph-svg" focusable="false">
          <defs>
            <radialGradient id="gs-core" cx="38%" cy="32%" r="75%">
              <stop offset="0" stopColor="#e9fbff" />
              <stop offset=".45" stopColor="#9fdcea" />
              <stop offset="1" stopColor="#2d6576" />
            </radialGradient>
            <radialGradient id="gs-hub" cx="40%" cy="35%" r="70%">
              <stop offset="0" stopColor="#1b3440" />
              <stop offset="1" stopColor="#060d12" />
            </radialGradient>
            <radialGradient id="gs-halo">
              <stop offset="0" stopColor="#a8eaf4" stopOpacity=".38" />
              <stop offset="1" stopColor="#a8eaf4" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g>
            {LINKS.map((l, i) => {
              const [a, b] = l;
              const [x1, y1] = a === "hub" ? HUB : NODES.find((n) => n.id === a)!.at;
              const [x2, y2] = NODES.find((n) => n.id === b)!.at;
              return (
                <g key={i} data-link className={`gs-link${linkOn(l) ? " is-on" : ""}${i > 3 ? " is-ring" : ""}`}>
                  <line className="gs-link-base" x1={x1} y1={y1} x2={x2} y2={y2} />
                  <line className="gs-link-line" x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} />
                  <circle className="gs-pulse" r="2.6" cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} opacity="0" />
                  <circle className="gs-pulse" r="1.8" cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} opacity="0" />
                </g>
              );
            })}
          </g>
          <g data-node="hub" className="gs-hubnode" transform={`translate(${HUB[0]} ${HUB[1]})`}>
            <circle r="66" fill="url(#gs-halo)" className="gs-hub-halo" />
            <circle r="44" className="gs-hub-orbit" />
            <circle r="33" fill="url(#gs-hub)" className="gs-hub-core" />
            <circle key={plan.key} r="33" className="gs-hub-ripple" />
          </g>
          {NODES.map((n) => {
            const active = on.has(n.id);
            return (
              <g
                key={n.id}
                data-node={n.id}
                className={`gs-node${active ? " is-on" : ""}${lead === n.id ? " is-lead" : ""}`}
                transform={`translate(${n.at[0]} ${n.at[1]})`}
              >
                <circle r="46" fill="url(#gs-halo)" className="gs-node-halo" />
                <circle r="29" className="gs-node-ring" />
                <circle r="20" className="gs-node-shell" />
                <circle r="20" fill="url(#gs-core)" className="gs-node-core" />
                <circle r="3.2" className="gs-node-dot" />
              </g>
            );
          })}
        </svg>
        <span data-label="hub" className="gs-hub-label" style={{ left: `${(HUB[0] / W) * 100}%`, top: `${(HUB[1] / H) * 100}%` }}>
          {plan.hub}
        </span>
        {NODES.map((n) => {
          const r = rankOf(n.id);
          const subs = plan.services.filter((s) => SERVICES[s].node === n.id).map((s) => SERVICES[s].short);
          return (
            <span
              key={n.id}
              data-label={n.id}
              className={`gs-node-label${r >= 0 ? " is-on" : ""}`}
              style={{ left: `${(n.at[0] / W) * 100}%`, top: `${((n.at[1] + 36) / H) * 100}%` }}
            >
              <b>{r >= 0 ? <em>{String(r + 1).padStart(2, "0")}</em> : null}{n.name}</b>
              <small>{subs.length ? subs.join(" · ") : n.idle}</small>
            </span>
          );
        })}
      </div>

      <div className="gs-trajectory">
        <div className="gs-traj-head">
          <span>Growth trajectory</span>
          <span className="gs-tag">Illustrative</span>
        </div>
        <div className="gs-traj-plot">
          <svg viewBox={`0 0 ${CW} ${CH}`} className="gs-traj-svg" focusable="false">
            <defs>
              <linearGradient id="gs-line" x1="0" x2="1">
                <stop offset="0" stopColor="#4f97ab" />
                <stop offset=".6" stopColor="#a8eaf4" />
                <stop offset="1" stopColor="#f0fdff" />
              </linearGradient>
              <linearGradient id="gs-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#8bcbdc" stopOpacity=".28" />
                <stop offset="1" stopColor="#8bcbdc" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((v) => (
              <line key={v} className="gs-grid" x1={cx(0)} x2={cx(CURVE_POINTS - 1)} y1={cy(v)} y2={cy(v)} />
            ))}
            {[0, 1 / 4, 1 / 2, 1].map((t) => (
              <line key={t} className="gs-grid gs-grid-v" x1={cx(t * (CURVE_POINTS - 1))} x2={cx(t * (CURVE_POINTS - 1))} y1={cy(1)} y2={CH - 20} />
            ))}
            <path data-curve="area" d={area(init.line)} fill="url(#gs-area)" />
            <path data-curve="base" d={init.base} className="gs-curve-base" />
            <path data-curve="glow" d={init.line} className="gs-curve-glow" />
            <path data-curve="line" d={init.line} className="gs-curve-line" stroke="url(#gs-line)" />
            <circle data-curve="spark" r="3" className="gs-spark" cx={init.end[0]} cy={init.end[1]} opacity="0" />
            <circle data-curve="end" r="11" className="gs-end-halo" cx={init.end[0]} cy={init.end[1]} />
            <circle data-curve="end" r="4.5" className="gs-end-dot" cx={init.end[0]} cy={init.end[1]} />
          </svg>
        </div>
        <div className="gs-traj-axis">
          {(["Today", "Month 3", "Month 6", "Month 12"] as const).map((m, i) => (
            <span key={m} style={{ left: `${(cx([0, 1 / 4, 1 / 2, 1][i] * (CURVE_POINTS - 1)) / CW) * 100}%` }}>{m}</span>
          ))}
        </div>
        <div className="gs-traj-legend">
          <span><i className="gs-key-plan" />With this plan</span>
          <span><i className="gs-key-base" />Current path</span>
        </div>
      </div>
    </div>
  );
}
