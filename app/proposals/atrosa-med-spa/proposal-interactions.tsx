"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./proposal.module.css";

const findings = [
  {
    title: "The mobile experience loses the page",
    description:
      "On a 390px phone, the homepage still renders at approximately 980px wide. Navigation, branding and important content are clipped before a visitor reaches the booking decision.",
    evidence: "390px viewport · approximately 980px page width",
    signal: "Responsive foundation",
  },
  {
    title: "Clinical trust is not visible early enough",
    description:
      "The website says “Med Spa,” but the first screen does not establish who performs treatments, who provides medical oversight or why a first-time patient should feel safe booking.",
    evidence: "No named medical director or credentials on the homepage",
    signal: "Credibility architecture",
  },
  {
    title: "Service choices create friction",
    description:
      "Duplicate RF Microneedling listings appear at different prices, package names are inconsistent and two high-intent service links do not lead to a working booking destination.",
    evidence: "$799 · $950 · $2,550 · two service links resolve to #",
    signal: "Treatment hierarchy",
  },
  {
    title: "Local business signals disagree",
    description:
      "The Contact page and the site-wide footer publish different opening hours. Friday disappears from the footer, and broken placeholder content is visible above the schedule.",
    evidence: "Two sets of opening hours · missing Friday · stray “:00”",
    signal: "Local consistency",
  },
  {
    title: "Google receives only a partial business picture",
    description:
      "The website contains generic WebSite structured data, but no complete LocalBusiness or MedicalBusiness markup connecting the practice, address, opening hours and treatments.",
    evidence: "Generic WebSite schema only",
    signal: "Search clarity",
  },
  {
    title: "Paid traffic has no dedicated conversion system",
    description:
      "Without campaign-specific landing pages, precise call and form tracking and a clean mobile booking journey, Google Ads would pay to amplify the same friction already present on the website.",
    evidence: "No dedicated campaign funnel or verified conversion framework",
    signal: "Paid acquisition",
  },
];

const growthNodes = [
  ["Premium Website", "Trust and clarity turn attention into confident action."],
  ["Local Visibility", "Accurate signals help Atrosa appear for relevant nearby searches."],
  ["Qualified Traffic", "Organic and paid demand arrives with clear treatment intent."],
  ["More Bookings", "Focused journeys reduce friction between interest and appointment."],
  ["More Reviews", "A consistent patient experience creates new local proof."],
  ["Stronger Local Authority", "Reviews, relevance and consistency compound visibility."],
];

const metrics = [
  "Booked appointments",
  "Qualified phone calls",
  "Consultation and contact requests",
  "Website conversion rate",
  "Cost per qualified lead",
  "Cost per booked appointment where trackable",
  "Local search visibility",
  "Google Maps engagement",
  "Organic treatment-page traffic",
  "Performance by treatment category",
  "Review growth",
];

export function RevealDirector() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motion.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-visible", "true");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}

export function ProposalOrb() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const pointer = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.matches || reduced.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        scene.style.setProperty("--orb-x", `${x * 14}deg`);
        scene.style.setProperty("--orb-y", `${y * -12}deg`);
        scene.style.setProperty("--light-x", `${50 + x * 28}%`);
        scene.style.setProperty("--light-y", `${42 + y * 24}%`);
      });
    };

    const reset = () => {
      scene.style.setProperty("--orb-x", "0deg");
      scene.style.setProperty("--orb-y", "0deg");
      scene.style.setProperty("--light-x", "38%");
      scene.style.setProperty("--light-y", "34%");
    };

    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div
      className={styles.orbScene}
      ref={sceneRef}
      role="img"
      aria-label="A translucent layered biomaterial orb connecting website, local search and paid acquisition."
    >
      <div className={styles.orbHalo} />
      <div className={styles.orb}>
        <span className={styles.orbSkin} />
        <span className={styles.orbCore} />
        <span className={styles.orbLayerOne} />
        <span className={styles.orbLayerTwo} />
        <span className={styles.orbSpecular} />
      </div>
      <span className={`${styles.orbNode} ${styles.orbNodeOne}`}>Website</span>
      <span className={`${styles.orbNode} ${styles.orbNodeTwo}`}>Local search</span>
      <span className={`${styles.orbNode} ${styles.orbNodeThree}`}>Google Ads</span>
      <span className={styles.orbCaption}>One connected growth system</span>
    </div>
  );
}

export function Findings() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.findings}>
      {findings.map((finding, index) => (
        <article
          className={active === index ? styles.findingActive : ""}
          key={finding.title}
          data-reveal
        >
          <button
            type="button"
            aria-expanded={active === index}
            onClick={() => setActive(index)}
          >
            <span className={styles.findingIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.findingBody}>
              <span className={styles.findingSignal}>{finding.signal}</span>
              <span className={styles.findingTitle}>{finding.title}</span>
              <span className={styles.findingDescription}>{finding.description}</span>
              <span className={styles.findingEvidence}>
                <i aria-hidden="true" />
                Evidence · {finding.evidence}
              </span>
            </span>
            <span className={styles.findingToggle} aria-hidden="true">
              {active === index ? "−" : "+"}
            </span>
          </button>
        </article>
      ))}
    </div>
  );
}

