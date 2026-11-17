"use client";
import { Arrow, Star } from "./icons";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/data/content";
export function ContactForm({
  enabled,
  uploadsEnabled,
}: {
  enabled: boolean;
  uploadsEnabled: boolean;
}) {
  const t = useTranslations();
  const l = useLocale();
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!enabled) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const file = data.get("reference") as File;
    if (
      file?.size &&
      (file.size > 3 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type))
    ) {
      setState("invalidFile");
      return;
    }
    setBusy(true);
    setState("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: data,
      });
      if (!response.ok) throw new Error();
      setState("success");
      form.reset();
    } catch {
      setState("error");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      {!enabled && (
        <p className="notice" id="form-status">
          {t("contact.disabled")}
        </p>
      )}
      <div className="form-grid">
        <label>
          {t("contact.name")} *
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          {t("contact.email")} *
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          {t("contact.business")}
          <input name="business" autoComplete="organization" maxLength={180} />
        </label>
        <label>
          {t("contact.service")} *
          <select name="service" defaultValue="" required>
            <option value="" disabled>
              {t("contact.select")}
            </option>
            {services.map((s) => (
              <option value={s} key={s}>
                {t(`services.${s}.name`)}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          {t("contact.description")} *
          <textarea
            name="description"
            rows={5}
            required
            minLength={20}
            maxLength={10000}
          />
        </label>
        <label>
          {t("contact.budget")}
          <input name="budget" maxLength={120} />
        </label>
        <label>
          {t("contact.deadline")}
          <input name="deadline" type="date" />
        </label>
        <label className="full">
          {t("contact.file")}
          <input
            name="reference"
            type="file"
            disabled={!uploadsEnabled}
            accept="image/jpeg,image/png,image/webp"
            aria-describedby="file-hint"
          />
          <small id="file-hint">
            {t(uploadsEnabled ? "contact.fileHint" : "contact.fileDisabled")}
          </small>
        </label>
        <label className="honeypot" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <p className="form-privacy">
        <Link href={`/${l}/privacy`}>{t("contact.privacy")}</Link>
      </p>
      <button
        className="button dark"
        type="submit"
        disabled={!enabled || busy}
        aria-describedby={!enabled ? "form-status" : undefined}
      >
        {t(busy ? "contact.sending" : "contact.submit")}
        <span aria-hidden="true">
          <Arrow />
        </span>
      </button>
      <p
        role="status"
        className={state === "success" ? "success" : "form-error"}
      >
        {state && t(`contact.${state}`)}
      </p>
    </form>
  );
}
