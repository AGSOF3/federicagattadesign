# Federica Gatta Design

A complete first version of an independent design studio website, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4 and next-intl 4. Self-hosted Cormorant Garamond and DM Sans keep font loading independent of Google services. No database or paid CMS is needed.

## Start here

Install **Node.js 24 LTS** (the version used to build this project) and npm. In a terminal opened in this folder:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The root redirects to English. The other languages are `/it` and `/es`. Stop the server with Ctrl+C. On the managed cloud machine, use `npm ci --cache /workspace/.npm-cache` if the default npm cache is not writable. Use this existing checkout; cloud tasks are already isolated and do not require a separate worktree.

Production verification:

```bash
npm run build
npm start
```

`npm run typecheck` checks TypeScript. See the testing section for the browser suite.

## What is included

- Home, About, Portfolio, Services, Digital Shop, Contact, FAQ and three legal pages in English, Italian and Spanish.
- Five clearly labelled demonstration portfolio projects, each with a detail page. These do **not** represent commissioned client work.
- Four demonstration products, each with a detail page, pricing in AUD, formats, instructions and compatibility notes.
- Portfolio filters; shop search and category filters; image/video galleries with controls; responsive navigation; language switching that preserves the current page.
- Responsive layouts, subtle CSS animations, scroll reveals in browsers supporting animation timelines and reduced-motion support. No animation library is needed.
- Local typography-based demonstration artwork. Replace it with your actual work when ready. The illustrated portrait is an explicit placeholder, not a photograph of Federica.
- Translated page metadata, canonical URLs, hreflang, Open Graph, `/sitemap.xml` and `/robots.txt`.
- A real Formspree forwarding route, disabled until configured. There is no fake message delivery or payment simulation.

## Files you will edit most often

| File                 | Purpose                                                             |
| -------------------- | ------------------------------------------------------------------- |
| `data/site.ts`       | Brand, logo, contact details, social links, currency and navigation |
| `data/content.ts`    | Projects, products, categories, prices, media and Payhip URLs       |
| `messages/en.json`   | English text, SEO descriptions, services, FAQs and legal drafts     |
| `messages/it.json`   | Italian translations with the same structure                        |
| `messages/es.json`   | Spanish translations with the same structure                        |
| `public/images/`     | Your images, logo and project mockups                               |
| `public/videos/`     | MP4 files and video poster images                                   |
| `styles/globals.css` | Colours, typography, spacing, artwork and responsive styles         |
| `.env.local`         | Local service settings; never commit this file                      |

Text is separate from layout. Keep translation keys identical across languages. Named sample projects use the same brand name across languages; their descriptions are translated. Decorative brand lettering appears within the sample artwork.

## Brand, portrait and contact details

Edit `data/site.ts`. Add your email and full HTTPS Instagram/social URLs. Put your logo in `public/images/logo.svg` and set `logo: '/images/logo.svg'`. The FG monogram is the temporary logo.

Put your portrait in `public/images/` and set `portrait` in `data/site.ts` to its local path. It will replace the illustrated placeholder automatically. Edit `common.portraitAlt` in the translation files to describe your image. You can edit the introductory biography in each translation file without touching the layout.

Set `NEXT_PUBLIC_SITE_URL` in `.env.local` and in Vercel to your final HTTPS domain, without a trailing slash. The current `https://example.com` is a placeholder for metadata, **not your live domain**. Rebuild after changing public variables.

## Add or update a portfolio project

1. Put optimised images in `public/images/your-project/` and MP4s in `public/videos/`.
2. Add an entry to `projects` in `data/content.ts`:

```ts
{
  id: 'your-project',
  category: 'brand', // brand, social, print, marketing, digital
  year: 2026,
  concept: true,
  demo: false,
  art: 'alma', // fallback artwork only, if no images are supplied
  media: [
    {type: 'image', src: '/images/your-project/cover.webp'},
    {type: 'image', src: '/images/your-project/detail.webp'},
    {type: 'video', src: '/videos/your-project.mp4', poster: '/images/your-project/poster.webp'}
  ]
}
```

3. Add the matching `projects.your-project` object to **all three** message files, with `title`, `short` and `description`.
4. Visit `/en/portfolio/your-project`. The sitemap updates automatically at the next build.

