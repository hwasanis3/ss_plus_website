// ──────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces for the "Assets (Équipements)" module.
// Derived from:
//   - fleets, zones, equipment, equipment_zone, qr_code_logs,
//     equipment_attachables Laravel migration files
// ──────────────────────────────────────────────────────────────────────────────

import type { LocalizedString } from './clientPortal';

// ── fleets ──────────────────────────────────────────────────────────────────

export type FleetStatus = 'active' | 'inactive' | 'archived';
export type FleetType = 'fire_safety' | 'ppe' | 'detection' | 'mixed';

export interface Fleet {
  id: number;
  client_id: number;
  bp_address_id: number;
  fleet_id: string;               // unique business identifier e.g. "FLT-2025-001"
  fleet_name: string;
  fleet_status: FleetStatus | null;
  fleet_type: FleetType | null;
  notes: string | null;
  created_by: string | null;
  updated_by: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  // ── Front-end enriched relations ──
  zones?: Zone[];
}

// ── zones ───────────────────────────────────────────────────────────────────

export type ZoneAccessibility = 'public' | 'restricted' | 'high_security';
export type ZoneClassification = 'production' | 'storage' | 'office' | 'utility' | 'exterior';

export interface Zone {
  id: number;
  fleet_id: number;
  zone_name: string;
  zone_description: string | null;
  zone_accessibility: ZoneAccessibility | null;
  zone_classification: ZoneClassification | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  // ── Front-end enriched relations ──
  equipment_zones?: EquipmentZone[];
}

// ── equipment ───────────────────────────────────────────────────────────────

export type EquipmentStatus =
  | 'compliant'
  | 'needs_inspection'
  | 'non_compliant'
  | 'out_of_service'
  | 'pending_delivery'
  | 'decommissioned';

export interface Equipment {
  id: number;
  client_id: number;
  client_name: string | null;

  // Category hierarchy (JSON i18n fields from migration)
  category_name: LocalizedString;
  category_name_slug: string;
  subcategory_name: LocalizedString;
  subcategory_name_slug: string;
  equipment_model_name: LocalizedString;
  equipment_model_name_slug: string;

  // Technical specs
  pressure_name: LocalizedString | null;
  capacity_value: number | null;       // decimal(10,2)
  capacity_unit: LocalizedString | null;
  capacity_abbreviation: LocalizedString | null;

  // Identification
  brand: string | null;
  equipment_qrc: string;               // unique QR code e.g. "QRC-2024-8891"
  internal_id: string | null;
  serial_number: string | null;

  // Dates
  mfg_date: string | null;            // ISO date
  installation_date: string | null;    // ISO date
  date_next_inspection: string | null; // ISO date
  date_next_hydro_test: string | null; // ISO date
  date_next_second_hydro_test: string | null;

  // Compliance
  certifications: string | null;
  equipment_current_status: EquipmentStatus | null;

  // Meta
  notes: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;

  // ── Front-end enriched relations ──
  equipment_zones?: EquipmentZone[];
  qr_code_logs?: QrCodeLog[];
  attachables?: EquipmentAttachable[];
}

// ── equipment_zone (pivot) ──────────────────────────────────────────────────

export interface EquipmentZone {
  id: number;
  equipment_id: number;
  zone_id: number;
  floor: string | null;               // e.g. "RDC", "Étage 1"
  direction_notes: string | null;     // e.g. "Couloir principal, face à l'entrée"
  created_at: string;
  updated_at: string;

  // ── Front-end enriched (joined) ──
  equipment?: Equipment;
  zone?: Zone;
}

// ── qr_code_logs ────────────────────────────────────────────────────────────

export type QrCodeAction = 'created' | 'updated' | 'replaced' | 'deactivated';

export interface QrCodeLog {
  id: number;
  equipment_id: number;
  old_qr_code: string | null;
  new_qr_code: string;
  action: QrCodeAction;
  user_id: number | null;
  created_at: string;
  updated_at: string;

  // ── Front-end enriched ──
  user_name?: string;                  // resolved from user_id for display
}

// ── equipment_attachables (polymorphic pivot) ───────────────────────────────

export interface EquipmentAttachable {
  id: number;
  equipment_id: number;
  equipmentable_id: number;
  equipmentable_type: string;          // e.g. "App\\Models\\Document", "App\\Models\\Photo"
  created_at: string;
  updated_at: string;
}

// ── Composite type consumed by Assets component ─────────────────────────────

export interface AssetsData {
  fleets: Fleet[];
  allEquipment: Equipment[];
  allZones: Zone[];
  allEquipmentZones: EquipmentZone[];
  allQrCodeLogs: QrCodeLog[];
}
