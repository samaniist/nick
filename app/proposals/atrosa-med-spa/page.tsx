import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import {
  AdsJourney,
  Findings,
  GrowthSystem,
  LocalSearch,
  MeasurementVisual,
  ProposalOrb,
  RevealDirector,
  WebsiteConcept,
} from "./proposal-interactions";
import styles from "./proposal.module.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--atrosa-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--atrosa-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Digital Growth Proposal for Atrosa Med Spa",
  description:
    "A connected website, local SEO and Google Ads strategy prepared for Atrosa Med Spa.",
  alternates: {
    canonical: "https://nexlytic.de/proposals/atrosa-med-spa",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const websiteDeliverables = [
  "Mobile-first website redesign and development",
  "Website structure and user journey planning",
  "Premium medical-spa visual direction",
  "Clear treatment architecture",
  "Conversion-focused homepage",
  "Dedicated treatment pages",
  "Medical director and team presentation",
  "Credentials and licensing information",
  "Transparent pricing and treatment duration",
  "Preparation and aftercare information",
  "Patient reviews and trust signals",
  "Before-and-after content where appropriate",
  "Fast booking journey",
  "Booking-system integration",
  "Seasonal offers that remain current",
  "GA4 and Google Tag Manager",
  "Form, call and booking-event tracking",
  "Performance and accessibility optimization",
];

const seoDeliverables = [
  "Technical SEO",
  "Crawl and indexation cleanup",
  "Local keyword research",
  "Competitor visibility analysis",
  "On-page SEO for core treatments",
  "Google Business Profile optimization",
  "Accurate business categories and services",
  "Consistent name, address, phone number and opening hours",
  "LocalBusiness or MedicalBusiness structured data",
  "Service structured data",
  "FAQ structured data where appropriate",
  "Treatment and location content",
  "Internal-linking strategy",
  "Image optimization and descriptive alternative text",
  "Review-generation framework",
  "Review-response guidelines",
  "Google Search Console",
  "Local visibility tracking",
  "Monthly SEO reporting",
];

const adsDeliverables = [
  "Google Ads account audit or clean campaign setup",
  "Campaign strategy by treatment intent",
  "Campaign grouping by treatment and value",
  "Vienna and Northern Virginia location targeting",
  "High-intent keyword strategy",
  "Negative-keyword strategy",
  "Branded search protection",
  "Dedicated campaign landing pages",
  "Call tracking",
  "Form tracking",
  "Booking conversion tracking",
  "Ad-copy testing",
  "Search-term optimization",
  "Device and location analysis",
  "Budget and bid optimization",
  "Remarketing where consent allows",
  "Monthly campaign reporting",
  "Scaling based on verified performance",
];

const campaignGroups = [
  "Advanced facials",
  "RF microneedling",
  "Chemical peels",
  "Head spa treatments",
  "Brow and lash services",
  "Waxing and threading",
  "Seasonal treatments",
  "Branded search",
];

const principles = [
  {
    title: "Stronger Patient Trust",
    copy: "Clinical credibility, transparent information and consistent branding reduce uncertainty before the first appointment.",
  },
  {
    title: "Multiple Acquisition Channels",
    copy: "Atrosa will not depend on a single source of traffic.",
  },
  {
    title: "Better Advertising Efficiency",
    copy: "Paid campaigns lead to pages specifically designed for the advertised treatment.",
  },
  {
    title: "Sustainable Visibility",
    copy: "SEO and local authority continue creating value beyond individual advertising campaigns.",
  },
  {
    title: "Clearer Measurement",
    copy: "Calls, forms and booking actions are tracked so decisions can be based on evidence.",
  },
  {
    title: "Scalable Growth",
    copy: "Successful treatments, landing pages and campaigns can be expanded based on demand and appointment capacity.",
  },
];

function SectionLabel({
  index,
  children,
  light = false,
}: {
  index: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className={`${styles.sectionLabel} ${light ? styles.sectionLabelLight : ""}`}>
      <span>{index}</span>
      <span>{children}</span>
    </div>
  );
}

function Deliverables({ items }: { items: string[] }) {
  return (
    <ul className={styles.deliverables}>
      {items.map((item, index) => (
        <li key={item} data-reveal style={{ "--delay": `${index * 24}ms` } as React.CSSProperties}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PhaseIntro({
  index,
  title,
  statement,
  objective,
}: {
  index: string;
  title: string;
  statement: string;
  objective: string;
}) {
  return (
    <header className={styles.phaseHeader}>
      <SectionLabel index={index}>Phase {index.slice(-2)}</SectionLabel>
      <div className={styles.phaseTitleRow} data-reveal>
        <h2>{title}</h2>
        <p className={styles.phaseStatement}>{statement}</p>
      </div>
      <div className={styles.objective} data-reveal>
        <span>Objective</span>
        <p>{objective}</p>
      </div>
    </header>
  );
}

export default function AtrosaProposalPage() {
  return (
    <div className={`${styles.proposal} ${serif.variable} ${sans.variable}`}>
      <RevealDirector />
      <a className={styles.skipLink} href="#proposal-main">
        Skip to proposal
      </a>

      <main id="proposal-main">
        <section className={styles.hero} aria-labelledby="proposal-title">
          <div className={styles.heroGrain} aria-hidden="true" />
          <div className={styles.heroTop}>
            <a className={styles.nexlyticMark} href="https://nexlytic.de" aria-label="Nexlytic home">
              N<span>∕</span>
            </a>
            <div className={styles.wordmark} aria-label="Atrosa Med Spa">
              ATROSA <span>MED SPA</span>
            </div>
            <span className={styles.proposalTag}>Private proposal · 2026</span>
          </div>

          <div className={styles.heroLayout}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Prepared for Atrosa Med Spa</p>
              <h1 id="proposal-title">
                A clearer path from local search to <em>booked care.</em>
              </h1>
              <p className={styles.heroSupport}>
                A connected website, local SEO and Google Ads strategy designed to turn
                more high-intent searches into appointments for Atrosa Med Spa.
              </p>
            </div>
            <ProposalOrb />
          </div>

          <dl className={styles.heroMeta}>
            <div>
              <dt>Practice</dt>
              <dd>Vienna, Virginia</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Website · SEO · Google Ads</dd>
            </div>
            <div>
              <dt>Prepared by</dt>
              <dd>Nexlytic, Munich</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>2026</dd>
            </div>
          </dl>

          <a className={styles.scrollCue} href="#opportunity">
            <span>Explore the proposal</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section className={styles.opportunity} id="opportunity">
          <div className={styles.content}>
            <SectionLabel index="02">The Opportunity</SectionLabel>
            <div className={styles.opportunityGrid}>
              <h2 data-reveal>
                The goal is not simply to replace a <em>Wix website.</em>
              </h2>
              <div className={styles.opportunityCopy} data-reveal>
                <p>
                  Atrosa already has real services, transparent pricing and a functioning
                  booking system. The opportunity is to turn those pieces into a digital
                  growth system that earns trust before the first appointment.
                </p>
                <p>
                  The proposed approach connects three jobs that are often treated
                  separately: build a site people trust, make it easy to find locally, and
                  use paid search to capture demand while organic visibility grows.
                </p>
              </div>
            </div>
            <div className={styles.connectionLine} aria-hidden="true" data-reveal>
              <span>Website</span>
              <i />
              <span>Local search</span>
              <i />
              <span>Paid demand</span>
              <i />
              <strong>Booked care</strong>
            </div>
          </div>
        </section>

        <section className={styles.findingsSection}>
          <div className={styles.content}>
            <SectionLabel index="03">Current Growth Opportunities</SectionLabel>
            <div className={styles.sectionIntro} data-reveal>
              <h2>What is limiting growth today</h2>
              <p>
                These observations are based on a walkthrough of the live Atrosa website
                on desktop and mobile.
              </p>
            </div>
            <Findings />
          </div>
        </section>

        <section className={styles.growthSection}>
          <div className={styles.content}>
            <SectionLabel index="04" light>
              The Growth System
            </SectionLabel>
            <div className={`${styles.sectionIntro} ${styles.sectionIntroLight}`} data-reveal>
              <h2>Every channel should make the next one stronger.</h2>
              <p>
                Paid search creates immediate demand. SEO compounds over time. A stronger
                website improves both. Better appointments create reviews, and reviews
                improve local visibility again.
              </p>
            </div>
            <GrowthSystem />
          </div>
        </section>

        <section className={styles.phase}>
          <div className={styles.content}>
            <PhaseIntro
              index="05"
              title="Website and Conversion Foundation"
              statement="Make the first visit feel credible, clear and easy to book."
              objective="Rebuild the digital experience around patient trust and appointment conversion—not around a generic spa template."
            />
            <div className={styles.phaseColumns}>
              <div>
                <p className={styles.listLabel}>Scope of work</p>
                <Deliverables items={websiteDeliverables} />
              </div>
              <div className={styles.phaseVisual}>
                <WebsiteConcept />
                <div className={styles.outcome} data-reveal>
                  <span>Expected outcome</span>
                  <p>
                    A premium, responsive website that answers important trust questions
                    quickly and gives every visitor one obvious next step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.phase} ${styles.phaseStone}`}>
          <div className={styles.content}>
            <PhaseIntro
              index="06"
              title="Local SEO and Google Presence"
              statement="Turn local searches into a dependable source of appointments."
              objective="Build a consistent local search foundation so Atrosa can compete for high-intent searches in Vienna and the surrounding Northern Virginia market."
            />
            <div className={`${styles.phaseColumns} ${styles.phaseColumnsReverse}`}>
              <div className={styles.phaseVisual}>
                <LocalSearch />
                <div className={styles.outcome} data-reveal>
                  <span>Expected outcome</span>
                  <p>
                    A stronger presence across Google organic results and local map
                    listings, supported by accurate business information and useful
                    treatment content.
                  </p>
                </div>
              </div>
              <div>
                <p className={styles.listLabel}>Scope of work</p>
                <Deliverables items={seoDeliverables} />
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.phase} ${styles.adsPhase}`}>
          <div className={styles.content}>
            <PhaseIntro
              index="07"
              title="Google Ads and Paid Acquisition"
              statement="Capture people already searching for the treatments Atrosa provides."
              objective="Launch a measurable paid-search system focused on qualified local demand—not broad traffic or vanity clicks."
            />
            <AdsJourney />
            <div className={styles.phaseColumns}>
              <div>
                <p className={styles.listLabel}>Scope of work</p>
                <Deliverables items={adsDeliverables} />
              </div>
              <div>
                <div className={styles.campaignPanel} data-reveal>
                  <span className={styles.listLabel}>Potential campaign groups</span>
                  <ul>
                    {campaignGroups.map((group) => (
                      <li key={group}>{group}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.outcome} data-reveal>
                  <span>Expected outcome</span>
                  <p>
                    A controlled acquisition channel where advertising spend can be
                    connected to calls, forms and bookings—and scaled only when the
                    numbers justify it.
                  </p>
                </div>
                <p className={styles.mediaNote} data-reveal>
                  Google Ads media spend is paid directly to Google and remains separate
                  from campaign-management fees.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.measurementSection}>
          <div className={styles.content}>
            <SectionLabel index="08" light>
              Measurement
            </SectionLabel>
            <div className={`${styles.sectionIntro} ${styles.sectionIntroLight}`} data-reveal>
              <h2>Success should be visible in the business, not only in a report.</h2>
              <p>
                Before campaigns launch, we establish a clean baseline and measurement
                plan. Reporting then focuses on the signals that lead to revenue.
              </p>
            </div>
            <MeasurementVisual />
            <p className={styles.disclaimer} data-reveal>
              Specific outcomes depend on advertising budget, appointment capacity,
              pricing, offer strength, market response and execution. The objective is to
              build a measurable system that can be improved and scaled.
            </p>
          </div>
        </section>

        <section className={styles.principlesSection}>
          <div className={styles.content}>
            <SectionLabel index="09">Why This Strategy Works</SectionLabel>
            <div className={styles.principlesHeading} data-reveal>
              <h2>
                One connected system—not three <em>disconnected services.</em>
              </h2>
              <div className={styles.mergeMark} aria-hidden="true">
                <span>W</span>
                <span>S</span>
                <span>A</span>
                <strong>01</strong>
              </div>
            </div>
            <div className={styles.principles}>
              {principles.map((principle, index) => (
                <article key={principle.title} data-reveal>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{principle.title}</h3>
                  <p>{principle.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.whySection}>
          <div className={styles.content}>
            <SectionLabel index="10">Why Nexlytic</SectionLabel>
            <div className={styles.whyLayout}>
              <h2 data-reveal>A growth partner, not three disconnected suppliers.</h2>
              <div className={styles.whyPoints}>
                <article data-reveal>
                  <span>01</span>
                  <div>
                    <h3>One Connected System</h3>
                    <p>
                      Website, SEO and Google Ads are planned together. We do not send
                      paid traffic to weak pages or publish SEO content that has no route
                      to booking.
                    </p>
                  </div>
                </article>
                <article data-reveal>
                  <span>02</span>
                  <div>
                    <h3>Evidence Before Execution</h3>
                    <p>
                      Every recommendation starts with something visible on the live
                      website: mobile overflow, conflicting hours, broken links, duplicate
                      pricing and missing local signals.
                    </p>
                  </div>
                </article>
                <article data-reveal>
                  <span>03</span>
                  <div>
                    <h3>Measured by Appointments</h3>
                    <p>
                      Traffic and rankings matter only when they lead to qualified calls,
                      forms and bookings. The measurement plan is built before campaigns
                      launch.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.finalSection}>
          <div className={styles.finalOrb} aria-hidden="true">
            <span />
            <i />
          </div>
          <div className={styles.content}>
            <SectionLabel index="11" light>
              Next Step
            </SectionLabel>
            <div className={styles.finalLayout}>
              <div>
                <h2 data-reveal>Build the foundation once. Grow from it every month.</h2>
                <p className={styles.finalCopy} data-reveal>
                  The next conversation is to confirm Atrosa’s priorities, treatment
                  margins, appointment capacity, technical access and advertising budget.
                  From there, this strategy can be converted into a final implementation
                  plan.
                </p>
              </div>
              <div className={styles.finalStatement} data-reveal>
                <p>The goal is not simply to attract more website visitors.</p>
                <p>
                  The goal is to turn local demand into <em>trust, appointments and
                  sustainable growth.</em>
                </p>
              </div>
            </div>

            <div className={styles.contactRow} data-reveal>
              <a href="mailto:hello@nexlytic.de">
                <span>Email</span>
                hello@nexlytic.de
              </a>
              <a href="https://wa.me/4917670767725">
                <span>WhatsApp</span>
                +49 176 70767725
              </a>
              <a href="https://nexlytic.de/contact">
                <span>Contact</span>
                Start the conversation <i aria-hidden="true">↗</i>
              </a>
            </div>

            <footer className={styles.proposalFooter}>
              <span>Nexlytic · Munich</span>
              <span>Prepared for Atrosa Med Spa · Vienna, Virginia</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
