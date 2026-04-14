"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { mockBlueprints } from "@/data/mockCatalogData";
import type { EquipmentBlueprint, BlueprintConsumable, BlueprintServicing, GuidelineStep } from "@/types/catalog";

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(price: number | null, currency = "TND"): string {
  if (price === null) return "—";
  return (
    new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price) + ` ${currency}`
  );
}

function equipmentClassLabel(ec: string): string {
  const labels: Record<string, string> = {
    portable_extinguisher: "Extincteur portatif",
    wheeled_extinguisher: "Extincteur sur roues",
    fixed_suppression_system: "Système fixe d'extinction",
    detection_panel: "Centrale de détection",
    detector: "Détecteur",
    hose_reel: "RIA",
    fire_blanket: "Couverture anti-feu",
    other: "Autre",
  };
  return labels[ec] || ec;
}

function equipmentIcon(ec: string): string {
  return ec === "portable_extinguisher" ? "🧯" : ec === "detection_panel" ? "🖥️" : "🔩";
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="green">Actif</Badge>;
    case "draft":
      return <Badge variant="yellow">Brouillon</Badge>;
    case "inactive":
      return <Badge variant="gray">Inactif</Badge>;
    default:
      return <Badge variant="gray">{status}</Badge>;
  }
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Blueprints() {
  const [selectedBlueprint, setSelectedBlueprint] = useState<EquipmentBlueprint | null>(null);

  const uniqueComponents = new Set(mockBlueprints.flatMap((bp) => (bp.consumables || []).map((c) => c.catalog_item_id))).size;
  const linkedServices = new Set(mockBlueprints.flatMap((bp) => (bp.servicing || []).map((s) => s.catalog_item_id))).size;

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          🔩 Blueprints Techniques
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configurations d&apos;équipements standardisées avec liste de composants, services associés et spécifications techniques.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Blueprints</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{mockBlueprints.length}</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Actifs</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {mockBlueprints.filter((bp) => bp.status === "active").length}
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Composants uniques</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            {uniqueComponents}
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Services liés</div>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400">
            {linkedServices}
          </div>
        </Card>
      </div>

      {/* Blueprints Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Configuration Blueprint</th>
                <th className="text-left px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Classe</th>
                <th className="text-left px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Statut</th>
                <th className="text-center px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Composants</th>
                <th className="text-center px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Guidelines</th>
                <th className="text-right px-5 py-4 text-xs text-slate-500 font-bold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockBlueprints.map((bp) => (
                <tr 
                  key={bp.id} 
                  onClick={() => setSelectedBlueprint(bp)}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg flex-shrink-0 shadow-sm">
                         {equipmentIcon(bp.equipment_class)}
                       </div>
                       <div>
                         <div className="font-bold text-slate-900 dark:text-white">{bp.name.fr}</div>
                         <div className="font-mono text-[11px] text-slate-500 mt-0.5">{bp.code}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-300">
                    {equipmentClassLabel(bp.equipment_class)}
                  </td>
                  <td className="px-5 py-4">
                    {statusBadge(bp.status)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Badge variant="blue">{(bp.consumables || []).length} items</Badge>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {bp.guideline ? (
                      <Badge variant="green">Oui</Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Ouvrir ➔</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Modal overlay ── */}
      {selectedBlueprint && (
        <BlueprintModal 
          bp={selectedBlueprint} 
          onClose={() => setSelectedBlueprint(null)} 
        />
      )}
    </div>
  );
}


// ── Blueprint Modal ─────────────────────────────────────────────────────────

type ModalTab = "specs" | "components" | "guidelines" | "documents";

