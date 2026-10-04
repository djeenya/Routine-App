# Routine

Веб-приложение: акции магазинов Австрии → рецепты из купленных продуктов.

## Быстрый старт (в Cursor)

1. `npm install`
2. Скопируй `.env.example` → `.env.local`, заполни ключи Supabase и Anthropic
3. Создай проект на supabase.com, выполни `supabase/schema.sql` в SQL Editor
4. `npm run dev` → http://localhost:3000

## Что уже готово (скелет)

- `app/` — страницы: Дашборд, Акции, Рецепты (рабочая генерация через Claude API)
- `lib/supabase.ts` — клиенты Supabase (обычный + service role)
- `lib/generateRecipe.ts` — вызов Claude API с кэшированием по хэшу ингредиентов
- `app/api/generate-recipe/route.ts` — API роут для реактивного сценария "составь рецепт из того что купил"
- `supabase/schema.sql` — схема БД (sales, pantry_items, recipes, user_settings)
- `n8n/README.md` — план workflow для скрапинга акций и ежедневной рассылки

## Что дальше (по плану, Фаза 1)

- [ ] Определиться: wogibtswas.at vs marktguru.at
- [ ] Собрать n8n workflow `scrape-sales`, погонять несколько дней
- [ ] Подключить Supabase Auth (сейчас в recipes/page.tsx захардкожен TEMP_USER_ID)
- [ ] Добавить страницу настроек (время рассылки, канал уведомлений)

Полный поэтапный план — см. `plan-assistant-app.md` (отправлен отдельно ранее).
