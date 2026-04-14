"use client";

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
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Users,
  MapPin,
  Star,
} from "lucide-react";

import Dashboard from "./modules/Dashboard";
import MonProfil from "./modules/MonProfil";
import Catalogue from "./modules/Catalogue";
import Blueprints from "./modules/Blueprints";
import SuiviCommercial from "./modules/SuiviCommercial";
import Logistique from "./modules/Logistique";
import Missions from "./modules/Missions";
import Paiements from "./modules/Paiements";
import Assets from "./modules/Assets";
import Workwear from "./modules/Workwear";
import Demandes from "./modules/Demandes";
import InspectionQR from "./modules/InspectionQR";
import NotreEquipe from "./modules/NotreEquipe";

/* ─── Section meta ─────────────────────────────────────── */

interface SectionMeta {
  key: string;
  titleFr: string;
  titleEn: string;
  descFr: string;
  descEn: string;
  icon: React.ElementType;
  color: string;
}

const SECTION_META: SectionMeta[] = [
  {
    key: "dashboard",
    titleFr: "Dashboard",
    titleEn: "Dashboard",
    descFr: "Vue d'ensemble des opérations PROTEX INDUSTRIES",
    descEn: "Operations overview for PROTEX INDUSTRIES",
    icon: LayoutDashboard,
    color: "from-ss-red/20 to-ss-red/5",
  },
  {
    key: "profile",
    titleFr: "Mon Profil Entreprise",
    titleEn: "Company Profile",
    descFr: "Informations et paramètres de PROTEX INDUSTRIES",
    descEn: "PROTEX INDUSTRIES information and settings",
    icon: Building2,
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    key: "catalogue",
    titleFr: "Catalogue Produits",
    titleEn: "Product Catalogue",
    descFr: "Parcourir notre catalogue de produits de sécurité",
    descEn: "Browse our safety product catalogue",
    icon: Package,
    color: "from-emerald-500/20 to-emerald-500/5",
  },
  {
    key: "blueprints",
    titleFr: "Plans & Blueprints",
    titleEn: "Blueprints",
    descFr: "Plans d'implantation et schémas techniques",
    descEn: "Installation plans and technical schematics",
    icon: Wrench,
    color: "from-violet-500/20 to-violet-500/5",
  },
  {
    key: "commercial",
    titleFr: "Suivi Commercial",
    titleEn: "Commercial Tracking",
    descFr: "Devis, commandes et suivi des propositions",
    descEn: "Quotes, orders and proposal tracking",
    icon: ClipboardList,
    color: "from-sky-500/20 to-sky-500/5",
  },
  {
    key: "logistics",
    titleFr: "Logistique",
    titleEn: "Logistics",
    descFr: "Suivi des livraisons et planning logistique",
    descEn: "Delivery tracking and logistics planning",
    icon: Truck,
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    key: "missions",
    titleFr: "Missions & Services",
    titleEn: "Missions & Services",
    descFr: "Interventions planifiées et rapports de service",
    descEn: "Scheduled interventions and service reports",
    icon: Settings,
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    key: "payments",
    titleFr: "Paiements",
    titleEn: "Payments",
    descFr: "Factures, paiements et historique financier",
    descEn: "Invoices, payments and financial history",
    icon: CreditCard,
    color: "from-green-500/20 to-green-500/5",
  },
  {
    key: "assets",
    titleFr: "Assets (Équipements)",
    titleEn: "Assets (Equipment)",
    descFr: "Inventaire et suivi de vos équipements de sécurité",
    descEn: "Inventory and tracking of your safety equipment",
    icon: ShieldCheck,
    color: "from-red-500/20 to-red-500/5",
  },
  {
    key: "workwear",
    titleFr: "Workwear",
    titleEn: "Workwear",
    descFr: "Gestion des vêtements de travail et EPI",
    descEn: "Work clothing and PPE management",
    icon: Shirt,
    color: "from-indigo-500/20 to-indigo-500/5",
  },
  {
    key: "requests",
    titleFr: "Mes Demandes",
    titleEn: "My Requests",
    descFr: "Soumissions, tickets et suivi des demandes",
    descEn: "Submissions, tickets and request tracking",
    icon: FileText,
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    key: "inspection",
    titleFr: "Outils QHSE & Inspections",
    titleEn: "QHSE & Inspections Tools",
    descFr: "Scanner, inspecter et gérer la conformité",
    descEn: "Scan, inspect, and manage compliance",
    icon: Search,
    color: "from-teal-500/20 to-teal-500/5",
  },
  {
    key: "team",
    titleFr: "Notre Équipe",
    titleEn: "Our Team",
    descFr: "Votre équipe dédiée SS PLUS",
    descEn: "Your dedicated SS PLUS team",
    icon: HardHat,
    color: "from-amber-500/20 to-amber-500/5",
  },
];

