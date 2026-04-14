"use client";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TabButton } from "../ui/TabButton";
import { ProgressBar } from "../ui/ProgressBar";
import { AlertStrip } from "../ui/AlertStrip";
import { useState, Fragment } from "react";
import { mockCommercialData } from "@/data/mockCommercialData";
import type {
  QuoteStatus,
  OrderStatus,
  InvoiceStatus,
  MsaStatus,
  PriceListStatus,
  Quote,
  Order,
} from "@/types/commercialPortal";

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Format a number as TND currency in French locale: 14 200,000 TND */
function formatTND(amount: number): string {
  return (
    amount
      .toFixed(3)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",") + " TND"
  );
}

/** Format ISO date string to DD/MM/YYYY */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

// ── Status → Badge variant mapping ──────────────────────────────────────────

function quoteStatusBadge(status: QuoteStatus): { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string } {
  const map: Record<QuoteStatus, { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string }> = {
    draft: { variant: "gray", label: "Brouillon" },
    sent: { variant: "blue", label: "Envoyé" },
    pending: { variant: "orange", label: "En attente" },
    approved: { variant: "green", label: "Approuvé" },
    rejected: { variant: "red", label: "Rejeté" },
    expired: { variant: "red", label: "Expiré" },
    cancelled: { variant: "gray", label: "Annulé" },
  };
  return map[status];
}

function orderStatusBadge(status: OrderStatus): { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string } {
  const map: Record<OrderStatus, { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string }> = {
    draft: { variant: "gray", label: "Brouillon" },
    confirmed: { variant: "blue", label: "Confirmée" },
    processing: { variant: "blue", label: "En préparation" },
    partially_shipped: { variant: "orange", label: "Expédition partielle" },
    shipped: { variant: "purple", label: "Expédiée" },
    delivered: { variant: "green", label: "Livrée" },
    completed: { variant: "green", label: "Terminée" },
    cancelled: { variant: "red", label: "Annulée" },
  };
  return map[status];
}

function invoiceStatusBadge(status: InvoiceStatus): { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string } {
  const map: Record<InvoiceStatus, { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string }> = {
    draft: { variant: "gray", label: "Brouillon" },
    sent: { variant: "blue", label: "Envoyée" },
    partially_paid: { variant: "orange", label: "Part. payée" },
    paid: { variant: "green", label: "Payée" },
    overdue: { variant: "red", label: "En retard" },
    cancelled: { variant: "gray", label: "Annulée" },
    credited: { variant: "purple", label: "Avoir émis" },
  };
  return map[status];
}

function msaStatusBadge(status: MsaStatus): { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string } {
  const map: Record<MsaStatus, { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string }> = {
    draft: { variant: "gray", label: "Brouillon" },
    pending_commercial_review: { variant: "yellow", label: "Revue commerciale" },
    pending_finance_validation: { variant: "yellow", label: "Validation finance" },
    pending_client_approval: { variant: "orange", label: "En attente signature" },
    approved: { variant: "green", label: "Approuvé" },
    active: { variant: "green", label: "Actif" },
    suspended: { variant: "red", label: "Suspendu" },
    amendment_requested: { variant: "orange", label: "Amendement demandé" },
    amended: { variant: "blue", label: "Amendé" },
    terminated: { variant: "red", label: "Résilié" },
    renewed: { variant: "green", label: "Renouvelé" },
    archived: { variant: "gray", label: "Archivé" },
    denied_master_service_agreement: { variant: "red", label: "Refusé" },
  };
  return map[status];
}

function priceListStatusBadge(status: PriceListStatus): { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string } {
  const map: Record<PriceListStatus, { variant: "green" | "orange" | "yellow" | "red" | "blue" | "gray" | "purple"; label: string }> = {
    active: { variant: "green", label: "Actif" },
    draft: { variant: "gray", label: "Brouillon" },
    inactive: { variant: "red", label: "Inactif" },
  };
  return map[status];
}

// ── Tabs ────────────────────────────────────────────────────────────────────

