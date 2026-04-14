// ──────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces derived from the Laravel migration files.
// Each interface mirrors the columns/types from the corresponding migration.
// JSON columns (translatable) are typed as LocalizedString.
// ──────────────────────────────────────────────────────────────────────────────

/** Represents a translatable JSON column (e.g. `{ fr: "...", en: "..." }`) */
export interface LocalizedString {
  fr: string;
  en?: string;
  ar?: string;
}

// ── clients ─────────────────────────────────────────────────────────────────

export type LegalStatus =
  | 'sarl'
  | 'sa'
  | 'suarl'
  | 'snc'
  | 'individual'
  | 'public_entity'
  | 'association'
  | 'ngo'
  | 'other';

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5001-10000'
  | '10001+';

export type ClientCategory =
  | 'unclassified'
  | 'individual'
  | 'standard'
  | 'enterprise'
  | 'premium'
  | 'group';

export type ClientStatus =
  | 'prospect'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'blacklisted'
  | 'archived';

export interface Client {
  id: number;
  client_id: string;

  // Identity
  legal_name: string;
  commercial_name: LocalizedString | null;
  tax_id: string | null;
  rne_id: string | null;
  legal_status: LegalStatus | null;
  company_size: CompanySize | null;
  industry: string | null;
  founding_year: number | null;
  website: string | null;
  logo_path: string | null;
  primary_phone: string | null;
  primary_email: string | null;
  hq_address: LocalizedString | null;
  hq_city: LocalizedString | null;
  hq_postcode: string | null;
  hq_country: string;

  // Operational
  account_manager_id: number | null;
  partner_since: string | null;           // ISO date
  satisfaction_score: number | null;      // decimal(3,1)

  // Client-Specific
  client_category: ClientCategory;
  credit_limit: number;                   // decimal(15,3)
  payment_terms: string | null;
  default_currency: string;
  discount_rate: number;                  // decimal(5,2)

  // Status & Meta
  status: ClientStatus;
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── bp_addresses ────────────────────────────────────────────────────────────

export type AddressType =
  | 'headquarters'
  | 'billing'
  | 'shipping'
  | 'operational_site'
  | 'warehouse'
  | 'branch'
  | 'other';

export interface BpAddress {
  id: number;
  addressable_type: string;
  addressable_id: number;

  // Flags
  type: AddressType;
  is_primary: boolean;
  is_billing_default: boolean;
  is_shipping_default: boolean;
  label: LocalizedString | null;

  // Address Fields
  address_street: LocalizedString;
  address_street2: LocalizedString | null;
  city: LocalizedString | null;
  state: LocalizedString | null;
  postcode: string | null;
  country: string;

  // Site-Specific
  phone: string | null;
  email: string | null;
  responsible: string | null;
  nearest_fire_station: string | null;
  work_team: string | null;
  latitude: number | null;
  longitude: number | null;

  notes: LocalizedString | null;
  created_at: string;
  updated_at: string;
}

// ── bp_contacts ─────────────────────────────────────────────────────────────

export type ContactGender = 'male' | 'female';
export type ContactStatus = 'active' | 'inactive';

export interface BpContact {
  id: number;
  contactable_type: string;
  contactable_id: number;

  // Identity
  first_name: LocalizedString;
  last_name: LocalizedString;
  gender: ContactGender | null;
  avatar_path: string | null;

  // Professional
  job_title: string | null;
  department: string | null;

  // Communication
  phone: string | null;
  mobile: string | null;
  whatsapp_number: string | null;
  email: string | null;
  linkedin_url: string | null;

  // Flags
  is_primary: boolean;
  is_decision_maker: boolean;
  status: ContactStatus;

  notes: LocalizedString | null;
  created_at: string;
  updated_at: string;

  // Virtual (pivot data)
  assigned_sites?: BpContactAddress[];
}

// ── bp_contact_address (pivot) ──────────────────────────────────────────────

export interface BpContactAddress {
  id: number;
  bp_contact_id: number;
  bp_address_id: number;
  is_primary_location: boolean;
  created_at: string;
  updated_at: string;
}

// ── bp_bank_accounts ────────────────────────────────────────────────────────

export type BankAccountUsage = 'payments' | 'receipts' | 'both';

export interface BpBankAccount {
  id: number;
  bankable_type: string;
  bankable_id: number;

  // Bank Details
  bank_name: string;
  bank_code: string | null;
  branch: string | null;
  account_holder: string | null;
  rib: string | null;
  iban: string | null;
  swift_bic: string | null;
  account_number: string | null;
  currency: string;

  // Flags
  is_primary: boolean;
  is_verified: boolean;
  usage: BankAccountUsage;

  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── bp_vat_certificates ─────────────────────────────────────────────────────

export type VatCertificateStatus =
  | 'active'
  | 'expired'
  | 'revoked'
  | 'pending_renewal';

export interface BpVatCertificate {
  id: number;
  certifiable_type: string;
  certifiable_id: number;

  // Certificate Details
  certificate_number: string;
  issuing_authority: string | null;
  issue_date: string;               // ISO date
  expiration_date: string | null;    // ISO date

  // Status
  status: VatCertificateStatus;
  document_path: string | null;

  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── bp_documents ────────────────────────────────────────────────────────────

export type DocumentType =
  | 'contract'
  | 'nda'
  | 'framework_agreement'
  | 'purchase_order'
  | 'compliance_certificate'
  | 'insurance_policy'
  | 'tax_id'
  | 'rne'
  | 'other';

export type DocumentStatus =
  | 'draft'
  | 'active'
  | 'under_review'
  | 'expired'
  | 'terminated';

export interface BpDocument {
  id: number;
  documentable_type: string;
  documentable_id: number;

  // Users
  uploaded_by: number | null;
  verified_by: number | null;

  // Classification
  type: DocumentType;
  title: LocalizedString;
  reference_number: string | null;

  // Dates
  issue_date: string | null;
  effective_date: string | null;
  expiration_date: string | null;
  auto_renewable: boolean;

  // Status
  status: DocumentStatus;
  is_verified: boolean;

  // File
  file_path: string | null;
  file_name: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;

  notes: LocalizedString | null;
  created_at: string;
  updated_at: string;
}

// ── media (Spatie Media Library) ────────────────────────────────────────────

export interface Media {
  id: number;
  model_type: string;
  model_id: number;
  uuid: string | null;
  collection_name: string;
  name: string;
  file_name: string;
  mime_type: string | null;
  disk: string;
  conversions_disk: string | null;
  size: number;
  manipulations: Record<string, unknown>;
  custom_properties: Record<string, unknown>;
  generated_conversions: Record<string, unknown>;
  responsive_images: Record<string, unknown>;
  order_column: number | null;
  created_at: string | null;
  updated_at: string | null;
}

// ── Composite Profile (what the frontend consumes) ──────────────────────────

export interface ClientProfile extends Client {
  addresses: BpAddress[];
  contacts: BpContact[];
  bank_accounts: BpBankAccount[];
  vat_certificates: BpVatCertificate[];
  documents: BpDocument[];
}
