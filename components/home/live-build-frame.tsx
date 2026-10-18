import Image from "next/image";
import type { CSSProperties } from "react";

/** Phase values (0 → 1) that drive the frame through CSS custom properties. */
export type Phases = { s: number; d: number; b: number; g: number };

type Box = { id: string; tag: string; x: number; y: number; w: number; h: number; o: number };

/* Wireframe blocks laid over the real Atlantis homepage layout (percent of the viewport). */
const BLOCKS: Box[] = [
  { id: "logo", tag: "Logo", x: 4, y: 3, w: 15, h: 5.6, o: 0 },
  { id: "nav", tag: "Nav", x: 40, y: 4.4, w: 20, h: 2.4, o: 0.04 },
  { id: "cta", tag: "CTA", x: 81.5, y: 3.3, w: 14.6, h: 4.8, o: 0.08 },
  { id: "eyebrow", tag: "Label", x: 5.5, y: 24.2, w: 19, h: 1.6, o: 0.1 },
  { id: "h1a", tag: "H1", x: 5.5, y: 29.5, w: 34, h: 8, o: 0.14 },
  { id: "h1b", tag: "", x: 5.5, y: 39.5, w: 40, h: 8, o: 0.18 },
  { id: "h1c", tag: "", x: 5.5, y: 49.5, w: 42, h: 8, o: 0.22 },
  { id: "para", tag: "Body", x: 5.5, y: 60.5, w: 36, h: 5.6, o: 0.26 },
  { id: "btn1", tag: "Book", x: 5.5, y: 70.5, w: 16, h: 6, o: 0.3 },
  { id: "btn2", tag: "", x: 22.3, y: 70.5, w: 13.4, h: 6, o: 0.33 },
  { id: "img", tag: "Hero media", x: 47, y: 21, w: 53, h: 79, o: 0.12 },
];

/* Sitemap drawn during Strategy, in a 1440 × 900 viewBox. */
const NODES = [
  { label: "Home", x: 600, y: 120, w: 240, h: 72, o: 0 },
  { label: "Services", x: 220, y: 330, w: 240, h: 72, o: 0.16 },
  { label: "About", x: 600, y: 330, w: 240, h: 72, o: 0.2 },
  { label: "Book a visit", x: 980, y: 330, w: 240, h: 72, o: 0.24, goal: true },
  { label: "Psychiatry", x: 150, y: 520, w: 190, h: 60, o: 0.34 },
  { label: "Integrative", x: 360, y: 520, w: 200, h: 60, o: 0.38 },
  { label: "Locations", x: 1010, y: 520, w: 180, h: 60, o: 0.42 },
];
const LINKS = [
  { d: "M720 192V260", o: 0.08 },
  { d: "M340 260H1100", o: 0.1 },
  { d: "M340 260V322M332 312l8 10 8-10", o: 0.14 },
  { d: "M720 260V322M712 312l8 10 8-10", o: 0.16 },
  { d: "M1100 260V322M1092 312l8 10 8-10", o: 0.18 },
  { d: "M340 402V470H245V514M237 504l8 10 8-10", o: 0.3 },
  { d: "M340 470H460V514M452 504l8 10 8-10", o: 0.32 },
  { d: "M1100 402V514M1092 504l8 10 8-10", o: 0.36 },
];

const CODE = [
  "export default function Home()",
  "<Hero headline={copy.h1} />",
  '<BookingCTA href="/book" />',
  "const services = await getServices()",
  'aria-label="Book an appointment"',
  "✓ Compiled successfully",
];

const varsOf = (p: Phases) => ({ "--s": p.s, "--d": p.d, "--b": p.b, "--g": p.g }) as CSSProperties;
const offset = (o: number) => ({ "--o": o }) as CSSProperties;

/**
 * A browser window whose page is built in four phases. Everything is decorative
 * (the step copy lives in the ordered list), so the whole frame is aria-hidden.
 * Without `phases`, it inherits the live values from the section root.
 */
