import ThemeProvider from "@/components/providers/ThemeProvider";

/* ─── Portal Demo Layout ─────────────────────────────── */
/* Standalone layout that strips the corporate Navbar/Footer
   and provides a clean SaaS application shell. */

export const metadata = {
  title: "WAVE PLUS Portal Demo | SS PLUS",
  description:
    "Experience the WAVE PLUS client portal — your industrial safety management platform by SS PLUS.",
};

export default function PortalDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {/* Override the root layout's Navbar/Footer by providing
          our own wrapper that fills the viewport */}
      <div className="portal-layout-root fixed inset-0 z-[200] bg-[var(--portal-bg)]">
        {children}
      </div>
    </ThemeProvider>
  );
}
