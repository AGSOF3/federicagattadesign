import { test, expect } from "@playwright/test";
import en from "../messages/en.json";
import it from "../messages/it.json";
import es from "../messages/es.json";
const messages = { en, it, es };
const pages = [
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
for (const locale of ["en", "it", "es"] as const) {
  test(`${locale}: every page and translated SEO`, async ({ request }) => {
    for (const path of pages) {
      const response = await request.get(`/${locale}/${path}`);
      expect(response.status(), path).toBe(200);
      const html = await response.text();
      expect(html).toContain(`<html lang="${locale}"`);
      expect(html).toContain('rel="canonical"');
      for (const alternate of ["en", "it", "es", "x-default"])
        expect(html).toContain(`hrefLang="${alternate}"`);
      expect(html).not.toContain("MISSING_MESSAGE");
      expect(html).toContain('property="og:description"');
    }
  });
  test(`${locale}: functional language switch preserves product`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/shop/everyday-planner`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      messages[locale].products["everyday-planner"].name,
    );
    await page.getByRole("link", { name: "Italiano", exact: true }).click();
    await expect(page).toHaveURL("/it/shop/everyday-planner");
    await expect(page.locator("html")).toHaveAttribute("lang", "it");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      it.products["everyday-planner"].name,
    );
  });
}
test("English default and genuine missing routes", async ({ request }) => {
  expect((await request.get("/")).url()).toMatch(/\/en$/);
  for (const url of [
    "/en/shop/missing",
    "/en/portfolio/missing",
    "/fr",
    "/en/extra/path/here",
  ])
    expect((await request.get(url)).status()).toBe(404);
});
test("portfolio filters produce the expected results", async ({ page }) => {
  await page.goto("/en/portfolio");
  await expect(page.locator(".project-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Print design", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card h3")).toHaveText("Casa Botanica");
  await page.getByRole("button", { name: "All projects", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(5);
});
test("shop search, categories and empty state", async ({ page }) => {
  await page.goto("/en/shop");
  await expect(page.locator(".product-card")).toHaveCount(4);
  await page.getByRole("searchbox").fill("weekly");
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card h3")).toHaveText("The Weekly Edit");
  await page.getByRole("searchbox").fill("");
  await page
    .getByRole("button", { name: "Digital stickers", exact: true })
    .click();
  await expect(page.locator(".empty")).toBeVisible();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(4);
});
test("purchasing and contact stay honestly unavailable", async ({
  page,
  request,
}) => {
  await page.goto("/en/shop/everyday-planner");
  await expect(
    page.getByRole("button", { name: "Coming soon" }),
  ).toBeDisabled();
  await expect(page.locator('a[href*="payhip.com"]')).toHaveCount(0);
  await page.goto("/en/contact");
  await expect(
    page.getByRole("button", { name: "Send enquiry" }),
  ).toBeDisabled();
  await expect(page.locator("#form-status")).toContainText("not connected");
  const result = await request.post("/api/contact", {
    form: {
      name: "Test",
      email: "test@example.com",
      description: "This should never be delivered.",
      service: "brand",
    },
  });
  expect(result.status()).toBe(503);
});
test("FAQ expansion and video gallery play a real silent MP4", async ({
  page,
}) => {
  await page.goto("/en/faq");
  const first = page.locator(".faq-section details").first();
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(first.locator("p")).toBeVisible();
  await page.goto("/en/portfolio/forma");
  await page.getByRole("button", { name: "Next image", exact: true }).click();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  expect(
    await video.evaluate(async (v: HTMLVideoElement) => {
      await v.play();
      return {
        playing: !v.paused,
        width: v.videoWidth,
        audio:
          (v as HTMLVideoElement & { webkitAudioDecodedByteCount?: number })
            .webkitAudioDecodedByteCount || 0,
      };
    }),
  ).toMatchObject({ playing: true, width: 960, audio: 0 });
  await page
    .getByRole("button", { name: "Previous image", exact: true })
    .click();
  await expect(page.locator(".gallery-main img")).toBeVisible();
});
test("mobile navigation, language selection, reduced motion and widths", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page
    .locator("#mobile-nav")
    .getByRole("link", { name: "Digital shop" })
    .click();
  await expect(page).toHaveURL("/en/shop");
  await expect(page.locator("#mobile-nav")).toBeHidden();
  await page.getByRole("link", { name: "Español", exact: true }).click();
  await expect(page).toHaveURL("/es/shop");
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/es",
      "/it/services",
      "/en/contact",
      "/en/shop/everyday-planner",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width} ${path}`,
      ).toBe(true);
    }
  }
});
test("no browser errors and meaningful headings are visible", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of [
    "/en",
    "/it/about",
    "/es/services",
    "/en/portfolio",
    "/en/shop",
    "/en/contact",
  ]) {
    await page.goto(path);
    await expect(page.locator("main h1")).toBeVisible();
    for (const heading of await page.locator("main h2").all()) {
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});
test("sitemap, robots and generated social image", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect((xml.match(/<url>/g) || []).length).toBe(57);
  expect(xml).toContain("/es/shop/quiet-journal");
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const og = await request.get("/opengraph-image");
  expect(og.status()).toBe(200);
  expect(og.headers()["content-type"]).toContain("image/png");
});
test("all editable translation files have matching keys", () => {
  function keys(value: unknown, prefix = ""): string[] {
    if (Array.isArray(value))
      return value.flatMap((v, i) => keys(v, `${prefix}.${i}`));
    if (value && typeof value === "object")
      return Object.entries(value).flatMap(([k, v]) =>
        keys(v, `${prefix}.${k}`),
      );
    expect(typeof value).toBe("string");
    expect(String(value).trim().length).toBeGreaterThan(0);
    return [prefix];
  }
  expect(keys(it).sort()).toEqual(keys(en).sort());
  expect(keys(es).sort()).toEqual(keys(en).sort());
});
