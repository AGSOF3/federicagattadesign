import Link from "next/link";
import { headers } from "next/headers";
import { isLocale, locales, localeNames } from "@/lib/locales";
export default async function NotFound() {
  const lang = (await headers()).get("x-site-locale") || "en";
  const locale = isLocale(lang) ? lang : "en";
  const m = (await import(`../messages/${locale}.json`)).default;
  return (
    <main className="not-found">
      <p>404</p>
      <h1>{m.common.notFound}</h1>
      {locales.map((l) => (
        <Link key={l} href={`/${l}`} lang={l}>
          {localeNames[l]}
        </Link>
      ))}
    </main>
  );
}
