"use client";

import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  FileText,
  Building2,
} from "lucide-react";

/* ─── Bottom nav items ─────────────────────────────────── */

const BOTTOM_ITEMS = [
  { key: "dashboard", labelFr: "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard },
  { key: "catalogue", labelFr: "Catalogue", labelEn: "Catalogue", icon: Package },
  { key: "assets", labelFr: "Assets", labelEn: "Assets", icon: ShieldCheck },
  { key: "requests", labelFr: "Demandes", labelEn: "Requests", icon: FileText },
  { key: "profile", labelFr: "Profil", labelEn: "Profile", icon: Building2 },
];

/* ─── MobileBottomNav Component ────────────────────────── */

interface MobileBottomNavProps {
  locale: string;
  activeSection: string;
  onNavigate: (key: string) => void;
}

export default function MobileBottomNav({
  locale,
  activeSection,
  onNavigate,
}: MobileBottomNavProps) {
  const isFr = locale === "fr";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-[var(--bottom-nav-bg)] backdrop-blur-2xl border-t border-[var(--border-subtle)] flex items-center justify-around px-2 safe-area-pb">
      {BOTTOM_ITEMS.map((item) => {
        const isActive = activeSection === item.key;
        const Icon = item.icon;
        const label = isFr ? item.labelFr : item.labelEn;

        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[56px] ${
              isActive
                ? "text-ss-red"
                : "text-[var(--text-tertiary)] active:scale-95"
            }`}
          >
            <div className="relative">
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
              {isActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-ss-red rounded-full shadow-[0_0_6px_rgba(214,40,40,0.6)]" />
              )}
            </div>
            <span
              className={`text-[10px] font-semibold leading-none ${
                isActive ? "text-ss-red" : ""
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
