import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // client pitch page + paid-traffic landings — not for search engines
      disallow: ["/onelogy", "/lp/"],
    },
    sitemap: "https://nexlytic.de/sitemap.xml",
  };
}
