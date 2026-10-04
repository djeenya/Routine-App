"use client";

import { LOCALES } from "@/lib/i18n/dictionaries";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("language.label")}
      className="flex items-center rounded-lg border border-border bg-surface p-0.5"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={`rounded-md px-2 py-1 text-xs font-semibold uppercase transition-colors duration-200 ${
              active
                ? "bg-accent text-background"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