export default function BuildFrame({ phases, withShot = true, live = false }: { phases?: Phases; withShot?: boolean; live?: boolean }) {
  return (
    <div className="lb-frame" style={phases ? varsOf(phases) : undefined} aria-hidden="true">
      <div className="lb-chrome">
        <span className="lb-dots"><i /><i /><i /></span>
        <span className="lb-url">
          <span className="lb-url-draft">nexlytic.dev/preview</span>
          <span className="lb-url-live"><b /> atlantiswellnesscenters.com</span>
        </span>
        <span className="lb-live-badge"><i /> Live</span>
      </div>

      <div className="lb-viewport">
        <div className="lb-cream" />
        <div className="lb-grid" />

        <svg className="lb-blueprint" viewBox="0 0 1440 900" fill="none">
          <text x="60" y="76" className="lb-bp-meta lb-draw-fade" style={offset(0)}>SITEMAP · V1</text>
          {LINKS.map((l) => (
            <path key={l.d} d={l.d} pathLength={1} className="lb-draw" style={offset(l.o)} />
          ))}
          {NODES.map((n) => (
            <g key={n.label} className={n.goal ? "lb-goal" : undefined}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="10" pathLength={1} className="lb-draw" style={offset(n.o)} />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 10} textAnchor="middle" className="lb-bp-label lb-draw-fade" style={offset(n.o + 0.12)}>
                {n.label}
              </text>
            </g>
          ))}
          {/* annotations */}
          <path d="M1190 330C1220 270 1250 240 1300 222" pathLength={1} className="lb-draw lb-note" style={offset(0.5)} />
          <text x="1380" y="208" textAnchor="end" className="lb-bp-note lb-draw-fade" style={offset(0.56)}>Goal: bookings</text>
          <path d="M150 600V690H190" pathLength={1} className="lb-draw lb-note" style={offset(0.56)} />
          <text x="204" y="700" className="lb-bp-note lb-draw-fade" style={offset(0.62)}>Audience: adults seeking whole-person care</text>
          <path d="M600 780H1360" pathLength={1} className="lb-draw lb-note" style={offset(0.64)} />
          <text x="600" y="830" className="lb-bp-meta lb-draw-fade" style={offset(0.7)}>KPI · BOOKED APPOINTMENTS / WEEK</text>
        </svg>

        <div className="lb-blocks">
          {BLOCKS.map((b) => (
            <div
              key={b.id}
              className={`lb-block lb-block-${b.id}`}
              style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%`, ...offset(b.o) }}
            >
              <span className="lb-fill" />
              <span className="lb-wire">{b.tag && <em>{b.tag}</em>}</span>
            </div>
          ))}
          <div className="lb-specimen" style={offset(0.2)}>
            <span className="lb-specimen-aa">Aa</span>
            <span className="lb-specimen-meta">Display · 450<br />Body · 400</span>
          </div>
          <div className="lb-swatches">
            {["#163a5c", "#2e9a6e", "#f2f0ea", "#9cc9e2"].map((c, i) => (
              <span key={c} style={{ background: c, ...offset(0.22 + i * 0.04) }} />
            ))}
          </div>
        </div>

        {withShot && (
          <div className="lb-shot">
            <div className="lb-shot-inner">
              <Image
                src="/case-studies/atlantis-home.png"
                alt=""
                fill
                sizes={live ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 45vw, 100vw"}
                loading="lazy"
              />
            </div>
          </div>
        )}
        <div className="lb-scan"><i /></div>

        <div className="lb-stats">
          <div className="lb-stats-head">
            <span className="lb-pulse"><i /> Live</span>
            <span>Illustrative</span>
          </div>
          <p className="lb-stats-title">Bookings trend</p>
          <svg viewBox="0 0 300 110" className="lb-chart" fill="none">
            <path d="M0 100H300M0 66H300M0 32H300" className="lb-chart-grid" />
            <path d="M0 96C40 94 60 88 90 84S140 70 170 60 230 34 300 12V110H0Z" className="lb-chart-area" />
            <path d="M0 96C40 94 60 88 90 84S140 70 170 60 230 34 300 12" pathLength={1} className="lb-chart-line" />
            <circle cx="300" cy="12" r="5" className="lb-chart-dot" />
          </svg>
          <p className="lb-stats-foot"><span>Launch</span><span>Week 12</span></p>
        </div>
      </div>

      {live && (
        <ul className="lb-code">
          {CODE.map((c, i) => (
            <li key={c} style={offset(i * 0.12)}><code>{c}</code></li>
          ))}
        </ul>
      )}
    </div>
  );
}
