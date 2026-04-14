"use client";

import React, { useState } from "react";
import { Card } from "../ui/Card";
import { AlertStrip } from "../ui/AlertStrip";
import { NewRequestModal } from "../ui/NewRequestModal";
import { ApprovalModal } from "../ui/ApprovalModal";
import { toast } from "sonner";
import { 
  FilePlus2, 
  QrCode, 
  CheckCircle2, 
  CalendarDays, 
  ArrowRight,
  Zap
} from "lucide-react";

const dashboardData = {
  kpis: [
    { label: "Équipements actifs", value: "247", subLabel: "⚠️ 12 arrivent à expiration sous 30 jours", colorBorder: "border-l-blue-600 dark:border-l-blue-500", colorText: "text-blue-500 dark:text-blue-400" },
    { label: "Missions ce mois", value: "8", subLabel: "🟢 2 en cours · 6 planifiées", colorBorder: "border-l-emerald-500", colorText: "text-emerald-500 dark:text-emerald-400" },
    { label: "Factures impayées", value: "3", subLabel: "🔴 14 200,000 TND en attente", colorBorder: "border-l-red-500", colorText: "text-red-500 dark:text-red-400" },
    { label: "Contrats actifs", value: "2", subLabel: "🟡 1 en attente de votre signature", colorBorder: "border-l-orange-500", colorText: "text-orange-500 dark:text-orange-400" },
  ],
  alerts: [
    { level: "red", icon: "🔴", message: "3 extincteurs — Zone B Usine Nord — date d'expiration dépassée depuis 8 jours" },
    { level: "red", icon: "🔴", message: "Facture INV-2024-089 — 45 jours de retard — Montant : 5 200,000 TND" },
    { level: "orange", icon: "🟠", message: "Contrat MSA-2025-004 en attente de votre approbation depuis 3 jours" },
    { level: "yellow", icon: "🟡", message: "Mission planifiée demain 06/11 à 09:00 — Vérification extincteurs Siège Social" },
    { level: "blue", icon: "🔵", message: "Rapport d'intervention IR-0241 disponible au téléchargement" }
  ] as const,
  activities: [
    { time: "Aujourd'hui 10:14", title: "Livraison BL-2024-112 réceptionnée — 18 articles vérifiés", type: "Logistique", dotColor: "bg-emerald-500" },
    { time: "Hier 16:45", title: "Rapport IR-0241 généré — Vérification annuelle Zone A Siège", type: "Intervention", dotColor: "bg-blue-600" },
    { time: "Hier 11:20", title: "Devis QT-2024-158 reçu — Fourniture EPI H2 2025", type: "Commercial", dotColor: "bg-orange-500" },
    { time: "04/11 09:30", title: "Commande SO-2024-079 confirmée — Recharge extincteurs", type: "Commercial", dotColor: "bg-yellow-500" },
    { time: "03/11 14:00", title: "Tenue de travail attribuée — Mohamed Trabelsi", type: "Workwear", dotColor: "bg-purple-500" },
    { time: "01/11 08:15", title: "Inspection mensuelle effectuée — Zone C Entrepôt", type: "Inspection", dotColor: "bg-slate-500" }
  ]
};

export default function Dashboard() {
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);

  const quickActions = [
    { 
      label: "Nouvelle demande", 
      description: "Créer un dossier d'intervention",
      icon: <FilePlus2 className="w-5 h-5" />, 
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
      hoverBorder: "hover:border-blue-500/50",
      action: () => setIsNewReqOpen(true)
    },
    { 
      label: "Scanner QR", 
      description: "Identifier un équipement",
      icon: <QrCode className="w-5 h-5" />, 
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400",
      hoverBorder: "hover:border-emerald-500/50",
      action: () => toast.info("📸 Ouverture du scanner...")
    },
    { 
      label: "Approuver docs", 
      description: "3 documents en attente",
      icon: <CheckCircle2 className="w-5 h-5" />, 
      color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400",
      hoverBorder: "hover:border-orange-500/50",
      action: () => setIsApprovalOpen(true)
    },
    { 
      label: "Voir planning", 
      description: "Missions et interventions",
      icon: <CalendarDays className="w-5 h-5" />, 
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400",
      hoverBorder: "hover:border-indigo-500/50",
      action: () => toast.info("Redirection vers le planning...")
    }
  ];

  return (
    <div className="p-4 lg:p-8 animate-in">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Bonjour, Karim 👋
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
          PROTEX INDUSTRIES SARL — Tableau de bord HSE
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Mercredi, 06 novembre 2024 · Dernière connexion : Hier à 14:32 depuis Sfax, TN
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardData.kpis.map((kpi, idx) => (
          <Card key={idx} className={`p-5 border-l-4 ${kpi.colorBorder} transition-transform hover:-translate-y-0.5 hover:shadow-md`}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
              {kpi.label}
            </div>
            <div className={`text-3xl font-black leading-none mb-2 ${kpi.colorText}`}>
              {kpi.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {kpi.subLabel}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 mb-6">
        {/* Alertes prioritaires */}
        <Card className="p-5 lg:p-6">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            ⚡ Alertes prioritaires
          </h3>
          <div className="flex flex-col gap-2.5">
            {dashboardData.alerts.map((alert, idx) => (
              <AlertStrip key={idx} variant={alert.level} icon={alert.icon}>
                <span className="font-medium text-[13px]">{alert.message}</span>
              </AlertStrip>
            ))}
          </div>
        </Card>

        {/* Actions rapides */}
        <Card className="p-5 lg:p-6 overflow-hidden relative">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              Actions rapides
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className={`group flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-left transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${action.hoverBorder} active:scale-[0.98] cursor-pointer`}
              >
                <div className={`shrink-0 p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110 ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-[13px] text-slate-900 dark:text-slate-100 truncate">
                      {action.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-slate-400" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity feed */}
      <Card className="p-5 lg:p-6">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-5">
          📰 Fil d'activité récente
        </h3>
        <div className="flex flex-col gap-0">
          {dashboardData.activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 py-2.5 relative">
              {idx !== dashboardData.activities.length - 1 && (
                <div className="absolute left-[5px] top-[24px] bottom-[-8px] w-0.5 bg-slate-200 dark:bg-slate-800" />
              )}
              <div className={`w-3 h-3 rounded-full shrink-0 mt-[5px] ${activity.dotColor}`} />
              <div>
                <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activity.time} · {activity.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modals */}
      <NewRequestModal isOpen={isNewReqOpen} onClose={() => setIsNewReqOpen(false)} />
      <ApprovalModal isOpen={isApprovalOpen} onClose={() => setIsApprovalOpen(false)} />
    </div>
  );
}
