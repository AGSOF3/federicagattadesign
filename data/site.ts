export const site = {
  name: "Federica Gatta Design",
  monogram: "FG",
  portrait: "", // Optional local portrait path, e.g. /images/federica.webp
  logo: "", // Optional local image path, e.g. /images/logo.svg
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  email: "",
  instagram: "",
  otherSocial: [] as { name: string; url: string }[],
  currency: "AUD",
};
export const navigation = [
  "home",
  "about",
  "portfolio",
  "services",
  "shop",
  "contact",
] as const;
export const projectCategories = [
  "all",
  "brand",
  "social",
  "print",
  "marketing",
  "digital",
] as const;
export const productCategories = [
  "all",
  "digital-planners",
  "printable-planners",
  "goodnotes",
  "social-templates",
  "business-templates",
  "journals",
  "stickers",
  "stationery",
] as const;