const tabs = ["Devis", "Commandes", "Contrats & MSA", "Factures", "Tarifs"] as const;

// ── KPI computations ────────────────────────────────────────────────────────

const { quotes, orders, invoices, msas, priceLists } = mockCommercialData;

const pendingQuotes = quotes.filter((q) => q.status === "pending" || q.status === "sent");
const activeOrders = orders.filter((o) => o.status === "processing" || o.status === "shipped" || o.status === "confirmed" || o.status === "partially_shipped");
const overdueInvoices = invoices.filter((i) => i.status === "overdue");
const annualSpend = orders
  .filter((o) => o.status === "completed" || o.status === "delivered")
  .reduce((sum, o) => sum + o.total_amount, 0);

// ── Expanded row state type ─────────────────────────────────────────────────

type ExpandedRow = { type: "quote"; id: number } | { type: "order"; id: number } | null;

// ── Component ───────────────────────────────────────────────────────────────

export default function SuiviCommercial() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Devis");
  const [expandedRow, setExpandedRow] = useState<ExpandedRow>(null);

  function toggleExpand(type: "quote" | "order", id: number) {
    setExpandedRow((prev) =>
      prev && prev.type === type && prev.id === id ? null : { type, id }
    );
  }

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* ─── Header ──────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          📋 Suivi Commercial
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Consultez et gérez vos devis, commandes, contrats cadre et factures.
        </p>
      </div>

      {/* ─── KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-orange-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Devis en attente
          </div>
          <div className="text-3xl font-black leading-none mb-2 text-orange-500 dark:text-orange-400">
            {pendingQuotes.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Valeur totale : {formatTND(pendingQuotes.reduce((s, q) => s + q.total_amount, 0))}
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-600 dark:border-l-blue-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Commandes actives
          </div>
          <div className="text-3xl font-black leading-none mb-2 text-blue-500 dark:text-blue-400">
            {activeOrders.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {activeOrders.filter((o) => o.status === "processing").length} en préparation · {activeOrders.filter((o) => o.status === "shipped").length} expédiées
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-red-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Factures impayées
          </div>
          <div className="text-3xl font-black leading-none mb-2 text-red-500 dark:text-red-400">
            {overdueInvoices.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Montant dû : {formatTND(overdueInvoices.reduce((s, i) => s + i.amount_due, 0))}
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500 transition-transform hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            Dépenses annuelles
          </div>
          <div className="text-3xl font-black leading-none mb-2 text-emerald-500 dark:text-emerald-400">
            {formatTND(annualSpend).split(",")[0]}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {orders.filter((o) => o.status === "completed" || o.status === "delivered").length} commandes livrées en 2024
          </div>
        </Card>
      </div>

      {/* ─── Alert Strip ─────────────────────────────────────────── */}
      {overdueInvoices.length > 0 && (
        <AlertStrip variant="red" icon="🔴">
          <span className="font-medium text-[13px]">
            Facture {overdueInvoices[0].reference} — en retard de paiement — Montant : {formatTND(overdueInvoices[0].amount_due)}
          </span>
        </AlertStrip>
      )}

      {/* ─── Tabs ────────────────────────────────────────────────── */}
      <Card className="p-3 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <TabButton key={tab} active={activeTab === tab} onClick={() => { setActiveTab(tab); setExpandedRow(null); }}>
            {tab}
          </TabButton>
        ))}
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          TAB: DEVIS
       ═══════════════════════════════════════════════════════════ */}
      {activeTab === "Devis" && (
        <Card className="overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm">Devis clients</span>
            <span className="text-xs text-slate-500">{quotes.length} devis au total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Référence</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Objet</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Tarif</th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 font-semibold">Montant TTC</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Validité</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Statut</th>
                  <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quotes.map((q) => {
                  const badge = quoteStatusBadge(q.status);
                  const isExpanded = expandedRow?.type === "quote" && expandedRow.id === q.id;
                  return (
                    <Fragment key={q.id}>
                      <tr
                        key={q.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => toggleExpand("quote", q.id)}
                      >
                        <td className="px-4 py-3 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                          {q.reference}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(q.issue_date)}</td>
                        <td className="px-4 py-3 max-w-[260px] truncate" title={q.object}>{q.object}</td>
                        <td className="px-4 py-3">
                          {q.price_list_ref ? (
                            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                              {q.price_list_ref}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatTND(q.total_amount)}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(q.validity_date)}</td>
                        <td className="px-4 py-3">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {(q.status === "pending" || q.status === "sent") && (
                              <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors">
                                Approuver
                              </button>
                            )}
                            <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors">
                              PDF
                            </button>
                          </div>
                        </td>
                      </tr>
                      {/* ─── Expanded detail row ─── */}
                      {isExpanded && (
                        <tr key={`${q.id}-detail`}>
                          <td colSpan={8} className="bg-slate-50/60 dark:bg-slate-900/40 px-4 py-4">
                            <QuoteDetail quote={q} />
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

      {/* ═══════════════════════════════════════════════════════════
          TAB: COMMANDES
       ═══════════════════════════════════════════════════════════ */}
      {activeTab === "Commandes" && (
        <div className="space-y-4">
          {/* Active orders */}
          {activeOrders.length > 0 && (
            <Card className="overflow-hidden">
              <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-sm">Commandes en cours</span>
                <span className="text-xs text-slate-500">{activeOrders.length} commandes actives</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeOrders.map((o) => {
                  const badge = orderStatusBadge(o.status);
                  const isExpanded = expandedRow?.type === "order" && expandedRow.id === o.id;
                  return (
                    <div key={o.id}>
                      <div
                        className="p-4 lg:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => toggleExpand("order", o.id)}
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">
                                {o.reference}
                              </span>
                              <Badge variant={badge.variant}>{badge.label}</Badge>
                              {o.quote_reference && (
                                <span className="text-xs text-slate-400">← {o.quote_reference}</span>
                              )}
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{o.object}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>📅 Commande : {formatDate(o.order_date)}</span>
                              {o.expected_delivery && <span>🚚 Livraison prévue : {formatDate(o.expected_delivery)}</span>}
                              <span>📍 {o.delivery_site}</span>
                              <span>👤 {o.delivery_contact}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold tabular-nums">{formatTND(o.total_amount)}</div>
                            <div className="text-xs text-slate-500 mt-0.5">TTC</div>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className="mt-3 flex items-center gap-3">
                          <ProgressBar
                            value={o.progress_percent}
                            color={o.progress_percent === 100 ? "bg-emerald-500" : "bg-blue-600"}
                            className="flex-1"
                          />
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums w-10 text-right">
                            {o.progress_percent}%
                          </span>
                        </div>
                      </div>
                      {/* Expanded detail */}
                      {isExpanded && (
                        <div className="bg-slate-50/60 dark:bg-slate-900/40 px-4 lg:px-5 py-4 border-t border-slate-100 dark:border-slate-800">
                          <OrderDetail order={o} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Historique */}
          <Card className="overflow-hidden">
            <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-sm">Historique des commandes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                    <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Référence</th>
                    <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Objet</th>
                    <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 font-semibold">Montant TTC</th>
                    <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Livraison</th>
                    <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Statut</th>
                    <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders
                    .filter((o) => o.status === "completed" || o.status === "delivered")
                    .map((o) => {
                      const badge = orderStatusBadge(o.status);
                      return (
                        <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">{o.reference}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(o.order_date)}</td>
                          <td className="px-4 py-3 max-w-[260px] truncate" title={o.object}>{o.object}</td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatTND(o.total_amount)}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            {o.actual_delivery ? formatDate(o.actual_delivery) : "—"}
                          </td>
                          <td className="px-4 py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                          <td className="px-4 py-3 text-center">
                            <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors">
                              Télécharger PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB: CONTRATS & MSA
       ═══════════════════════════════════════════════════════════ */}
      {activeTab === "Contrats & MSA" && (
        <div className="space-y-4">
          {msas.map((msa) => {
            const badge = msaStatusBadge(msa.msa_status);
            return (
              <Card key={msa.id} className="p-5 lg:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">{msa.msa_id}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-semibold">
                      Accord Cadre de Services {msa.effective_date ? new Date(msa.effective_date).getFullYear() : "—"}–{msa.end_date ? new Date(msa.end_date).getFullYear() : "—"}
                    </p>
                  </div>
                  {msa.msa_status === "pending_client_approval" && (
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-colors border border-emerald-500/30">
                      ✍️ Signer le contrat
                    </button>
                  )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Durée initiale</span>
                    <p className="font-semibold mt-0.5">{msa.initial_term_years} an{msa.initial_term_years > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Renouvellement auto.</span>
                    <p className="font-semibold mt-0.5">{msa.auto_renewal_years} an{msa.auto_renewal_years > 1 ? "s" : ""}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Conditions paiement</span>
                    <p className="font-semibold mt-0.5">{msa.payment_terms || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Date effective</span>
                    <p className="font-semibold mt-0.5">{msa.effective_date ? formatDate(msa.effective_date) : "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Date fin</span>
                    <p className="font-semibold mt-0.5">{msa.end_date ? formatDate(msa.end_date) : "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Signature SS PLUS</span>
                    <p className="font-semibold mt-0.5">{msa.our_signature_name || "—"}</p>
                    {msa.our_signature_date && (
                      <p className="text-xs text-slate-400">{formatDate(msa.our_signature_date)}</p>
                    )}
                  </div>
                </div>

                {msa.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-md p-3 leading-relaxed">
                    💬 {msa.notes}
                  </p>
                )}
              </Card>
            );
          })}

          {/* SLA section */}
          <Card className="p-5 lg:p-6">
            <h3 className="font-bold text-sm mb-3">SLA-2025-001 — Engagements de service</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Urgence critique :</strong> Réponse &lt; 2h, intervention &lt; 4h (24/7).</p>
              <p><strong>Urgence standard :</strong> Réponse &lt; 4h, intervention &lt; 24h (jours ouvrables).</p>
              <p><strong>Maintenance planifiée :</strong> Prise en compte sous 5 jours ouvrables.</p>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB: FACTURES
       ═══════════════════════════════════════════════════════════ */}
      {activeTab === "Factures" && (
        <Card className="overflow-hidden">
          <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm">Factures</span>
            <span className="text-xs text-slate-500">{invoices.length} factures</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Référence</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Objet</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Commande</th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 font-semibold">Montant TTC</th>
                  <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 font-semibold">Restant dû</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Échéance</th>
                  <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Statut</th>
                  <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {invoices.map((inv) => {
                  const badge = invoiceStatusBadge(inv.status);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">{inv.reference}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(inv.issue_date)}</td>
                      <td className="px-4 py-3 max-w-[220px] truncate" title={inv.object}>{inv.object}</td>
                      <td className="px-4 py-3">
                        {inv.order_reference ? (
                          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{inv.order_reference}</span>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatTND(inv.total_amount)}</td>
                      <td className={`px-4 py-3 text-right font-semibold tabular-nums ${inv.amount_due > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {inv.amount_due > 0 ? formatTND(inv.amount_due) : "0,000 TND"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(inv.due_date)}</td>
                      <td className="px-4 py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                      <td className="px-4 py-3 text-center">
                        <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors">
                          Télécharger PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════════════
          TAB: TARIFS (Price Lists)
       ═══════════════════════════════════════════════════════════ */}
      {activeTab === "Tarifs" && (
        <div className="space-y-4">
          {priceLists.map((pl) => {
            const badge = priceListStatusBadge(pl.price_list_status);
            return (
              <Card key={pl.id} className="p-5 lg:p-6">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[13px] font-bold text-blue-600 dark:text-blue-400">{pl.price_list_id}</span>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                      {pl.version && (
                        <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">
                          {pl.version}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-semibold">{pl.name.fr}</p>
                  </div>
                  <button className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors">
                    Consulter
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>📅 Début : {pl.start_date ? formatDate(pl.start_date) : "—"}</span>
                  <span>📅 Fin : {pl.end_date ? formatDate(pl.end_date) : "—"}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

/** Expandable detail view for a quote — shows full line items with price list refs */
function QuoteDetail({ quote }: { quote: Quote }) {
  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
        <span>📄 MSA : {quote.msa_id || "—"}</span>
        <span>🏷️ Tarif : {quote.price_list_ref || "—"}</span>
        <span>✍️ Préparé par : {quote.prepared_by}</span>
      </div>

      {/* Line items table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800/60">
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Réf. produit</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Désignation</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Qté</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Unité</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">P.U. HT</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Remise</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Total HT</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Tarif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {quote.lines.map((line) => (
              <tr key={line.id} className="hover:bg-white/50 dark:hover:bg-slate-800/30">
                <td className="px-3 py-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">{line.product_ref}</td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{line.designation}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{line.quantity}</td>
                <td className="px-3 py-2 text-slate-500">{line.unit}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatTND(line.unit_price)}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {line.discount_rate > 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">-{line.discount_rate.toFixed(2)}%</span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{formatTND(line.line_total)}</td>
                <td className="px-3 py-2">
                  {line.price_list_id ? (
                    <span className="font-mono text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded">
                      {line.price_list_id}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Sous-total HT</span>
            <span className="tabular-nums font-semibold">{formatTND(quote.subtotal)}</span>
          </div>
          {quote.discount_total > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
              <span>Remise globale</span>
              <span className="tabular-nums font-semibold">-{formatTND(quote.discount_total)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>TVA ({quote.tax_rate}%)</span>
            <span className="tabular-nums">{formatTND(quote.tax_amount)}</span>
          </div>
          <div className="flex justify-between text-slate-900 dark:text-white font-bold border-t border-slate-200 dark:border-slate-700 pt-1.5">
            <span>Total TTC</span>
            <span className="tabular-nums">{formatTND(quote.total_amount)}</span>
          </div>
        </div>
      </div>

      {quote.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 rounded-md p-2.5 leading-relaxed">
          💬 {quote.notes}
        </p>
      )}
    </div>
  );
}

/** Expandable detail view for an order — shows line items with shipment progress */
function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800/60">
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Réf. produit</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Désignation</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Qté</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Expédié</th>
              <th className="px-3 py-2 text-left text-[10px] uppercase text-slate-500 font-semibold">Unité</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">P.U. HT</th>
              <th className="px-3 py-2 text-right text-[10px] uppercase text-slate-500 font-semibold">Total HT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.lines.map((line) => (
              <tr key={line.id} className="hover:bg-white/50 dark:hover:bg-slate-800/30">
                <td className="px-3 py-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">{line.product_ref}</td>
                <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{line.designation}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{line.quantity}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  <span className={line.shipped_quantity >= line.quantity ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}>
                    {line.shipped_quantity}/{line.quantity}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-500">{line.unit}</td>
                <td className="px-3 py-2 text-right tabular-nums">{formatTND(line.unit_price)}</td>
                <td className="px-3 py-2 text-right tabular-nums font-semibold">{formatTND(line.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-56 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Sous-total HT</span>
            <span className="tabular-nums font-semibold">{formatTND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>TVA ({order.tax_rate}%)</span>
            <span className="tabular-nums">{formatTND(order.tax_amount)}</span>
          </div>
          <div className="flex justify-between text-slate-900 dark:text-white font-bold border-t border-slate-200 dark:border-slate-700 pt-1.5">
            <span>Total TTC</span>
            <span className="tabular-nums">{formatTND(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 rounded-md p-2.5 leading-relaxed">
          💬 {order.notes}
        </p>
      )}
    </div>
  );
}
