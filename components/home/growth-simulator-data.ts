/* Growth simulator — pure plan logic. Given a visitor's situation it ranks
   services, writes the phased plan and shapes the illustrative growth
   curve. No React here so the same data renders on the server (no-JS
   default plan) and drives every live update on the client. */

export type Business = "clinic" | "shop" | "local" | "b2b";
export type Goal = "customers" | "sales" | "brand" | "automation";
export type Stage = "scratch" | "underperform" | "scale";
export type Service = "web" | "ecom" | "seo" | "ads" | "brand" | "auto";
export type EngineNode = "brand" | "web" | "perf" | "auto";

export type Choice<T extends string> = { value: T; label: string; hint?: string };

export const BUSINESSES: Choice<Business>[] = [
  { value: "clinic", label: "Clinic & healthcare" },
  { value: "shop", label: "Online shop" },
  { value: "local", label: "Local service" },
  { value: "b2b", label: "B2B / services" },
];

export const GOALS: Choice<Goal>[] = [
  { value: "customers", label: "More customers / appointments" },
  { value: "sales", label: "More online sales" },
  { value: "brand", label: "Stronger brand" },
  { value: "automation", label: "Save time with automation" },
];

export const STAGES: Choice<Stage>[] = [
  { value: "scratch", label: "Starting from scratch", hint: "No site, or nothing worth keeping" },
  { value: "underperform", label: "Have a site that underperforms", hint: "Traffic or leads below potential" },
  { value: "scale", label: "Growing and want to scale", hint: "It works — now make it bigger" },
];

export const DEFAULT_INPUT = { business: "clinic", goal: "customers", stage: "underperform" } as const satisfies {
  business: Business;
  goal: Goal;
  stage: Stage;
};

export type Input = { business: Business; goal: Goal; stage: Stage };

export const SERVICES: Record<Service, { name: string; node: EngineNode; short: string; why: string; topic: string }> = {
  web: {
    name: "Web Design",
    node: "web",
    short: "Website",
    why: "A fast, focused site is the base every channel points to.",
    topic: "Web Design & Development",
  },
  ecom: {
    name: "E-Commerce",
    node: "web",
    short: "Storefront",
    why: "A store built for speed and checkout turns visits into orders.",
    topic: "E-Commerce",
  },
  seo: {
    name: "SEO",
    node: "perf",
    short: "SEO",
    why: "The demand already exists in search — this makes sure it finds you.",
    topic: "SEO",
  },
  ads: {
    name: "Performance Marketing",
    node: "perf",
    short: "Paid media",
    why: "Paid media is the quickest lever to reach buyers right now.",
    topic: "Performance Marketing",
  },
  brand: {
    name: "Brand",
    node: "brand",
    short: "Identity",
    why: "A clear identity makes every later euro of marketing work harder.",
    topic: "Branding",
  },
  auto: {
    name: "Automation & Workflows",
    node: "auto",
    short: "Workflows",
    why: "Automation turns enquiries into revenue without extra admin.",
    topic: "Automation & Workflows",
  },
};

const NOUNS: Record<Business, { people: string; conv: string; convs: string; short: string }> = {
  clinic: { people: "patients", conv: "booking", convs: "bookings", short: "Clinic" },
  shop: { people: "shoppers", conv: "order", convs: "orders", short: "Shop" },
  local: { people: "local customers", conv: "enquiry", convs: "enquiries", short: "Local" },
  b2b: { people: "decision-makers", conv: "qualified lead", convs: "qualified leads", short: "B2B" },
};

/* Tie-break order: earlier wins when scores are equal. */
const ORDER: Service[] = ["web", "ecom", "seo", "ads", "brand", "auto"];

function rank({ business, goal, stage }: Input): Service[] {
  const s: Record<Service, number> = { web: 0, ecom: 0, seo: 0, ads: 0, brand: 0, auto: 0 };
  const ecomFits = business === "shop" || goal === "sales";

  if (goal === "customers") { s.ads += 3; s.seo += 2; s.web += 2; s.auto += 1; }
  if (goal === "sales") { s.ecom += 3; s.ads += 2; s.seo += 1; s.web += 1; }
  if (goal === "brand") { s.brand += 3; s.web += 2; s.seo += 1; }
  if (goal === "automation") { s.auto += 3; s.web += 1; }

  if (business === "clinic") { s.auto += 1; s.seo += 1; }
  if (business === "shop") { s.ecom += 2; s.ads += 1; }
  if (business === "local") { s.seo += 2; }
  if (business === "b2b") { s.brand += 1; s.auto += 1; s.seo += 1; }

  if (stage === "scratch") { s.brand += 2; s.web += 2; }
  if (stage === "underperform") { s.web += 2; s.seo += 1; }
  if (stage === "scale") { s.ads += 2; s.auto += 2; }

  if (!ecomFits) s.ecom = -99;
  const sorted = [...ORDER].sort((a, b) => s[b] - s[a] || ORDER.indexOf(a) - ORDER.indexOf(b));
  /* A storefront build already covers the website — never list both. */
  const picked = ecomFits ? sorted.filter((x) => x !== "web") : sorted;
  const top = picked.slice(0, 3);
  return s[top[2]] >= 2 ? top : top.slice(0, 2);
}

export type Phase = { when: string; title: string; text: string };

export type Plan = {
  key: string;
  services: Service[];
  nodes: EngineNode[];
  hub: string;
  why: string;
  phases: Phase[];
  outlook: string;
  signals: string;
  metric: string;
  topic: string;
  summary: string;
  announce: string;
};

const listJoin = (xs: string[]) => (xs.length < 3 ? xs.join(" and ") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);

