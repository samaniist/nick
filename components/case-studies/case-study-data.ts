export type ProjectPreview =
  | "atlantis"
  | "veenendaal"
  | "haveneiland"
  | "onelogy"
  | "corridor"
  | "sepehr";

export type WebProject = {
  name: string;
  domain: string;
  href: string;
  description: string;
  services: string[];
  preview: ProjectPreview;
  size: "wide" | "compact" | "full";
  searchPerformance?: {
    source: string;
    screenshot: string;
    metrics: { label: string; value: string }[];
  };
};

export const webProjects: WebProject[] = [
  {
    name: "Atlantis Wellness Centers",
    domain: "atlantiswellnesscenters.com",
    href: "https://www.atlantiswellnesscenters.com/",
    description:
      "A calm, clearly structured digital experience that makes an expansive wellness offering feel considered and approachable.",
    services: ["Web Design", "Digital Experience"],
    preview: "atlantis",
    size: "wide",
  },
  {
    name: "Onelogy",
    domain: "onelogy.com",
    href: "https://onelogy.com/",
    description:
      "A bold, product-first storefront that gives an unconventional skincare format a clear and memorable digital identity.",
    services: ["Web Design", "Brand Presentation", "Digital Product"],
    preview: "onelogy",
    size: "compact",
  },
  {
    name: "Mondzorgpraktijk Veenendaal",
    domain: "mondzorgpraktijkveenendaal.nl",
    href: "https://mondzorgpraktijkveenendaal.nl/",
    description:
      "A warm local-service experience that brings practical patient information and clear appointment paths to the foreground.",
    services: ["Web Design", "User Experience", "Local Positioning"],
    preview: "veenendaal",
    size: "compact",
    searchPerformance: {
      source: "Google Search Console · Web search · 12-month view · September 2026",
      screenshot: "/case-studies/veenendaal-google-search-console.png",
      metrics: [
        { label: "Organic clicks", value: "8.97K" },
        { label: "Search impressions", value: "643K" },
        { label: "Average CTR", value: "1.4%" },
        { label: "Average position", value: "9.8" },
      ],
    },
  },
  {
    name: "Mondzorg Haveneiland",
    domain: "mondzorghaveneiland.nl",
    href: "https://mondzorghaveneiland.nl/",
    description:
      "A professional healthcare presence balancing a modern presentation with an approachable, reassuring experience.",
    services: ["Web Design", "User Experience", "Healthcare"],
    preview: "haveneiland",
    size: "wide",
  },
  {
    name: "The Sepehr",
    domain: "thesepehr.org",
    href: "https://thesepehr.org/",
    description:
      "A mission-led digital experience structured to give stories, context, and purpose room to resonate.",
    services: ["Web Design", "Storytelling", "Mission-driven Experience"],
    preview: "sepehr",
    size: "wide",
  },
  {
    name: "Tandarts Corridor",
    domain: "tandarts-corridor.nl",
    href: "https://tandarts-corridor.nl/",
    description:
      "An editorial dental experience for Mondzorgpraktijk Veenendaal, pairing warm imagery and considered typography with clear paths to care and appointments.",
    services: ["Web Design", "User Experience", "Healthcare"],
    preview: "corridor",
    size: "compact",
  },
];

export const capabilities = [
  "Web Design",
  "Web Development",
  "Conversion Optimization",
  "Growth Strategy",
  "Amazon Growth",
  "Performance Marketing",
];
