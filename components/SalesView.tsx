"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export type SaleItem = {
  id: string;
  store_name: string;
  product_name: string;
  price: number | string | null;
  discount_price: number | string | null;
  unit: string | null;
};

type Props = {
  sales: SaleItem[];
  stores: string[];
  categories: string[];
  q: string;
  store: string;
  category: string;
  sortByDiscount: boolean;
  hasFilters: boolean;
};

function discountPercent(item: SaleItem) {
  if (item.price == null || item.discount_price == null) return null;
  const price = Number(item.price);
  const discountPrice = Number(item.discount_price);
  if (!(price > 0) || !(discountPrice < price)) return null;
  const percent = Math.round((1 - discountPrice / price) * 100);
  return percent > 0 ? percent : null;
}

const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent";

export default function SalesView({
  sales,
  stores,
  categories,
  q,
  store,
  category,
  sortByDiscount,
  hasFilters,
}: Props) {
  const { t } = useTranslation();
  const showFilters = stores.length > 0 || hasFilters;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {t("sales.title")}
      </h1>
      <p className="mb-8 text-text-secondary">{t("sales.subtitle")}</p>

      {showFilters && (
        <form
          method="get"
          action="/sales"
          className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]"
        >
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t("sales.searchPlaceholder")}
            aria-label={t("sales.searchPlaceholder")}
            className={fieldClass}
          />
          <select
            name="store"
            defaultValue={store}
            aria-label={t("sales.storeLabel")}
            className={fieldClass}
          >
            <option value="">{t("sales.allStores")}</option>
            {store && !stores.includes(store) && (
              <option value={store}>{store}</option>
            )}
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            name="category"
            defaultValue={category}
            aria-label={t("sales.categoryLabel")}
            className={fieldClass}
          >
            <option value="">{t("sales.allCategories")}</option>
            {category && !categories.includes(category) && (
              <option value={category}>{category}</option>
            )}
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap items-center gap-3 sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              name="sort"
              value={sortByDiscount ? "discount" : ""}
              className="rounded-lg bg-accent px-5 py-2.5 font-medium text-background transition-colors duration-200 hover:bg-accent-hover"
            >
              {t("sales.apply")}
            </button>
            <button
              type="submit"
              name="sort"
              value={sortByDiscount ? "" : "discount"}
              aria-pressed={sortByDiscount}
              className={
                sortByDiscount
                  ? "rounded-lg border border-accent bg-accent/15 px-5 py-2.5 font-medium text-accent transition-colors duration-200 hover:bg-accent/25"
                  : "rounded-lg border border-border bg-surface px-5 py-2.5 font-medium text-text-primary transition-colors duration-200 hover:bg-surface-hover"
              }
            >
              {t("sales.sortByDiscount")}
            </button>
            {hasFilters && (
              <Link
                href="/sales"
                className="text-sm text-text-secondary transition-colors duration-200 hover:text-accent"
              >
                {t("sales.reset")}
              </Link>
            )}
          </div>
        </form>
      )}

      {!sales.length && !hasFilters && (
        <p className="rounded-lg border border-border bg-surface p-6 text-text-secondary">
          {t("sales.noData")}
        </p>
      )}

      {!sales.length && hasFilters && (
        <div className="rounded-lg border border-border bg-surface p-8 text-center">
          <p className="text-lg font-medium">{t("sales.notFoundTitle")}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {t("sales.notFoundHint")}
          </p>
        </div>
      )}

      {!!sales.length && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sales.map((item) => {
            const hasDiscount =
              item.discount_price != null &&
              item.price != null &&
              Number(item.discount_price) !== Number(item.price);
            const currentPrice = item.discount_price ?? item.price;
            const percent = discountPercent(item);

            return (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:bg-surface-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-text-secondary">
                    {item.store_name}
                  </p>
                  {percent != null && (
                    <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      -{percent}%
                    </span>
                  )}
                </div>
                <h2 className="mt-1 text-lg font-medium leading-snug">
                  {item.product_name}
                </h2>
                <div className="mt-3 flex flex-wrap items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-text-secondary line-through">
                      {item.price} €
                    </span>
                  )}
                  {currentPrice != null && (
                    <span className="font-bold text-accent">
                      {currentPrice} €
                    </span>
                  )}
                  {item.unit && (
                    <span className="text-sm text-text-secondary">
                      / {item.unit}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
