// ──────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces for the "Suivi Commercial" module.
// Derived from:
//   - msas, msa_logs, msa_product, msa_price_list migrations
//   - price_lists, price_list_attachables, client_price_list migrations
//   - Supplementary Quote / Order / Invoice models for the frontend UI
// ──────────────────────────────────────────────────────────────────────────────

import type { LocalizedString } from './clientPortal';

// ── price_lists ─────────────────────────────────────────────────────────────

export type PriceListStatus = 'active' | 'draft' | 'inactive';

export interface PriceList {
  id: number;
  price_list_id: string;         // unique business identifier e.g. "PL-2025-001"
  name: LocalizedString;
  price_list_status: PriceListStatus;
  start_date: string | null;     // ISO date
  end_date: string | null;       // ISO date
  version: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── price_list_attachables (pivot) ──────────────────────────────────────────

export interface PriceListAttachable {
  id: number;
  price_list_id: number;
  priceable_id: number;
  priceable_type: string;        // e.g. "App\\Models\\Product"
  base_price: number | null;     // decimal(10,3)
  discount_rate: number;         // decimal(5,2) — default 0
  sales_price: number | null;    // decimal(10,3)
  created_at: string;
  updated_at: string;
}

// ── client_price_list (pivot) ───────────────────────────────────────────────

export interface ClientPriceList {
  id: number;
  client_id: number;
  price_list_id: number;
  created_at: string;
  updated_at: string;
}

// ── msas ────────────────────────────────────────────────────────────────────

export type MsaStatus =
  | 'draft'
  | 'pending_commercial_review'
  | 'pending_finance_validation'
  | 'pending_client_approval'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'amendment_requested'
  | 'amended'
  | 'terminated'
  | 'renewed'
  | 'archived'
  | 'denied_master_service_agreement';

export interface Msa {
  id: number;
  client_id: number;
  msa_id: string | null;         // unique business reference e.g. "MSA-2025-004"

  // Client snapshot
  client_name: string;
  tax_id: string | null;
  rne_id: string | null;

  // HQ
  hq_address: string | null;
  hq_city: string | null;
  hq_postcode: string | null;
  hq_country: string | null;

  // Contact
  primary_phone: string | null;
  primary_email: string | null;

  // Terms
  payment_terms: string | null;
  msa_status: MsaStatus;

  // Dates
  effective_date: string | null;
  end_date: string | null;
  initial_term_years: number;
  auto_renewal_years: number;
  renewal_count: number | null;

  // Client signature
  client_signature_name: string | null;
  client_signature_title: string | null;
  client_signature_date: string | null;

  // Our signature
  our_signature_name: string | null;
  our_signature_title: string | null;
  our_signature_date: string | null;

  // Meta
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// ── msa_logs ────────────────────────────────────────────────────────────────

export interface MsaLog {
  id: number;
  msa_id: number;
  user_id: number | null;
  action: string;               // 'created', 'updated', 'status_changed', 'renewed', etc.
  status_from: string | null;
  status_to: string | null;
  description: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  performed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── msa_product (pivot) ─────────────────────────────────────────────────────

export interface MsaProduct {
  id: number;
  msa_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

// ── msa_price_list (pivot) ──────────────────────────────────────────────────

export interface MsaPriceList {
  id: number;
  msa_id: number;
  price_list_id: number;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// FRONTEND-ONLY INTERFACES
// These model the Quote → Order → Invoice commercial flow for the client
// portal UI. They are not direct 1:1 migration mappings but represent the
// aggregated view a client sees in the "Suivi Commercial" module.
// ──────────────────────────────────────────────────────────────────────────────

// ── Quote (Devis) ───────────────────────────────────────────────────────────

export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'expired'
  | 'cancelled';

export interface QuoteLineItem {
  id: number;
  product_ref: string;
  designation: string;
  quantity: number;
  unit: string;
  unit_price: number;           // decimal(10,3) TND
  discount_rate: number;        // decimal(5,2) %
  line_total: number;           // decimal(10,3) TND
  price_list_id: string | null; // reference to PriceList.price_list_id
}

export interface Quote {
  id: number;
  reference: string;            // e.g. "DEV-2024-089"
  msa_id: string | null;        // linked MSA reference
  client_id: number;
  client_name: string;

  // Content
  object: string;               // descriptive label
  lines: QuoteLineItem[];

  // Financials
  subtotal: number;             // sum of line_totals
  discount_total: number;       // applied negotiated discount
  tax_rate: number;             // % (e.g. 19 for TVA)
  tax_amount: number;
  total_amount: number;

  // Dates
  issue_date: string;
  validity_date: string;        // expiry
  approved_date: string | null;

  // Status
  status: QuoteStatus;

  // Meta
  notes: string | null;
  prepared_by: string;
  price_list_ref: string | null;
  created_at: string;
  updated_at: string;
}

// ── Order (Commande) ────────────────────────────────────────────────────────

export type OrderStatus =
  | 'draft'
  | 'confirmed'
  | 'processing'
  | 'partially_shipped'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface OrderLineItem {
  id: number;
  product_ref: string;
  designation: string;
  quantity: number;
  shipped_quantity: number;
  unit: string;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  reference: string;            // e.g. "CMD-2024-102"
  quote_reference: string | null;
  msa_id: string | null;
  client_id: number;
  client_name: string;

  // Content
  object: string;
  lines: OrderLineItem[];

  // Financials
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;

  // Dates
  order_date: string;
  expected_delivery: string | null;
  actual_delivery: string | null;

  // Status & progress
  status: OrderStatus;
  progress_percent: number;     // 0-100

  // Delivery
  delivery_site: string;        // address label
  delivery_contact: string;

  // Meta
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Invoice (Facture) ───────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'partially_paid'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'credited';

export interface Invoice {
  id: number;
  reference: string;            // e.g. "FAC-2024-067"
  order_reference: string | null;
  quote_reference: string | null;
  msa_id: string | null;
  client_id: number;
  client_name: string;

  // Content
  object: string;

  // Financials
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;

  // Dates
  issue_date: string;
  due_date: string;
  paid_date: string | null;

  // Status
  status: InvoiceStatus;

  // Meta
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── Composite type consumed by SuiviCommercial ──────────────────────────────

export interface CommercialData {
  priceLists: PriceList[];
  msas: Msa[];
  quotes: Quote[];
  orders: Order[];
  invoices: Invoice[];
}
