// ──────────────────────────────────────────────────────────────────────────────
// Mock Assets Data — PROTEX INDUSTRIES SARL
// Domain: Industrial Safety & Fire Protection — French values
// Hierarchy: Fleet → Zones → Equipment (via equipment_zone pivot)
// ──────────────────────────────────────────────────────────────────────────────

import type {
  AssetsData,
  Fleet,
  Zone,
  Equipment,
  EquipmentZone,
  QrCodeLog,
} from '@/types/assetsPortal';

// ── Fleet ───────────────────────────────────────────────────────────────────

const fleets: Fleet[] = [
  {
    id: 1,
    client_id: 1,
    bp_address_id: 1,
    fleet_id: 'FLT-2025-001',
    fleet_name: 'Parc Principal Sfax',
    fleet_status: 'active',
    fleet_type: 'fire_safety',
    notes: 'Parc principal couvrant le siège social et les zones de production — Zone Industrielle Sfax Sud.',
    created_by: 'Mehdi Karray',
    updated_by: 'Mehdi Karray',
    deleted_at: null,
    created_at: '2024-06-15T08:00:00Z',
    updated_at: '2025-02-10T14:30:00Z',
  },
];

// ── Zones ───────────────────────────────────────────────────────────────────

const zones: Zone[] = [
  {
    id: 1,
    fleet_id: 1,
    zone_name: 'Zone de Stockage',
    zone_description: 'Entrepôt principal de stockage de matières premières et produits finis — surface 800 m².',
    zone_accessibility: 'restricted',
    zone_classification: 'storage',
    deleted_at: null,
    created_at: '2024-06-15T08:30:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 2,
    fleet_id: 1,
    zone_name: 'Bureaux Administratifs',
    zone_description: 'Bloc administratif comprenant open-space, salles de réunion et direction — 2 étages.',
    zone_accessibility: 'public',
    zone_classification: 'office',
    deleted_at: null,
    created_at: '2024-06-15T08:45:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 3,
    fleet_id: 1,
    zone_name: 'Atelier de Production',
    zone_description: 'Ligne de fabrication principale — machines CNC, soudure et assemblage — surface 1 200 m².',
    zone_accessibility: 'restricted',
    zone_classification: 'production',
    deleted_at: null,
    created_at: '2024-06-15T09:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
];

// ── Equipment ───────────────────────────────────────────────────────────────

const equipment: Equipment[] = [
  // ─── 1. Extincteur Poudre ABC 6kg — Compliant ───
  {
    id: 1,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'Poudre ABC', en: 'ABC Powder' },
    subcategory_name_slug: 'poudre-abc',
    equipment_model_name: { fr: 'Extincteur Poudre ABC 6kg', en: 'ABC Powder Extinguisher 6kg' },
    equipment_model_name_slug: 'extincteur-poudre-abc-6kg',
    pressure_name: { fr: 'Pression permanente', en: 'Stored pressure' },
    capacity_value: 6.00,
    capacity_unit: { fr: 'Kilogramme', en: 'Kilogram' },
    capacity_abbreviation: { fr: 'kg', en: 'kg' },
    brand: 'Desautel',
    equipment_qrc: 'QRC-2024-8891',
    internal_id: 'EXT-SFX-001',
    serial_number: 'DST-2023-APC-004817',
    mfg_date: '2023-03-15',
    installation_date: '2023-06-20',
    date_next_inspection: '2026-06-20',
    date_next_hydro_test: '2033-03-15',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7, CE',
    equipment_current_status: 'compliant',
    notes: 'Dernière vérification annuelle effectuée le 18/06/2025 — conforme.',
    deleted_at: null,
    created_at: '2023-06-20T08:00:00Z',
    updated_at: '2025-06-18T14:00:00Z',
    qr_code_logs: [],
  },
  // ─── 2. Extincteur Poudre ABC 6kg — Needs Inspection ───
  {
    id: 2,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'Poudre ABC', en: 'ABC Powder' },
    subcategory_name_slug: 'poudre-abc',
    equipment_model_name: { fr: 'Extincteur Poudre ABC 6kg', en: 'ABC Powder Extinguisher 6kg' },
    equipment_model_name_slug: 'extincteur-poudre-abc-6kg',
    pressure_name: { fr: 'Pression permanente', en: 'Stored pressure' },
    capacity_value: 6.00,
    capacity_unit: { fr: 'Kilogramme', en: 'Kilogram' },
    capacity_abbreviation: { fr: 'kg', en: 'kg' },
    brand: 'Desautel',
    equipment_qrc: 'QRC-2024-8892',
    internal_id: 'EXT-SFX-002',
    serial_number: 'DST-2022-APC-003291',
    mfg_date: '2022-09-10',
    installation_date: '2022-12-05',
    date_next_inspection: '2025-12-05',    // ⚠️ past due — triggers warning
    date_next_hydro_test: '2032-09-10',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7, CE',
    equipment_current_status: 'needs_inspection',
    notes: 'Inspection annuelle en retard — à planifier prioritairement.',
    deleted_at: null,
    created_at: '2022-12-05T08:00:00Z',
    updated_at: '2025-11-20T10:00:00Z',
    qr_code_logs: [],
  },
  // ─── 3. Extincteur CO₂ 5kg — Compliant ───
  {
    id: 3,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'CO₂', en: 'CO₂' },
    subcategory_name_slug: 'co2',
    equipment_model_name: { fr: 'Extincteur CO₂ 5kg', en: 'CO₂ Extinguisher 5kg' },
    equipment_model_name_slug: 'extincteur-co2-5kg',
    pressure_name: { fr: 'Haute pression', en: 'High pressure' },
    capacity_value: 5.00,
    capacity_unit: { fr: 'Kilogramme', en: 'Kilogram' },
    capacity_abbreviation: { fr: 'kg', en: 'kg' },
    brand: 'Sicli',
    equipment_qrc: 'QRC-2024-8893',
    internal_id: 'EXT-SFX-003',
    serial_number: 'SCL-2023-CO2-001455',
    mfg_date: '2023-01-22',
    installation_date: '2023-04-10',
    date_next_inspection: '2026-04-10',
    date_next_hydro_test: '2033-01-22',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7, CE',
    equipment_current_status: 'compliant',
    notes: null,
    deleted_at: null,
    created_at: '2023-04-10T08:00:00Z',
    updated_at: '2025-04-12T11:00:00Z',
    qr_code_logs: [],
  },
  // ─── 4. Extincteur CO₂ 5kg — Out of Service ───
  {
    id: 4,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'CO₂', en: 'CO₂' },
    subcategory_name_slug: 'co2',
    equipment_model_name: { fr: 'Extincteur CO₂ 5kg', en: 'CO₂ Extinguisher 5kg' },
    equipment_model_name_slug: 'extincteur-co2-5kg',
    pressure_name: { fr: 'Haute pression', en: 'High pressure' },
    capacity_value: 5.00,
    capacity_unit: { fr: 'Kilogramme', en: 'Kilogram' },
    capacity_abbreviation: { fr: 'kg', en: 'kg' },
    brand: 'Sicli',
    equipment_qrc: 'QRC-2024-8894',
    internal_id: 'EXT-SFX-004',
    serial_number: 'SCL-2019-CO2-000782',
    mfg_date: '2019-05-14',
    installation_date: '2019-08-01',
    date_next_inspection: '2025-08-01',     // ⚠️ past due
    date_next_hydro_test: '2029-05-14',     // ⚠️ past due
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7',
    equipment_current_status: 'out_of_service',
    notes: 'Corrosion sévère au niveau de la base — à remplacer. Retiré de son emplacement le 15/03/2025.',
    deleted_at: null,
    created_at: '2019-08-01T08:00:00Z',
    updated_at: '2025-03-15T09:00:00Z',
    qr_code_logs: [],
  },
  // ─── 5. Robinet d'Incendie Armé (RIA) DN 25/30 — Compliant ───
  {
    id: 5,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'RIA', en: 'Fire Hose Reels' },
    category_name_slug: 'ria',
    subcategory_name: { fr: 'RIA DN 25/30', en: 'Fire Hose Reel DN 25/30' },
    subcategory_name_slug: 'ria-dn-25-30',
    equipment_model_name: { fr: 'Robinet d\'Incendie Armé (RIA) DN 25/30', en: 'Fire Hose Reel DN 25/30' },
    equipment_model_name_slug: 'ria-dn-25-30',
    pressure_name: { fr: '6 bar', en: '6 bar' },
    capacity_value: 30.00,
    capacity_unit: { fr: 'Mètre', en: 'Meter' },
    capacity_abbreviation: { fr: 'm', en: 'm' },
    brand: 'Eurofeu',
    equipment_qrc: 'QRC-2024-8895',
    internal_id: 'RIA-SFX-001',
    serial_number: 'EUF-2022-RIA-002341',
    mfg_date: '2022-06-10',
    installation_date: '2022-09-15',
    date_next_inspection: '2026-09-15',
    date_next_hydro_test: '2027-06-10',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 671-1, CE',
    equipment_current_status: 'compliant',
    notes: 'Tuyau semi-rigide 30 m — débit mesuré 55 L/min — conforme.',
    deleted_at: null,
    created_at: '2022-09-15T08:00:00Z',
    updated_at: '2025-09-18T14:00:00Z',
    qr_code_logs: [],
  },
  // ─── 6. RIA DN 33 — Needs Inspection ───
  {
    id: 6,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'RIA', en: 'Fire Hose Reels' },
    category_name_slug: 'ria',
    subcategory_name: { fr: 'RIA DN 33', en: 'Fire Hose Reel DN 33' },
    subcategory_name_slug: 'ria-dn-33',
    equipment_model_name: { fr: 'Robinet d\'Incendie Armé (RIA) DN 33', en: 'Fire Hose Reel DN 33' },
    equipment_model_name_slug: 'ria-dn-33',
    pressure_name: { fr: '8 bar', en: '8 bar' },
    capacity_value: 20.00,
    capacity_unit: { fr: 'Mètre', en: 'Meter' },
    capacity_abbreviation: { fr: 'm', en: 'm' },
    brand: 'Desautel',
    equipment_qrc: 'QRC-2024-8896',
    internal_id: 'RIA-SFX-002',
    serial_number: 'DST-2021-RIA-001876',
    mfg_date: '2021-11-20',
    installation_date: '2022-02-10',
    date_next_inspection: '2026-02-10',    // ⚠️ past — triggers warning
    date_next_hydro_test: '2026-11-20',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 671-1',
    equipment_current_status: 'needs_inspection',
    notes: 'Fuite légère au raccord signalée lors du dernier contrôle — inspection approfondie requise.',
    deleted_at: null,
    created_at: '2022-02-10T08:00:00Z',
    updated_at: '2025-10-05T11:00:00Z',
    qr_code_logs: [],
  },
  // ─── 7. Extincteur Eau Pulvérisée 9L — Compliant ───
  {
    id: 7,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'Eau pulvérisée', en: 'Water spray' },
    subcategory_name_slug: 'eau-pulverisee',
    equipment_model_name: { fr: 'Extincteur Eau Pulvérisée 9L avec additif', en: 'Water Spray Extinguisher 9L with additive' },
    equipment_model_name_slug: 'extincteur-eau-pulverisee-9l',
    pressure_name: { fr: 'Pression permanente', en: 'Stored pressure' },
    capacity_value: 9.00,
    capacity_unit: { fr: 'Litre', en: 'Liter' },
    capacity_abbreviation: { fr: 'L', en: 'L' },
    brand: 'Andrieu',
    equipment_qrc: 'QRC-2024-8897',
    internal_id: 'EXT-SFX-005',
    serial_number: 'AND-2024-EAU-000312',
    mfg_date: '2024-01-08',
    installation_date: '2024-03-20',
    date_next_inspection: '2027-03-20',
    date_next_hydro_test: '2034-01-08',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7, CE, Bio-vérifié',
    equipment_current_status: 'compliant',
    notes: null,
    deleted_at: null,
    created_at: '2024-03-20T08:00:00Z',
    updated_at: '2025-03-22T10:00:00Z',
    qr_code_logs: [],
  },
  // ─── 8. Extincteur Poudre ABC 9kg — Non-Compliant ───
  {
    id: 8,
    client_id: 1,
    client_name: 'PROTEX INDUSTRIES SARL',
    category_name: { fr: 'Extincteurs', en: 'Fire Extinguishers' },
    category_name_slug: 'extincteurs',
    subcategory_name: { fr: 'Poudre ABC', en: 'ABC Powder' },
    subcategory_name_slug: 'poudre-abc',
    equipment_model_name: { fr: 'Extincteur Poudre ABC 9kg', en: 'ABC Powder Extinguisher 9kg' },
    equipment_model_name_slug: 'extincteur-poudre-abc-9kg',
    pressure_name: { fr: 'Pression permanente', en: 'Stored pressure' },
    capacity_value: 9.00,
    capacity_unit: { fr: 'Kilogramme', en: 'Kilogram' },
    capacity_abbreviation: { fr: 'kg', en: 'kg' },
    brand: 'Desautel',
    equipment_qrc: 'QRC-2024-8898',
    internal_id: 'EXT-SFX-006',
    serial_number: 'DST-2020-APC-002015',
    mfg_date: '2020-07-22',
    installation_date: '2020-10-15',
    date_next_inspection: '2025-10-15',     // ⚠️ past due
    date_next_hydro_test: '2030-07-22',
    date_next_second_hydro_test: null,
    certifications: 'NF EN 3-7',
    equipment_current_status: 'non_compliant',
    notes: 'Manomètre défectueux — pression non vérifiable. Recharge + remplacement manomètre requis.',
    deleted_at: null,
    created_at: '2020-10-15T08:00:00Z',
    updated_at: '2025-10-20T09:00:00Z',
    qr_code_logs: [],
  },
];