Set `concept: true` for personal/concept work. Keep `demo: true` for sample content. Never label sample work as an actual client commission. For real client information, include it in the translated descriptions. The first image becomes the project card cover; the detail gallery shows every item, including videos.

## Images, animations and video

Use local WebP, AVIF, JPEG or PNG images at sensible dimensions (usually 1200–1800 px wide for large artwork). Next Image generates responsive optimised variants. Avoid embedding full-resolution original files. Image alt text is derived from the translated project/product title and gallery position.

Use web-compatible **H.264 MP4** with a poster image. Videos have native controls, `playsInline` and `preload="metadata"`; they never autoplay. Do not include copyrighted media without permission. There is no sound autoplay. A gallery can combine images, animated WebP/GIF and MP4. Large videos consume deployment bandwidth, so keep clips short and compressed. An example muted motion concept is included with Forma Journal.

## Add a digital product and Payhip checkout

1. Create the actual downloadable product and configure its files or Canva delivery links in your own Payhip account. Downloadable paid files belong in **Payhip**, not `public/`, where anyone could access them.
2. Add a product entry in `data/content.ts`. Use an existing entry as a template. Its `id` must be unique.
3. Choose a category from `productCategories` in `data/site.ts`. The shop includes all eight requested categories; empty categories show a translated empty state.
4. Add translated `name`, `short`, `description`, `features` (an array), `compatibility`, `instructions` and `download` under `products.your-product-id` in every message file.
5. Set the actual price and formats. `currency` is centrally configured in `data/site.ts`; keep displayed currency and price aligned with Payhip.
6. Set `checkoutUrl` to that product’s **HTTPS Payhip link**, e.g. `https://payhip.com/b/YOUR_PRODUCT_ID`.
7. Verify the purchase link opens the correct product, currency, tax/total information and delivery settings. Test checkout and email delivery in your Payhip account before launch.

Empty or invalid checkout URLs do not create a purchase button. Product pages show a clear coming-soon state. Payhip processes payment and automatic delivery externally. The website has no payment processing, customer accounts or shopping cart. Taxes, licences, refund settings and delivery files must be configured and reviewed on Payhip. The sample prices and specifications are illustrative, not a sellable product catalogue. Replace every demonstration description before selling.

## Connect the contact form

The form collects name, email, business, service and project description, plus optional budget, deadline and reference image. Name, email, service and a project description of at least 20 characters are required. It is deliberately disabled while no provider is connected.

