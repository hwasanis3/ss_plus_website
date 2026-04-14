import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

/* ─── Typography ─────────────────────────────────────────── */

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/* ─── SEO Metadata ───────────────────────────────────────── */

export const metadata: Metadata = {
  title: "SS PLUS | Industrial Safety & Fire Protection — Tunisia",
  description:
    "Since 2001, SS PLUS delivers certified fire-fighting systems, PPE, workplace safety, and signage solutions to businesses across Tunisia. Think Safety, Think Us.",
  keywords: [
    "industrial safety",
    "fire protection",
    "Tunisia",
    "SS PLUS",
    "PPE",
    "fire extinguisher",
    "safety consulting",
    "WAVE PLUS",
  ],
  openGraph: {
    title: "SS PLUS — Think Safety, Think Us",
    description:
      "Tunisia's trusted partner in industrial safety & fire protection since 2001.",
    type: "website",
    locale: "en_US",
  },
};

/* ─── Root Layout ────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
