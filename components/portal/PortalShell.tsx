"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";
import MobileBottomNav from "./MobileBottomNav";
import MobileDrawer from "./MobileDrawer";
import SectionContent from "./SectionContent";
import { Toaster } from "sonner";

/* ─── PortalShell Component ────────────────────────────── */

interface PortalShellProps {
  locale: string;
}

export default function PortalShell({ locale }: PortalShellProps) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (key: string) => {
    setActiveSection(key);
    // Scroll main content to top on section change
    const main = document.getElementById("portal-main-content");
    if (main) main.scrollTop = 0;
  };

  return (
    <div className="portal-shell h-full flex overflow-hidden bg-[var(--portal-bg)]">
      {/* ── Desktop Sidebar ──────────────────────────── */}
      <Sidebar
        locale={locale}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
      />

      {/* ── Mobile Drawer ────────────────────────────── */}
      <MobileDrawer
        locale={locale}
        activeSection={activeSection}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* ── Main Area ────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        }`}
      >
        {/* Top Header */}
        <TopHeader
          locale={locale}
          activeSection={activeSection}
          sidebarCollapsed={sidebarCollapsed}
          onToggleDrawer={() => setDrawerOpen((p) => !p)}
        />

        {/* Scrollable content */}
        <main
          id="portal-main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden ss-scrollbar pb-20 md:pb-0"
          data-lenis-prevent
        >
          <SectionContent locale={locale} activeSection={activeSection} />
        </main>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────── */}
      <MobileBottomNav
        locale={locale}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
