import { createClient } from "@supabase/supabase-js";

// Клиент с service role — только для серверных API-роутов (n8n webhook, cron)
// НИКОГДА не импортировать в клиентский компонент
export function getServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
