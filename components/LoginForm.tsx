"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";

type FormError = { key: TranslationKey } | { raw: string };

function mapAuthError(message: string): FormError {
  const text = message.toLowerCase();
  if (text.includes("invalid login credentials")) {
    return { key: "login.errorInvalidCredentials" };
  }
  if (text.includes("user already registered") || text.includes("already registered")) {
    return { key: "login.errorEmailTaken" };
  }
  if (text.includes("password should be") || text.includes("password is known")) {
    return { key: "login.errorPasswordShort" };
  }
  if (text.includes("unable to validate email") || text.includes("invalid email")) {
    return { key: "login.errorInvalidEmail" };
  }
  if (text.includes("email not confirmed")) {
    return { key: "login.errorEmailNotConfirmed" };
  }
  return { raw: message };
}

export default function LoginForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<FormError | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAccountCreated(false);
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
      setAccountCreated(true);
      setLoading(false);
      return;
    }
    router.push("/recipes");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {mode === "signin" ? t("login.signInTitle") : t("login.signUpTitle")}
      </h1>
      <p className="mb-6 text-text-secondary">
        {mode === "signin"
          ? t("login.signInSubtitle")
          : t("login.signUpSubtitle")}
      </p>

      <div className="mb-6 grid grid-cols-2 rounded-lg border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setAccountCreated(false);
          }}
          className={`rounded-md py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "signin"
              ? "bg-accent text-background"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t("login.tabSignIn")}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setAccountCreated(false);
          }}
          className={`rounded-md py-2 text-sm font-medium transition-colors duration-200 ${
            mode === "signup"
              ? "bg-accent text-background"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {t("login.tabSignUp")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("login.emailPlaceholder")}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent"
        />
        <input
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("login.passwordPlaceholder")}
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary outline-none transition-colors duration-200 placeholder:text-text-secondary focus:border-accent"
        />
        {error && (
          <p className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-red-400">
            {"key" in error ? t(error.key) : error.raw}
          </p>
        )}
        {accountCreated && (
          <p className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-accent">
            {t("login.accountCreated")}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-accent px-5 py-2.5 font-medium text-background transition-colors duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? t("login.loading")
            : mode === "signin"
              ? t("login.submitSignIn")
              : t("login.submitSignUp")}
        </button>
      </form>
    </div>
  );
}
