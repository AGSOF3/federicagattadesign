import { Arrow, Star } from "./icons";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Artwork, Portrait } from "./artwork";
import { Catalog, Gallery, ProductCard, ProjectCard } from "./catalog";
import { ContactForm } from "./contact-form";
import { services, projects, products } from "@/data/content";
import { site } from "@/data/site";
export function ButtonLink({
  href,
  children,
  outline = false,
}: {
  href: string;
  children: React.ReactNode;
  outline?: boolean;
}) {
  return (
    <Link href={href} className={`button ${outline ? "outline" : "dark"}`}>
      {children}
      <span aria-hidden="true">
        <Arrow />
      </span>
    </Link>
  );
}
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="text-link">
      {children}
      <span aria-hidden="true">
        <Arrow />
      </span>
    </Link>
  );
}
export function CTA() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <section className="cta">
      <div className="cta-star" aria-hidden="true">
        <Star />
      </div>
      <p className="eyebrow">{t("home.ctaLabel")}</p>
      <h2>{t("home.ctaTitle")}</h2>
      <p>{t("home.ctaText")}</p>
      <ButtonLink href={`/${l}/contact`}>{t("common.quote")}</ButtonLink>
    </section>
  );
}
export function PageIntro({ page }: { page: string }) {
  const t = useTranslations();
  return (
    <section className="page-intro">
      <div className="intro-index" aria-hidden="true">
        FG / {page.toUpperCase()}
      </div>
      <p className="eyebrow">{t(`pages.${page}.eyebrow`)}</p>
      <h1>{t(`pages.${page}.title`)}</h1>
      <p className="intro-copy">{t(`pages.${page}.intro`)}</p>
    </section>
  );
}
export function Home() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="tiny-star">
              <Star />
            </span>
            {t("home.eyebrow")}
          </p>
          <h1>{t("home.title")}</h1>
          <p className="hero-description">{t("home.intro")}</p>
          <div className="hero-buttons">
            <ButtonLink href={`/${l}/portfolio`}>
              {t("common.explore")}
            </ButtonLink>
            <TextLink href={`/${l}/shop`}>{t("common.discover")}</TextLink>
          </div>
          <div className="hero-scroll">
            <span>↓</span>
            {t("home.scroll")}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-topline">
            <span>FEDERICA GATTA DESIGN</span>
            <span>{t("common.preview")}</span>
          </div>
          <Artwork kind="alma" />
          <div className="hero-badge">
            <span>FG</span>
            <small>DESIGN STUDIO</small>
          </div>
          <div className="hero-bottomline">
            <i>{t("home.heroNote")}</i>
            <span>01 / 05</span>
          </div>
        </div>
      </section>
      <div className="brand-strip">
        {(t.raw("home.strip") as string[]).map((s) => (
          <span key={s}>
            {s}
            <i aria-hidden="true">
              <Star />
            </i>
          </span>
        ))}
      </div>
      <section className="studio-section section-pad">
        <div>
          <p className="eyebrow">{t("home.studioLabel")}</p>
          <span className="studio-flower" aria-hidden="true">
            <Star />
          </span>
        </div>
        <div>
          <h2>{t("home.studioTitle")}</h2>
          <p className="body-large">{t("home.studioText")}</p>
          <TextLink href={`/${l}/about`}>{t("home.studioLink")}</TextLink>
        </div>
      </section>
      <section className="services-home section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("home.servicesLabel")}</p>
            <h2>{t("home.servicesTitle")}</h2>
          </div>
          <TextLink href={`/${l}/services`}>{t("home.servicesLink")}</TextLink>
        </div>
        <div className="service-links">
          {services.slice(0, 4).map((s, i) => (
            <Link href={`/${l}/services#${s}`} key={s}>
              <span className="service-number">0{i + 1}</span>
              <div>
                <h3>{t(`services.${s}.name`)}</h3>
                <p>{t(`services.${s}.short`)}</p>
              </div>
              <span className="round-arrow">
                <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="work-home section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("home.workLabel")}</p>
            <h2>{t("home.workTitle")}</h2>
          </div>
          <TextLink href={`/${l}/portfolio`}>{t("home.workLink")}</TextLink>
        </div>
        <p className="collection-note">{t("common.demoNote")}</p>
        <div className="project-grid">
          {projects.slice(0, 2).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>
      <section className="shop-home section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("home.shopLabel")}</p>
            <h2>{t("home.shopTitle")}</h2>
          </div>
          <div className="section-side">
            <p>{t("home.shopText")}</p>
            <TextLink href={`/${l}/shop`}>{t("home.shopLink")}</TextLink>
          </div>
        </div>
        <p className="collection-note">{t("common.shopNote")}</p>
        <div className="product-grid">
          {products
            .filter((p) => p.featured)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="about-home section-pad">
        <Portrait />
        <div>
          <p className="eyebrow">{t("home.aboutLabel")}</p>
          <h2>{t("home.aboutTitle")}</h2>
          <p className="body-large">{t("home.aboutText")}</p>
          <TextLink href={`/${l}/about`}>{t("home.aboutLink")}</TextLink>
          <div className="signature" aria-hidden="true">
            Federica
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
export function About() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <>
      <section className="about-intro section-pad">
        <div>
          <p className="eyebrow">{t("about.eyebrow")}</p>
          <h1>{t("about.title")}</h1>
          <p className="body-large">{t("about.intro")}</p>
          <span className="signature">Federica</span>
        </div>
        <Portrait />
      </section>
      <section className="about-values section-pad">
        {["approach", "philosophy", "help"].map((k, i) => (
          <article key={k}>
            <small>0{i + 1} /</small>
            <h2>{t(`about.${k}Title`)}</h2>
            <p>{t(`about.${k}`)}</p>
          </article>
        ))}
      </section>
      <div className="values-strip">
        {(t.raw("about.values") as string[]).map((v) => (
          <span key={v}>
            <Star /> {v}
          </span>
        ))}
      </div>
      <section className="section-pad about-end">
        <h2>{t("home.servicesTitle")}</h2>
        <ButtonLink href={`/${l}/services`}>
          {t("home.servicesLink")}
        </ButtonLink>
      </section>
      <CTA />
    </>
  );
}
export function Services() {
  const t = useTranslations();
  const l = useLocale();
  return (
    <>
      <PageIntro page="services" />
      <section className="service-details section-pad">
        {services.map((s, i) => (
          <article id={s} key={s}>
            <div className="service-art">
              <Artwork kind={["alma", "slow", "casa", "notes", "forma"][i]} />
              <small>{t("common.demo")}</small>
            </div>
            <div>
              <p className="eyebrow">0{i + 1} /</p>
              <h2>{t(`services.${s}.name`)}</h2>
              <p>{t(`services.${s}.description`)}</p>
              <h3 className="eyebrow">{t("common.included")}</h3>
              <ul className="included-list">
                {(t.raw(`services.${s}.includes`) as string[]).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <TextLink href={`/${l}/contact`}>{t("common.quote")}</TextLink>
            </div>
          </article>
        ))}
      </section>
      <Process />
      <CTA />
    </>
  );
}
function Process() {
  const t = useTranslations();
  return (
    <section className="process section-pad">
      <p className="eyebrow">FG / DESIGN</p>
      <h2>{t("process.title")}</h2>
      <div>
        {(t.raw("process.steps") as { title: string; text: string }[]).map(
          (s, i) => (
            <article key={s.title}>
              <span>0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
export function Collection({ type }: { type: "portfolio" | "shop" }) {
  const t = useTranslations();
  return (
    <>
      <PageIntro page={type} />
      <section className="section-pad catalog-section">
        <p className="notice">
          {t(type === "portfolio" ? "common.demoNote" : "common.shopNote")}
        </p>
        <Catalog type={type} />
        {type === "shop" && (
          <p className="currency-note">{t("common.currency")}</p>
        )}
      </section>
      <CTA />
    </>
  );
}
export function ProjectDetail({ id }: { id: string }) {
  const t = useTranslations();
  const l = useLocale();
  const p = projects.find((p) => p.id === id)!;
  return (
    <>
      <section className="detail-heading section-pad">
        <TextLink href={`/${l}/portfolio`}>{t("common.back")}</TextLink>
        <p className="eyebrow">{t(`categories.${p.category}`)}</p>
        <h1>{t(`projects.${id}.title`)}</h1>
        <p className="intro-copy">{t(`projects.${id}.short`)}</p>
        {p.demo && <span className="label">{t("common.demo")}</span>}
        {p.concept && <span className="label">{t("common.concept")}</span>}
      </section>
      <section className="project-detail section-pad">
        <Gallery
          media={p.media}
          art={p.art}
          title={t(`projects.${id}.title`)}
        />
        <div className="project-story">
          <div>
            <p className="eyebrow">{t("common.project")}</p>
            <h2>{t(`projects.${id}.short`)}</h2>
          </div>
          <div>
            <p>{t(`projects.${id}.description`)}</p>
            <dl>
              <dt>{t("common.year")}</dt>
              <dd>{p.year}</dd>
              <dt>{t("common.details")}</dt>
              <dd>{t(`categories.${p.category}`)}</dd>
            </dl>
          </div>
        </div>
      </section>
      <section className="section-pad related">
        <h2>{t("common.next")}</h2>
        <div className="project-grid">
          {projects
            .filter((x) => x.id !== id)
            .slice(0, 2)
            .map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
export function ProductDetail({ id }: { id: string }) {
  const t = useTranslations();
  const l = useLocale();
  const p = products.find((p) => p.id === id)!;
  const validUrl = /^https:\/\/(?:www\.)?payhip\.com\//.test(p.checkoutUrl);
  return (
    <>
      <div className="detail-back section-pad">
        <TextLink href={`/${l}/shop`}>{t("common.back")}</TextLink>
      </div>
      <section className="product-detail section-pad">
        <Gallery media={p.media} art={p.art} title={t(`products.${id}.name`)} />
        <div>
          <p className="eyebrow">{t(`categories.${p.category}`)}</p>
          <h1>{t(`products.${id}.name`)}</h1>
          <p className="body-large">{t(`products.${id}.short`)}</p>
          <p className="detail-price">
            {new Intl.NumberFormat(l, {
              style: "currency",
              currency: site.currency,
            }).format(p.price)}{" "}
            <small>AUD</small>
          </p>
          <p>{t(`products.${id}.description`)}</p>
          {validUrl ? (
            <a
              href={p.checkoutUrl}
              className="button dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("common.buy")} <Arrow />
            </a>
          ) : (
            <>
              <button className="button dark" disabled>
                {t("common.coming")}
              </button>
              <p className="muted">{t("common.notConfigured")}</p>
            </>
          )}
          <p className="checkout-note">{t("common.external")}</p>
          <div className="product-accordions">
            <details open>
              <summary>{t("common.included")}</summary>
              <ul className="included-list">
                {(t.raw(`products.${id}.features`) as string[]).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </details>
            {["formats", "compatibility", "instructions", "download"].map(
              (key) => (
                <details key={key}>
                  <summary>{t(`common.${key}`)}</summary>
                  <p>
                    {key === "formats"
                      ? p.formats.join(" · ")
                      : t(`products.${id}.${key}`)}
                  </p>
                </details>
              ),
            )}
          </div>
          <Link className="policy-link" href={`/${l}/refund`}>
            {t("nav.refund")} <Arrow />
          </Link>
        </div>
      </section>
      <section className="section-pad related">
        <h2>{t("common.next")}</h2>
        <div className="product-grid">
          {products
            .filter((x) => x.id !== id)
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
    </>
  );
}
export function Contact({ enabled }: { enabled: boolean }) {
  const t = useTranslations();
  return (
    <>
      <PageIntro page="contact" />
      <section className="contact-layout section-pad">
        <aside>
          <h2>{t("contact.elsewhere")}</h2>
          <p>{t("home.ctaText")}</p>
          {site.email ? (
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email} <Arrow />
            </a>
          ) : (
            <p className="muted">{t("common.noContact")}</p>
          )}
          {site.instagram && (
            <a
              className="text-link"
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("contact.instagram")} <Arrow />
            </a>
          )}
          <span className="contact-flower" aria-hidden="true">
            <Star />
          </span>
        </aside>
        <ContactForm
          enabled={enabled}
          uploadsEnabled={
            enabled && process.env.FORM_UPLOADS_ENABLED === "true"
          }
        />
      </section>
    </>
  );
}
export function FAQ() {
  const t = useTranslations();
  return (
    <>
      <PageIntro page="faq" />
      <section className="faq-section section-pad">
        {(t.raw("faq") as { q: string; a: string }[]).map((f, i) => (
          <details key={f.q}>
            <summary>
              <small>0{i + 1}</small>
              {f.q}
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
      <CTA />
    </>
  );
}
export function Legal({ type }: { type: string }) {
  const t = useTranslations();
  return (
    <article className="legal section-pad">
      <p className="eyebrow">{t("common.updated")}</p>
      <h1>{t(`legal.${type}.title`)}</h1>
      <p className="notice">{t("common.legalNote")}</p>
      <p className="body-large">{t(`legal.${type}.intro`)}</p>
      {(
        t.raw(`legal.${type}.sections`) as { title: string; text: string }[]
      ).map((s, i) => (
        <section key={s.title}>
          <h2>
            {i + 1}. {s.title}
          </h2>
          <p>{s.text}</p>
        </section>
      ))}
    </article>
  );
}
