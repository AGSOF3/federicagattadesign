"use client";
import { Arrow, Star } from "./icons";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Artwork } from "./artwork";
import { products, projects } from "@/data/content";
import { productCategories, projectCategories, site } from "@/data/site";
import type { Media, Product, Project } from "@/types/content";
export function ProjectCard({ project: p }: { project: Project }) {
  const t = useTranslations();
  const l = useLocale();
  return (
    <article className="project-card">
      <Link href={`/${l}/portfolio/${p.id}`} className="art-link">
        {p.media.find((m) => m.type === "image") ? (
          <Image
            src={p.media.find((m) => m.type === "image")!.src}
            width={1000}
            height={750}
            alt={t(`projects.${p.id}.title`)}
            className="cover-image"
          />
        ) : (
          <Artwork kind={p.art} />
        )}
        <span className="card-arrow" aria-hidden="true">
          <Arrow />
        </span>
        <span className="sr-only">{t("common.viewProject")}</span>
      </Link>
      <div className="card-info">
        <div>
          <h3>
            <Link href={`/${l}/portfolio/${p.id}`}>
              {t(`projects.${p.id}.title`)}
            </Link>
          </h3>
          <p>{t(`categories.${p.category}`)}</p>
        </div>
        <small>
          {p.demo ? t("common.demo") : p.concept ? t("common.concept") : p.year}
        </small>
      </div>
    </article>
  );
}
export function ProductCard({ product: p }: { product: Product }) {
  const t = useTranslations();
  const l = useLocale();
  return (
    <article className="product-card">
      <Link href={`/${l}/shop/${p.id}`} className="art-link">
        {p.media.find((m) => m.type === "image") ? (
          <Image
            src={p.media.find((m) => m.type === "image")!.src}
            width={800}
            height={800}
            alt={t(`products.${p.id}.name`)}
            className="cover-image"
          />
        ) : (
          <Artwork kind={p.art} />
        )}
        <span className="product-status">
          {t(p.checkoutUrl ? "common.viewProduct" : "common.coming")}
        </span>
        <span className="card-arrow" aria-hidden="true">
          <Arrow />
        </span>
      </Link>
      <div className="product-info">
        <small>{t(`categories.${p.category}`)}</small>
        <h3>
          <Link href={`/${l}/shop/${p.id}`}>{t(`products.${p.id}.name`)}</Link>
        </h3>
        <p>{t(`products.${p.id}.short`)}</p>
        <span className="price">
          {new Intl.NumberFormat(l, {
            style: "currency",
            currency: site.currency,
          }).format(p.price)}{" "}
          <small>AUD</small>
        </span>
      </div>
    </article>
  );
}
export function Catalog({ type }: { type: "portfolio" | "shop" }) {
  const t = useTranslations();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const categories = type === "shop" ? productCategories : projectCategories;
  const filteredProducts = products.filter(
    (p) =>
      (category === "all" || p.category === category) &&
      `${t(`products.${p.id}.name`)} ${t(`products.${p.id}.description`)}`
        .toLocaleLowerCase()
        .includes(search.toLocaleLowerCase()),
  );
  const filteredProjects = projects.filter(
    (p) => category === "all" || p.category === category,
  );
  return (
    <>
      <div className="catalog-tools">
        {type === "shop" && (
          <label className="search">
            <span>{t("common.search")}</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
            />
            <span aria-hidden="true">⌕</span>
          </label>
        )}
        <div className="filters" role="group" aria-label={t(`nav.${type}`)}>
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c === "all" && type === "shop"
                ? t("common.all")
                : t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="false">
        <div className={type === "shop" ? "product-grid" : "project-grid"}>
          {type === "shop"
            ? filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))
            : filteredProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
        </div>
        {(type === "shop" ? filteredProducts : filteredProjects).length ===
          0 && <p className="empty">{t("common.empty")}</p>}
      </div>
    </>
  );
}
export function Gallery({
  media,
  art,
  title,
}: {
  media: Media[];
  art: string;
  title: string;
}) {
  const t = useTranslations("common");
  const [index, setIndex] = useState(0);
  if (!media.length) return <Artwork kind={art} />;
  const m = media[index];
  return (
    <div className="gallery">
      <div className="gallery-main">
        {m.type === "video" ? (
          <video
            controls
            playsInline
            preload="metadata"
            poster={m.poster}
            key={m.src}
          >
            <source src={m.src} type="video/mp4" />
            {title}
          </video>
        ) : (
          <Image
            src={m.src}
            width={1200}
            height={1000}
            alt={`${title} — ${index + 1}`}
            priority
          />
        )}
      </div>
      {media.length > 1 && (
        <div className="gallery-controls">
          <button
            onClick={() => setIndex((index - 1 + media.length) % media.length)}
            aria-label={t("previous")}
          >
            ←
          </button>
          <span>
            {index + 1} / {media.length}
          </span>
          <button
            onClick={() => setIndex((index + 1) % media.length)}
            aria-label={t("nextImage")}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
