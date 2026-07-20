/* One small living graphic per process step — monochrome, looping,
   matching the site's black/white palette. Pure SVG/CSS, no JS needed:
   the loop runs entirely on keyframes already defined in globals.css
   (proc-, svc- and viz- prefixed), so these stay cheap even with several
   on screen at once. */

/* Step 01 — Analysis: a magnifier sweeps across a row of data bars,
   each one breathing like it's being read. */
export function AnalysisViz() {
  const bars = [0.42, 0.68, 0.5, 0.8, 0.58, 0.86];
  return (
    <div className="relative flex h-full w-full items-end justify-center gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-black/30 px-5 pb-5 pt-8">
      {bars.map((h, i) => (
        <span
          key={i}
          className="svc-eq w-full max-w-[22px] rounded-t-[3px] bg-white/25"
          style={{ height: `${h * 100}%`, ["--eq-min" as string]: 0.62, animationDelay: `${i * 0.22}s` }}
        />
      ))}
      <span
        className="proc-scan absolute bottom-6 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-sm"
        aria-hidden="true"
      >
        <span className="absolute -bottom-2.5 -right-2.5 h-4 w-[3px] rotate-45 rounded-full bg-white/70" />
      </span>
    </div>
  );
}

/* Step 02 — Strategy: a roadmap of four waypoints, connected by a
   redrawing path, with a token traveling the route on loop. */
export function StrategyViz() {
  const points = [
    { x: 6, y: 82 },
    { x: 34, y: 30 },
    { x: 64, y: 68 },
    { x: 92, y: 12 },
  ];
  const d = `M ${points.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        <path d={d} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="svc-draw" vectorEffect="non-scaling-stroke" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="#ffffff" opacity={0.85} />
        ))}
      </svg>
      <span
        className="proc-token absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.85)]"
        aria-hidden="true"
      />
    </div>
  );
}

/* Step 03 — Implementation: a code window typing itself out line by
   line, a build progress bar filling underneath. */
export function ImplementationViz() {
  const lines = [88, 60, 74, 42, 66];
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/30">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 px-4">
        {lines.map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="proc-code-line h-2.5 rounded-full bg-white/30"
              style={{ ["--w" as string]: `${w}%`, animationDelay: `${i * 0.42}s` }}
            />
            {i === lines.length - 1 && <span className="svc-caret h-3 w-[3px] bg-white/70" />}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-3.5">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="proc-build-fill h-full rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

/* Step 04 — Growth: a rising line chart drawing itself, with a pulsing
   marker and a popping "+24%" badge at the peak. */
export function GrowthViz() {
  const pts = [
    { x: 4, y: 86 },
    { x: 22, y: 68 },
    { x: 42, y: 76 },
    { x: 62, y: 46 },
    { x: 80, y: 54 },
    { x: 96, y: 20 },
  ];
  const line = `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  const area = `${line} L 96 100 L 4 100 Z`;
  const last = pts[pts.length - 1];
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black/30 p-4">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
        {[30, 55, 80].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        ))}
        <path d={area} fill="rgba(255,255,255,0.08)" />
        <path d={line} fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="svc-draw" vectorEffect="non-scaling-stroke" />
        <circle cx={last.x} cy={last.y} r="2.8" fill="#ffffff" className="viz-pulse" />
      </svg>
      <span className="svc-pop absolute right-4 top-4 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-black">
        +24%
      </span>
    </div>
  );
}
