import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { generateRecipe, hashIngredients } from "@/lib/generateRecipe";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/dictionaries";

// POST { products: string[], strictMode?: boolean, language?: 'en' | 'de' | 'ru' }
export async function POST(req: NextRequest) {
  try {
    const authClient = createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    const body = await req.json();
    const { products, strictMode = true } = body;
    const language: Locale = isLocale(body.language)
      ? body.language
      : DEFAULT_LOCALE;

    if (!products?.length) {
      return NextResponse.json(
        { error: "products обязательны" },
        { status: 400 }
      );
    }

    const userId = user.id;
    const supabase = getServiceSupabase();
    const ingredientsHash = hashIngredients(products, language);

    // 1. Проверяем кэш — вдруг такой набор продуктов уже кто-то генерировал
    const { data: cached } = await supabase
      .from("recipes")
      .select("*")
      .eq("ingredients_hash", ingredientsHash)
      .limit(1)
      .maybeSingle();

    if (cached) {
      return NextResponse.json({ recipe: cached, cached: true });
    }

    // 2. Генерируем через Claude API
    const recipe = await generateRecipe(
      products.map((name: string) => ({ name })),
      strictMode,
      language
    );

    // 3. Сохраняем в БД для будущего кэша
    const { data: saved, error } = await supabase
      .from("recipes")
      .insert({
        user_id: userId,
        ingredients_hash: ingredientsHash,
        title: recipe.title,
        description: recipe.description,
        servings: recipe.servings,
        ingredients_json: recipe.ingredients,
        steps_json: recipe.steps,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ recipe: saved, cached: false });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
