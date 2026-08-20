export type ProjectPreview =
  | "atlantis"
  | "veenendaal"
  | "haveneiland"
  | "onelogy"
  | "sepehr";

export type WebProject = {
  name: string;
  domain: string;
  href: string;
  description: string;
  services: string[];
  preview: ProjectPreview;
  size: "wide" | "compact" | "full";
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
    size: "full",
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
