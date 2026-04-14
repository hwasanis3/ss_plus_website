"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  Package,
  Wrench,
  ClipboardList,
  Truck,
  Settings,
  CreditCard,
  ShieldCheck,
  Shirt,
  FileText,
  Search,
  HardHat,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/* ─── Navigation items ─────────────────────────────────── */

export interface NavItem {
  key: string;
  labelFr: string;
  labelEn: string;
  icon: React.ElementType;
  comingSoon?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", labelFr: "Dashboard", labelEn: "Dashboard", icon: LayoutDashboard },
  { key: "profile", labelFr: "Mon Profil", labelEn: "My Profile", icon: Building2 },
  { key: "catalogue", labelFr: "Catalogue", labelEn: "Catalogue", icon: Package },
  { key: "blueprints", labelFr: "Blueprints", labelEn: "Blueprints", icon: Wrench },
  { key: "commercial", labelFr: "Suivi Commercial", labelEn: "Commercial Tracking", icon: ClipboardList },
  { key: "logistics", labelFr: "Logistique", labelEn: "Logistics", icon: Truck },
  { key: "missions", labelFr: "Missions & Services", labelEn: "Missions & Services", icon: Settings },
  { key: "payments", labelFr: "Paiements", labelEn: "Payments", icon: CreditCard },
  { key: "assets", labelFr: "Assets (Équipements)", labelEn: "Assets (Equipment)", icon: ShieldCheck },
  { key: "workwear", labelFr: "Workwear", labelEn: "Workwear", icon: Shirt },
  { key: "requests", labelFr: "Mes Demandes", labelEn: "My Requests", icon: FileText },
  { key: "inspection", labelFr: "Inspection QR", labelEn: "QR Inspection", icon: Search },
  { key: "team", labelFr: "Notre Équipe", labelEn: "Our Team", icon: HardHat, comingSoon: true },
];

/* ─── Sidebar Component ────────────────────────────────── */

interface SidebarProps {
  locale: string;
  activeSection: string;
  onNavigate: (key: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  locale,
  activeSection,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const isFr = locale === "fr";

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 bg-[var(--sidebar-bg)] border-r border-[var(--border-subtle)] transition-all duration-300 ease-out ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* ── Logo Area ──────────────────────────────────── */}
      <div className={`flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 h-16 shrink-0 ${collapsed ? "justify-center" : ""}`}>
        {collapsed ? (
          <span className="font-display text-sm font-black text-ss-red tracking-tight">S+</span>
        ) : (
          <>
            <Image
              src="/logo-ssplus.png"
              alt="SS PLUS"
              width={100}
              height={30}
              className="object-contain brightness-110"
              style={{ width: "auto", height: "28px" }}
            />
            <div className="ml-auto">
              <span className="text-[8px] font-black text-ss-red/70 uppercase tracking-[0.3em] leading-none block">WAVE+</span>
            </div>
          </>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 ss-scrollbar space-y-0.5" data-lenis-prevent>
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.key;
          const Icon = item.icon;
          const label = isFr ? item.labelFr : item.labelEn;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              title={collapsed ? label : undefined}
              className={`group relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 outline-none
                ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
                ${
                  isActive
                    ? "bg-ss-red/10 text-ss-red"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                }
              `}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-ss-red rounded-r-full" />
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                className="shrink-0 transition-colors duration-200"
              />

              {!collapsed && (
                <span className="text-[13px] font-semibold truncate leading-none">
                  {label}
                </span>
              )}

              {/* Coming Soon badge */}
              {item.comingSoon && !collapsed && (
                <span className="ml-auto text-[8px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  Soon
                </span>
              )}
              {item.comingSoon && collapsed && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Collapse Toggle ────────────────────────────── */}
      <div className="border-t border-[var(--border-subtle)] p-3 shrink-0">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight size={16} />
          ) : (
            <>
              <ChevronsLeft size={16} />
              <span className="text-[11px] font-semibold">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
