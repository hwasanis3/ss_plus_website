import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { mockClientData } from "@/data/mockClientData";
import type { BpAddress, BpContact, BpBankAccount, BpVatCertificate, BpDocument } from "@/types/clientPortal";

// ── Helpers ─────────────────────────────────────────────────────────────────

const LEGAL_STATUS_LABELS: Record<string, string> = {
  sarl: 'Société à Responsabilité Limitée (SARL)',
  sa: 'Société Anonyme (SA)',
  suarl: 'Société Unipersonnelle à Responsabilité Limitée (SUARL)',
  snc: 'Société en Nom Collectif (SNC)',
  individual: 'Entreprise Individuelle',
  public_entity: 'Établissement Public',
  association: 'Association',
  ngo: 'Organisation Non-Gouvernementale',
  other: 'Autre',
};

const CLIENT_CATEGORY_LABELS: Record<string, string> = {
  unclassified: 'Non classifié',
  individual: 'Individuel',
  standard: 'Standard',
  enterprise: 'Entreprise',
  premium: 'Premium',
  group: 'Groupe',
};

const DOC_TYPE_LABELS: Record<string, string> = {
  contract: 'Contrat',
  nda: 'Accord de confidentialité',
  framework_agreement: 'Contrat-cadre',
  purchase_order: 'Bon de commande',
  compliance_certificate: 'Certificat de conformité',
  insurance_policy: 'Police d\'assurance',
  tax_id: 'Matricule fiscal',
  rne: 'Registre de commerce',
  other: 'Autre',
};

const DOC_STATUS_BADGES: Record<string, { variant: "green" | "red" | "yellow" | "blue" | "gray" | "orange" | "purple"; label: string }> = {
  active: { variant: 'green', label: 'Actif' },
  draft: { variant: 'gray', label: 'Brouillon' },
  under_review: { variant: 'orange', label: 'En révision' },
  expired: { variant: 'red', label: 'Expiré' },
  terminated: { variant: 'red', label: 'Résilié' },
};

