import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const root = path.resolve("pages-out");
const prefix = "/federicagattadesign";
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    let url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (!url.startsWith(prefix + "/")) {
      res.writeHead(404).end();
      return;
    }
    let file = path.resolve(root, "." + url.slice(prefix.length));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(404).end();
      return;
    }
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!url.endsWith("/")) {
        res.writeHead(301, { location: url + "/" }).end();
        return;
      }
      file = path.join(file, "index.html");
    }
    const data = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      })
      .end(data);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(3200, "127.0.0.1", r));
let browser;
try {
  const origin = "http://127.0.0.1:3200";
  const base = origin + prefix;
  const paths = [
    "",
    "about",
    "portfolio",
    "services",
    "shop",
    "contact",
    "faq",
    "privacy",
    "terms",
    "refund",
    "portfolio/alma",
    "portfolio/slow-living",
    "portfolio/casa",
    "portfolio/studio-notes",
    "portfolio/forma",
    "shop/everyday-planner",
    "shop/social-essentials",
    "shop/weekly-printables",
    "shop/quiet-journal",
  ];
  for (const locale of ["en", "it", "es"])
    for (const slug of paths) {
      const r = await fetch(`${base}/${locale}/${slug}${slug ? "/" : ""}`);
      assert.equal(r.status, 200, `${locale}/${slug}`);
      assert.ok((await r.text()).includes(`<html lang="${locale}"`));
    }
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(base + "/");
  await page.waitForURL(base + "/en/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Italiano", exact: true }).click();
  await page.waitForURL(base + "/it/");
  assert.equal(await page.locator("html").getAttribute("lang"), "it");
  await page.goto(base + "/en/shop/");
  await page.getByRole("searchbox").fill("weekly");
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".product-card").count(), 1);
  await page.goto(base + "/en/portfolio/");
  await page.getByRole("button", { name: "Print design", exact: true }).click();
  assert.equal(await page.locator(".project-card").count(), 1);
  await page.goto(base + "/en/portfolio/forma/");
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  await page.locator("video").evaluate((v) => v.play());
  assert.equal(await page.locator("video").evaluate((v) => v.videoWidth), 960);
  await page.goto(base + "/en/contact/");
  assert.ok(
    await page.getByRole("button", { name: "Send enquiry" }).isDisabled(),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Digital shop" })
    .click();
  await page.waitForURL(base + "/en/shop/");
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.waitForLoadState("networkidle");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 57 static routes, project-prefixed assets, default redirect, language switching, filters, search, video, unavailable contact and mobile navigation.",
  );
} finally {
  if (browser) await browser.close();
  await new Promise((r) => server.close(r));
}
