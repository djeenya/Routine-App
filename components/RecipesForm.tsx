"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/dictionaries";

type FormError = { key: TranslationKey } | { raw: string };

export default function RecipesForm() {
  const { t, locale } = useTranslation();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<FormError | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    const products = input
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products,
        strictMode: true,
        language: locale,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) {
        setError({ key: "recipes.errorUnauthorized" });
      } else if (data.error) {
        setError({ raw: String(data.error) });
      } else {
        setError({ key: "recipes.errorGeneric" });
      }
      setLoading(false);
      return;
    }
    setRecipe(data.recipe);
    setLoading(false);
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {t("recipes.title")}
      </h1>
      <p className="mb-6 text-text-secondary">{t("recipes.subtitle")}</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("recipes.placeholder")}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="shrink-0 rounded-lg bg-accent px-5 py-2.5 font-medium text-background transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("recipes.generating") : t("recipes.generate")}
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-red-400">
          {"key" in error ? t(error.key) : error.raw}
        </p>
      )}

      {recipe && (
        <article className="mt-8 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xl font-semibold">{recipe.title}</h2>
          {recipe.description && (
            <p className="mt-2 text-text-secondary">{recipe.description}</p>
          )}

          <h3 className="mt-6 mb-3 text-sm font-medium uppercase tracking-wide text-text-secondary">
            {t("recipes.ingredients")}
          </h3>
          <ul className="space-y-2">
            {recipe.ingredients_json?.map((ing: any, i: number) => (
              <li key={i} className="flex justify-between gap-4 text-sm">
                <span>{ing.name}</span>
                <span className="text-text-secondary">
                  {ing.amount}
                  {!ing.have_it && ` · ${t("recipes.toBuy")}`}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 mb-3 text-sm font-medium uppercase tracking-wide text-text-secondary">
            {t("recipes.steps")}
          </h3>
          <ol className="space-y-4">
            {recipe.steps_json?.map((step: any, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {step.instruction}
                    {step.time_minutes != null &&
                      ` (~${step.time_minutes} ${t("recipes.minutesShort")})`}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </article>
      )}
    </div>
  );
}
