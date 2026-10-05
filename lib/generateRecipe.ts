import crypto from "crypto";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/dictionaries";

export type RecipeLanguage = Locale;

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
 * Язык входит в хэш: один и тот же набор продуктов на разных языках — разные рецепты.
 */
export function hashIngredients(
  products: string[],
  language: RecipeLanguage = DEFAULT_LOCALE
): string {
  const normalized = products
    .map((p) => p.trim().toLowerCase())
    .sort()
    .join("|");
  return crypto
    .createHash("sha256")
    .update(`${language}::${normalized}`)
    .digest("hex");
}

type PromptTexts = {
  system: string;
  user: (productList: string, strictMode: boolean) => string;
};

const JSON_SCHEMA = `{
  "title": "string",
  "description": "string",
  "servings": number,
  "ingredients": [{"name": "string", "amount": "string", "have_it": boolean}],
  "steps": [{"title": "string", "instruction": "string", "time_minutes": number}]
}`;

const PROMPTS: Record<RecipeLanguage, PromptTexts> = {
  en: {
    system:
      "You are a professional chef. Respond STRICTLY in JSON format, with no explanations and no markdown wrapper (no ```json). Write every text value (title, description, ingredient names and amounts, step titles and instructions) in English.",
    user: (productList, strictMode) => `The user has the following products: ${productList}.
Create 1 dish recipe using ${
      strictMode
        ? "ONLY these products (salt, oil, spices and water are allowed)"
        : "as many of these products as possible; you may add 1-2 missing ingredients"
    }.
Write all text values in English.
Respond strictly in this JSON format:
${JSON_SCHEMA}`,
  },
  de: {
    system:
      "Du bist ein professioneller Koch. Antworte STRENG im JSON-Format, ohne Erklärungen und ohne Markdown-Umrahmung (ohne ```json). Schreibe alle Textwerte (Titel, Beschreibung, Namen und Mengen der Zutaten, Titel und Anweisungen der Schritte) auf Deutsch.",
    user: (productList, strictMode) => `Der Benutzer hat folgende Produkte: ${productList}.
Erstelle 1 Rezept für ein Gericht und verwende ${
      strictMode
        ? "NUR diese Produkte (Salz, Öl, Gewürze und Wasser sind erlaubt)"
        : "möglichst viele dieser Produkte; 1-2 fehlende Zutaten dürfen dazugekauft werden"
    }.
Schreibe alle Textwerte auf Deutsch.
Antworte streng in diesem JSON-Format:
${JSON_SCHEMA}`,
  },
  ru: {
    system:
      "Ты — шеф-повар. Отвечай СТРОГО в формате JSON, без пояснений, без markdown-обёртки (без ```json). Все текстовые значения (название, описание, названия и количества ингредиентов, заголовки и инструкции шагов) пиши на русском языке.",
    user: (productList, strictMode) => `У пользователя есть следующие продукты: ${productList}.
Составь 1 рецепт блюда, используя ${
      strictMode
        ? "ТОЛЬКО эти продукты (разрешается соль, масло, специи, вода)"
        : "максимум этих продуктов, можно докупить 1-2 недостающих ингредиента"
    }.
Все текстовые значения пиши на русском языке.
Ответь строго в формате JSON:
${JSON_SCHEMA}`,
  },
};

/**
 * Вызывает Claude API и просит строго JSON с рецептом.
 * strictMode = true -> только из того что есть (+соль/масло/вода/специи)
 * strictMode = false -> разрешить докупить 1-2 ингредиента
 */
export async function generateRecipe(
  products: PantryProduct[],
  strictMode: boolean = true,
  language: RecipeLanguage = DEFAULT_LOCALE
): Promise<GeneratedRecipe> {
  const productList = products.map((p) => p.name).join(", ");

  const prompts = PROMPTS[language] ?? PROMPTS[DEFAULT_LOCALE];
  const systemPrompt = prompts.system;
  const userPrompt = prompts.user(productList, strictMode);

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
