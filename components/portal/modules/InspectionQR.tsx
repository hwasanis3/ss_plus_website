"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { 
  Scan, 
  Search, 
  ShieldAlert, 
  FileWarning, 
  FileSignature, 
  Lock, 
  Check, 
  X, 
  Camera, 
  Upload, 
  CheckCircle2
} from "lucide-react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { mockAssetsData } from "@/data/mockAssetsData";
import type { Equipment } from "@/types/assetsPortal";
import { EquipmentDetailDrawer } from "./Assets";

// ── Tabs ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "scanner", label: "Inspection Visuelle", icon: Scan, locked: false },
  { id: "risks", label: "Évaluation des Risques", icon: ShieldAlert, locked: true },
  { id: "nc", label: "Non-Conformités", icon: FileWarning, locked: true },
  { id: "permits", label: "Permis de Travail", icon: FileSignature, locked: true },
] as const;

type TabId = typeof TABS[number]["id"];

export default function InspectionQR() {
  const [activeTab, setActiveTab] = useState<TabId>("scanner");
  const [scannedCode, setScannedCode] = useState("");
  const [searchInput, setSearchInput] = useState("QRC-2024-8891");
  const [scannedEquipment, setScannedEquipment] = useState<Equipment | null>(null);
  
  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Form states
  const [checklist, setChecklist] = useState({
    acces: null as boolean | null,
    manometre: null as boolean | null,
    goupille: null as boolean | null,
    etat: null as boolean | null,
  });
  const [showToast, setShowToast] = useState(false);

  const [isScanning, setIsScanning] = useState(true);

  const performSearch = (code: string) => {
    const eq = mockAssetsData.allEquipment.find(e => e.equipment_qrc === code || e.internal_id === code);
    if (eq) {
      setScannedEquipment(eq);
      setScannedCode(code);
    } else {
      // Simulate finding the first one if mock data doesn't match
      setScannedEquipment(mockAssetsData.allEquipment[0]);
      setScannedCode(code);
    }
    setIsScanning(false);
  };

  const handleSearch = () => {
    performSearch(searchInput);
  };

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0 && isScanning) {
      const value = detectedCodes[0].rawValue;
      setSearchInput(value);
      performSearch(value);
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    // Reset form after submission
    setTimeout(() => {
      setChecklist({ acces: null, manometre: null, goupille: null, etat: null });
      setScannedEquipment(null);
      setScannedCode("");
      setSearchInput("");
      setIsScanning(true);
    }, 1500);
  };

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Scan className="w-8 h-8 text-blue-600" />
          Outils QHSE & Inspections
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gérez vos inspections, évaluez les risques et gardez le contrôle sur la conformité de votre site.
        </p>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 border cursor-pointer
                ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
              {tab.label}
              {tab.locked && (
                <Lock size={12} className={isActive ? "text-blue-200 ml-1" : "text-slate-300 ml-1"} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content: Active Scanner ── */}
      {activeTab === "scanner" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Scanner Area */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <Camera size={16} className="text-slate-500" />
                  Scanner un équipement
                </h3>
              </div>
              <div className="p-5 space-y-5">
                {/* Real Camera View */}
                <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
                  {isScanning ? (
                    <Scanner
                      onScan={handleScan}
                      components={{
                        onOff: false,
                        torch: false,
                        zoom: false,
                        finder: true
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
                      <CheckCircle2 size={48} className="text-emerald-500 mb-2" />
                      <p className="text-white font-bold">QR Scanné avec succès</p>
                      <button 
                        onClick={() => setIsScanning(true)}
                        className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                      >
                        Scanner un autre Code
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white dark:bg-[var(--card-bg)] px-2 text-slate-500 font-semibold uppercase tracking-wider">
                      Ou saisie manuelle
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={14} className="text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Ex: QRC-2024-8891"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-white transition-colors cursor-pointer"
                  >
                    Valider
                  </button>
                </div>
              </div>
            </Card>

            {/* Equipment Result Card */}
            {scannedEquipment && (
              <Card className="border-l-4 border-l-blue-500 p-5 shadow-md animate-in fade-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Badge variant="blue" className="mb-2">Équipement Trouvé</Badge>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{scannedEquipment.equipment_model_name.fr}</h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{scannedEquipment.internal_id} • {scannedEquipment.equipment_qrc}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <Scan size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <button 
                  onClick={() => setDrawerOpen(true)}
                  className="w-full mt-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Voir Fiche Équipement
                </button>
              </Card>
            )}
          </div>

          {/* Inspection Form */}
          <div className="lg:col-span-7">
            <Card className="h-full border-slate-200 dark:border-slate-800 opacity-100 transition-opacity">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/20">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Nouvelle Inspection Visuelle</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Contrôle mensuel de routine</p>
                </div>
                <Badge variant={scannedEquipment ? "green" : "gray"}>
                  {scannedEquipment ? "Équipement sélectionné" : "En attente de scan"}
                </Badge>
              </div>

              <div className="p-5 lg:p-6">
                {!scannedEquipment ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Scan className="text-slate-400" size={24} />
                    </div>
                    <p className="text-sm text-slate-500 max-w-xs">
                      Veuillez scanner ou saisir l'identifiant d'un équipement pour démarrer l'inspection.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submitForm} className="space-y-6 animate-in fade-in duration-500">
                    
                    {/* Checklist */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Checklist de contrôle</h4>
                      
                      <ChecklistItem 
                        label="L'accès à l'équipement est-il dégagé ?"
                        value={checklist.acces}
                        onChange={(v) => setChecklist({...checklist, acces: v})}
                      />
                      <ChecklistItem 
                        label="Le manomètre est-il dans la zone verte ?"
                        value={checklist.manometre}
                        onChange={(v) => setChecklist({...checklist, manometre: v})}
                      />
                      <ChecklistItem 
                        label="La goupille et le plomb de scellé sont-ils intacts ?"
                        value={checklist.goupille}
                        onChange={(v) => setChecklist({...checklist, goupille: v})}
                      />
                      <ChecklistItem 
                        label="État général : absence de traces de chocs ou de corrosion ?"
                        value={checklist.etat}
                        onChange={(v) => setChecklist({...checklist, etat: v})}
                      />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Photo(s) éventuelle(s)</label>
                      <button type="button" className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-slate-500 cursor-pointer">
                        <Upload size={20} />
                        <span className="text-sm font-semibold">Ajouter une photo justificative</span>
                      </button>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Observations / Notes</label>
                      <textarea 
                        rows={3} 
                        placeholder="Ras, ou description d'un problème éventuel..."
                        className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                      />
                    </div>

                    {/* Submit */}
                    <button 
                      type="submit" 
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-transform active:scale-[0.98] cursor-pointer"
                    >
                      Enregistrer l'inspection
                    </button>
                  </form>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── Premium "Locked" Tabs Layout ── */}
      {(activeTab === "risks" || activeTab === "nc" || activeTab === "permits") && (
        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 min-h-[500px] flex items-center justify-center animate-in fade-in duration-500">
          
          {/* Blurred Background Mockup */}
          <div className="absolute inset-0 opacity-20 dark:opacity-10 filter blur-[8px] pointer-events-none select-none overflow-hidden flex flex-col">
            {/* Fake Dashboard Elements in background */}
            <div className="p-8 space-y-6 w-full">
              <div className="flex gap-4">
                <div className="h-24 w-1/4 bg-slate-300 rounded-xl"></div>
                <div className="h-24 w-1/4 bg-slate-300 rounded-xl"></div>
                <div className="h-24 w-1/4 bg-slate-300 rounded-xl"></div>
                <div className="h-24 w-1/4 bg-slate-300 rounded-xl"></div>
              </div>
              <div className="h-10 w-1/3 bg-slate-200 rounded-lg"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-slate-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none"></div>

          {/* Locked Content Card */}
          <div className="relative z-10 max-w-lg w-full px-6">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-8 text-center space-y-6 shadow-blue-900/5">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center shadow-inner">
                <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="space-y-2">
                <Badge variant="blue" className="mb-2">Bientôt Disponible</Badge>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {TABS.find(t => t.id === activeTab)?.label}
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {activeTab === "risks" && "Digitalisez votre Document Unique d'Évaluation des Risques (DUER). Identifiez les dangers, évaluez la criticité et générez des plans d'actions préventives."}
                {activeTab === "nc" && "Système de ticketing HSE. Déclarez les presqu'accidents, les conditions dangereuses et suivez la résolution des actions correctives (CAPA)."}
                {activeTab === "permits" && "Dématérialisez vos autorisations de travail (Travaux par point chaud, Travaux en hauteur). Workflow de validation 100% digital entre vos équipes et les sous-traitants."}
              </p>

              <div className="pt-4">
                <button className="px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-lg cursor-pointer">
                  Demander un accès anticipé
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ── Toast Notification ── */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ease-out flex items-center gap-3 bg-slate-900 dark:bg-slate-800 text-white px-5 py-4 rounded-xl shadow-2xl border border-slate-700
          ${showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
          <CheckCircle2 size={20} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-bold">Inspection enregistrée</p>
          <p className="text-xs text-slate-400">Vos données ont été sauvegardées avec succès.</p>
        </div>
      </div>

      {/* ── Equipment Drawer Overlay ── */}
      {(drawerOpen && scannedEquipment) && (
        <>
          <div
            className="fixed inset-0 bg-black/40 dark:bg-black/60 z-[9998] transition-opacity duration-300 animate-in fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="fixed top-0 right-0 h-full w-full max-w-[560px] z-[9999] bg-[var(--card-bg)] shadow-2xl transition-transform duration-300 ease-out overflow-y-auto animate-in slide-in-from-right"
          >
            <EquipmentDetailDrawer 
              equipment={scannedEquipment} 
              onClose={() => setDrawerOpen(false)} 
            />
          </div>
        </>
      )}

    </div>
  );
}

// ── Shared UI Components ──────────────────────────────────────────────────

function ChecklistItem({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: boolean | null; 
  onChange: (v: boolean) => void 
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1 pr-4">{label}</span>
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center justify-center w-12 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
            value === true 
              ? "bg-emerald-500 text-white shadow-sm" 
              : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <Check size={14} className={value === true ? "mr-1" : "hidden"} />
          OUI
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center justify-center w-12 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
            value === false 
              ? "bg-red-500 text-white shadow-sm" 
              : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          <X size={14} className={value === false ? "mr-1" : "hidden"} />
          NON
        </button>
      </div>
    </div>
  );
}
