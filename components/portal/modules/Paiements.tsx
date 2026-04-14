import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { AlertStrip } from "../ui/AlertStrip";
import { mockPaymentsData } from "@/data/mockPaymentsData";
import { PaymentStatus } from "@/types/paymentsPortal";

function formatTND(amount: number): string {
  return (
    amount
      .toFixed(3)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      .replace(".", ",") + " TND"
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function paymentStatusBadge(status: PaymentStatus): { variant: "green" | "orange" | "red"; label: string } {
  const map: Record<PaymentStatus, { variant: "green" | "orange" | "red"; label: string }> = {
    paid: { variant: "green", label: "Payée" },
    pending: { variant: "orange", label: "En attente" },
    overdue: { variant: "red", label: "En retard" },
  };
  return map[status];
}

export default function Paiements() {
  const { invoices } = mockPaymentsData;

  const totalUnpaid = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');
  const paidThisMonth = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0); // Simplified for demo
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
  const nextDueDate = pendingInvoices.length > 0 ? pendingInvoices.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0] : null;

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">💳 Suivi des Paiements</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Factures en cours, règlements et historique financier SS Plus.</p>
      </div>

      {overdueInvoices.length > 0 && (
        <AlertStrip variant="red" icon="⚠️">
          <span className="font-medium text-[13px]">
            Action requise : Vous avez {overdueInvoices.length} facture(s) en retard pour un montant total de {formatTND(overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0))}.
          </span>
        </AlertStrip>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Total Impayé</p>
          <p className={`text-3xl font-black ${overdueInvoices.length > 0 ? "text-red-500 dark:text-red-400" : "text-orange-500 dark:text-orange-400"}`}>
            {formatTND(totalUnpaid).split(",")[0]}<span className="text-xl">,{formatTND(totalUnpaid).split(",")[1]}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">{invoices.filter(inv => inv.status !== 'paid').length} factures en attente</p>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Payé (Historique)</p>
          <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400">
            {formatTND(paidThisMonth).split(",")[0]}<span className="text-xl">,{formatTND(paidThisMonth).split(",")[1]}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">{invoices.filter(inv => inv.status === 'paid').length} règlements validés</p>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-600 dark:border-l-blue-500 hover:shadow-md transition-shadow">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Prochaine Échéance</p>
          {nextDueDate ? (
            <>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{formatTND(nextDueDate.amount).split(",")[0]}<span className="text-xl">,{formatTND(nextDueDate.amount).split(",")[1]}</span></p>
              <p className="text-xs text-slate-500 mt-2">{nextDueDate.invoice_id} — {formatDate(nextDueDate.due_date)}</p>
            </>
          ) : (
            <>
              <p className="text-3xl font-black text-slate-400">—</p>
              <p className="text-xs text-slate-500 mt-2">Aucune échéance à venir</p>
            </>
          )}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 lg:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="font-bold text-sm">Toutes les factures</span>
          <span className="text-xs text-slate-500">{invoices.length} enregistrements</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">N° Facture</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Réf. Commande</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Date d'émission</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Échéance</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-slate-500 font-semibold">Montant (TND)</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Statut</th>
                <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => {
                const badge = paymentStatusBadge(inv.status);
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-[13px] font-bold text-slate-900 dark:text-white">{inv.invoice_id}</td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400">
                        {inv.linked_order_id}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{formatDate(inv.issue_date)}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-semibold">{formatDate(inv.due_date)}</td>
                    <td className="px-4 py-4 text-right font-bold tabular-nums text-[13px]">{formatTND(inv.amount)}</td>
                    <td className="px-4 py-4">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        {inv.status !== 'paid' && (
                          <button className="px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
                            Déclarer un virement
                          </button>
                        )}
                        <button className="px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300/60 dark:hover:bg-slate-700 transition-colors">
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
