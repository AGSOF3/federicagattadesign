/** Build a static preview in an isolated copy; keep the full Next.js app intact. */
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
const root = process.cwd();
const basePath = process.env.PAGES_BASE_PATH ?? "/federicagattadesign";
if (!/^\/[a-zA-Z0-9_-]+$/.test(basePath) && basePath !== "")
  throw new Error("Invalid Pages base path");
const siteUrl =
  process.env.PAGES_SITE_URL || `https://agsof3.github.io${basePath}`;
const temp = await mkdtemp(path.join(tmpdir(), "fg-pages-"));
const destination = path.join(root, "pages-out");
try {
  for (const name of [
    "app",
    "components",
    "data",
    "lib",
    "messages",
    "public",
    "styles",
    "types",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "postcss.config.mjs",
  ])
    await cp(path.join(root, name), path.join(temp, name), { recursive: true });
  await symlink(
    path.join(root, "node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  for (const name of [
    "app/layout.tsx",
    "app/page.tsx",
    "app/not-found.tsx",
    "app/api",
  ])
    await rm(path.join(temp, name), { recursive: true, force: true });
  await writeFile(
    path.join(temp, "next.config.ts"),
    `import createNextIntlPlugin from 'next-intl/plugin';
export default createNextIntlPlugin('./lib/i18n.ts')({output:'export',trailingSlash:true,basePath:${JSON.stringify(basePath)},images:{unoptimized:true},poweredByHeader:false,turbopack:{root:${JSON.stringify(temp)}}});\n`,
  );
  await writeFile(
    path.join(temp, "app/[locale]/layout.tsx"),
    `import type {Metadata} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages,setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {isLocale,locales} from '@/lib/locales';
import {site} from '@/data/site';
import {Header,Footer} from '@/components/chrome';
import '@/styles/globals.css';
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:site.name,template:'%s | '+site.name},robots:{index:false,follow:false}};
export function generateStaticParams(){return locales.map(locale=>({locale}))}
export default async function Layout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();setRequestLocale(locale);const messages=await getMessages();return <html lang={locale}><body><NextIntlClientProvider locale={locale} messages={messages}><Header/><main id="main">{children}</main><Footer/></NextIntlClientProvider></body></html>}
`,
  );
  const pagePath = path.join(temp, "app/[locale]/[[...slug]]/page.tsx");
  let page = await readFile(pagePath, "utf8");
  page += `\nexport function generateStaticParams(){return [[],...['about','portfolio','services','shop','contact','faq','privacy','terms','refund'].map(s=>[s]),...projects.map(p=>['portfolio',p.id]),...products.map(p=>['shop',p.id])].map(slug=>({slug}));}\n`;
  // Absolute SEO URLs retain the project subdirectory on GitHub Pages.
  page = page
    .replaceAll("`/${locale}${path}`", "`${site.url}/${locale}${path}`")
    .replaceAll("`/${l}${path}`", "`${site.url}/${l}${path}`")
    .replaceAll("`/en${path}`", "`${site.url}/en${path}`")
    .replace('url: "/opengraph-image"', `url: "${siteUrl}/opengraph-image"`);
  await writeFile(pagePath, page);
  // Native language links and public media also need the Pages project prefix.
  const chromePath = path.join(temp, "components/chrome.tsx");
  let chrome = await readFile(chromePath, "utf8");
  chrome = chrome.replace("`/${lang}${", "`" + basePath + "/${lang}${");
  await writeFile(chromePath, chrome);
  const contentPath = path.join(temp, "data/content.ts");
  let content = await readFile(contentPath, "utf8");
  content = content
    .replaceAll('"/images/', JSON.stringify(basePath).slice(0, -1) + "/images/")
    .replaceAll(
      '"/videos/',
      JSON.stringify(basePath).slice(0, -1) + "/videos/",
    );
  await writeFile(contentPath, content);
  await writeFile(
    path.join(temp, "app/robots.ts"),
    `export const dynamic='force-static';export default function robots(){return {rules:{userAgent:'*',disallow:'/'}}}\n`,
  );
  for (const relative of ["app/sitemap.ts", "app/opengraph-image.tsx"]) {
    const file = path.join(temp, relative);
    await writeFile(
      file,
      "export const dynamic='force-static';\n" + (await readFile(file, "utf8")),
    );
  }
  const result = spawnSync(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
    {
      cwd: temp,
      stdio: "inherit",
      env: {
        ...process.env,
        NEXT_PUBLIC_SITE_URL: siteUrl,
        FORM_ENDPOINT: "",
        FORM_UPLOADS_ENABLED: "false",
        NEXT_TELEMETRY_DISABLED: "1",
      },
    },
  );
  if (result.status !== 0) throw new Error("Static preview build failed");
  await rm(destination, { recursive: true, force: true });
  await cp(path.join(temp, "out"), destination, { recursive: true });
  await writeFile(path.join(destination, ".nojekyll"), "");
  await writeFile(
    path.join(destination, "index.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><meta http-equiv="refresh" content="0;url=${basePath}/en/"><title>Federica Gatta Design</title></head><body><a href="${basePath}/en/">Federica Gatta Design</a></body></html>`,
  );
  console.log(`Static preview ready in ${destination} for ${siteUrl}/`);
} finally {
  await rm(temp, { recursive: true, force: true });
}
