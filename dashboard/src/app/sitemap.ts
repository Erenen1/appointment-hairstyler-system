import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = [
    "",
    "/solutions",
    "/features",
    "/integrations",
    "/pricing",
    "/customers",
    "/faq",
    "/contact",
    "/legal/privacy",
    "/legal/terms",
    "/legal/kvkk",
  ];
  return routes.map((r) => ({ url: siteUrl + r, changeFrequency: "weekly", priority: r === "" ? 1 : 0.6 }));
}