// ── Equipment ↔ Zone Pivot ──────────────────────────────────────────────────

const equipmentZones: EquipmentZone[] = [
  // Zone de Stockage (id: 1)
  { id: 1, equipment_id: 1, zone_id: 1, floor: 'RDC', direction_notes: 'Entrée principale du hangar, à droite du portail',         created_at: '2023-06-20T08:00:00Z', updated_at: '2023-06-20T08:00:00Z' },
  { id: 2, equipment_id: 4, zone_id: 1, floor: 'RDC', direction_notes: 'Allée centrale, section B — retiré de son emplacement',     created_at: '2019-08-01T08:00:00Z', updated_at: '2025-03-15T09:00:00Z' },
  { id: 3, equipment_id: 7, zone_id: 1, floor: 'RDC', direction_notes: 'Face au quai de chargement, mur nord',                      created_at: '2024-03-20T08:00:00Z', updated_at: '2024-03-20T08:00:00Z' },

  // Bureaux Administratifs (id: 2)
  { id: 4, equipment_id: 2, zone_id: 2, floor: 'RDC', direction_notes: 'Couloir accueil, face à la réception',                      created_at: '2022-12-05T08:00:00Z', updated_at: '2022-12-05T08:00:00Z' },
  { id: 5, equipment_id: 3, zone_id: 2, floor: 'Étage 1', direction_notes: 'Salle serveurs informatique, à côté du TGBT',           created_at: '2023-04-10T08:00:00Z', updated_at: '2023-04-10T08:00:00Z' },
  { id: 6, equipment_id: 5, zone_id: 2, floor: 'RDC', direction_notes: 'Cage d\'escalier principale, palier RDC',                   created_at: '2022-09-15T08:00:00Z', updated_at: '2022-09-15T08:00:00Z' },

  // Atelier de Production (id: 3)
  { id: 7, equipment_id: 6, zone_id: 3, floor: 'RDC', direction_notes: 'Ligne de soudure, pilier P4 — accès restreint',             created_at: '2022-02-10T08:00:00Z', updated_at: '2022-02-10T08:00:00Z' },
  { id: 8, equipment_id: 8, zone_id: 3, floor: 'RDC', direction_notes: 'Zone assemblage, face au tableau électrique secondaire',     created_at: '2020-10-15T08:00:00Z', updated_at: '2020-10-15T08:00:00Z' },
];

