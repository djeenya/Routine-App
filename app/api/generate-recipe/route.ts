import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { generateRecipe, hashIngredients } from "@/lib/generateRecipe";

// POST { products: string[], strictMode?: boolean }
export async function POST(req: NextRequest) {
  try {
    const authClient = createClient();
    const {
      data: { user },
    } = await authClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
    }

    const { products, strictMode = true } = await req.json();

    if (!products?.length) {
      return NextResponse.json(
        { error: "products обязательны" },
        { status: 400 }
      );
    }

    const userId = user.id;
    const supabase = getServiceSupabase();
    const ingredientsHash = hashIngredients(products);

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
      strictMode
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
