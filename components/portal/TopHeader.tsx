"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Search, Menu, Moon, Sun, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";

/* ─── TopHeader Component ────────────────────────────── */

interface TopHeaderProps {
  locale: string;
  activeSection: string;
  sidebarCollapsed: boolean;
  onToggleDrawer: () => void;
}

export default function TopHeader({
  locale,
  activeSection,
  sidebarCollapsed,
  onToggleDrawer,
}: TopHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const isFr = locale === "fr";

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const activeItem = NAV_ITEMS.find((n) => n.key === activeSection);
  const activeLabel = activeItem
    ? isFr
      ? activeItem.labelFr
      : activeItem.labelEn
    : "Dashboard";

  return (
    <header
      className={`sticky top-0 z-30 h-16 flex items-center gap-4 px-4 lg:px-6 bg-[var(--header-bg)] backdrop-blur-xl border-b border-[var(--border-subtle)] transition-all duration-300`}
    >
      {/* ── Mobile hamburger ───────────────────────────── */}
      <button
        onClick={onToggleDrawer}
        className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
        aria-label="Open navigation drawer"
      >
        <Menu size={20} />
      </button>

      {/* ── Breadcrumbs ────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 text-[12px] font-medium">
        <span className="text-ss-red font-bold tracking-wide">WAVE PLUS</span>
        <ChevronRight size={12} className="text-[var(--text-tertiary)]" />
        <span className="text-[var(--text-primary)] font-semibold">{activeLabel}</span>
      </div>

      {/* ── Mobile logo ────────────────────────────────── */}
      <div className="md:hidden flex items-center gap-2">
        <span className="font-display text-sm font-black text-ss-red tracking-tight">WAVE+</span>
      </div>

      {/* ── Spacer ─────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Search Bar ─────────────────────────────────── */}
      <div
        className={`hidden lg:flex items-center gap-2 rounded-xl border transition-all duration-300 px-3 py-2 ${
          searchFocused
            ? "border-ss-red/40 bg-[var(--search-focus-bg)] shadow-[0_0_20px_rgba(214,40,40,0.08)]"
            : "border-[var(--border-subtle)] bg-[var(--search-bg)]"
        }`}
        style={{ width: "280px" }}
      >
        <Search size={14} className="text-[var(--text-tertiary)] shrink-0" />
        <input
          type="text"
          placeholder={isFr ? "Rechercher..." : "Search..."}
          className="bg-transparent outline-none text-[13px] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] w-full font-body"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden xl:inline-flex text-[9px] text-[var(--text-tertiary)] border border-[var(--border-subtle)] rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* ── Actions ────────────────────────────────────── */}
      <div className="flex items-center gap-1.5">
        {/* Notification Bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ss-red rounded-full shadow-[0_0_6px_rgba(214,40,40,0.6)]" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => mounted && setTheme(isDark ? "light" : "dark")}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {mounted ? (
            isDark ? <Sun size={18} /> : <Moon size={18} />
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </button>

        {/* User Avatar */}
        <div className="hidden sm:flex items-center gap-2.5 ml-2 pl-3 border-l border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ss-red to-ss-red-dark flex items-center justify-center text-white text-[11px] font-black shadow-lg">
            P
          </div>
          <div className="hidden lg:flex flex-col leading-none">
            <span className="text-[12px] font-bold text-[var(--text-primary)]">Admin</span>
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium mt-0.5">PROTEX INDUSTRIES</span>
          </div>
        </div>
      </div>
    </header>
  );
}
