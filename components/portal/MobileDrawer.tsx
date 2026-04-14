"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { NAV_ITEMS } from "./Sidebar";

/* ─── MobileDrawer Component ──────────────────────────── */

interface MobileDrawerProps {
  locale: string;
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (key: string) => void;
}

export default function MobileDrawer({
  locale,
  activeSection,
  isOpen,
  onClose,
  onNavigate,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const isFr = locale === "fr";

  /* Lock body scroll when open */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNav = (key: string) => {
    onNavigate(key);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`md:hidden fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[var(--drawer-bg)] border-r border-[var(--border-subtle)] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-black text-ss-red tracking-tight">WAVE PLUS</span>
            <span className="text-[8px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider border border-[var(--border-subtle)] rounded px-1.5 py-0.5">
              Demo
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)] transition-colors"
            aria-label="Close drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 mt-4 mb-2 p-3 rounded-xl bg-[var(--hover-bg)] border border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ss-red to-ss-red-dark flex items-center justify-center text-white text-[12px] font-black shadow-lg">
              P
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold text-[var(--text-primary)]">Admin Client</span>
              <span className="text-[10px] text-[var(--text-tertiary)] font-medium mt-0.5">PROTEX INDUSTRIES</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-3 space-y-0.5">
          <div className="px-3 py-2">
            <span className="text-[9px] font-black text-[var(--text-tertiary)] uppercase tracking-[0.2em]">
              {isFr ? "Navigation" : "Navigation"}
            </span>
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.key;
            const Icon = item.icon;
            const label = isFr ? item.labelFr : item.labelEn;

            return (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`group relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 outline-none ${
                  isActive
                    ? "bg-ss-red/10 text-ss-red"
                    : "text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-ss-red rounded-r-full" />
                )}

                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} className="shrink-0" />

                <span className="text-[13px] font-semibold truncate">{label}</span>

                {item.comingSoon && (
                  <span className="ml-auto text-[8px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Soon
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom fade gradient for scroll hint */}
        <div className="sticky bottom-0 h-8 bg-gradient-to-t from-[var(--drawer-bg)] to-transparent pointer-events-none" />
      </div>
    </>
  );
}
