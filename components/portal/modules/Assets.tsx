"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AlertStrip } from "../ui/AlertStrip";
import { useState, useMemo } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Search, Scan, X } from "lucide-react";
import { mockAssetsData } from "@/data/mockAssetsData";
import type {
  Equipment,
  EquipmentStatus,
  EquipmentZone,
  QrCodeLog,
  Zone,
} from "@/types/assetsPortal";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Format ISO date string to DD/MM/YYYY */
function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

/** Format ISO datetime to DD/MM/YYYY HH:mm */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} à ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Check if a date string is in the past */
function isPastDate(iso: string | null): boolean {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

/** Days until a date (negative = overdue) */
function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - new Date().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// ── Status → Badge variant mapping ──────────────────────────────────────────

function equipmentStatusBadge(status: EquipmentStatus | null): {
  variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple";
  label: string;
  icon: string;
} {
  const map: Record<
    EquipmentStatus,
    { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string; icon: string }
  > = {
    compliant: { variant: "green", label: "Conforme", icon: "✅" },
    needs_inspection: { variant: "orange", label: "À inspecter", icon: "🔍" },
    non_compliant: { variant: "red", label: "Non conforme", icon: "⚠️" },
    out_of_service: { variant: "red", label: "Hors service", icon: "🚫" },
    pending_delivery: { variant: "blue", label: "En livraison", icon: "📦" },
    decommissioned: { variant: "gray", label: "Déclassé", icon: "🗑️" },
  };
  if (!status) return { variant: "gray", label: "Inconnu", icon: "❓" };
  return map[status];
}

function qrActionLabel(action: string): { label: string; variant: "green" | "blue" | "orange" | "red" | "gray" } {
  const map: Record<string, { label: string; variant: "green" | "blue" | "orange" | "red" | "gray" }> = {
    created: { label: "Création", variant: "green" },
    updated: { label: "Mise à jour", variant: "blue" },
    replaced: { label: "Remplacement", variant: "orange" },
    deactivated: { label: "Désactivation", variant: "red" },
  };
  return map[action] || { label: action, variant: "gray" };
}

// ── Data preparation ────────────────────────────────────────────────────────

const { fleets, allEquipment, allZones, allEquipmentZones, allQrCodeLogs } = mockAssetsData;
const fleet = fleets[0]; // Single fleet for demo

/** Get equipment-zone records for a given zone */
function getEquipmentForZone(zoneId: number): (EquipmentZone & { equipment: Equipment })[] {
  return allEquipmentZones
    .filter((ez) => ez.zone_id === zoneId)
    .map((ez) => ({
      ...ez,
      equipment: allEquipment.find((e) => e.id === ez.equipment_id)!,
    }))
    .filter((ez) => ez.equipment);
}

/** Get zone info by id */
function getZone(zoneId: number): Zone | undefined {
  return allZones.find((z) => z.id === zoneId);
}

/** Get QR code logs for an equipment */
function getQrCodeLogs(equipmentId: number): QrCodeLog[] {
  return allQrCodeLogs
    .filter((log) => log.equipment_id === equipmentId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/** Get zone + location for an equipment */
function getEquipmentLocation(equipmentId: number): { zone: Zone; pivot: EquipmentZone } | null {
  const pivot = allEquipmentZones.find((ez) => ez.equipment_id === equipmentId);
  if (!pivot) return null;
  const zone = getZone(pivot.zone_id);
  if (!zone) return null;
  return { zone, pivot };
}

// ── Filter tabs ─────────────────────────────────────────────────────────────

const filterTabs = ["Tous", "Conformes", "À inspecter", "Non conformes", "Hors service"] as const;
type FilterTab = (typeof filterTabs)[number];

const filterToStatus: Record<FilterTab, EquipmentStatus | null> = {
  "Tous": null,
  "Conformes": "compliant",
  "À inspecter": "needs_inspection",
  "Non conformes": "non_compliant",
  "Hors service": "out_of_service",
};

// ── Component ───────────────────────────────────────────────────────────────

export default function Assets() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Tous");
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  // ── KPI computations ──
  const kpis = useMemo(() => {
    const total = allEquipment.length;
    const compliant = allEquipment.filter((e) => e.equipment_current_status === "compliant").length;
    const needsInspection = allEquipment.filter(
      (e) => e.equipment_current_status === "needs_inspection" || isPastDate(e.date_next_inspection)
    ).length;
    const outOfService = allEquipment.filter(
      (e) => e.equipment_current_status === "out_of_service"
    ).length;
    const nonCompliant = allEquipment.filter(
      (e) => e.equipment_current_status === "non_compliant"
    ).length;
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;
    return { total, compliant, needsInspection, outOfService, nonCompliant, complianceRate };
  }, []);

  // ── Filtered equipment ──
  const filteredEquipment = useMemo(() => {
    let eq = allEquipment;
    
    // Status Filter
    const statusFilter = filterToStatus[activeFilter];
    if (statusFilter) {
      eq = eq.filter((e) => e.equipment_current_status === statusFilter);
    }
    
    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      eq = eq.filter(e => 
        e.equipment_qrc.toLowerCase().includes(q) || 
        e.internal_id?.toLowerCase().includes(q) ||
        e.equipment_model_name.fr.toLowerCase().includes(q) ||
        (e.brand && e.brand.toLowerCase().includes(q))
      );
    }
    
    return eq;
  }, [activeFilter, searchQuery]);

  // ── Open detail drawer ──
  function openDetail(eq: Equipment) {
    setSelectedEquipment(eq);
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setSelectedEquipment(null), 300);
  }

  // ── Overdue inspections alert ──
  const overdueItems = allEquipment.filter(
    (e) => e.date_next_inspection && isPastDate(e.date_next_inspection) && e.equipment_current_status !== "out_of_service" && e.equipment_current_status !== "decommissioned"
  );

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          🧯 Mes Équipements
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Inventaire et suivi de conformité — {fleet.fleet_name} · {allZones.length} zones · {allEquipment.length} équipements
        </p>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <Card className="p-4 lg:p-5 border-l-4 border-l-blue-600 dark:border-l-blue-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Total Équipements
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-blue-600 dark:text-blue-400">
            {kpis.total}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {allZones.length} zones actives
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-emerald-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Conformes
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-emerald-500 dark:text-emerald-400">
            {kpis.compliant}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Taux : {kpis.complianceRate}%
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-orange-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            À Inspecter
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-orange-500 dark:text-orange-400">
            {kpis.needsInspection}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Inspections en attente
          </div>
        </Card>

        <Card className="p-4 lg:p-5 border-l-4 border-l-red-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Non Conformes
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-red-500 dark:text-red-400">
            {kpis.nonCompliant}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Action corrective requise
          </div>
        </Card>

        <Card className="col-span-2 lg:col-span-1 p-4 lg:p-5 border-l-4 border-l-red-800 dark:border-l-red-600 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Hors Service
          </div>
          <div className="text-3xl font-black leading-none mb-1 text-red-800 dark:text-red-500">
            {kpis.outOfService}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Remplacement à prévoir
          </div>
        </Card>
      </div>

      {/* ─── Alert Strip ─────────────────────────────────────────── */}
      {overdueItems.length > 0 && (
        <AlertStrip variant="orange" icon="⚠️">
          <span className="font-medium text-[13px]">
            {overdueItems.length} équipement{overdueItems.length > 1 ? "s" : ""} avec inspection en retard —{" "}
            {overdueItems.map((e) => e.internal_id).join(", ")}
          </span>
        </AlertStrip>
      )}

      {/* ─── Fleet Info Card ─────────────────────────────────────── */}
      <Card className="p-4 lg:p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                {fleet.fleet_id}
              </span>
              <Badge variant="green">Actif</Badge>
              <Badge variant="blue">Sécurité incendie</Badge>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-semibold">
              {fleet.fleet_name}
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
            <span>Mis à jour : {formatDate(fleet.updated_at)}</span>
          </div>
        </div>
        {fleet.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed mt-3">
            💬 {fleet.notes}
          </p>
        )}

        {/* Zone summary chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {allZones.map((zone) => {
            const eqCount = allEquipmentZones.filter((ez) => ez.zone_id === zone.id).length;
            return (
              <div
                key={zone.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/60 text-xs"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">{zone.zone_name}</span>
                <span className="text-slate-500 dark:text-slate-400">· {eqCount} éq.</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ─── Filter Tabs ─────────────────────────────────────────── */}
      <Card className="p-3 flex flex-wrap gap-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab;
          const count =
            tab === "Tous"
              ? allEquipment.length
              : allEquipment.filter((e) => e.equipment_current_status === filterToStatus[tab]).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg font-semibold text-[13px] cursor-pointer border-none transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </Card>

      {/* ─── Equipment Data Table ────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-bold text-sm block">
              Inventaire — {activeFilter === "Tous" ? "Tous les équipements" : activeFilter}
            </span>
            <span className="text-xs text-slate-500">
              {filteredEquipment.length} équipement{filteredEquipment.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Chercher (QR, Modèle, ID)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button 
              onClick={() => setShowScanner(!showScanner)}
              className={`p-2 border rounded-lg transition-colors flex items-center justify-center
                ${showScanner 
                  ? "bg-blue-600 border-blue-600 text-white" 
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"}
              `}
              title="Scanner QR Code"
            >
              <Scan size={18} />
            </button>
          </div>
        </div>

        {showScanner && (
          <div className="p-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 flex justify-center animate-in slide-in-from-top-2">
            <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-video flex-shrink-0 shadow-inner">
              <Scanner 
                onScan={(res) => {
                  if (res.length > 0) {
                    setSearchQuery(res[0].rawValue);
                    setShowScanner(false);
                  }
                }}
                components={{ finder: true, zoom: false }}
              />
              <button 
                onClick={() => setShowScanner(false)} 
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
              >
                <X size={16} />
              </button>
              <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                  Pointez sur un QR Code
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  QR Code
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  Catégorie / Modèle
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  Marque
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  Zone / Emplacement
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">
                  Prochaine Inspection
                </th>
                <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEquipment.map((eq) => {
                const badge = equipmentStatusBadge(eq.equipment_current_status);
                const location = getEquipmentLocation(eq.id);
                const overdue = isPastDate(eq.date_next_inspection);
                const days = daysUntil(eq.date_next_inspection);

                return (
                  <tr
                    key={eq.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* QR Code */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-blue-600/10 text-blue-600 dark:text-blue-400 text-xs">
                          ⊞
                        </span>
                        <div>
                          <div className="font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                            {eq.equipment_qrc}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{eq.internal_id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category / Model */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 text-[13px]">
                        {eq.equipment_model_name.fr}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {eq.subcategory_name.fr} · {eq.capacity_value}{eq.capacity_abbreviation?.fr}
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-[13px]">
                      {eq.brand || "—"}
                    </td>

                    {/* Zone / Location */}
                    <td className="px-4 py-3">
                      {location ? (
                        <div>
                          <div className="font-semibold text-[13px] text-slate-700 dark:text-slate-300">
                            {location.zone.zone_name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[200px] truncate" title={location.pivot.direction_notes || ""}>
                            {location.pivot.floor && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold mr-1">
                                {location.pivot.floor}
                              </span>
                            )}
                            {location.pivot.direction_notes}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>
                        {badge.icon} {badge.label}
                      </Badge>
                    </td>

                    {/* Next Inspection */}
                    <td className="px-4 py-3">
                      <div
                        className={`text-[13px] font-semibold ${
                          overdue
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {formatDate(eq.date_next_inspection)}
                      </div>
                      {days !== null && (
                        <div
                          className={`text-[11px] mt-0.5 ${
                            overdue
                              ? "text-red-500 dark:text-red-400 font-semibold"
                              : "text-slate-400"
                          }`}
                        >
                          {overdue
                            ? `⚠️ Retard de ${Math.abs(days)} jours`
                            : `Dans ${days} jours`}
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => openDetail(eq)}
                        className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 transition-colors cursor-pointer border-none"
                      >
                        Voir Détails
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredEquipment.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-400 text-sm">
                    Aucun équipement ne correspond au filtre sélectionné.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ─── Zone-by-Zone Breakdown ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {allZones.map((zone) => {
          const zoneEquipment = getEquipmentForZone(zone.id);
          const compliantCount = zoneEquipment.filter(
            (ez) => ez.equipment.equipment_current_status === "compliant"
          ).length;
          const issueCount = zoneEquipment.length - compliantCount;

          return (
            <Card key={zone.id} className="p-4 lg:p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {zone.zone_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {zoneEquipment.length} équipement{zoneEquipment.length > 1 ? "s" : ""}
                  </p>
                </div>
                {issueCount > 0 ? (
                  <Badge variant="orange">{issueCount} alerte{issueCount > 1 ? "s" : ""}</Badge>
                ) : (
                  <Badge variant="green">Tous conformes</Badge>
                )}
              </div>

              {zone.zone_description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {zone.zone_description}
                </p>
              )}

              {/* Mini compliance bar */}
              <div className="w-full">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                  <span>Conformité zone</span>
                  <span className="font-semibold">
                    {zoneEquipment.length > 0
                      ? Math.round((compliantCount / zoneEquipment.length) * 100)
                      : 100}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      compliantCount === zoneEquipment.length
                        ? "bg-emerald-500"
                        : compliantCount > 0
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${
                        zoneEquipment.length > 0
                          ? (compliantCount / zoneEquipment.length) * 100
                          : 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Equipment list */}
              <div className="space-y-1.5">
                {zoneEquipment.map((ez) => {
                  const sb = equipmentStatusBadge(ez.equipment.equipment_current_status);
                  return (
                    <div
                      key={ez.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => openDetail(ez.equipment)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                          {ez.equipment.internal_id}
                        </span>
                        <span className="truncate text-slate-700 dark:text-slate-300">
                          {ez.equipment.equipment_model_name.fr}
                        </span>
                      </div>
                      <Badge variant={sb.variant} className="shrink-0 ml-2">
                        {sb.icon}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DETAIL DRAWER / MODAL OVERLAY
       ═══════════════════════════════════════════════════════════════ */}
      {(drawerOpen || selectedEquipment) && (
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 bg-black/40 dark:bg-black/60 z-[9998] transition-opacity duration-300 ${
              drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-full max-w-[560px] z-[9999] bg-[var(--card-bg)] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto ${
              drawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {selectedEquipment && (
              <EquipmentDetailDrawer equipment={selectedEquipment} onClose={closeDrawer} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Detail Drawer Sub-Component ─────────────────────────────────────────────

export function EquipmentDetailDrawer({
  equipment: eq,
  onClose,
}: {
  equipment: Equipment;
  onClose: () => void;
}) {
  const badge = equipmentStatusBadge(eq.equipment_current_status);
  const location = getEquipmentLocation(eq.id);
  const logs = getQrCodeLogs(eq.id);
  const [activeTab, setActiveTab] = useState<"Détails" | "Cycle de vie" | "Maintenance">("Détails");

  return (
    <div className="flex flex-col h-full">
      {/* ─── Drawer Header ─── */}
      <div className="sticky top-0 z-10 bg-[var(--card-bg)] border-b border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
              {eq.equipment_qrc}
            </span>
            <Badge variant={badge.variant}>
              {badge.icon} {badge.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{eq.internal_id} · {eq.serial_number}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer border-none bg-transparent text-lg"
          aria-label="Fermer"
        >
          ✕
        </button>
      </div>

      {/* ─── Drawer Body ─── */}
      <div className="flex-1 p-5 space-y-5 overflow-y-auto">
        {/* Model / Category */}
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
            {eq.equipment_model_name.fr}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {eq.category_name.fr} › {eq.subcategory_name.fr} · {eq.capacity_value}{eq.capacity_abbreviation?.fr}
          </p>
        </div>

        {/* ─── Tabs Navigation ─── */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {["Détails", "Cycle de vie", "Maintenance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-semibold text-[13px] transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Détails" && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">


        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          <InfoCell label="Marque" value={eq.brand || "—"} />
          <InfoCell label="N° de série" value={eq.serial_number || "—"} mono />
          <InfoCell label="Pression" value={eq.pressure_name?.fr || "—"} />
          <InfoCell label="Certifications" value={eq.certifications || "—"} />
          <InfoCell label="Date de fabrication" value={formatDate(eq.mfg_date)} />
          <InfoCell label="Date d'installation" value={formatDate(eq.installation_date)} />
        </div>

        {/* Location */}
        {location && (
          <Card className="p-4 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              📍 Emplacement
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {location.zone.zone_name}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {location.pivot.floor && (
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  🏢 {location.pivot.floor}
                </span>
              )}
              {location.pivot.direction_notes && (
                <span className="text-slate-500 dark:text-slate-400">
                  → {location.pivot.direction_notes}
                </span>
              )}
            </div>
          </Card>
        )}

        {/* Inspection Dates */}
        <Card className="p-4 space-y-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            📅 Échéances
          </div>
          <div className="space-y-2">
            <DateRow
              label="Prochaine inspection"
              date={eq.date_next_inspection}
              alert={isPastDate(eq.date_next_inspection)}
            />
            <DateRow
              label="Épreuve hydraulique"
              date={eq.date_next_hydro_test}
              alert={isPastDate(eq.date_next_hydro_test)}
            />
            {eq.date_next_second_hydro_test && (
              <DateRow
                label="2ème épreuve hydraulique"
                date={eq.date_next_second_hydro_test}
                alert={isPastDate(eq.date_next_second_hydro_test)}
              />
            )}
          </div>
        </Card>

        {/* Notes */}
        {eq.notes && (
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed">
            💬 {eq.notes}
          </div>
        )}

        {/* ─── QR Code Logs ─── */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">
            🔄 Historique QR Code ({logs.length} entrée{logs.length > 1 ? "s" : ""})
          </div>
          {logs.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/60">
                    <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">
                      Date
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">
                      Action
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">
                      Ancien QRC
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">
                      Nouveau QRC
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">
                      Utilisateur
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.map((log) => {
                    const action = qrActionLabel(log.action);
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-white/50 dark:hover:bg-slate-800/30"
                      >
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDateTime(log.created_at)}
                        </td>
                        <td className="px-3 py-2">
                          <Badge variant={action.variant}>{action.label}</Badge>
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {log.old_qr_code || "—"}
                        </td>
                        <td className="px-3 py-2 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {log.new_qr_code}
                        </td>
                        <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                          {log.user_name || `User #${log.user_id}`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Aucun historique de QR code disponible.
            </p>
          )}
        </div>
          </div>
        )}

        {/* ─── Timeline Tab ─── */}
        {activeTab === "Cycle de vie" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Traçabilité et cycle de vie</h4>
            
            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-6 pb-4">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-700 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">{formatDate(eq.mfg_date)}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fabrication</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">{formatDate(eq.installation_date)}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Installation initiale</p>
              </div>

              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">Aujourd'hui</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dernière inspection conforme</p>
              </div>

              <div className="relative pl-6">
                <div className={`absolute w-3 h-3 ${isPastDate(eq.date_next_hydro_test) ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-400'} rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900`} />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">{formatDate(eq.date_next_hydro_test)}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">1ère Épreuve Hydraulique (10 ans)</p>
                <p className="text-xs text-slate-500 mt-1">Nécessite retour en atelier.</p>
              </div>

              <div className="relative pl-6 opacity-60">
                <div className="absolute w-3 h-3 bg-slate-400 rounded-full -left-[7px] top-1 border-2 border-white dark:border-slate-900" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
                  {eq.mfg_date ? `${parseInt(eq.mfg_date.substring(0, 4)) + 20}-01-01` : "—"}
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fin de vie (20 ans)</p>
                <p className="text-xs text-slate-500 mt-1">Déclassement recommandé.</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Maintenance & Parts Tab ─── */}
        {activeTab === "Maintenance" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <Card className="p-4 bg-slate-50 dark:bg-slate-900/50">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">Statistiques Maintenance</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Coût cumulé (TND)</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">340,00</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">MTBF Estimé</p>
                  <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">14 <span className="text-sm text-slate-500">mois</span></p>
                </div>
              </div>
              
              {/* Mock simple bar chart */}
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Consommation pièces de rechange (2 ans)</p>
                <div className="flex gap-2 items-end h-20 border-b border-slate-200 dark:border-slate-700 pb-1">
                  <div className="w-1/4 bg-blue-100 dark:bg-blue-900/30 rounded-t flex flex-col justify-end" style={{ height: "40%" }}>
                    <span className="text-[10px] text-center mb-1 text-slate-500">Goupille</span>
                  </div>
                  <div className="w-1/4 bg-blue-200 dark:bg-blue-800/40 rounded-t flex flex-col justify-end" style={{ height: "70%" }}>
                    <span className="text-[10px] text-center mb-1 text-slate-500">J. Torique</span>
                  </div>
                  <div className="w-1/4 bg-blue-400 dark:bg-blue-600/50 rounded-t flex flex-col justify-end" style={{ height: "100%" }}>
                    <span className="text-[10px] text-center mb-1 text-blue-900 dark:text-blue-100 font-bold">Poudre</span>
                  </div>
                  <div className="w-1/4 bg-blue-100 dark:bg-blue-900/30 rounded-t flex flex-col justify-end" style={{ height: "20%" }}>
                    <span className="text-[10px] text-center mb-1 text-slate-500">Tuyau</span>
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">Dernières interventions</h4>
              <div className="space-y-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Recharge complète poudre ABC</span>
                    <span className="text-[10px] text-slate-500">Il y a 8 mois</span>
                  </div>
                  <p className="text-xs text-slate-500">Remplacement joint torique et goupille suite à chute de pression. Facture: INV-2023-112</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Inspection Visuelle (Annuelle)</span>
                    <span className="text-[10px] text-slate-500">Il y a 1an</span>
                  </div>
                  <p className="text-xs text-slate-500">Appareil conforme, bon état de surface.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Drawer Footer ─── */}
      <div className="sticky bottom-0 bg-[var(--card-bg)] border-t border-slate-200 dark:border-slate-800 px-5 py-3 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400">
          Créé le {formatDate(eq.created_at)} · Maj {formatDate(eq.updated_at)}
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors cursor-pointer border-none">
            Télécharger PDF
          </button>
          <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer border-none">
            Demander Inspection
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Micro Sub-Components ────────────────────────────────────────────────────

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
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      <p className={`font-semibold text-sm mt-0.5 text-slate-800 dark:text-slate-200 ${mono ? "font-mono text-[13px]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function DateRow({
  label,
  date,
  alert,
}: {
  label: string;
  date: string | null;
  alert: boolean;
}) {
  const days = daysUntil(date);
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <div className="text-right">
        <span
          className={`font-semibold ${
            alert ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-200"
          }`}
        >
          {formatDate(date)}
        </span>
        {alert && days !== null && (
          <span className="text-[11px] text-red-500 dark:text-red-400 ml-2 font-semibold">
            ⚠️ -{Math.abs(days)}j
          </span>
        )}
      </div>
    </div>
  );
}
