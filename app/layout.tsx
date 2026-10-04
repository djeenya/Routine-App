import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata = {
  title: "Routine",
  description: "Deals and recipes — all in one place",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <Header email={user?.email ?? null} />
          <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