function BlueprintModal({ bp, onClose }: { bp: EquipmentBlueprint; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<ModalTab>("specs");

  const consumables = bp.consumables || [];
  const servicing = bp.servicing || [];
  const totalComponentCost = consumables.reduce((acc, c) => {
    const price = c.item?.base_price ?? 0;
    return acc + price * c.quantity;
  }, 0);

  const docsMedia = bp.media?.filter(m => !m.mime_type.startsWith("image/")) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-inner flex items-center justify-center text-white text-2xl flex-shrink-0">
              {equipmentIcon(bp.equipment_class)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight">
                  {bp.name.fr}
                </h3>
                {statusBadge(bp.status)}
              </div>
              <div className="font-mono text-[13px] text-slate-500">{bp.code}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body & Tabs */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tab Strip */}
          <div className="flex border-b border-slate-100 dark:border-slate-800/80 px-4 bg-white dark:bg-slate-900">
             <button 
                onClick={() => setActiveTab("specs")}
                className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'specs' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Spécifications techniques
              </button>
              <button 
                onClick={() => setActiveTab("components")}
                className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'components' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Composants & Services <Badge variant="blue" className="ml-1 px-1.5 py-0 text-[10px]">{consumables.length + servicing.length}</Badge>
              </button>
              <button 
                onClick={() => setActiveTab("guidelines")}
                className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'guidelines' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Guidelines {bp.guideline && <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 py-0.5 px-1.5 rounded text-[10px]">1</span>}
              </button>
              <button 
                onClick={() => setActiveTab("documents")}
                className={`px-5 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documents' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Documents {docsMedia.length > 0 && <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-0.5 px-1.5 rounded text-[10px]">{docsMedia.length}</span>}
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 dark:bg-slate-900/10">
            {activeTab === "specs" && (
                <div className="space-y-6">
                   {bp.description && (
                     <div className="max-w-3xl">
                       <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Description du Blueprint</h4>
                       <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                         {bp.description.fr}
                       </p>
                     </div>
                   )}
                   <div>
                     <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Informations Physiques & Réglementaires</h4>
                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                         <SpecItem label="Classe équipement" value={equipmentClassLabel(bp.equipment_class)} />
                          {bp.capacity_value && (
                            <SpecItem label="Capacité" value={`${bp.capacity_value} ${bp.capacity_unit || ""}`} />
                          )}
                          {bp.working_pressure_bar && (
                            <SpecItem label="Pression service" value={`${bp.working_pressure_bar} bar`} />
                          )}
                          {bp.fire_class_rating && (
                            <SpecItem label="Classification feu" value={bp.fire_class_rating} />
                          )}
                          <SpecItem label="Fréquence inspection" value={bp.inspection_frequency} />
                          {bp.hydro_test_frequency && (
                            <SpecItem label="Épreuve hydraulique" value={bp.hydro_test_frequency} />
                          )}
                          {bp.default_expiry_years && (
                            <SpecItem label="Durée de vie (estim.)" value={`${bp.default_expiry_years} ans`} />
                          )}
                          {bp.regulatory_standard && (
                            <SpecItem label="Norme réglementaire" value={bp.regulatory_standard} />
                          )}
                          <SpecItem label="Jauge pression" value={bp.has_pressure_gauge ? "✅ Présente" : "❌ Aucune"} />
                          <SpecItem label="Plomb sécurité" value={bp.has_tamper_seal ? "✅ Requis" : "❌ Non"} />
                          <SpecItem label="Traçabilité N° Série" value={bp.requires_serial_number ? "✅ Requise" : "❌ Non"} />
                          {bp.serial_number_format && (
                            <SpecItem label="Format N° série" value={bp.serial_number_format} mono />
                          )}
                     </div>
                   </div>
                </div>
            )}

            {activeTab === "components" && (
                <div className="space-y-8">
                  {/* Consumables Table */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        📋 Nomenclature (BOM)
                      </h4>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 mr-2">Coût total du kit:</span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">{formatPrice(totalComponentCost)}</span>
                      </div>
                    </div>
                    
                    {consumables.length > 0 ? (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Composant</th>
                              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Code/SKU</th>
                              <th className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Type</th>
                              <th className="text-center px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Quantité</th>
                              <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">P.Unitaire</th>
                              <th className="text-right px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Sous-total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {consumables.map((c) => <ConsumableRow key={c.id} consumable={c} />)}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm italic py-4">Aucun composant matériel configuré.</div>
                    )}
                  </div>

                  {/* Servicing List */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                      🔧 Opérations de maintenance et services habilités
                    </h4>
                    {servicing.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {servicing.map((s) => <ServicingRow key={s.id} servicing={s} />)}
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm italic py-4">Aucun service associé configuré.</div>
                    )}
                  </div>

                </div>
            )}

            {activeTab === "guidelines" && (
                <div>
                   <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">Procédures & Consignes de Maintenance</h4>
                   {bp.guideline ? (
                      <div className="max-w-3xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                          <h3 className="font-black text-lg text-slate-900 dark:text-white mb-1">{bp.guideline.name.fr}</h3>
                          <div className="font-mono text-xs text-blue-600 dark:text-blue-400 mb-3">{bp.guideline.code}</div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{bp.guideline.description?.fr}</p>
                        </div>
                        <div className="p-0">
                          {bp.guideline.steps?.length ? (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800/50">
                              {bp.guideline.steps.sort((a,b) => a.sort_order - b.sort_order).map((step, idx) => (
                                <li key={step.id} className="flex gap-4 p-5 hover:bg-slate-50 flex flex-col md:flex-row dark:hover:bg-slate-800/20 transition-colors">
                                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                  </div>
                                  <div className="pt-1 flex-1">
                                    <div className="font-semibold text-slate-900 dark:text-white text-sm mb-1.5">{step.instruction.fr}</div>
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-bold tracking-widest uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                                         Type: {step.step_type}
                                       </span>
                                       {step.is_required && (
                                         <span className="text-[10px] font-bold tracking-widest uppercase text-red-500">Requis *</span>
                                       )}
                                       {step.expected_value && (
                                         <span className="text-[10px] font-mono bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 px-1.5 py-0.5 rounded ml-2">
                                           Attendu: {step.expected_value}
                                         </span>
                                       )}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="p-6 text-center text-slate-500">Aucune étape définie pour cette procédure.</div>
                          )}
                        </div>
                      </div>
                   ) : (
                     <div className="text-center py-12 px-4 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl max-w-3xl">
                       <div className="text-4xl mb-3 opacity-30">📋</div>
                       <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Aucune guideline attachée</h4>
                       <p className="text-sm text-slate-500 mt-1">Aucune procédure de maintenance n'est spécifiée pour ce blueprint de manière globale.</p>
                     </div>
                   )}
                </div>
            )}

            {activeTab === "documents" && (
                <div className="space-y-4 max-w-3xl">
                  {docsMedia.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-white dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      <div className="text-3xl mb-2 opacity-50">📄</div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucun document technique</h4>
                      <p className="text-xs text-slate-500 mt-1">Pas de schémas de montage ou déclarations de conformité attachées.</p>
                    </div>
                  ) : (
                    docsMedia.map((doc) => (
                      <a key={doc.id} href={doc.url} onClick={(e) => e.preventDefault()} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:border-blue-500 hover:shadow-sm transition-all group">
                         <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-2xl shrink-0">
                           {doc.mime_type === "application/pdf" ? "📕" : "📄"}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                             {doc.file_name}
                           </div>
                           <div className="text-xs text-slate-500 uppercase flex items-center gap-2 mt-1 font-mono">
                             <span className="font-semibold">{doc.collection_name}</span>
                             <span>•</span>
                             <span>{(doc.size / 1024).toFixed(1)} KB</span>
                           </div>
                         </div>
                         <div className="text-slate-400 group-hover:text-blue-500 transition-colors font-bold text-sm bg-slate-50 dark:bg-slate-900 group-hover:bg-blue-50 py-2 px-3 rounded-lg">
                           Télécharger
                         </div>
                      </a>
                    ))
                  )}
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}


// ── Sub-components for Blueprint contents ───────────────────────────────────

function SpecItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className={`text-sm font-semibold text-slate-900 dark:text-white ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function ConsumableRow({ consumable: c }: { consumable: BlueprintConsumable }) {
  const item = c.item;
  const unitPrice = item?.base_price ?? 0;
  const subtotal = unitPrice * c.quantity;

  const typeLabel =
    item?.item_type === "product"
      ? "Produit principal"
      : item?.item_type === "consumable"
        ? "Consommable"
        : "Autre";

  const typeBadgeVariant =
    item?.item_type === "product"
      ? "blue"
      : item?.item_type === "consumable"
        ? "purple"
        : "gray";

  return (
    <tr className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors bg-white dark:bg-slate-800/80">
      <td className="px-4 py-3 border-l-2 border-transparent">
        <div className="font-bold text-sm text-slate-900 dark:text-white">{item?.name.fr ?? "—"}</div>
      </td>
      <td className="px-4 py-3 font-mono text-[11px] font-medium text-slate-500">{item?.code ?? "—"}</td>
      <td className="px-4 py-3">
        <Badge variant={typeBadgeVariant as any}>{typeLabel}</Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-black border border-slate-200 dark:border-slate-600">
          x{c.quantity}
        </span>
      </td>
      <td className="px-4 py-3 text-right font-mono text-xs text-slate-500 dark:text-slate-400">
        {formatPrice(unitPrice)}
      </td>
      <td className="px-4 py-3 text-right font-mono text-sm font-black text-slate-900 dark:text-white">
        {formatPrice(subtotal)}
      </td>
    </tr>
  );
}

function ServicingRow({ servicing: s }: { servicing: BlueprintServicing }) {
  const item = s.item;

  let deliveryLabel = "—";
  let recurLabel = "—";
  if (item?.item_type === "eq_servicing") {
    const es = (item as any).eq_servicing;
    const modeLabels: Record<string, string> = { on_site: "Sur site", workshop: "Atelier", hybrid: "Hybride" };
    deliveryLabel = modeLabels[es.delivery_mode] || es.delivery_mode;
    recurLabel = es.is_recurring ? `Tous les ${es.recurrence_months} mois` : "Ponctuel";
  }

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-lg">
          🔧
        </div>
        <div>
          <div className="font-bold text-sm text-slate-900 dark:text-white mb-0.5">{item?.name.fr ?? "—"}</div>
          <div className="flex gap-2 items-center">
            <span className="text-[10px] text-slate-500 font-mono bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded">{item?.code ?? "—"}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[10px] font-semibold text-slate-500">{deliveryLabel}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-black text-slate-900 dark:text-white">{formatPrice(item?.base_price ?? null)}</span>
        <Badge variant="blue">{recurLabel}</Badge>
      </div>
    </div>
  );
}