export function buildPlan(input: Input): Plan {
  const { business, goal, stage } = input;
  const n = NOUNS[business];
  const services = rank(input);
  const lead = services[0];

  const phase1: Record<Stage, string> = {
    scratch: "Positioning, offer and structure, agreed in one focused workshop.",
    underperform: "An audit of speed, search and conversion leaks, ranked by impact.",
    scale: "A funnel and data review to find where the next growth sits.",
  };
  const phase2: Record<Service, string> = {
    web: `A fast, conversion-led site designed around how ${n.people} decide.`,
    ecom: "Storefront, checkout and product feeds rebuilt for speed and trust.",
    brand: "Identity, messaging and core assets that make you instantly recognisable.",
    seo: `Technical SEO and content that put you where ${n.people} search.`,
    ads: `Google and Meta campaigns live, tracked to every ${n.conv}.`,
    auto: "Booking, CRM and follow-ups connected, so nothing slips through.",
  };
  const phase3: Record<Goal, string> = {
    customers: `Weekly tuning of pages and campaigns toward more ${n.convs}.`,
    sales: "Testing offers, feeds and checkout for higher order value.",
    brand: "Content and campaigns that keep the brand consistent everywhere.",
    automation: "A new workflow each month as your team wins back hours.",
  };
  const outlook: Record<Goal, Record<Stage, string>> = {
    customers: {
      scratch: `Faster path to your first steady ${n.convs}`,
      underperform: `More ${n.convs} from the traffic you already have`,
      scale: `Lower cost per ${n.conv} as volume grows`,
    },
    sales: {
      scratch: "A store that is ready to sell from launch day",
      underperform: "More revenue from the visitors you already have",
      scale: "Sales that compound across more channels",
    },
    brand: {
      scratch: "A brand people remember from the first contact",
      underperform: "A brand that finally matches the quality of your work",
      scale: "A brand that makes every campaign work harder",
    },
    automation: {
      scratch: "Systems that scale before the workload does",
      underperform: "Fewer manual steps between enquiry and sale",
      scale: "Hours back every week, even at higher volume",
    },
  };
  const signals: Record<Stage, string> = { scratch: "6–10 weeks", underperform: "3–6 weeks", scale: "2–4 weeks" };
  const metric: Record<Goal, string> = {
    customers: `Cost per ${n.conv}`,
    sales: "Conversion rate & order value",
    brand: "Recall & branded search",
    automation: "Hours saved per week",
  };

  const names = services.map((x) => SERVICES[x].name);
  let topic = SERVICES[lead].topic;
  if (goal === "customers" && (lead === "ads" || lead === "seo")) topic = "Lead Generation & Appointments";

  const b = BUSINESSES.find((x) => x.value === business)!.label;
  const g = GOALS.find((x) => x.value === goal)!.label;
  const st = STAGES.find((x) => x.value === stage)!.label;

  return {
    key: `${business}-${goal}-${stage}`,
    services,
    nodes: [...new Set(services.map((x) => SERVICES[x].node))],
    hub: n.short,
    why: SERVICES[lead].why,
    phases: [
      { when: "Weeks 1–2", title: stage === "scale" ? "Find the lever" : "Diagnose & define", text: phase1[stage] },
      { when: "Weeks 3–6", title: stage === "scale" ? "Upgrade & launch" : "Build & launch", text: phase2[lead] },
      { when: "Ongoing", title: "Grow & compound", text: phase3[goal] },
    ],
    outlook: outlook[goal][stage],
    signals: signals[stage],
    metric: metric[goal],
    topic,
    summary: `Hi Nexlytic, I used the growth simulator on your site.\n\nBusiness: ${b}\nMain goal: ${g}\nCurrent state: ${st}\nSuggested focus: ${listJoin(names)}\n\nI'd like to talk about building this plan.`,
    announce: `Recommended focus: ${listJoin(names)}. Illustrative outlook: ${outlook[goal][stage]}.`,
  };
}

/* ---- Illustrative growth curve ------------------------------------- */

export const CURVE_POINTS = 12;

/* Values 0..1 (bottom..top). The shape is directional only. */
export function curveFor({ business, goal, stage }: Input): { plan: number[]; base: number[] } {
  const start = { scratch: 0.05, underperform: 0.17, scale: 0.32 }[stage];
  const lag = { scratch: 0.2, underperform: 0.09, scale: 0.02 }[stage];
  const amp = { clinic: 0.56, shop: 0.62, local: 0.52, b2b: 0.58 }[business] + (stage === "scale" ? 0.02 : 0);
  const drift = { scratch: 0.02, underperform: -0.015, scale: 0.08 }[stage];

  const shape = (t: number) => {
    switch (goal) {
      case "customers": return 1 - Math.exp(-3.4 * t) * (1 - 0.12 * t);
      case "sales": return (Math.exp(2.7 * t) - 1) / (Math.exp(2.7) - 1);
      case "brand": { const sg = (x: number) => 1 / (1 + Math.exp(-9 * (x - 0.55))); return (sg(t) - sg(0)) / (sg(1) - sg(0)); }
      case "automation": return 1 - Math.exp(-6 * t) * 0.85 - 0.15 * (1 - t);
    }
  };
  const plan: number[] = [];
  const base: number[] = [];
  for (let i = 0; i < CURVE_POINTS; i++) {
    const t = i / (CURVE_POINTS - 1);
    const tt = Math.max(0, (t - lag) / (1 - lag));
    const dip = stage === "scratch" ? 0 : -0.03 * Math.sin(Math.min(1, t / Math.max(lag, 0.05)) * Math.PI) * (t < lag ? 1 : 0);
    plan.push(Math.min(0.97, start + Math.max(0, amp * shape(tt)) + dip));
    base.push(start + drift * t + 0.012 * Math.sin(t * 7));
  }
  return { plan, base };
}
