import type { Metadata } from "next";
import { headers } from "next/headers";
import { site } from "@/data/site";
import "@/styles/globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  return (
    <html lang={h.get("x-site-locale") || "en"}>
      <body>{children}</body>
    </html>
  );
}
