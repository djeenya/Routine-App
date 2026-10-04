"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import type { TranslationKey } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/client";

const links: { href: string; labelKey: TranslationKey }[] = [
  { href: "/", labelKey: "nav.dashboard" },
  { href: "/sales", labelKey: "nav.sales" },
  { href: "/recipes", labelKey: "nav.recipes" },
];

export default function Header({ email }: { email: string | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary">
          Routine
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`border-b-2 pb-0.5 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            );
          })}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <LanguageSwitcher />
            {email ? (
              <>
                <span className="max-w-[180px] truncate text-sm text-text-secondary">
                  {email}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary transition-colors duration-200 hover:bg-surface-hover"
                >
                  {t("nav.signOut")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  pathname === "/login"
                    ? "bg-accent text-background"
                    : "bg-accent text-background hover:bg-accent-hover"
                }`}
              >
                {t("nav.signIn")}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