export function GrowthSystem() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.growthSystem} data-reveal>
      <div className={styles.growthTrack}>
        {growthNodes.map(([label], index) => (
          <button
            type="button"
            key={label}
            className={active === index ? styles.growthNodeActive : ""}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </button>
        ))}
        <span className={styles.growthPulse} aria-hidden="true" />
      </div>
      <div className={styles.growthExplanation} aria-live="polite">
        <span>{growthNodes[active][0]}</span>
        <p>{growthNodes[active][1]}</p>
        <i>{String(active + 1).padStart(2, "0")} / 06</i>
      </div>
    </div>
  );
}

export function WebsiteConcept() {
  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className={styles.websiteDemo} data-reveal>
      <div className={styles.demoToolbar}>
        <span>Live concept · illustrative</span>
        <div role="group" aria-label="Preview size">
          <button
            type="button"
            aria-pressed={view === "desktop"}
            onClick={() => setView("desktop")}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={view === "mobile"}
            onClick={() => setView("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>
      <div className={`${styles.siteFrame} ${view === "mobile" ? styles.siteFrameMobile : ""}`}>
        <div className={styles.siteNav}>
          <span>ATROSA</span>
          <div>
            <span>Treatments</span>
            <span>Our practice</span>
            <strong>Book consultation</strong>
          </div>
        </div>
        <div className={styles.siteHero}>
          <div>
            <small>Clinical skincare · Vienna, Virginia</small>
            <h3>Care that begins with understanding your skin.</h3>
            <p>Advanced treatments, clear guidance and a considered path to visible change.</p>
            <span className={styles.siteCta}>Plan a consultation</span>
          </div>
          <div className={styles.sitePortrait} aria-hidden="true">
            <span />
          </div>
        </div>
        <div className={styles.siteTrust}>
          <span>Medical oversight</span>
          <span>Transparent treatment plans</span>
          <span>Patient-first care</span>
        </div>
      </div>
    </div>
  );
}

export function LocalSearch() {
  const queries = ["rf microneedling vienna va", "advanced facial near me", "med spa vienna va"];
  const [query, setQuery] = useState(0);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const timer = window.setInterval(() => {
      setQuery((current) => (current + 1) % queries.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [queries.length]);

  return (
    <div className={styles.searchDemo} data-reveal>
      <div className={styles.searchTop}>
        <span>Illustrative local-search concept</span>
        <i aria-hidden="true" />
      </div>
      <div className={styles.searchField} aria-live="polite">
        <span aria-hidden="true" />
        {queries[query]}
        <i aria-hidden="true" />
      </div>
      <div className={styles.searchLayout}>
        <div className={styles.localResult}>
          <span className={styles.sponsoredLabel}>Local result · example</span>
          <h3>Atrosa Med Spa</h3>
          <div className={styles.stars} aria-label="Illustrative review display">
            <span aria-hidden="true">★★★★★</span> Reviews
          </div>
          <p>Advanced skincare and aesthetic treatments in Vienna, Virginia.</p>
          <div className={styles.resultActions}>
            <span>Website</span>
            <span>Directions</span>
            <span>Call</span>
          </div>
          <div className={styles.schemaSignals}>
            <span>MedicalBusiness</span>
            <span>Service</span>
            <span>Hours</span>
          </div>
        </div>
        <div className={styles.map} aria-label="Illustrative map of local search coverage around Vienna">
          <span className={styles.mapRoadOne} />
          <span className={styles.mapRoadTwo} />
          <span className={styles.mapRoadThree} />
          <i className={styles.pinMain}>A</i>
          <i className={styles.pinTwo} />
          <i className={styles.pinThree} />
          <small>Vienna</small>
        </div>
      </div>
      <div className={styles.queryOptions} role="group" aria-label="Example search query">
        {queries.map((item, index) => (
          <button
            type="button"
            key={item}
            aria-pressed={query === index}
            onClick={() => setQuery(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
    </div>
  );
}

export function AdsJourney() {
  const stages = [
    ["Search Query", "RF microneedling near Vienna"],
    ["Google Ad", "Treatment-focused message"],
    ["Landing Page", "Trust, pricing and next step"],
    ["Call or Booking", "One clear action"],
    ["Measured Conversion", "Verified appointment signal"],
  ];

  return (
    <div className={styles.adsJourney} data-reveal>
      <p>Illustrative conversion journey</p>
      <ol>
        {stages.map(([title, detail], index) => (
          <li key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{detail}</p>
            {index < stages.length - 1 && <i aria-hidden="true" />}
          </li>
        ))}
      </ol>
      <span className={styles.adsSignal} aria-hidden="true" />
    </div>
  );
}

export function MeasurementVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${styles.measurement} ${visible ? styles.measurementVisible : ""}`}
      ref={rootRef}
      data-reveal
    >
      <div className={styles.measurementSignal}>
        <div className={styles.signalHeader}>
          <span>Measurement architecture</span>
          <i>Illustrative · no client results</i>
        </div>
        <div className={styles.signalChart} role="img" aria-label="Illustrative signal quality improving as tracking becomes connected.">
          {[36, 52, 44, 68, 61, 79, 88].map((height, index) => (
            <span
              key={index}
              style={
                {
                  "--bar": `${height}%`,
                  "--bar-delay": `${index * 70}ms`,
                } as React.CSSProperties
              }
            />
          ))}
          <i aria-hidden="true" />
        </div>
        <div className={styles.signalLegend}>
          <span>Baseline</span>
          <span>Connected measurement</span>
        </div>
      </div>
      <ul className={styles.metricList}>
        {metrics.map((metric, index) => (
          <li key={metric}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {metric}
          </li>
        ))}
      </ul>
    </div>
  );
}
