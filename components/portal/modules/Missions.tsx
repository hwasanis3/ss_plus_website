"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AlertStrip } from "../ui/AlertStrip";
import { ProgressBar } from "../ui/ProgressBar";
import { useState, useMemo, Fragment } from "react";
import { mockMissionsPortalData } from "@/data/mockMissionsData";
import type {
  MissionFolder,
  MissionStatus,
  InterventionStatus,
  WorkshopStatus,
  EquipmentInterventionStatus,
  EvaluationGrade,
  Intervention,
  Recommendation,
  Compliance,
  WorkshopTrackingItem,
  PlanningEvent,
  MissionEventCalendar,
  Technician,
} from "@/types/missionsPortal";
import {
  ClipboardCheck,
  Clock,
  CalendarDays,
  Wrench,
  ChevronRight,
  X,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  Award,
  BarChart3,
  Package,
  CircleDot,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function formatMonth(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

// ═══════════════════════════════════════════════════════════════════════════
// Badge Helpers
// ═══════════════════════════════════════════════════════════════════════════

type BadgeVariant = "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple" | "slate";

function missionStatusBadge(status: MissionStatus): { variant: BadgeVariant; label: string; icon: string } {
  const map: Record<MissionStatus, { variant: BadgeVariant; label: string; icon: string }> = {
    pending: { variant: "orange", label: "Planifiée", icon: "📋" },
    in_progress: { variant: "blue", label: "En cours", icon: "🔄" },
    completed: { variant: "green", label: "Terminée", icon: "✅" },
    closure: { variant: "green", label: "Clôturée", icon: "🔒" },
  };
  return map[status];
}

function interventionStatusBadge(status: InterventionStatus): { variant: BadgeVariant; label: string } {
  const map: Record<InterventionStatus, { variant: BadgeVariant; label: string }> = {
    pending: { variant: "orange", label: "Planifiée" },
    in_progress: { variant: "blue", label: "En cours" },
    completed: { variant: "green", label: "Clôturée" },
  };
  return map[status];
}

function workshopStatusBadge(status: WorkshopStatus): { variant: BadgeVariant; label: string } {
  const map: Record<WorkshopStatus, { variant: BadgeVariant; label: string }> = {
    pending: { variant: "orange", label: "En attente" },
    in_progress: { variant: "blue", label: "En cours" },
    completed: { variant: "green", label: "Terminé" },
  };
  return map[status];
}

function equipmentStatusBadge(status: EquipmentInterventionStatus): { variant: BadgeVariant; label: string } {
  const map: Record<EquipmentInterventionStatus, { variant: BadgeVariant; label: string }> = {
    conforme: { variant: "green", label: "Conforme" },
    non_conforme: { variant: "orange", label: "Non conforme" },
    hors_service: { variant: "red", label: "Hors service" },
    en_atelier: { variant: "purple", label: "En atelier" },
    "remplacé": { variant: "gray", label: "Remplacé" },
  };
  return map[status];
}

function evaluationBadge(grade: EvaluationGrade | null, score: number): { variant: BadgeVariant; label: string; color: string } {
  if (!grade || score === 0) return { variant: "gray", label: "—", color: "text-slate-400" };
  const map: Record<EvaluationGrade, { variant: BadgeVariant; label: string; color: string }> = {
    A: { variant: "green", label: `A — ${score}%`, color: "text-emerald-500" },
    B: { variant: "blue", label: `B — ${score}%`, color: "text-blue-500" },
    C: { variant: "orange", label: `C — ${score}%`, color: "text-orange-500" },
    D: { variant: "red", label: `D — ${score}%`, color: "text-red-500" },
  };
  return map[grade];
}

function calendarBadge(calendar: MissionEventCalendar): { variant: BadgeVariant; label: string } {
  const map: Record<MissionEventCalendar, { variant: BadgeVariant; label: string }> = {
    prevision: { variant: "purple", label: "Prévision" },
    pending: { variant: "blue", label: "En cours" },
    completed: { variant: "green", label: "Réalisée" },
  };
  return map[calendar];
}

function priorityBadge(priority: string): { variant: BadgeVariant } {
  const map: Record<string, BadgeVariant> = { haute: "red", moyenne: "orange", basse: "gray" };
  return { variant: map[priority] || "gray" };
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Tabs
// ═══════════════════════════════════════════════════════════════════════════

const mainTabs = [
  { id: "historique", label: "Historique & Tableaux", icon: ClipboardCheck },
  { id: "atelier", label: "Équipements en Atelier", icon: Wrench },
  { id: "planning", label: "Planning Annuel", icon: CalendarDays },
] as const;

type MainTab = (typeof mainTabs)[number]["id"];

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function Missions() {
  const [activeTab, setActiveTab] = useState<MainTab>("historique");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<MissionFolder | null>(null);

  const { missions, workshopTracking, planningEvents } = mockMissionsPortalData;

  // ── KPI computations ──
  const kpis = useMemo(() => {
    const total = missions.length;
    const active = missions.filter((m) => m.mission_status === "in_progress").length;
    const completed = missions.filter(
      (m) => m.mission_status === "completed" || m.mission_status === "closure"
    ).length;
    const pending = missions.filter((m) => m.mission_status === "pending").length;
    const totalRecs = missions.reduce((sum, m) => sum + m.report.recommendations.length, 0);
    const urgentRecs = missions.reduce(
      (sum, m) => sum + m.report.recommendations.filter((r) => r.priority === "haute").length,
      0
    );
    const inWorkshop = workshopTracking.filter((w) => w.workshop_status !== "completed").length;
    const avgScore =
      missions.filter((m) => m.report.evaluation_score > 0).length > 0
        ? Math.round(
            missions
              .filter((m) => m.report.evaluation_score > 0)
              .reduce((sum, m) => sum + m.report.evaluation_score, 0) /
              missions.filter((m) => m.report.evaluation_score > 0).length
          )
        : 0;
    return { total, active, completed, pending, totalRecs, urgentRecs, inWorkshop, avgScore };
  }, [missions, workshopTracking]);

  function openMissionDetail(mission: MissionFolder) {
    setSelectedMission(mission);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setSelectedMission(null), 300);
  }

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* ─── Header ────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          🔧 Missions & Services
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tableau de bord opérationnel — inspections, audits, interventions et
          suivi du parc en temps réel.
        </p>
      </div>

      {/* ─── KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <Card className="p-4 lg:p-5 border-l-4 border-l-blue-600 dark:border-l-blue-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Missions actives
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-blue-600 dark:text-blue-400">
            {kpis.active}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {kpis.pending} planifiée{kpis.pending > 1 ? "s" : ""}
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-emerald-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Missions terminées
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-emerald-500 dark:text-emerald-400">
            {kpis.completed}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            sur {kpis.total} au total
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-orange-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Recommandations
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-orange-500 dark:text-orange-400">
            {kpis.totalRecs}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            dont {kpis.urgentRecs} urgente{kpis.urgentRecs > 1 ? "s" : ""}
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-purple-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            En atelier
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-purple-500 dark:text-purple-400">
            {kpis.inWorkshop}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Équipement{kpis.inWorkshop > 1 ? "s" : ""} en réparation
          </div>
        </Card>

        <Card className="col-span-2 lg:col-span-1 p-4 lg:p-5 border-l-4 border-l-cyan-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Score moyen
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-cyan-600 dark:text-cyan-400">
            {kpis.avgScore}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Évaluation globale du parc
          </div>
        </Card>
      </div>

      {/* ─── Alert Strip ──────────────────────────────────────────── */}
      {kpis.urgentRecs > 0 && (
        <AlertStrip variant="orange" icon="⚠️">
          <span className="font-medium text-[13px]">
            {kpis.urgentRecs} recommandation{kpis.urgentRecs > 1 ? "s" : ""}{" "}
            urgente{kpis.urgentRecs > 1 ? "s" : ""} à traiter — Consultez les
            détails dans les rapports de mission.
          </span>
        </AlertStrip>
      )}

      {/* ─── Main Tabs ──────────────────────────────────────────────── */}
      <Card className="p-2 flex flex-wrap gap-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[13px] cursor-pointer border-none transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "atelier" && kpis.inWorkshop > 0 && (
                <span
                  className={`ml-1 text-[11px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-purple-500/15 text-purple-500"
                  }`}
                >
                  {kpis.inWorkshop}
                </span>
              )}
            </button>
          );
        })}
      </Card>

      {/* ═══════════════════════════════════════════════════════════════
          TAB 1: HISTORIQUE & TABLEAUX — Mission Data Grid
       ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "historique" && (
        <HistoriqueTab missions={missions} onOpenDetail={openMissionDetail} />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 2: ÉQUIPEMENTS EN ATELIER
       ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "atelier" && (
        <AtelierTab workshopTracking={workshopTracking} />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          TAB 3: PLANNING ANNUEL
       ═══════════════════════════════════════════════════════════════ */}
      {activeTab === "planning" && (
        <PlanningTab planningEvents={planningEvents} />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          DETAIL DRAWER / SLIDE-OVER
       ═══════════════════════════════════════════════════════════════ */}
      {(drawerOpen || selectedMission) && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/40 dark:bg-black/60 z-[9998] transition-opacity duration-300 ${
              drawerOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={closeDrawer}
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-full max-w-[720px] z-[9999] bg-[var(--card-bg)] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedMission && (
              <MissionDetailDrawer
                mission={selectedMission}
                onClose={closeDrawer}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 1: Historique & Tableaux
// ═══════════════════════════════════════════════════════════════════════════

function HistoriqueTab({
  missions,
  onOpenDetail,
}: {
  missions: MissionFolder[];
  onOpenDetail: (m: MissionFolder) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="font-bold text-sm">
          Historique des Missions
        </span>
        <span className="text-xs text-slate-500">
          {missions.length} mission{missions.length > 1 ? "s" : ""} au total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-900/40">
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Référence
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Type de Mission
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Durée
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Site
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Statut
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                Évaluation
              </th>
              <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {missions.map((m) => {
              const sBadge = missionStatusBadge(m.mission_status);
              const eBadge = evaluationBadge(
                m.report.overall_evaluation,
                m.report.evaluation_score
              );
              return (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                  onClick={() => onOpenDetail(m)}
                >
                  {/* Reference */}
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                      {m.mission_id}
                    </span>
                  </td>
                  {/* Type */}
                  <td className="px-4 py-3.5 max-w-[220px]">
                    <div className="font-semibold text-[13px] text-slate-800 dark:text-slate-200 truncate">
                      {m.mission_type}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.interventions.length} intervention{m.interventions.length !== 1 ? "s" : ""}
                      {m.workshops.length > 0 && ` · ${m.workshops.length} atelier`}
                    </div>
                  </td>
                  {/* Date */}
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDateShort(m.mission_date)}
                  </td>
                  {/* Duration */}
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {m.mission_duration}
                  </td>
                  {/* Site */}
                  <td className="px-4 py-3.5">
                    <div className="text-[13px] text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                      {m.park_title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {m.park_city}
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <Badge
                      variant={sBadge.variant}
                      className={
                        m.mission_status === "in_progress"
                          ? "animate-pulse"
                          : ""
                      }
                    >
                      {sBadge.icon} {sBadge.label}
                    </Badge>
                  </td>
                  {/* Evaluation */}
                  <td className="px-4 py-3.5">
                    {m.report.evaluation_score > 0 ? (
                      <Badge variant={eBadge.variant}>{eBadge.label}</Badge>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  {/* Action */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-colors cursor-pointer border-none group-hover:bg-blue-600/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(m);
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Détails
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 2: Équipements en Atelier
// ═══════════════════════════════════════════════════════════════════════════

function AtelierTab({
  workshopTracking,
}: {
  workshopTracking: WorkshopTrackingItem[];
}) {
  const active = workshopTracking.filter(
    (w) => w.workshop_status !== "completed"
  );
  const completed = workshopTracking.filter(
    (w) => w.workshop_status === "completed"
  );

  return (
    <div className="space-y-4">
      {/* Active */}
      {active.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-sm">
                Équipements en cours de réparation
              </span>
            </div>
            <span className="text-xs text-slate-500">
              {active.length} équipement{active.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {active.map((w) => {
              const badge = workshopStatusBadge(w.workshop_status);
              return (
                <div key={w.id} className="p-4 lg:p-5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                          {w.equipment_qrc}
                        </span>
                        <Badge variant={badge.variant}>
                          {badge.label}
                        </Badge>
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                          {w.workshop_id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">
                        {w.equipment_model} — {w.equipment_type}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>📅 Entrée : {formatDateShort(w.entry_date)}</span>
                        {w.estimated_completion && (
                          <span>
                            🎯 Sortie estimée :{" "}
                            {formatDateShort(w.estimated_completion)}
                          </span>
                        )}
                        <span>👤 {w.workshop_leader}</span>
                        <span>
                          🔗 Mission : {w.mission_id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions list */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.actions.map((action, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-medium"
                      >
                        {action}
                      </span>
                    ))}
                  </div>

                  {w.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed mt-3">
                      💬 {w.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Completed recently */}
      {completed.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sm">
              Récemment terminés
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    QR Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    Équipement
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    Entrée
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    Sortie
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                    Mission
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {completed.map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                      {w.equipment_qrc}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {w.equipment_model}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {formatDateShort(w.entry_date)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                      {w.estimated_completion
                        ? formatDateShort(w.estimated_completion)
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="green">✅ Terminé</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {w.mission_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {workshopTracking.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          Aucun équipement actuellement en atelier.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// TAB 3: Planning Annuel
// ═══════════════════════════════════════════════════════════════════════════

function PlanningTab({
  planningEvents,
}: {
  planningEvents: PlanningEvent[];
}) {
  // Group events by month
  const grouped = useMemo(() => {
    const map = new Map<string, PlanningEvent[]>();
    const sorted = [...planningEvents].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    for (const ev of sorted) {
      const key = new Date(ev.start).toISOString().slice(0, 7); // YYYY-MM
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return Array.from(map.entries());
  }, [planningEvents]);

  return (
    <div className="space-y-4">
      <Card className="p-4 lg:p-5">
        <div className="flex items-center gap-3 mb-4">
          <CalendarDays className="w-5 h-5 text-blue-500" />
          <div>
            <h3 className="font-bold text-sm">
              Planning Annuel 2026
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {planningEvents.length} missions programmées cette année
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            Réalisée
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block animate-pulse" />
            En cours
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
            Prévision
          </div>
        </div>
      </Card>

      {/* Timeline */}
      {grouped.map(([monthKey, events]) => (
        <Card key={monthKey} className="overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <span className="font-bold text-sm capitalize">
              📅 {formatMonth(events[0].start)}
            </span>
            <span className="text-xs text-slate-500 ml-2">
              ({events.length} événement{events.length > 1 ? "s" : ""})
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {events.map((ev) => {
              const cb = calendarBadge(ev.calendar);
              const dotColor =
                ev.calendar === "completed"
                  ? "bg-emerald-500"
                  : ev.calendar === "pending"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-purple-500";
              return (
                <div
                  key={ev.id}
                  className="p-4 lg:p-5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center gap-1 pt-1">
                    <span className={`w-3 h-3 rounded-full ${dotColor}`} />
                    <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 min-h-[24px]" />
                  </div>

                  {/* Event content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                        {ev.title}
                      </span>
                      <Badge variant={cb.variant}>{cb.label}</Badge>
                      {ev.mission_frequency && (
                        <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                          {ev.mission_frequency}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        📅 {formatDateShort(ev.start)}
                        {ev.start !== ev.end &&
                          ` → ${formatDateShort(ev.end)}`}
                      </span>
                      <span>📍 {ev.city}</span>
                      <span>🔗 {ev.mission_id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DETAIL DRAWER: Full Mission Report
// ═══════════════════════════════════════════════════════════════════════════

const drawerTabs = [
  { id: "general", label: "Généralités", icon: ClipboardCheck },
  { id: "interventions", label: "Interventions", icon: Wrench },
  { id: "rapport", label: "Rapport", icon: BarChart3 },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

type DrawerTab = (typeof drawerTabs)[number]["id"];

function MissionDetailDrawer({
  mission: m,
  onClose,
}: {
  mission: MissionFolder;
  onClose: () => void;
}) {
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("general");
  const sBadge = missionStatusBadge(m.mission_status);
  const eBadge = evaluationBadge(
    m.report.overall_evaluation,
    m.report.evaluation_score
  );

  return (
    <div className="flex flex-col h-full">
      {/* ─── Drawer Header ─── */}
      <div className="sticky top-0 z-10 bg-[var(--card-bg)] border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {m.mission_id}
              </span>
              <Badge variant={sBadge.variant} className={m.mission_status === "in_progress" ? "animate-pulse" : ""}>
                {sBadge.icon} {sBadge.label}
              </Badge>
              {m.report.evaluation_score > 0 && (
                <Badge variant={eBadge.variant}>{eBadge.label}</Badge>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-semibold">
              {m.mission_type}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {m.park_title} · {m.park_city}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer border-none bg-transparent"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Sub-tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {drawerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = drawerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setDrawerTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-[12px] cursor-pointer border-none transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600/15 text-blue-600 dark:text-blue-400"
                    : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Drawer Body ─── */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {drawerTab === "general" && <DrawerGeneralites mission={m} />}
        {drawerTab === "interventions" && <DrawerInterventions mission={m} />}
        {drawerTab === "rapport" && <DrawerRapport mission={m} />}
        {drawerTab === "documents" && <DrawerDocuments mission={m} />}
      </div>

      {/* ─── Drawer Footer ─── */}
      <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          {m.mission_id} · Conformité : {m.compliance_rate}
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors cursor-pointer border-none"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer Tab: Généralités
// ═══════════════════════════════════════════════════════════════════════════

function DrawerGeneralites({ mission: m }: { mission: MissionFolder }) {
  return (
    <>
      {/* Date & duration grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <InfoCell label="Date de mission" value={formatDate(m.mission_date)} />
        <InfoCell label="Durée" value={m.mission_duration} />
        <InfoCell label="Temps sur site" value={m.work_time_on_site} />
        <InfoCell label="Fréquence" value={m.mission_frequency || "Ponctuelle"} />
        <InfoCell label="Équipements traités" value={m.total_equipment} />
        <InfoCell label="Taux de conformité" value={m.compliance_rate} />
      </div>

      {/* Team members */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <Users className="w-4 h-4" />
          Ressources Humaines
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {m.team.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600/15 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">
                {tech.avatar_initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {tech.technician_name}
                </p>
                <p className="text-[11px] text-slate-500">
                  {tech.role === "chef_equipe"
                    ? "Chef d'équipe"
                    : tech.role === "chauffeur"
                    ? "Chauffeur"
                    : "Technicien"}{" "}
                  · {tech.technician_id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Transport */}
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          <Truck className="w-4 h-4" />
          Transport & Logistique
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoCell label="Véhicule" value={m.vehicle_model} />
          <InfoCell label="Distance" value={`${m.target_in_km} km`} />
        </div>
      </Card>

      {/* Park details */}
      <Card className="p-4 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
          📍 Site d&apos;intervention
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoCell label="Parc" value={m.park_title} />
          <InfoCell label="Ville" value={m.park_city} />
          <InfoCell label="Adresse" value={m.park_address || "—"} />
          <InfoCell
            label="Équipements"
            value={`${m.total_fire_extinguisher} ext. · ${m.total_fire_hose} RIA · ${m.total_others_equipment} autres`}
          />
        </div>
      </Card>

      {/* Evaluation summary */}
      {m.operational_readiness && (
        <Card className="p-4 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            📊 Indicateurs d&apos;évaluation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {m.operational_readiness && (
              <EvalIndicator
                label="Disponibilité opérationnelle"
                value={m.operational_readiness}
                desc={m.operational_readiness_desc}
              />
            )}
            {m.maintenance_quality && (
              <EvalIndicator
                label="Qualité maintenance"
                value={m.maintenance_quality}
                desc={m.maintenance_quality_desc}
              />
            )}
            {m.safety_compliance && (
              <EvalIndicator
                label="Conformité sécurité"
                value={m.safety_compliance}
                desc={m.safety_compliance_desc}
              />
            )}
            {m.park_status && (
              <EvalIndicator
                label="Statut du parc"
                value={m.park_status}
                desc={m.park_status_desc}
              />
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {m.mission_notes && (
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed">
          💬 {m.mission_notes}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer Tab: Détails des Interventions
// ═══════════════════════════════════════════════════════════════════════════

function DrawerInterventions({ mission: m }: { mission: MissionFolder }) {
  const [expandedEqId, setExpandedEqId] = useState<number | null>(null);

  if (m.interventions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        Aucune intervention enregistrée pour cette mission.
      </div>
    );
  }

  return (
    <>
      {m.interventions.map((inv) => {
        const iBadge = interventionStatusBadge(inv.intervention_status);
        return (
          <div key={inv.id} className="space-y-4">
            {/* Intervention header card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                    {inv.intervention_id}
                  </span>
                  <Badge variant={iBadge.variant}>{iBadge.label}</Badge>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(inv.intervention_date)} · {inv.intervention_duration}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <InfoCell label="Chef d'équipe" value={inv.team_leader} />
                <InfoCell label="Équipe" value={inv.team_members} />
                <InfoCell label="Véhicule" value={inv.vehicle_model || "—"} />
                <InfoCell
                  label="Équipements"
                  value={`${inv.total_fire_extinguisher} ext. · ${inv.total_fire_hose} RIA`}
                />
              </div>

              {/* Client feedback */}
              {inv.client_feedback && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-lg p-3 text-xs">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    Feedback client :
                  </span>{" "}
                  <span className="text-slate-700 dark:text-slate-300 italic">
                    &quot;{inv.client_feedback}&quot;
                  </span>
                </div>
              )}
            </Card>

            {/* Equipment sub-table */}
            {inv.equipment_intervened.length > 0 && (
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Détail équipements traités
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {inv.equipment_intervened.length} équipement{inv.equipment_intervened.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 dark:bg-slate-900/30">
                        <th className="px-3 py-2.5 text-left text-[10px] uppercase text-slate-500 font-semibold">
                          QR Code
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] uppercase text-slate-500 font-semibold">
                          Type / Modèle
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] uppercase text-slate-500 font-semibold">
                          Action réalisée
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] uppercase text-slate-500 font-semibold">
                          Statut
                        </th>
                        <th className="px-3 py-2.5 text-center text-[10px] uppercase text-slate-500 font-semibold">
                          +
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {inv.equipment_intervened.map((eq) => {
                        const eqBadge = equipmentStatusBadge(eq.equipment_status);
                        const isExpanded = expandedEqId === eq.id;
                        return (
                          <Fragment key={eq.id}>
                            <tr
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                              onClick={() =>
                                setExpandedEqId(
                                  isExpanded ? null : eq.id
                                )
                              }
                            >
                              <td className="px-3 py-2.5 font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                {eq.equipment_qrc}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="text-slate-700 dark:text-slate-300 font-medium">
                                  {eq.equipment_type}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  {eq.equipment_model}
                                </div>
                              </td>
                              <td className="px-3 py-2.5 max-w-[200px] text-slate-600 dark:text-slate-400">
                                {eq.action_summary}
                              </td>
                              <td className="px-3 py-2.5">
                                <Badge variant={eqBadge.variant}>
                                  {eqBadge.label}
                                </Badge>
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {isExpanded ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-slate-400 inline" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 inline" />
                                )}
                              </td>
                            </tr>

                            {/* Expanded detail row */}
                            {isExpanded && (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="bg-slate-50/60 dark:bg-slate-900/40 px-4 py-3"
                                >
                                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-[11px]">
                                    {eq.inspection && (
                                      <MiniDetail
                                        label="Inspection"
                                        value={eq.inspection}
                                      />
                                    )}
                                    {eq.maintenance && (
                                      <MiniDetail
                                        label="Maintenance"
                                        value={eq.maintenance}
                                      />
                                    )}
                                    {eq.raw_recharge && (
                                      <MiniDetail
                                        label="Recharge"
                                        value={eq.raw_recharge}
                                      />
                                    )}
                                    {eq.nitrogen_recharge && (
                                      <MiniDetail
                                        label="Azote"
                                        value={eq.nitrogen_recharge}
                                      />
                                    )}
                                    {eq.additional_maintenance && (
                                      <MiniDetail
                                        label="Maintenance add."
                                        value={eq.additional_maintenance}
                                      />
                                    )}
                                    {eq.supply && (
                                      <MiniDetail
                                        label="Fourniture"
                                        value={eq.supply}
                                      />
                                    )}
                                    {eq.accessory && (
                                      <MiniDetail
                                        label="Accessoire"
                                        value={eq.accessory}
                                      />
                                    )}
                                    {eq.equipment_protection_name && (
                                      <MiniDetail
                                        label="Protection"
                                        value={eq.equipment_protection_name}
                                      />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Out of service list */}
            {m.out_of_service_eqs.length > 0 && (
              <AlertStrip variant="red" icon="🚫">
                <div>
                  <span className="font-semibold text-[13px]">
                    Équipements mis hors service
                  </span>
                  <ul className="mt-1 space-y-0.5 text-xs">
                    {m.out_of_service_eqs.map((eq) => (
                      <li key={eq.id}>
                        • {eq.equipment}
                        {eq.the_reason && (
                          <span className="text-slate-500 ml-1">
                            — {eq.the_reason}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </AlertStrip>
            )}
          </div>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer Tab: Rapport & Évaluation
// ═══════════════════════════════════════════════════════════════════════════

function DrawerRapport({ mission: m }: { mission: MissionFolder }) {
  const r = m.report;

  if (r.evaluation_score === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        Rapport non disponible — la mission n&apos;a pas encore été réalisée.
      </div>
    );
  }

  const eBadge = evaluationBadge(r.overall_evaluation, r.evaluation_score);

  return (
    <>
      {/* Score card */}
      <Card className="p-5 flex items-center gap-5">
        <div
          className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center ${
            r.overall_evaluation === "A"
              ? "bg-emerald-500/15"
              : r.overall_evaluation === "B"
              ? "bg-blue-500/15"
              : r.overall_evaluation === "C"
              ? "bg-orange-500/15"
              : "bg-red-500/15"
          }`}
        >
          <span className={`text-3xl font-black ${eBadge.color}`}>
            {r.overall_evaluation}
          </span>
          <span className={`text-sm font-bold ${eBadge.color}`}>
            {r.evaluation_score}%
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Évaluation Globale
          </h3>
          <ProgressBar
            value={r.evaluation_score}
            color={
              r.evaluation_score >= 90
                ? "bg-emerald-500"
                : r.evaluation_score >= 70
                ? "bg-blue-600"
                : r.evaluation_score >= 50
                ? "bg-orange-500"
                : "bg-red-500"
            }
            className="mt-2"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {r.standards_used.map((std) => (
              <span
                key={std.id}
                className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400"
              >
                <Shield className="w-3 h-3 mr-1" />
                {std.name}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* Safety & technical details */}
      <Card className="p-4 space-y-3">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          🛡️ Détails sécurité & techniques
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sécurité
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-[13px] mt-1 leading-relaxed">
              {r.safety_details}
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Technique
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-[13px] mt-1 leading-relaxed">
              {r.technical_details}
            </p>
          </div>
        </div>
      </Card>

      {/* Points to improve */}
      {r.points_to_improve.length > 0 && (
        <div className="bg-yellow-50/50 dark:bg-yellow-950/15 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-yellow-800 dark:text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            Points à améliorer ({r.points_to_improve.length})
          </div>
          <ul className="space-y-1.5 text-[13px] text-slate-700 dark:text-slate-300">
            {r.points_to_improve.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {r.recommendations.length > 0 && (
        <div className="bg-orange-50/50 dark:bg-orange-950/15 border border-orange-200 dark:border-orange-900/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-800 dark:text-orange-400">
            <Award className="w-4 h-4" />
            Recommandations ({r.recommendations.length})
          </div>
          <div className="space-y-2">
            {r.recommendations.map((rec) => {
              const pb = priorityBadge(rec.priority);
              return (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 p-2.5 rounded-md bg-white/60 dark:bg-slate-900/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-800 dark:text-slate-200 font-medium">
                      {rec.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={pb.variant}>
                        Priorité {rec.priority}
                      </Badge>
                      <span className="text-[11px] text-slate-500">
                        {rec.recommendation_status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compliances */}
      {r.compliances.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-4 h-4" />
            Notes de Conformité
          </div>
          <div className="space-y-2">
            {r.compliances.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-md bg-slate-50 dark:bg-slate-900/40 text-[13px]"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {c.compliance_desc}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>Norme : {c.applicable_standard}</span>
                    {c.action !== "Aucune" && (
                      <span>→ {c.action}</span>
                    )}
                  </div>
                </div>
                <Badge
                  variant={
                    c.compliance_status === "compliant"
                      ? "green"
                      : "red"
                  }
                  className="shrink-0"
                >
                  {c.compliance_status === "compliant" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Conforme
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Non conforme
                    </span>
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Risk assessments */}
      {r.risk_assessments.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            ⚡ Évaluation des Risques
          </div>
          <div className="space-y-2">
            {r.risk_assessments.map((ra) => (
              <div
                key={ra.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[13px] text-slate-800 dark:text-slate-200">
                    {ra.hazard}
                  </span>
                  <Badge
                    variant={
                      ra.risk_level === "Critical"
                        ? "red"
                        : ra.risk_level === "High"
                        ? "orange"
                        : "yellow"
                    }
                  >
                    {ra.risk_level}
                  </Badge>
                </div>
                {ra.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {ra.description}
                  </p>
                )}
                <div className="flex gap-4 text-[11px] text-slate-500">
                  <span>Probabilité: {ra.likelihood}</span>
                  <span>Gravité: {ra.severity}</span>
                </div>
                {ra.mitigation_strategy && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded p-2 mt-1">
                    🛡️ {ra.mitigation_strategy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* General remarks */}
      {r.general_remarks && (
        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed">
          💬 {r.general_remarks}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Drawer Tab: Documents Officiels
// ═══════════════════════════════════════════════════════════════════════════

function DrawerDocuments({ mission: m }: { mission: MissionFolder }) {
  const docs = m.documents;

  return (
    <>
      <Card className="p-5 space-y-4">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          📄 Documents Officiels
        </div>

        {/* Intervention report */}
        <button className="w-full p-5 rounded-xl border-2 border-dashed border-blue-300 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer text-left flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <FileText className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Télécharger le Rapport d&apos;Intervention
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {docs.intervention_report.name}
            </p>
            <div className="mt-1.5">
              <Badge
                variant={
                  docs.intervention_report.status === "available"
                    ? "green"
                    : docs.intervention_report.status === "generating"
                    ? "blue"
                    : "orange"
                }
              >
                {docs.intervention_report.status === "available"
                  ? "✅ Disponible"
                  : docs.intervention_report.status === "generating"
                  ? "⏳ En cours de génération"
                  : "🕐 En attente"}
              </Badge>
            </div>
          </div>
          {docs.intervention_report.status === "available" && (
            <Download className="w-5 h-5 text-blue-500 shrink-0" />
          )}
        </button>

        {/* Official certification */}
        <button className="w-full p-5 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer text-left flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-xl bg-emerald-600/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
            <Award className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Télécharger le Certificat Officiel
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {docs.official_certification.name}
            </p>
            <div className="mt-1.5">
              <Badge
                variant={
                  docs.official_certification.status === "available"
                    ? "green"
                    : docs.official_certification.status === "generating"
                    ? "blue"
                    : "orange"
                }
              >
                {docs.official_certification.status === "available"
                  ? "✅ Disponible"
                  : docs.official_certification.status === "generating"
                  ? "⏳ En cours de génération"
                  : "🕐 En attente"}
              </Badge>
            </div>
          </div>
          {docs.official_certification.status === "available" && (
            <Download className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
        </button>
      </Card>

      {/* Services covered */}
      {m.services.length > 0 && (
        <Card className="p-4 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            🔧 Services couverts par cette mission
          </div>
          <div className="flex flex-wrap gap-2">
            {m.services.map((svc) => (
              <span
                key={svc.id}
                className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                title={svc.description || ""}
              >
                {svc.name}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Suggestions */}
      {m.suggestions.length > 0 && (
        <Card className="p-4 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            💡 Suggestions
          </div>
          <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
            {m.suggestions.map((s) => (
              <li key={s.id} className="flex items-start gap-2">
                <CircleDot className="w-3 h-3 text-blue-500 mt-1 shrink-0" />
                {s.name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Shared UI Utilities
// ═══════════════════════════════════════════════════════════════════════════

function InfoCell({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <p
        className={`text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 block">
        {value}
      </span>
    </div>
  );
}

function EvalIndicator({
  label,
  value,
  desc,
}: {
  label: string;
  value: string;
  desc: string | null;
}) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 space-y-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
        {label}
      </span>
      <p className="text-base font-black text-slate-800 dark:text-slate-200">
        {value}
      </p>
      {desc && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          {desc}
        </p>
      )}
    </div>
  );
}
