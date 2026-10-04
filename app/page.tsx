"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {t("dashboard.title")}
      </h1>
      <p className="mb-8 text-text-secondary">{t("dashboard.subtitle")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-lg border border-border bg-surface p-6 transition-colors duration-200 hover:bg-surface-hover">
          <h2 className="mb-2 text-lg font-medium">
            {t("dashboard.dealsTitle")}
          </h2>
          <p className="text-sm text-text-secondary">
            {t("dashboard.dealsText")}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-surface p-6 transition-colors duration-200 hover:bg-surface-hover">
          <h2 className="mb-2 text-lg font-medium">
            {t("dashboard.recipeTitle")}
          </h2>
          <p className="text-sm text-text-secondary">
            {t("dashboard.recipeText")}
          </p>
        </article>
      </div>
    </div>
  );
}
