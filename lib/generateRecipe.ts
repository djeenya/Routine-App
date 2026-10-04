import crypto from "crypto";

type PantryProduct = {
  name: string;
};

type GeneratedRecipe = {
  title: string;
  description: string;
  servings: number;
  ingredients: { name: string; amount: string; have_it: boolean }[];
  steps: { title: string; instruction: string; time_minutes: number }[];
};

/**
 * Хэш набора ингредиентов — используется для кэширования рецептов в Supabase,
 * чтобы не платить за повторную генерацию одного и того же набора продуктов.
 */
export function hashIngredients(products: string[]): string {
  const normalized = products
    .map((p) => p.trim().toLowerCase())
    .sort()
    .join("|");
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

/**
 * Вызывает Claude API и просит строго JSON с рецептом.
 * strictMode = true -> только из того что есть (+соль/масло/вода/специи)
 * strictMode = false -> разрешить докупить 1-2 ингредиента
 */
export async function generateRecipe(
  products: PantryProduct[],
  strictMode: boolean = true
): Promise<GeneratedRecipe> {
  const productList = products.map((p) => p.name).join(", ");

  const systemPrompt = `Ты — шеф-повар. Отвечай СТРОГО в формате JSON, без пояснений, без markdown-обёртки (без \`\`\`json).`;

  const userPrompt = `У пользователя есть следующие продукты: ${productList}.
Составь 1 рецепт блюда, используя ${
    strictMode ? "ТОЛЬКО эти продукты (разрешается соль, масло, специи, вода)" : "максимум этих продуктов, можно докупить 1-2 недостающих ингредиента"
  }.
Ответь строго в формате JSON:
{
  "title": "string",
  "description": "string",
  "servings": number,
  "ingredients": [{"name": "string", "amount": "string", "have_it": boolean}],
  "steps": [{"title": "string", "instruction": "string", "time_minutes": number}]
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text;

  if (response.ok === false || !data.content || data.content.length === 0 || !text) {
    console.error("Anthropic API error:", JSON.stringify(data));
    throw new Error("Anthropic API error: " + JSON.stringify(data));
  }

  const clean = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean) as GeneratedRecipe;
  } catch (err) {
    throw new Error("Не удалось распарсить ответ модели: " + text);
  }
}