1. Create a real form at [Formspree](https://formspree.io) and verify the receiving email.
2. Set the **server variable** `FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID` in `.env.local` and Vercel. The route only forwards to this HTTPS host/path; it is not an open proxy.
3. If your plan supports attachments, set `FORM_UPLOADS_ENABLED=true` after testing it. Otherwise the optional upload control remains visibly disabled, while text enquiries work. Restart locally or redeploy on Vercel. The form will become enabled.
4. Send a real test enquiry and check the destination inbox. Test an attachment and provider quota limits too. No live delivery has been tested without your account.

The route validates required fields and reference file type/size, forwards only known fields and reports success only after Formspree accepts the request. Provider failures show an error and preserve the form. A honeypot is included. Enable provider spam controls and appropriate abuse protections for your traffic.

**Important:** Formspree text enquiries can use its free tier within its current limits. File uploads may require a paid plan. The upload field stays disabled by default so a free text-only form does not promise attachment delivery. Enable it only with a plan supporting attachments. Do not claim attachment delivery without testing it. Uploads are limited to 3 MB and the API applies a 4 MB request-length check, leaving room within Vercel’s commonly applied 4.5 MB Function payload limit. Larger submissions are rejected rather than reported as sent. The site does not store uploads or enquiries in a database.

No newsletter is displayed because no newsletter provider has been configured. Nothing silently subscribes visitors.

## Add a language

1. Copy `messages/en.json` to a new file, such as `messages/fr.json`, and translate **all values**, including metadata, products, FAQs and legal content. Keep keys unchanged.
2. Add the code to `locales` and its display name to `localeNames` in `lib/locales.ts`.
3. Add the locale/region mapping in the Open Graph metadata code in `app/[locale]/[[...slug]]/page.tsx` (for French: `fr_FR`).
4. Rebuild and test navigation, language switching, the document `lang`, canonical URLs and sitemap.

English remains the default. Routes share the same content slugs, so changing language preserves the current project/product page. Further locale support needs no new page components. There is no runtime machine translation.

## Legal content and launch preparation

The Privacy Policy, Terms and Digital Product Refund Policy are **editable drafts**, visibly labelled on the website. They are not legal advice and make no compliance claim. Complete the legal business identity, ABN if applicable, address, contact email, effective dates, service terms, product licence, actual provider processing, retention, international transfers and complaints process. Have Australian and relevant international requirements reviewed, including mandatory consumer rights and any digital-content withdrawal rules. Do not publish a blanket “no refunds” policy that overrides those rights.

Before launch, supply your real logo/portrait/contact information, replace demonstration projects and products, confirm all translations, set the final domain, review the legal drafts, connect and test Formspree and Payhip, and check accessibility and real devices with your final media. The starter contains no analytics or marketing cookies; adding those later may introduce new privacy/consent requirements.

## Deploy to Vercel and connect a domain

1. Save the project to your GitHub repository. This task does not push or publish code automatically.
2. Create a Vercel account and choose **Add New → Project**, then import the repository.
3. Keep the Next.js framework preset. Build command: `npm run build`; install command: `npm ci`; output directory: leave automatic. Select Node.js 24 if offered.
4. Add `NEXT_PUBLIC_SITE_URL` and, when configured, `FORM_ENDPOINT` in project Environment Variables. Never put private credentials in a `NEXT_PUBLIC_` variable.
5. Deploy and test all language routes and real integrations. Vercel’s Hobby plan has usage and eligibility restrictions, including restrictions on commercial use; a business site may require Pro or another host. Review current terms rather than assuming commercial hosting is free.
6. In **Project → Settings → Domains**, add your domain and follow Vercel’s exact DNS instructions at your registrar. Choose a primary domain and redirect the alternate www/non-www form.
7. Set `NEXT_PUBLIC_SITE_URL` to the primary HTTPS domain, redeploy and inspect `/sitemap.xml`, canonical URLs and HTTPS. Configure both preview and production environment variables deliberately.

The project also works on a Node host supporting Next.js. It uses a server route for the contact form and dynamic translated pages; do not deploy this version as a plain static HTML export.

## Testing

```bash
npm ci
npx playwright install chromium
npm run build
npm test
```

`npm test` launches the production server on port 3100 and runs browser tests. For a preinstalled Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. The suite checks translated routes and SEO, language preservation, portfolio filters, shop search, unavailable checkout/form behaviour, mobile navigation, layout overflow, FAQ and real gallery video controls. It does not purchase anything or submit to an external inbox.

## Future expansion

`data/content.ts` is a small typed catalogue; it can later be replaced with CMS queries while keeping the cards and detail views. Product checkout URLs are separate from presentation, so another commerce provider can be integrated deliberately later. Customer accounts, a dashboard, a blog and a newsletter are intentionally deferred. There are no paid CMS, database or newsletter dependencies.

## Temporary GitHub Pages preview

A separate static preview can be published on GitHub Pages. This leaves the full Next.js application and Formspree server route unchanged for a later Vercel deployment.

```bash
npm ci
npm run build:pages
```

The build creates `pages-out/` from an isolated temporary copy. All 57 translated routes are pre-rendered. The preview uses `/federicagattadesign` as its project base path, includes a default-English redirect and disables search indexing. Images are served as local static assets. Form submission is always disabled in this preview, even if the full app has a configured provider. Payhip links can still open external checkout pages once real links are supplied.

The workflow `.github/workflows/pages.yml` builds and deploys on pushes to `master`, or can be started manually in GitHub Actions. In the repository, first choose **Settings → Pages → Build and deployment → Source → GitHub Actions**. If an initial run happened before enabling Pages, use **Actions → Deploy website preview to GitHub Pages → Run workflow** afterward.

The expected address after a successful deployment is `https://agsof3.github.io/federicagattadesign/`. It is not a live URL until GitHub reports deployment success. Repository/plan restrictions may affect Pages availability. For a renamed repository or account, edit the two `PAGES_` variables in the workflow. These are public, non-secret settings.
