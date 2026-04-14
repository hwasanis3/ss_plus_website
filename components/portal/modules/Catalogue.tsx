"use client";

import { useMemo, useState } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TabButton } from "../ui/TabButton";
import { mockCatalog } from "@/data/mockCatalogData";
import type { CatalogItem, CatalogProduct, CatalogConsumable, CatalogEqServicing, CatalogMedia } from "@/types/catalog";

// ── Helpers ─────────────────────────────────────────────────────────────────

type CatalogFilter = "all" | "product" | "consumable" | "eq_servicing";
type ModalTab = "details" | "specs" | "documents";

function formatPrice(price: number | null, currency = "TND"): string {
  if (price === null) return "—";
  return (
    new Intl.NumberFormat("fr-TN", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price) + ` ${currency}`
  );
}

function stockBadge(item: CatalogItem) {
  if (!item.is_stockable) return <Badge variant="gray">Service</Badge>;
  const stock = item.current_stock;
  const min = item.min_stock_level ?? 0;
  if (stock <= 0) return <Badge variant="red">Rupture</Badge>;
  if (stock <= min) return <Badge variant="orange">Stock bas</Badge>;
  return <Badge variant="green">{stock} en stock</Badge>;
}

function itemTypeBadge(item: CatalogItem) {
  switch (item.item_type) {
    case "product":
      return <Badge variant="blue">Produit</Badge>;
    case "consumable":
      return <Badge variant="purple">Consommable</Badge>;
    case "eq_servicing":
      return <Badge variant="orange">Service</Badge>;
  }
}

function physicalIcon(item: CatalogItem): string {
  if (item.item_type === "product") {
    const pt = (item as CatalogProduct).product.physical_type;
    switch (pt) {
      case "extinguisher": return "🧯";
      case "detector": return "🔔";
      case "detection_panel": return "🖥️";
      case "hose_reel": return "🚿";
      case "ppe": return "🦺";
      case "cabinet": return "🗄️";
      default: return "📦";
    }
  }
  if (item.item_type === "consumable") {
    const ct = (item as CatalogConsumable).consumable.consumable_type;
    switch (ct) {
      case "agents_and_disposables": return "🧪";
      case "replacement_parts": return "🔧";
      case "safety_signage": return "⚠️";
      case "accessories": return "🗜️";
    }
  }
  return "🔧"; // eq_servicing
}

