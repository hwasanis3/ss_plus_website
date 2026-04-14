"use client";

import PortalShell from "@/components/portal/PortalShell";

/* ─── Portal Demo Client Wrapper ──────────────────────── */

interface PortalDemoClientProps {
  locale: string;
}

export default function PortalDemoClient({ locale }: PortalDemoClientProps) {
  return <PortalShell locale={locale} />;
}
