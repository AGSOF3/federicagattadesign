"use client";
import { Arrow, Star } from "./icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { locales, localeNames } from "@/lib/locales";
import { site, navigation } from "@/data/site";
export function Logo() {
  return (
    <span className="wordmark">
      {site.logo ? (
        <img src={site.logo} alt={site.name} />
      ) : (
        <span className="monogram">
          F<span>G</span>
        </span>
      )}
      <span>
        FEDERICA GATTA<small>DESIGN</small>
      </span>
    </span>
  );
}
export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open]);
  return (
    <>
      <a className="skip" href="#main">
        {t("common.skip")}
      </a>
      <header className="site-header">
        <Link className="logo-link" href={`/${locale}`} aria-label={site.name}>
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label={t("footer.explore")}>
          {navigation.map((key) => (
            <Link
              aria-current={
                pathname === `/${locale}${key === "home" ? "" : "/" + key}`
                  ? "page"
                  : undefined
              }
              key={key}
              href={`/${locale}${key === "home" ? "" : "/" + key}`}
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <div className="languages" aria-label={t("common.language")}>
            {locales.map((lang) => (
              <a
                key={lang}
                href={`/${lang}${pathname.split("/").slice(2).length ? "/" + pathname.split("/").slice(2).join("/") : ""}`}
                aria-label={localeNames[lang]}
                lang={lang}
                aria-current={lang === locale ? "true" : undefined}
              >
                {lang.toUpperCase()}
              </a>
            ))}
          </div>
          <button
            ref={button}
            className={`menu-toggle ${open ? "is-open" : ""}`}
            aria-label={t(open ? "common.close" : "common.menu")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
          </button>
        </div>
        <nav
          id="mobile-nav"
          className="mobile-nav"
          hidden={!open}
          aria-label={t("common.menu")}
        >
          {navigation.map((key, i) => (
            <Link
              key={key}
              href={`/${locale}${key === "home" ? "" : "/" + key}`}
            >
              <small>0{i + 1}</small>
              {t(`nav.${key}`)}
              <span>
                <Arrow />
              </span>
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div>
          <Link href={`/${locale}`}>
            <Logo />
          </Link>
          <p>{t("footer.tagline")}</p>
          <span className="availability">
            <i />
            {t("common.availability")}
          </span>
        </div>
        <div>
          <small>{t("footer.explore")}</small>
          {navigation.slice(1).map((k) => (
            <Link key={k} href={`/${locale}/${k}`}>
              {t(`nav.${k}`)}
            </Link>
          ))}
        </div>
        <div>
          <small>{t("footer.information")}</small>
          {["faq", "privacy", "terms", "refund"].map((k) => (
            <Link key={k} href={`/${locale}/${k}`}>
              {t(`nav.${k}`)}
            </Link>
          ))}
        </div>
        <div>
          <small>{t("footer.social")}</small>
          {site.email ? (
            <a href={`mailto:${site.email}`}>{site.email}</a>
          ) : (
            <p className="muted">{t("common.noContact")}</p>
          )}
          {site.instagram && (
            <a href={site.instagram} target="_blank" rel="noopener noreferrer">
              Instagram <Arrow />
            </a>
          )}
          {site.otherSocial.map((s) => (
            <a
              href={s.url}
              key={s.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.name} <Arrow />
            </a>
          ))}
          <Link className="footer-connect" href={`/${locale}/contact`}>
            {t("footer.contact")} <Arrow />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name}. {t("common.rights")}
        </span>
        <span>{t("common.made")}</span>
      </div>
    </footer>
  );
}
