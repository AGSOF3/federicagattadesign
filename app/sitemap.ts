import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { locales } from "@/lib/locales";
import { projects, products } from "@/data/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/portfolio",
    "/services",
    "/shop",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/refund",
    ...projects.map((p) => `/portfolio/${p.id}`),
    ...products.map((p) => `/shop/${p.id}`),
  ];
  return paths.flatMap((path) =>
    locales.map((l) => ({
      url: `${site.url}/${l}${path}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((lang) => [lang, `${site.url}/${lang}${path}`]),
        ),
      },
    })),
  );
}