/* ─── SectionContent Component ─────────────────────────── */

interface SectionContentProps {
  locale: string;
  activeSection: string;
}

export default function SectionContent({
  locale,
  activeSection,
}: SectionContentProps) {
  const isFr = locale === "fr";
  const meta = SECTION_META.find((s) => s.key === activeSection) || SECTION_META[0];
  const Icon = meta.icon;

  /* ── Dashboard content (default) ─────────────────────── */
  if (activeSection === "dashboard") {
    return <Dashboard />;
  }

  /* ── Profile content ─────────────────────────────────── */
  if (activeSection === "profile") {
    return <MonProfil />;
  }

  if (activeSection === "catalogue") {
    return <Catalogue />;
  }

  if (activeSection === "blueprints") {
    return <Blueprints />;
  }

  if (activeSection === "commercial") {
    return <SuiviCommercial />;
  }

  if (activeSection === "logistics") {
    return <Logistique />;
  }

  if (activeSection === "missions") {
    return <Missions />;
  }

  if (activeSection === "payments") {
    return <Paiements />;
  }

  if (activeSection === "assets") {
    return <Assets />;
  }

  if (activeSection === "workwear") {
    return <Workwear />;
  }

  if (activeSection === "requests") {
    return <Demandes />;
  }

  if (activeSection === "inspection") {
    return <InspectionQR />;
  }

  /* ── Coming Soon (team) ──────────────────────────────── */
  if (activeSection === "team") {
    return <NotreEquipe />;
  }

  /* ── Generic section content ─────────────────────────── */
  return (
    <div className="p-4 lg:p-8 animate-in">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
            <Icon size={20} className="text-[var(--text-primary)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight">
              {isFr ? meta.titleFr : meta.titleEn}
            </h1>
            <p className="text-[13px] text-[var(--text-tertiary)] mt-0.5">{isFr ? meta.descFr : meta.descEn}</p>
          </div>
        </div>
      </div>

      {/* Mock content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-6 hover:border-ss-red/20 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 rounded-lg bg-[var(--hover-bg)] flex items-center justify-center">
                <Star size={14} className="text-[var(--text-tertiary)]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                {isFr ? `Élément ${i}` : `Item ${i}`}
              </span>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-[var(--hover-bg)] rounded-full w-3/4" />
              <div className="h-3 bg-[var(--hover-bg)] rounded-full w-1/2" />
              <div className="h-3 bg-[var(--hover-bg)] rounded-full w-5/6" />
            </div>
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[var(--text-tertiary)]">
                {isFr ? "Voir détails" : "View details"}
              </span>
              <ArrowUpRight size={14} className="text-[var(--text-tertiary)] group-hover:text-ss-red transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Mock data table */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">
            {isFr ? "Données récentes" : "Recent Data"}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ss-red cursor-pointer hover:underline">
            {isFr ? "Tout voir" : "View all"}
          </span>
        </div>
        <div className="divide-y divide-[var(--border-subtle)]">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="px-6 py-3.5 flex items-center gap-4 hover:bg-[var(--hover-bg)] transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[var(--hover-bg)] shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-[var(--hover-bg)] rounded-full w-2/5" />
                <div className="h-2 bg-[var(--hover-bg)] rounded-full w-1/4" />
              </div>
              <div className="h-6 w-16 bg-[var(--hover-bg)] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Coming Soon Sub-Component ────────────────────────── */

function ComingSoonContent({ isFr, meta }: { isFr: boolean; meta: SectionMeta }) {
  const Icon = meta.icon;

  return (
    <div className="p-4 lg:p-8 flex items-center justify-center min-h-[60vh] animate-in">
      <div className="text-center max-w-md">
        <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${meta.color} flex items-center justify-center mx-auto mb-6`}>
          <Icon size={32} className="text-[var(--text-primary)]" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] bg-amber-500/15 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-full mb-4">
          Coming Soon
        </span>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-[var(--text-primary)] tracking-tight mb-3">
          {isFr ? meta.titleFr : meta.titleEn}
        </h2>
        <p className="text-[14px] text-[var(--text-tertiary)] leading-relaxed">
          {isFr
            ? "Cette fonctionnalité est en cours de développement et sera disponible prochainement. Restez connecté !"
            : "This feature is currently under development and will be available soon. Stay tuned!"}
        </p>
      </div>
    </div>
  );
}
