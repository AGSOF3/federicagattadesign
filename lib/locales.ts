export const locales = ["en", "it", "es"] as const;
export type Locale = (typeof locales)[number];
export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  es: "Español",
};
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
