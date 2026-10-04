-- ============================================
-- Schema: personal-assistant-app
-- Запусти это в Supabase SQL Editor
-- ============================================

-- Акции, собранные скрапером (n8n)
create table if not exists sales (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  product_name text not null,
  price numeric,
  discount_price numeric,
  unit text,
  category text,
  valid_from date,
  valid_to date,
  source_url text,
  scraped_at timestamptz default now()
);

-- Что юзер отметил как "купил" или "есть дома"
create table if not exists pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_name text not null,
  quantity text,
  source text check (source in ('sale', 'manual')) default 'manual',
  added_at timestamptz default now()
);

-- Сгенерированные рецепты (кэш по хэшу набора ингредиентов)
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  ingredients_hash text,
  title text not null,
  description text,
  servings int default 2,
  ingredients_json jsonb,
  steps_json jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_recipes_hash on recipes(ingredients_hash);

-- Настройки рассылки
create table if not exists user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_recipe_time time default '08:00',
  notification_channel text check (notification_channel in ('email', 'telegram', 'push')) default 'email',
  timezone text default 'Europe/Vienna'
);

-- Row Level Security (включить, когда появится мультиюзер)
alter table pantry_items enable row level security;
alter table recipes enable row level security;
alter table user_settings enable row level security;

create policy "Users manage own pantry" on pantry_items
  for all using (auth.uid() = user_id);
create policy "Users manage own recipes" on recipes
  for all using (auth.uid() = user_id);
create policy "Users manage own settings" on user_settings
  for all using (auth.uid() = user_id);
