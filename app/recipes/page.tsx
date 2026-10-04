import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RecipesForm from "@/components/RecipesForm";

export default async function RecipesPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <RecipesForm />;
}