// ── QR Code Logs ────────────────────────────────────────────────────────────

const qrCodeLogs: QrCodeLog[] = [
  // Equipment 1 — initial assignment
  { id: 1,  equipment_id: 1, old_qr_code: null,              new_qr_code: 'QRC-2024-8891', action: 'created',   user_id: 1, created_at: '2024-01-15T09:00:00Z', updated_at: '2024-01-15T09:00:00Z', user_name: 'Yassine Amri' },

  // Equipment 2 — created then replaced
  { id: 2,  equipment_id: 2, old_qr_code: null,              new_qr_code: 'QRC-2023-6701', action: 'created',   user_id: 1, created_at: '2023-01-10T08:30:00Z', updated_at: '2023-01-10T08:30:00Z', user_name: 'Yassine Amri' },
  { id: 3,  equipment_id: 2, old_qr_code: 'QRC-2023-6701',   new_qr_code: 'QRC-2024-8892', action: 'replaced',  user_id: 2, created_at: '2024-02-20T11:00:00Z', updated_at: '2024-02-20T11:00:00Z', user_name: 'Riadh Chaabane' },

  // Equipment 3
  { id: 4,  equipment_id: 3, old_qr_code: null,              new_qr_code: 'QRC-2024-8893', action: 'created',   user_id: 1, created_at: '2024-01-15T09:15:00Z', updated_at: '2024-01-15T09:15:00Z', user_name: 'Yassine Amri' },

  // Equipment 4 — created, updated, then deactivated
  { id: 5,  equipment_id: 4, old_qr_code: null,              new_qr_code: 'QRC-2022-4455', action: 'created',   user_id: 1, created_at: '2022-03-10T08:00:00Z', updated_at: '2022-03-10T08:00:00Z', user_name: 'Yassine Amri' },
  { id: 6,  equipment_id: 4, old_qr_code: 'QRC-2022-4455',   new_qr_code: 'QRC-2024-8894', action: 'replaced',  user_id: 2, created_at: '2024-02-20T11:30:00Z', updated_at: '2024-02-20T11:30:00Z', user_name: 'Riadh Chaabane' },
  { id: 7,  equipment_id: 4, old_qr_code: 'QRC-2024-8894',   new_qr_code: 'QRC-2024-8894', action: 'deactivated', user_id: 2, created_at: '2025-03-15T09:00:00Z', updated_at: '2025-03-15T09:00:00Z', user_name: 'Riadh Chaabane' },

  // Equipment 5
  { id: 8,  equipment_id: 5, old_qr_code: null,              new_qr_code: 'QRC-2024-8895', action: 'created',   user_id: 1, created_at: '2024-01-15T09:30:00Z', updated_at: '2024-01-15T09:30:00Z', user_name: 'Yassine Amri' },

  // Equipment 6
  { id: 9,  equipment_id: 6, old_qr_code: null,              new_qr_code: 'QRC-2024-8896', action: 'created',   user_id: 1, created_at: '2024-01-16T08:00:00Z', updated_at: '2024-01-16T08:00:00Z', user_name: 'Yassine Amri' },

  // Equipment 7
  { id: 10, equipment_id: 7, old_qr_code: null,              new_qr_code: 'QRC-2024-8897', action: 'created',   user_id: 1, created_at: '2024-03-20T10:00:00Z', updated_at: '2024-03-20T10:00:00Z', user_name: 'Yassine Amri' },

  // Equipment 8 — created then updated
  { id: 11, equipment_id: 8, old_qr_code: null,              new_qr_code: 'QRC-2023-5510', action: 'created',   user_id: 1, created_at: '2023-02-01T08:00:00Z', updated_at: '2023-02-01T08:00:00Z', user_name: 'Yassine Amri' },
  { id: 12, equipment_id: 8, old_qr_code: 'QRC-2023-5510',   new_qr_code: 'QRC-2024-8898', action: 'replaced',  user_id: 2, created_at: '2024-02-20T12:00:00Z', updated_at: '2024-02-20T12:00:00Z', user_name: 'Riadh Chaabane' },
];

// ── Export ───────────────────────────────────────────────────────────────────

export const mockAssetsData: AssetsData = {
  fleets,
  allEquipment: equipment,
  allZones: zones,
  allEquipmentZones: equipmentZones,
  allQrCodeLogs: qrCodeLogs,
};
