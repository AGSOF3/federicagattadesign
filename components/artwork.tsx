import Image from "next/image";
import { site } from "@/data/site";
import { Arrow, Star } from "./icons";
import { useTranslations } from "next-intl";
export function Artwork({
  kind = "alma",
  className = "",
}: {
  kind?: string;
  className?: string;
}) {
  const t = useTranslations();
  const product = ["planner", "social", "weekly", "journal"].includes(kind);
  const title =
    kind === "planner"
      ? t("products.everyday-planner.name")
      : kind === "social"
        ? t("products.social-essentials.name")
        : kind === "weekly"
          ? t("products.weekly-printables.name")
          : t("products.quiet-journal.name");
  return (
    <div
      className={`artwork art-${kind} ${className}`}
      role="img"
      aria-label={`${t("common.preview")} — ${product ? title : kind === "alma" ? "Alma Studio" : kind === "casa" ? "Casa Botanica" : kind === "slow" ? "The Slow Edit" : kind === "notes" ? "Studio Notes" : "Forma Journal"}`}
    >
      {kind === "alma" ? (
        <>
          <div className="art-shadow" />
          <div className="alma-card card-back">
            <span>ALMA</span>
            <small>STUDIO</small>
            <div className="leaf-drawing">
              <Star />
            </div>
          </div>
          <div className="alma-card card-front">
            <span className="alma-word">
              alma<span>®</span>
            </span>
            <div className="alma-line" />
            <small>STUDIO</small>
          </div>
          <div className="art-caption">01 — ALMA STUDIO</div>
        </>
      ) : kind === "casa" ? (
        <>
          <div className="casa-sheet">
            <span>
              CASA
              <br />
              <i>botanica</i>
            </span>
            <div className="botanical">
              <Star />
            </div>
            <div className="menu-lines">
              <b />
              <b />
              <b />
              <b />
              <b />
            </div>
          </div>
          <div className="casa-small">c b</div>
        </>
      ) : kind === "slow" ? (
        <>
          <div className="social-tile slow-one">
            <span>
              the
              <br />
              <i>slow</i>
              <br />
              edit.
            </span>
            <small>01 / 03</small>
          </div>
          <div className="social-tile slow-two">
            <div className="arch-shape" />
            <span>
              less, but
              <br />
              <i>better.</i>
            </span>
          </div>
          <div className="social-tile slow-three">S / E</div>
        </>
      ) : kind === "notes" ? (
        <>
          <div className="notes-card">
            STUDIO
            <br />
            <i>notes.</i>
            <div className="rule" />
            <small>FG</small>
          </div>
          <div className="notes-small">S/N</div>
        </>
      ) : kind === "forma" ? (
        <>
          <div className="forma-cover">
            <span>FORMA</span>
            <div className="forma-shape" />
            <small>01 — JOURNAL</small>
          </div>
        </>
      ) : (
        <>
          <div className="planner-page">
            <div className="planner-heading">{title}</div>
            <div className="planner-rule" />
            <div className="planner-grid">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i}>
                  <span>0{i + 1}</span>
                  <b />
                  <b />
                  <b />
                </div>
              ))}
            </div>
            <span className="planner-brand">FG / DESIGN</span>
          </div>
          <div className="planner-cover">
            <small>FEDERICA GATTA DESIGN</small>
            <span>{title}</span>
            <div className="cover-flower">
              <Star />
            </div>
            <small>{t("common.made")}</small>
          </div>
        </>
      )}
    </div>
  );
}
export function Portrait() {
  const t = useTranslations("common");
  if (site.portrait)
    return (
      <Image
        className="studio-portrait"
        src={site.portrait}
        width={900}
        height={1100}
        alt={t("portraitAlt")}
      />
    );
  return (
    <div className="portrait-placeholder">
      <div className="portrait-arch">
        <svg viewBox="0 0 240 300" fill="none" aria-hidden="true">
          <path d="M30 290c5-58 30-87 90-87s90 29 90 87" fill="#8f7965" />
          <ellipse cx="120" cy="137" rx="48" ry="62" fill="#c8b7a2" />
          <path
            d="M67 151c-16-74 14-108 58-108 43 0 65 46 48 113l-14-60c-24 25-57 15-66 29L77 173Z"
            fill="#58483a"
          />
        </svg>
      </div>
      <span>{t("portrait")}</span>
      <small>{t("portraitNote")}</small>
    </div>
  );
}