function capacityLabel(item: CatalogItem): string | null {
  if (item.item_type === "product") {
    const p = (item as CatalogProduct).product;
    if (p.capacity_value && p.capacity_unit) {
      return `${p.capacity_value} ${p.capacity_unit}`;
    }
  }
  return null;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function Catalogue() {
  const [activeTab, setActiveTab] = useState<CatalogFilter>("all");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  const tabs: { key: CatalogFilter; label: string; count: number }[] = [
    { key: "all", label: "Tous", count: mockCatalog.length },
    { key: "product", label: "Produits", count: mockCatalog.filter((i) => i.item_type === "product").length },
    { key: "consumable", label: "Consommables", count: mockCatalog.filter((i) => i.item_type === "consumable").length },
    { key: "eq_servicing", label: "Services", count: mockCatalog.filter((i) => i.item_type === "eq_servicing").length },
  ];

  const rows = useMemo(() => {
    const search = query.trim().toLowerCase();
    return mockCatalog.filter((item) => {
      const typeMatch = activeTab === "all" || item.item_type === activeTab;
      const searchMatch =
        !search ||
        item.name.fr.toLowerCase().includes(search) ||
        item.code.toLowerCase().includes(search) ||
        (item.brand?.name || "").toLowerCase().includes(search) ||
        (item.category?.name.fr || "").toLowerCase().includes(search);
      return typeMatch && searchMatch;
    });
  }, [activeTab, query]);

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          📦 Catalogue SS Plus
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Consultez l&apos;ensemble des équipements, consommables et services. Recherchez par nom, référence SKU ou marque.
        </p>
      </div>

      {/* Search + Filters */}
      <Card className="p-4 lg:p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par nom, code, marque… (ex: EXT-ABC-006)"
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-shadow"
          />
          <div className="flex gap-1">
            <button
               onClick={() => setViewMode("grid")}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
            >
              ▦ Grille
            </button>
            <button
               onClick={() => setViewMode("table")}
               className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
            >
              ≡ Table
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
              {tab.label} ({tab.count})
            </TabButton>
          ))}
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          {rows.length} article{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {rows.map((item) => (
            <div key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer h-full">
              <CatalogCard item={item} />
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/40">
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Article</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Code</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Type</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Marque</th>
                  <th className="text-right px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Prix</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Stock</th>
                  <th className="text-left px-4 py-3 text-xs text-slate-500 font-bold uppercase tracking-wide">Certifications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedItem(item)} className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{physicalIcon(item)}</span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name.fr}</div>
                          <div className="text-[11px] text-slate-400">{item.category?.name.fr}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] text-slate-600 dark:text-slate-300">{item.code}</td>
                    <td className="px-4 py-3">{itemTypeBadge(item)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.brand?.name || "—"}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-slate-900 dark:text-white">{formatPrice(item.base_price)}</td>
                    <td className="px-4 py-3">{stockBadge(item)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.certifications || []).slice(0, 3).map((cert) => (
                          <span key={cert} className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ── Modal overlay ── */}
      {selectedItem && (
        <CatalogItemModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

// ── Catalog Card ────────────────────────────────────────────────────────────

function CatalogCard({ item }: { item: CatalogItem }) {
  const cap = capacityLabel(item);

  // Color accent for card type
  const borderAccent =
    item.item_type === "product"
      ? "border-l-blue-500"
      : item.item_type === "consumable"
        ? "border-l-purple-500"
        : "border-l-orange-500";

  return (
    <Card className={`h-full p-5 border-l-4 ${borderAccent} flex flex-col justify-between transition-transform hover:-translate-y-0.5 hover:shadow-md`}>
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{physicalIcon(item)}</span>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">{item.name.fr}</h4>
              <div className="font-mono text-[11px] text-slate-500 mt-0.5">{item.code}</div>
            </div>
          </div>
          {itemTypeBadge(item)}
        </div>

        {item.short_description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
            {item.short_description.fr}
          </p>
        )}

        {/* Meta badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.brand && (
            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
              {item.brand.name}
            </span>
          )}
          {item.category && (
            <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {item.category.name.fr}
            </span>
          )}
          {cap && (
            <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              {cap}
            </span>
          )}
          {(item.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-medium bg-slate-50 dark:bg-slate-900/60 text-slate-500 px-1.5 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>

        {/* Certifications */}
        {(item.certifications || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.certifications!.map((cert) => (
              <span key={cert} className="text-[10px] font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/40">
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-800/60">
        <div>
          <div className="text-lg font-black text-slate-900 dark:text-white leading-none">
            {formatPrice(item.base_price)}
          </div>
          {item.uom && (
            <div className="text-[10px] text-slate-400 mt-0.5">/ {item.uom.name.fr}</div>
          )}
        </div>
        {stockBadge(item)}
      </div>
    </Card>
  );
}

// ── Catalog Modal ───────────────────────────────────────────────────────────

function CatalogItemModal({ item, onClose }: { item: CatalogItem; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<ModalTab>("details");

  const borderAccent =
    item.item_type === "product"
      ? "border-t-blue-500"
      : item.item_type === "consumable"
        ? "border-t-purple-500"
        : "border-t-orange-500";

  // Get first image from media if exists
  const imageMedia = item.media?.find(m => m.mime_type.startsWith("image/"));
  const docsMedia = item.media?.filter(m => !m.mime_type.startsWith("image/")) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-t-4 ${borderAccent} animate-in slide-in-from-bottom-4`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 lg:p-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex flex-shrink-0 items-center justify-center text-2xl">
              {physicalIcon(item)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg lg:text-xl text-slate-900 dark:text-white leading-tight">
                  {item.name.fr}
                </h3>
                {itemTypeBadge(item)}
              </div>
              <div className="font-mono text-[13px] text-slate-500">{item.code}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          
          {/* Left panel: Image & Price */}
          <div className="w-full lg:w-1/3 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800/80 overflow-y-auto">
            {imageMedia ? (
              <div className="aspect-square bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 mb-6 flex items-center justify-center shadow-sm">
                <img src={imageMedia.url} alt={item.name.fr} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
              </div>
            ) : (
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700/50 mb-6">
                <span className="text-6xl opacity-20">{physicalIcon(item)}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Prix de base</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {formatPrice(item.base_price)}
                </div>
                {item.uom && <div className="text-xs text-slate-400 mt-0.5">/ {item.uom.name.fr}</div>}
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Disponibilité</div>
                {stockBadge(item)}
              </div>
              
              {item.brand && (
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 mt-2">Fabricant</div>
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.brand.name}</div>
                  {item.brand.country_of_origin && (
                     <div className="text-[10px] text-slate-400 mt-0.5">Origine: {item.brand.country_of_origin}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Tabs & Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab strip */}
            <div className="flex border-b border-slate-100 dark:border-slate-800/80 px-4 pt-2">
              <button 
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Détails complets
              </button>
              <button 
                onClick={() => setActiveTab("specs")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'specs' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Spécifications techniques
              </button>
              <button 
                onClick={() => setActiveTab("documents")}
                className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documents' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                Documents {docsMedia.length > 0 && <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 py-0.5 px-1.5 rounded text-[10px]">{docsMedia.length}</span>}
              </button>
            </div>

            {/* Tab content area */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Description</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.short_description?.fr || "Aucune description disponible pour cet article."}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Méta-informations</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <SpecItem label="Catégorie" value={item.category?.name.fr || "—"} />
                      <SpecItem label="Tags" value={item.tags?.join(", ") || "—"} />
                      <SpecItem label="Garantie" value={item.warranty_months ? `${item.warranty_months} mois` : "—"} />
                      <SpecItem label="Délai livraison" value={item.lead_time_days ? `${item.lead_time_days} jours` : "—"} />
                    </div>
                  </div>

                  {item.certifications && item.certifications.length > 0 && (
                     <div>
                       <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">Normes & Certifications</h4>
                       <div className="flex flex-wrap gap-2">
                         {item.certifications.map((cert) => (
                           <Badge key={cert} variant="gray">{cert}</Badge>
                         ))}
                       </div>
                     </div>
                  )}
                </div>
              )}

              {activeTab === "specs" && (
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Caractéristiques de l'article</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.item_type === "product" && (
                      <>
                        <SpecItem label="Type Physique" value={(item as CatalogProduct).product.physical_type || "—"} />
                        <SpecItem label="Capacité" value={capacityLabel(item) || "—"} />
                        <SpecItem label="Matériau" value={(item as CatalogProduct).product.material || "—"} />
                        <SpecItem label="Durée de vie" value={(item as CatalogProduct).product.expiry_years ? `${(item as CatalogProduct).product.expiry_years} ans` : "—"} />
                        {Object.entries((item as CatalogProduct).product.technical_specs || {}).map(([key, val]) => (
                           <SpecItem key={key} label={key.replace(/_/g, ' ')} value={String(val)} />
                        ))}
                      </>
                    )}
                    {item.item_type === "consumable" && (
                      <>
                        <SpecItem label="Type Consommable" value={(item as CatalogConsumable).consumable.consumable_type || "—"} />
                        <SpecItem label="Référence OEM" value={(item as CatalogConsumable).consumable.oem_reference || "—"} />
                        <SpecItem label="Conservation" value={(item as CatalogConsumable).consumable.shelf_life_months ? `${(item as CatalogConsumable).consumable.shelf_life_months} mois` : "—"} />
                        <SpecItem label="Conditions de stockage" value={(item as CatalogConsumable).consumable.storage_conditions || "—"} />
                      </>
                    )}
                    {item.item_type === "eq_servicing" && (
                      <>
                        <SpecItem label="Mode de livraison" value={(item as CatalogEqServicing).eq_servicing.delivery_mode || "—"} />
                        <SpecItem label="Durée estimée" value={(item as CatalogEqServicing).eq_servicing.duration_minutes ? `${(item as CatalogEqServicing).eq_servicing.duration_minutes} min` : "—"} />
                        <SpecItem label="SLA Réponse" value={(item as CatalogEqServicing).eq_servicing.sla_response_hours ? `< ${(item as CatalogEqServicing).eq_servicing.sla_response_hours} h` : "—"} />
                        <SpecItem label="Récurrent" value={(item as CatalogEqServicing).eq_servicing.is_recurring ? `Oui (tous les ${(item as CatalogEqServicing).eq_servicing.recurrence_months} mois)` : "Non"} />
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-3">
                  {docsMedia.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                      <div className="text-3xl mb-2 opacity-50">📄</div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Aucun document attaché</h4>
                      <p className="text-xs text-slate-500 mt-1">Cet article n'a pas de fiches techniques ou de certificats publics.</p>
                    </div>
                  ) : (
                    docsMedia.map((doc) => (
                      <a key={doc.id} href={doc.url} onClick={(e) => e.preventDefault()} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all group">
                         <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center text-lg shrink-0">
                           {doc.mime_type === "application/pdf" ? "📕" : "📄"}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                             {doc.file_name}
                           </div>
                           <div className="text-[11px] text-slate-500 uppercase flex items-center gap-2 mt-0.5">
                             <span>{doc.collection_name}</span>
                             <span>•</span>
                             <span>{(doc.size / 1024).toFixed(1)} KB</span>
                           </div>
                         </div>
                         <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
                           ↓ Télécharger
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
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
      <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">{label}</div>
      <div className="text-xs font-semibold text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
