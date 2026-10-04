# n8n workflows

## 1. `scrape-sales` (Фаза 1)
Cron (раз в день, например 6:00) →
HTTP Request / Playwright node на wogibtswas.at или marktguru.at →
Function node (нормализация данных: сеть, товар, цена, категория) →
Supabase node (insert в таблицу `sales`)

## 2. `daily-recipe-push` (Фаза 2, проактивный режим)
Cron (время из `user_settings.daily_recipe_time`, по каждому юзеру) →
Supabase node (взять топ акции дня + продукты юзера) →
HTTP Request → POST на `/api/generate-recipe` (Next.js API роут) →
Email/Telegram node (отправка результата юзеру)

---

Собери сначала `scrape-sales` и прогони его несколько дней вручную,
проверь что данные приходят стабильно, прежде чем подключать рассылку.
