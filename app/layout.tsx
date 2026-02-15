import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { MainNav } from "@/components/main-nav";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Hand and Foot — Score Keeper",
  description: "Keep score for Hand and Foot card games. Create games, track rounds, and view standings.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <MainNav
              rightSlot={
                <>
                  <Suspense>
                    <AuthButton />
                  </Suspense>
                  <ThemeSwitcher />
                </>
              }
            />
            <div className="flex-1">{children}</div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
