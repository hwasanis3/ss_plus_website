// ──────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces derived from the catalog-domain Laravel migrations.
// Covers: categories, brands, units, items (base), products, consumables,
//         eq_servicing, guidelines, options/variants, blueprints, and all pivots.
// ──────────────────────────────────────────────────────────────────────────────

import type { LocalizedString } from './clientPortal';
export type { LocalizedString };

// ── catalog_categories ──────────────────────────────────────────────────────

export interface CatalogCategory {
  id: string; // ULID
  name: LocalizedString;
  parent_id: string | null;
  item_type_scope: ('product' | 'consumable')[] | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── catalog_brands ──────────────────────────────────────────────────────────

export interface CatalogBrand {
  id: string; // ULID
  name: string;
  code: string;
  country_of_origin: string | null;
  warranty_policy_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ── units_of_measure ────────────────────────────────────────────────────────

export type UomType = 'count' | 'mass' | 'volume' | 'length' | 'service';

export interface UnitOfMeasure {
  id: string; // ULID
  code: string;
  name: LocalizedString;
  type: UomType;
  created_at: string;
  updated_at: string;
}

// ── media ───────────────────────────────────────────────────────────────────

export interface CatalogMedia {
  id: number;
  collection_name: 'images' | 'documents' | 'manuals' | 'certifications' | string;
  name: string;
  file_name: string;
  mime_type: string;
  url: string;
  size: number;
}


// ── catalog_items (base table) ──────────────────────────────────────────────

export type CatalogItemType = 'product' | 'consumable' | 'eq_servicing';
export type TaxClass = 'standard_19pct' | 'reduced_7pct' | 'exempt';
export type CatalogItemStatus = 'active' | 'draft' | 'discontinued';

export interface CatalogItemBase {
  id: string; // ULID
  code: string;
  item_type: CatalogItemType;
  name: LocalizedString;
  short_description: LocalizedString | null;

  // Foreign keys (denormalized for frontend)
  category_id: string;
  brand_id: string | null;
  uom_id: string;

  // Resolved lookups (hydrated for display)
  category?: CatalogCategory;
  brand?: CatalogBrand;
  uom?: UnitOfMeasure;

  // Commerce & Pricing
  base_price: number | null;
  cost_price: number | null;
  markup: number | null;
  tax_class: TaxClass;
  is_stockable: boolean;
  is_purchasable: boolean;
  is_sellable: boolean;

  // Inventory
  current_stock: number;
  min_stock_level: number | null;
  reorder_point: number | null;
  reorder_qty: number | null;
  lead_time_days: number | null;

  // Supplier & Compliance
  preferred_supplier_id: number | null;
  warranty_months: number | null;
  internal_notes: string | null;

  // Status
  status: CatalogItemStatus;

  // Audit
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Meta (pivots & media)
  tags?: string[];
  certifications?: string[];
  media?: CatalogMedia[];
}

// ── catalog_products (extends items) ────────────────────────────────────────

export type ProductType = 'physical' | 'digital' | 'service';

export type PhysicalType =
  | 'extinguisher'
  | 'wheeled_extinguisher'
  | 'detector'
  | 'detection_panel'
  | 'suppression_system'
  | 'hose_reel'
  | 'fire_blanket'
  | 'sprinkler_head'
  | 'alarm_device'
  | 'ppe'
  | 'cabinet'
  | 'other';

export type DigitalType =
  | 'compliance_certificate'
  | 'compliance_report'
  | 'inspection_report'
  | 'training_material'
  | 'training_video'
  | 'software_license'
  | 'module_subscription'
  | 'other';

export type DeliveryMethod = 'auto_generated' | 'portal_download' | 'email_attachment';

export type ProductServiceType =
  | 'training'
  | 'safety_audit'
  | 'consultation'
  | 'emergency_response'
  | 'installation_project'
  | 'other';

export type BillableUnit = 'per_session' | 'per_hour' | 'per_day' | 'per_action' | 'flat_fee';

export interface CatalogProductFields {
  catalog_item_id: string;
  product_type: ProductType;

  // Physical
  physical_type: PhysicalType | null;
  capacity_value: number | null;
  capacity_unit: string | null;
  material: string | null;
  technical_specs: Record<string, unknown> | null;
  expiry_years: number | null;

  // Digital
  digital_type: DigitalType | null;
  delivery_method: DeliveryMethod | null;
  template_id: number | null;
  linked_servicing_id: string | null;
  is_downloadable: boolean;

  // Service
  service_type: ProductServiceType | null;
  billable_unit: BillableUnit | null;
  duration_minutes: number | null;
  max_participants: number | null;
}

export interface CatalogProduct extends CatalogItemBase {
  item_type: 'product';
  product: CatalogProductFields;
}

// ── catalog_consumables (extends items) ─────────────────────────────────────

export type ConsumableType =
  | 'agents_and_disposables'
  | 'replacement_parts'
  | 'safety_signage'
  | 'accessories';

export interface CatalogConsumableFields {
  catalog_item_id: string;
  consumable_type: ConsumableType;

  is_consumable: boolean;
  consumption_per_service: number | null;
  oem_reference: string | null;
  superseded_by_id: string | null;

  // Compatibility
  compatible_equipment_classes: string[] | null;
  compatible_item_ids: string[] | null;
  compatible_agent_types: string[] | null;
  compatibility_notes: string | null;

