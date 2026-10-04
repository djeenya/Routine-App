"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function mapAuthError(message: string) {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Неверный email или пароль";
  }
  if (text.includes("user already registered") || text.includes("already registered")) {
    return "Этот email уже занят";
  }
  if (text.includes("password should be") || text.includes("password is known")) {
    return "Пароль слишком короткий (минимум 6 символов)";
  }
  if (text.includes("unable to validate email") || text.includes("invalid email")) {
    return "Некорректный email";
  }
  if (text.includes("email not confirmed")) {
    return "Email ещё не подтверждён. Проверьте почту.";
  }
  return message;
}

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const supabase = createClient();

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(mapAuthError(signInError.message));
        setLoading(false);
        return;
      }
      router.push("/recipes");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(mapAuthError(signUpError.message));
      setLoading(false);
      return;
    }
    if (!data.session) {
      setInfo("Аккаунт создан. Проверьте почту, чтобы подтвердить email.");
      setLoading(false);
      return;
    }
    router.push("/recipes");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {mode === "signin" ? "Войти" : "Регистрация"}
      </h1>
      <p className="mb-6 text-text-secondary">
        {mode === "signin"
          ? "Войдите, чтобы составлять рецепты."
          : "Создайте аккаунт, чтобы сохранять рецепты."}
      </p>

      <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setInfo(null);
          }}
          className={`rounded-md py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "signin"
              ? "bg-accent text-background"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Войти
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setInfo(null);
          }}
          className={`rounded-md py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "signup"
              ? "bg-accent text-background"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          Зарегистрироваться
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent"
        />
        {error && (
          <p className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-red-400">
            {error}
          </p>
        )}
        {info && (
          <p className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-accent">
            {info}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-accent px-5 py-2.5 font-medium text-background transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Подождите..."
            : mode === "signin"
              ? "Войти"
              : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}
