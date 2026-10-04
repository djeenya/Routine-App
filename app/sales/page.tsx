import SalesView, { type SaleItem } from "@/components/SalesView";
import { getServiceSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
const SORT_POOL_SIZE = 1000;

type SearchParams = {
  q?: string | string[];
  store?: string | string[];
  category?: string | string[];
  sort?: string | string[];
};

function firstValue(value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return (v ?? "").trim();
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}

function uniqueSorted(values: (string | null)[] | undefined): string[] {
  return Array.from(
    new Set((values ?? []).filter((v): v is string => !!v && v.trim() !== ""))
  ).sort((a, b) => a.localeCompare(b));
}

function discountAmount(item: SaleItem) {
  if (item.price == null || item.discount_price == null) return -Infinity;
  return Number(item.price) - Number(item.discount_price);
}

export default async function SalesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = firstValue(searchParams.q);
  const store = firstValue(searchParams.store);
  const category = firstValue(searchParams.category);
  const sortByDiscount = firstValue(searchParams.sort) === "discount";
  const hasFilters = !!(q || store || category || sortByDiscount);

  const supabase = getServiceSupabase();

  let query = supabase.from("sales").select("*");
  if (q) query = query.ilike("product_name", `%${escapeLike(q)}%`);
  if (store) query = query.eq("store_name", store);
  if (category) query = query.eq("category", category);
  query = query
    .order("scraped_at", { ascending: false })
    .limit(sortByDiscount ? SORT_POOL_SIZE : PAGE_SIZE);

  const [{ data: rows }, { data: storeRows }, { data: categoryRows }] =
    await Promise.all([
      query,
      supabase.from("sales").select("store_name"),
      supabase.from("sales").select("category"),
    ]);

  const stores = uniqueSorted(storeRows?.map((r) => r.store_name));
  const categories = uniqueSorted(categoryRows?.map((r) => r.category));

  const items = (rows ?? []) as SaleItem[];
  const sales = sortByDiscount
    ? [...items]
        .sort((a, b) => discountAmount(b) - discountAmount(a))
        .slice(0, PAGE_SIZE)
    : items;

  return (
    <SalesView
      sales={sales}
      stores={stores}
      categories={categories}
      q={q}
      store={store}
      category={category}
      sortByDiscount={sortByDiscount}
      hasFilters={hasFilters}
    />
  );
}
