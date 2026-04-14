import { setRequestLocale } from "next-intl/server";
import PortalDemoClient from "./PortalDemoClient";

/* ─── Portal Demo Page ────────────────────────────────── */

interface PortalDemoPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortalDemoPage({ params }: PortalDemoPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PortalDemoClient locale={locale} />;
}
