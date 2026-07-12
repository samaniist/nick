import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // client pitch page — not for search engines
      disallow: "/onelogy",
    },
    sitemap: "https://nexlytic.de/sitemap.xml",
  };
}
