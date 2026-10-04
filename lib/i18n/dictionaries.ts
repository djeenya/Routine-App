const en = {
  "language.label": "Language",

  "nav.dashboard": "Dashboard",
  "nav.sales": "Deals",
  "nav.recipes": "Recipes",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",

  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Overview: today's deals and the recipe of the day.",
  "dashboard.dealsTitle": "Today's deals",
  "dashboard.dealsText": "A selection of discounts by store will appear here.",
  "dashboard.recipeTitle": "Recipe of the day",
  "dashboard.recipeText":
    "A dish made from what you already have at home will appear here.",

  "sales.title": "Deals",
  "sales.subtitle": "Discounts from stores in Austria",
  "sales.searchPlaceholder": "Search by product name",
  "sales.storeLabel": "Store",
  "sales.categoryLabel": "Category",
  "sales.allStores": "All stores",
  "sales.allCategories": "All categories",
  "sales.apply": "Apply",
  "sales.sortByDiscount": "Sort by discount",
  "sales.reset": "Reset",
  "sales.noData": "No data yet — run the n8n scraper workflow.",
  "sales.notFoundTitle": "Nothing found",
  "sales.notFoundHint": "Try changing your search or resetting the filters.",

  "recipes.title": "Recipes",
  "recipes.subtitle":
    "What do you have? Separate with commas (e.g. chicken, rice, tomatoes)",
  "recipes.placeholder": "chicken, rice, tomatoes",
  "recipes.generate": "Generate recipe",
  "recipes.generating": "Generating...",
  "recipes.errorGeneric": "Could not generate a recipe",
  "recipes.errorUnauthorized": "Please sign in first",
  "recipes.ingredients": "Ingredients",
  "recipes.steps": "Steps",
  "recipes.toBuy": "to buy",
  "recipes.minutesShort": "min",

  "login.signInTitle": "Sign in",
  "login.signUpTitle": "Sign up",
  "login.signInSubtitle": "Sign in to generate recipes.",
  "login.signUpSubtitle": "Create an account to save recipes.",
  "login.tabSignIn": "Sign in",
  "login.tabSignUp": "Sign up",
  "login.emailPlaceholder": "Email",
  "login.passwordPlaceholder": "Password",
  "login.loading": "Please wait...",
  "login.submitSignIn": "Sign in",
  "login.submitSignUp": "Create account",
  "login.accountCreated":
    "Account created. Check your email to confirm your address.",
  "login.errorInvalidCredentials": "Incorrect email or password",
  "login.errorEmailTaken": "This email is already registered",
  "login.errorPasswordShort": "Password is too short (at least 6 characters)",
  "login.errorInvalidEmail": "Invalid email address",
  "login.errorEmailNotConfirmed":
    "Email not confirmed yet. Please check your inbox.",
} as const;

export type TranslationKey = keyof typeof en;
type Dictionary = Record<TranslationKey, string>;

const de: Dictionary = {
  "language.label": "Sprache",

  "nav.dashboard": "Dashboard",
  "nav.sales": "Angebote",
  "nav.recipes": "Rezepte",
  "nav.signIn": "Anmelden",
  "nav.signOut": "Abmelden",

  "dashboard.title": "Dashboard",
  "dashboard.subtitle": "Übersicht: heutige Angebote und Rezept des Tages.",
  "dashboard.dealsTitle": "Heutige Angebote",
  "dashboard.dealsText":
    "Hier erscheint eine Auswahl an Rabatten nach Geschäften.",
  "dashboard.recipeTitle": "Rezept des Tages",
  "dashboard.recipeText":
    "Hier erscheint ein Gericht aus dem, was du bereits zu Hause hast.",

  "sales.title": "Angebote",
  "sales.subtitle": "Rabatte österreichischer Geschäfte",
  "sales.searchPlaceholder": "Nach Produktname suchen",
  "sales.storeLabel": "Geschäft",
  "sales.categoryLabel": "Kategorie",
  "sales.allStores": "Alle Geschäfte",
  "sales.allCategories": "Alle Kategorien",
  "sales.apply": "Anwenden",
  "sales.sortByDiscount": "Nach Rabatt sortieren",
  "sales.reset": "Zurücksetzen",
  "sales.noData": "Noch keine Daten — starte den n8n-Scraper-Workflow.",
  "sales.notFoundTitle": "Nichts gefunden",
  "sales.notFoundHint":
    "Ändere die Suche oder setze die Filter zurück.",

  "recipes.title": "Rezepte",
  "recipes.subtitle":
    "Was hast du da? Durch Kommas getrennt (z. B. Hähnchen, Reis, Tomaten)",
  "recipes.placeholder": "Hähnchen, Reis, Tomaten",
  "recipes.generate": "Rezept erstellen",
  "recipes.generating": "Wird erstellt...",
  "recipes.errorGeneric": "Rezept konnte nicht erstellt werden",
  "recipes.errorUnauthorized": "Bitte melde dich zuerst an",
  "recipes.ingredients": "Zutaten",
  "recipes.steps": "Schritte",
  "recipes.toBuy": "kaufen",
  "recipes.minutesShort": "Min.",

  "login.signInTitle": "Anmelden",
  "login.signUpTitle": "Registrierung",
  "login.signInSubtitle": "Melde dich an, um Rezepte zu erstellen.",
  "login.signUpSubtitle": "Erstelle ein Konto, um Rezepte zu speichern.",
  "login.tabSignIn": "Anmelden",
  "login.tabSignUp": "Registrieren",
  "login.emailPlaceholder": "E-Mail",
  "login.passwordPlaceholder": "Passwort",
  "login.loading": "Bitte warten...",
  "login.submitSignIn": "Anmelden",
  "login.submitSignUp": "Konto erstellen",
  "login.accountCreated":
    "Konto erstellt. Prüfe dein Postfach, um die E-Mail-Adresse zu bestätigen.",
  "login.errorInvalidCredentials": "Falsche E-Mail oder falsches Passwort",
  "login.errorEmailTaken": "Diese E-Mail-Adresse ist bereits registriert",
  "login.errorPasswordShort": "Passwort ist zu kurz (mindestens 6 Zeichen)",
  "login.errorInvalidEmail": "Ungültige E-Mail-Adresse",
  "login.errorEmailNotConfirmed":
    "E-Mail noch nicht bestätigt. Bitte prüfe dein Postfach.",
};