const VAT_STATUS_BADGES: Record<string, { variant: "green" | "red" | "yellow" | "orange"; label: string }> = {
  active: { variant: 'green', label: 'Active' },
  expired: { variant: 'red', label: 'Expirée' },
  revoked: { variant: 'red', label: 'Révoquée' },
  pending_renewal: { variant: 'yellow', label: 'Renouvellement en cours' },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-TN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(amount: number, currency: string = 'TND'): string {
  return new Intl.NumberFormat('fr-TN', {
    style: 'decimal',
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(amount) + ` ${currency}`;
}

function maskRIB(rib: string | null): string {
  if (!rib) return '—';
  const clean = rib.replace(/\s/g, '');
  if (clean.length <= 6) return rib;
  return clean.slice(0, 4) + ' •••• •••• ' + clean.slice(-4);
}

// ── Sub Components ──────────────────────────────────────────────────────────

function CompanyInfoCard() {
  const data = mockClientData;
  const entries: [string, string][] = [
    ['Raison sociale', data.legal_name],
    ['Nom commercial', data.commercial_name?.fr || '—'],
    ['Forme juridique', data.legal_status ? LEGAL_STATUS_LABELS[data.legal_status] : '—'],
    ['Matricule fiscal', data.tax_id || '—'],
    ['Registre de commerce', data.rne_id ? `${data.rne_id} — Tribunal Sfax` : '—'],
    ['Secteur d\'activité', data.industry || '—'],
    ['Taille entreprise', data.company_size ? `${data.company_size} employés` : '—'],
    ['Année de fondation', data.founding_year?.toString() || '—'],
    ['Adresse siège', data.hq_address?.fr || '—'],
    ['Ville / Code postal', `${data.hq_city?.fr || ''} ${data.hq_postcode || ''}`],
    ['Pays', data.hq_country],
    ['Téléphone', data.primary_phone || '—'],
    ['Email', data.primary_email || '—'],
    ['Site web', data.website || '—'],
    ['Client depuis', formatDate(data.partner_since)],
    ['Numéro client', data.client_id],
    ['Catégorie', CLIENT_CATEGORY_LABELS[data.client_category]],
    ['Condition paiement', data.payment_terms || '—'],
    ['Devise', data.default_currency],
    ['Score satisfaction', data.satisfaction_score ? `${data.satisfaction_score} / 5.0 ⭐` : '—'],
  ];

  return (
    <Card className="p-5 lg:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">
          Informations société
        </h3>
        <Badge variant={data.status === 'active' ? 'green' : 'gray'}>
          {data.status === 'active' ? '✅ Actif' : data.status}
        </Badge>
      </div>
      <div className="flex flex-col gap-2.5">
        {entries.map(([key, value], idx) => (
          <div key={idx} className="flex justify-between items-start gap-4">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide flex-shrink-0 w-40">
              {key}
            </span>
            <span className="text-[13px] font-medium text-slate-900 dark:text-slate-100 text-right">
              {key === 'Site web' && value !== '—' ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  {value}
                </a>
              ) : key === 'Email' && value !== '—' ? (
                <a href={`mailto:${value}`} className="text-blue-600 hover:text-blue-700 underline underline-offset-2">
                  {value}
                </a>
              ) : (
                value
              )}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SitesCard() {
  // Filter to show only operational_site + headquarters
  const sites: BpAddress[] = mockClientData.addresses.filter(
    (a) => a.type === 'operational_site' || a.type === 'headquarters'
  );

  const siteIcons: Record<string, string> = {
    headquarters: '🏢',
    operational_site: '🏭',
    warehouse: '📦',
  };

  return (
    <Card className="p-5 lg:p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">
          Sites / Fire Parks
        </h3>
        <Badge variant="blue">{sites.length} sites</Badge>
      </div>
      <div className="flex flex-col gap-3">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex items-start gap-4 border border-slate-100 dark:border-slate-800/80 transition-all hover:border-blue-200 dark:hover:border-blue-900/60"
          >
            <span className="text-2xl mt-0.5">
              {siteIcons[site.type] || '🏗️'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {site.label?.fr || site.type}
                </span>
                {site.is_primary && (
                  <Badge variant="green" className="text-[10px] py-0.5 px-1.5">Principal</Badge>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {site.address_street?.fr}
                {site.city?.fr && `, ${site.city.fr}`}
                {site.postcode && ` — ${site.postcode}`}
                <br />
                Resp. :{' '}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {site.responsible || '—'}
                </span>
                <br />
                🔥 Caserne :{' '}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {site.nearest_fire_station || '—'}
                </span>
                <br />
                👥 Équipe :{' '}
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {site.work_team || '—'}
                </span>
              </div>
              {site.phone && (
                <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-1.5">
                  📞 {site.phone}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ContactsTable() {
  const contacts: BpContact[] = mockClientData.contacts;

  return (
    <Card className="overflow-hidden">
      <div className="p-5 lg:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">
          Contacts autorisés
        </h3>
        <Badge variant="blue">{contacts.length} contacts</Badge>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Nom / Poste
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Département
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Coordonnées
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Statut
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Rôle
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {contact.first_name.fr[0]}{contact.last_name.fr[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white whitespace-nowrap">
                        {contact.first_name.fr} {contact.last_name.fr}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {contact.job_title || '—'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {contact.department || '—'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-[13px] font-mono font-medium text-slate-700 dark:text-slate-300">
                    {contact.mobile || contact.phone || '—'}
                  </div>
                  <div className="text-[13px] text-slate-500 hover:text-blue-600 transition-colors cursor-pointer mt-0.5">
                    {contact.email || '—'}
                  </div>
                  {contact.whatsapp_number && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>💬</span> WhatsApp
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <Badge variant={contact.status === 'active' ? 'green' : 'red'}>
                    {contact.status === 'active' ? 'Actif' : 'Inactif'}
                  </Badge>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-col gap-1">
                    {contact.is_primary && (
                      <Badge variant="blue">👤 Principal</Badge>
                    )}
                    {contact.is_decision_maker && (
                      <Badge variant="purple">🎯 Décideur</Badge>
                    )}
                    {!contact.is_primary && !contact.is_decision_maker && (
                      <span className="text-slate-300 dark:text-slate-700">—</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FinancialsCard() {
  const accounts: BpBankAccount[] = mockClientData.bank_accounts;
  const certificates: BpVatCertificate[] = mockClientData.vat_certificates;
  const data = mockClientData;

  return (
    <Card className="p-5 lg:p-6">
      <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-5">
        💰 Informations Financières & Légales
      </h3>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Plafond de crédit
          </div>
          <div className="text-lg font-black text-blue-600 dark:text-blue-400">
            {formatCurrency(data.credit_limit, data.default_currency)}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Taux de remise
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
            {data.discount_rate.toFixed(2)}%
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Condition de paiement
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {data.payment_terms || '—'}
          </div>
        </div>
      </div>

      {/* Bank Accounts */}
      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
        🏦 Comptes bancaires
        <Badge variant="blue">{accounts.length}</Badge>
      </h4>
      <div className="flex flex-col gap-3 mb-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {account.bank_name}
                </span>
                {account.is_primary && (
                  <Badge variant="green" className="text-[10px] py-0.5 px-1.5">Principal</Badge>
                )}
                {account.is_verified && (
                  <Badge variant="blue" className="text-[10px] py-0.5 px-1.5">✓ Vérifié</Badge>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-500">
                <div>
                  <span className="font-semibold uppercase tracking-wide">Agence :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{account.branch || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">Titulaire :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{account.account_holder || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">RIB :</span>{' '}
                  <span className="font-mono text-slate-700 dark:text-slate-300">{maskRIB(account.rib)}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">SWIFT :</span>{' '}
                  <span className="font-mono text-slate-700 dark:text-slate-300">{account.swift_bic || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">Devise :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{account.currency}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">Usage :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">
                    {account.usage === 'both' ? 'Émission & Encaissement' : account.usage === 'payments' ? 'Émission' : 'Encaissement'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VAT Certificates */}
      <h4 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
        📜 Attestations TVA
        <Badge variant="blue">{certificates.length}</Badge>
      </h4>
      <div className="flex flex-col gap-3">
        {certificates.map((cert) => {
          const statusInfo = VAT_STATUS_BADGES[cert.status] || { variant: 'gray' as const, label: cert.status };
          return (
            <div
              key={cert.id}
              className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm font-mono text-slate-900 dark:text-slate-100">
                  {cert.certificate_number}
                </span>
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-slate-500">
                <div>
                  <span className="font-semibold uppercase tracking-wide">Autorité :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{cert.issuing_authority || '—'}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">Émission :</span>{' '}
                  <span className="text-slate-700 dark:text-slate-300">{formatDate(cert.issue_date)}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wide">Expiration :</span>{' '}
                  <span className={`font-medium ${cert.status === 'expired' ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {formatDate(cert.expiration_date)}
                  </span>
                </div>
              </div>
              {cert.notes && (
                <p className="text-[11px] text-slate-400 mt-2 italic">{cert.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function DocumentsCard() {
  const documents: BpDocument[] = mockClientData.documents;

  return (
    <Card className="overflow-hidden">
      <div className="p-5 lg:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">
          📄 Documents contractuels
        </h3>
        <Badge variant="blue">{documents.length} documents</Badge>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Document
              </th>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Type
              </th>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Référence
              </th>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Validité
              </th>
              <th className="py-3.5 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                Statut
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {documents.map((doc) => {
              const statusInfo = DOC_STATUS_BADGES[doc.status] || { variant: 'gray' as const, label: doc.status };
              return (
                <tr
                  key={doc.id}
                  className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-sm text-slate-900 dark:text-white max-w-xs truncate">
                      {doc.title.fr}
                    </div>
                    {doc.file_name && (
                      <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                        {doc.file_name}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-6">
                    <Badge variant="gray" className="whitespace-nowrap">
                      {DOC_TYPE_LABELS[doc.type] || doc.type}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                      {doc.reference_number || '—'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="text-xs text-slate-500">
                      <div>{formatDate(doc.effective_date)} →</div>
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(doc.expiration_date)}
                      </div>
                      {doc.auto_renewable && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400">🔄 Tacite reconduction</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex flex-col gap-1">
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      {doc.is_verified && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ Vérifié</span>
                      )}
                    </div>
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

// ── Main Component ──────────────────────────────────────────────────────────

export default function MonProfil() {
  return (
    <div className="p-4 lg:p-8 animate-in">
      <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-6">
        🏢 Mon Profil
      </h2>

      {/* Row 1: Company Info + Sites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <CompanyInfoCard />
        <SitesCard />
      </div>

      {/* Row 2: Contacts Table */}
      <div className="mb-6">
        <ContactsTable />
      </div>

      {/* Row 3: Financials & Legal */}
      <div className="mb-6">
        <FinancialsCard />
      </div>

      {/* Row 4: Documents Table */}
      <DocumentsCard />
    </div>
  );
}
