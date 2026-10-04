import { getServiceSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const supabase = getServiceSupabase();
  const { data: sales } = await supabase
    .from("sales")
    .select("*")
    .order("scraped_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Акции</h1>
      <p className="mb-8 text-text-secondary">Скидки магазинов Австрии</p>

      {!sales?.length && (
        <p className="rounded-lg border border-border bg-surface p-6 text-text-secondary">
          Пока нет данных — запусти n8n workflow скрапера.
        </p>
      )}

      {!!sales?.length && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {sales.map((item) => {
            const hasDiscount =
              item.discount_price != null &&
              item.price != null &&
              Number(item.discount_price) !== Number(item.price);
            const currentPrice = item.discount_price ?? item.price;

            return (
              <li
                key={item.id}
                className="rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:bg-surface-hover"
              >
                <p className="text-xs text-text-secondary">{item.store_name}</p>
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
