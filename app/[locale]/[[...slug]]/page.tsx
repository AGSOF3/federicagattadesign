import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  Home,
  About,
  Services,
  Collection,
  ProjectDetail,
  ProductDetail,
  Contact,
  FAQ,
  Legal,
} from "@/components/views";
import { isLocale, locales } from "@/lib/locales";
import { projects, products } from "@/data/content";
import { site } from "@/data/site";
type Props = { params: Promise<{ locale: string; slug?: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  if (!isLocale(locale)) return {};
  const m = (await import(`../../../messages/${locale}.json`)).default;
  const page = slug[0] || "home";
  let title = m.nav[page] || site.name,
    description = m.home.intro;
  if (m.pages[page]) description = m.pages[page].intro;
  if (page === "about") description = m.about.intro;
  if (m.legal[page]) description = m.legal[page].intro;
  if (slug[1] && page === "portfolio" && m.projects[slug[1]]) {
    title = m.projects[slug[1]].title;
    description = m.projects[slug[1]].short;
  }
  if (slug[1] && page === "shop" && m.products[slug[1]]) {
    title = m.products[slug[1]].name;
    description = m.products[slug[1]].short;
  }
  const path = slug.length ? "/" + slug.join("/") : "";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: Object.fromEntries([
        ...locales.map((l) => [l, `/${l}${path}`]),
        ["x-default", `/en${path}`],
      ]),
    },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      locale: { en: "en_AU", it: "it_IT", es: "es_ES" }[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ({ en: "en_AU", it: "it_IT", es: "es_ES" })[l]),
      type: "website",
      url: `/${locale}${path}`,
      siteName: site.name,
      images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    },
  };
}
export default async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  if (!slug.length) return <Home />;
  if (slug.length === 2) {
    if (slug[0] === "portfolio" && projects.some((p) => p.id === slug[1]))
      return <ProjectDetail id={slug[1]} />;
    if (slug[0] === "shop" && products.some((p) => p.id === slug[1]))
      return <ProductDetail id={slug[1]} />;
    notFound();
  }
  if (slug.length !== 1) notFound();
  switch (slug[0]) {
    case "about":
      return <About />;
    case "services":
      return <Services />;
    case "portfolio":
      return <Collection type="portfolio" />;
    case "shop":
      return <Collection type="shop" />;
    case "contact":
      return (
        <Contact
          enabled={/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(
            process.env.FORM_ENDPOINT || "",
          )}
        />
      );
    case "faq":
      return <FAQ />;
    case "privacy":
    case "terms":
    case "refund":
      return <Legal type={slug[0]} />;
    default:
      notFound();
  }
}
