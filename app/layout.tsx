import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata = {
  title: "Routine",
  description: "Акции и рецепты — в одном месте",
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
    <html lang="ru">
      <body className={inter.className}>
        <Header email={user?.email ?? null} />
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