const ru: Dictionary = {
  "language.label": "Язык",

  "nav.dashboard": "Дашборд",
  "nav.sales": "Акции",
  "nav.recipes": "Рецепты",
  "nav.signIn": "Войти",
  "nav.signOut": "Выйти",

  "dashboard.title": "Дашборд",
  "dashboard.subtitle": "Сводка: сегодняшние акции и рецепт дня.",
  "dashboard.dealsTitle": "Сегодняшние акции",
  "dashboard.dealsText": "Здесь появится подборка скидок по магазинам.",
  "dashboard.recipeTitle": "Рецепт дня",
  "dashboard.recipeText":
    "Здесь появится блюдо из того, что уже есть дома.",

  "sales.title": "Акции",
  "sales.subtitle": "Скидки магазинов Австрии",
  "sales.searchPlaceholder": "Поиск по названию товара",
  "sales.storeLabel": "Магазин",
  "sales.categoryLabel": "Категория",
  "sales.allStores": "Все магазины",
  "sales.allCategories": "Все категории",
  "sales.apply": "Применить",
  "sales.sortByDiscount": "Сортировать по скидке",
  "sales.reset": "Сбросить",
  "sales.noData": "Пока нет данных — запусти n8n workflow скрапера.",
  "sales.notFoundTitle": "Ничего не найдено",
  "sales.notFoundHint": "Попробуй изменить запрос или сбросить фильтры.",

  "recipes.title": "Рецепты",
  "recipes.subtitle":
    "Что у тебя есть? Через запятую (например: курица, рис, помидоры)",
  "recipes.placeholder": "курица, рис, помидоры",
  "recipes.generate": "Составить рецепт",
  "recipes.generating": "Генерирую...",
  "recipes.errorGeneric": "Не удалось составить рецепт",
  "recipes.errorUnauthorized": "Сначала войдите в аккаунт",
  "recipes.ingredients": "Ингредиенты",
  "recipes.steps": "Шаги",
  "recipes.toBuy": "докупить",
  "recipes.minutesShort": "мин",

  "login.signInTitle": "Войти",
  "login.signUpTitle": "Регистрация",
  "login.signInSubtitle": "Войдите, чтобы составлять рецепты.",
  "login.signUpSubtitle": "Создайте аккаунт, чтобы сохранять рецепты.",
  "login.tabSignIn": "Войти",
  "login.tabSignUp": "Зарегистрироваться",
  "login.emailPlaceholder": "Email",
  "login.passwordPlaceholder": "Пароль",
  "login.loading": "Подождите...",
  "login.submitSignIn": "Войти",
  "login.submitSignUp": "Создать аккаунт",
  "login.accountCreated":
    "Аккаунт создан. Проверьте почту, чтобы подтвердить email.",
  "login.errorInvalidCredentials": "Неверный email или пароль",
  "login.errorEmailTaken": "Этот email уже занят",
  "login.errorPasswordShort": "Пароль слишком короткий (минимум 6 символов)",
  "login.errorInvalidEmail": "Некорректный email",
  "login.errorEmailNotConfirmed":
    "Email ещё не подтверждён. Проверьте почту.",
};

export const dictionaries = { en, de, ru } as const;

export type Locale = keyof typeof dictionaries;

export const LOCALES: readonly Locale[] = ["en", "de", "ru"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "routine-locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && value in dictionaries;
}