  // Storage & Safety
  shelf_life_months: number | null;
  hazard_class: string | null;
  storage_conditions: string | null;
}

export interface CatalogConsumable extends CatalogItemBase {
  item_type: 'consumable';
  consumable: CatalogConsumableFields;
}

// ── catalog_eq_servicing (extends items) ────────────────────────────────────

export type EqServicingType =
  | 'inspection_and_testing'
  | 'maintenance_and_repair'
  | 'refill_recharge'
  | 'calibration_and_certification'
  | 'installation_decommissioning';

export type ServicingDeliveryMode = 'on_site' | 'workshop' | 'hybrid';

export type ServicingBillableUnit = 'per_unit' | 'per_session' | 'per_site' | 'flat_fee';

export interface CatalogEqServicingFields {
  catalog_item_id: string;
  eq_servicing_type: EqServicingType;
  delivery_mode: ServicingDeliveryMode;
  billable_unit: ServicingBillableUnit;
  duration_minutes: number | null;

  // Recurrence
  is_recurring: boolean;
  recurrence_months: number | null;
  applicable_equipment_classes: string[] | null;
  applicable_agent_types: string[] | null;

  // Outputs
  creates_intervention_record: boolean;
  creates_workshop_record: boolean;
  creates_compliance_document: boolean;
  updates_next_service_date: boolean;

  // Guideline & SLA
  guideline_id: number | null;
  sla_response_hours: number | null;
  sla_resolution_hours: number | null;
  required_certifications: string[] | null;
}

export interface CatalogEqServicing extends CatalogItemBase {
  item_type: 'eq_servicing';
  eq_servicing: CatalogEqServicingFields;
}

// ── Union Type ──────────────────────────────────────────────────────────────

export type CatalogItem = CatalogProduct | CatalogConsumable | CatalogEqServicing;

// ── guidelines ──────────────────────────────────────────────────────────────

export interface Guideline {
  id: number;
  code: string;
  name: LocalizedString;
  description: LocalizedString | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  steps?: GuidelineStep[];
}

export type StepType = 'boolean' | 'numeric' | 'text' | 'photo' | 'choice';

export interface GuidelineStep {
  id: number;
  guideline_id: number;
  sort_order: number;
  instruction: LocalizedString;
  step_type: StepType;
  is_required: boolean;
  expected_value: string | null;
  created_at: string;
  updated_at: string;
}

// ── equipment_blueprints ────────────────────────────────────────────────────

export type EquipmentClass =
  | 'portable_extinguisher'
  | 'wheeled_extinguisher'
  | 'fixed_suppression_system'
  | 'detection_panel'
  | 'detector'
  | 'hose_reel'
  | 'fire_blanket'
  | 'other';

export type BlueprintStatus = 'active' | 'draft' | 'inactive';

export interface EquipmentBlueprint {
  id: string; // ULID
  code: string;
  name: LocalizedString;
  description: LocalizedString | null;
  category_id: string | null;
  status: BlueprintStatus;
  linked_product_id: string | null;

  // Technical specs
  equipment_class: EquipmentClass;
  physical_type: PhysicalType | null;
  capacity_value: number | null;
  capacity_unit: string | null;
  working_pressure_bar: number | null;
  fire_class_rating: string | null;

  needs_azote_refill: boolean;
  has_pressure_gauge: boolean;
  has_tamper_seal: boolean;

  // Lifecycle
  inspection_frequency: string;
  hydro_test_frequency: string | null;
  default_refill_interval_months: number | null;
  default_expiry_years: number | null;

  // Compliance
  guideline_id: number | null;
  compliance_form_template_id: number | null;
  qr_label_template_id: number | null;
  requires_serial_number: boolean;
  serial_number_format: string | null;
  regulatory_standard: string | null;
  is_trackable_in_field_app: boolean;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  // Hydrated relations
  consumables?: BlueprintConsumable[];
  servicing?: BlueprintServicing[];
  guideline?: Guideline;
  guidelines?: Guideline[]; // Kept for backwards compatibility if needed
  category?: CatalogCategory;
  media?: CatalogMedia[];
}

// ── blueprint_consumables (pivot) ───────────────────────────────────────────

export interface BlueprintConsumable {
  id: number;
  blueprint_id: string;
  catalog_item_id: string;
  quantity: number;
  unit: string | null;
  created_at: string;
  updated_at: string;

  // Hydrated
  item?: CatalogItem;
}

// ── blueprint_servicing (pivot) ─────────────────────────────────────────────

export interface BlueprintServicing {
  id: number;
  blueprint_id: string;
  catalog_item_id: string;
  created_at: string;
  updated_at: string;

  // Hydrated
  item?: CatalogItem;
}

// ── servicing_consumables (pivot) ───────────────────────────────────────────

export interface ServicingConsumable {
  id: number;
  servicing_id: string;
  catalog_item_id: string;
  quantity: number;
  unit: string | null;
  created_at: string;
  updated_at: string;
}

// ── catalog_options / option_values / variants ──────────────────────────────

export interface CatalogOption {
  id: number;
  catalog_item_id: string;
  name: LocalizedString;
  sort_order: number;
  created_at: string;
  updated_at: string;
  values?: CatalogOptionValue[];
}

export interface CatalogOptionValue {
  id: number;
  option_id: number;
  value: LocalizedString;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type VariantStatus = 'active' | 'inactive';

export interface CatalogVariant {
  id: number;
  catalog_item_id: string;
  sku: string;
  barcode: string | null;
  price: number | null;
  cost_price: number | null;
  stock: number;
  status: VariantStatus;
  created_at: string;
  updated_at: string;
  option_values?: CatalogOptionValue[];
}

// ── catalog_item_tags / certifications (pivots) ─────────────────────────────

export interface CatalogItemTag {
  id: number;
  catalog_item_id: string;
  tag: string;
}

export interface CatalogItemCertification {
  id: number;
  catalog_item_id: string;
  certification: string;
}
