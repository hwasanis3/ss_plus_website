// ═══════════════════════════════════════════════════════════════════════════
// Types for Missions & Services Portal Module
// Mirrors the Laravel migration schema from /mission folder migration/
// ═══════════════════════════════════════════════════════════════════════════

// ── Enums ───────────────────────────────────────────────────────────────────

export type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'closure';
export type InterventionStatus = 'pending' | 'in_progress' | 'completed';
export type WorkshopStatus = 'pending' | 'in_progress' | 'completed';
export type ComplianceStatus = 'compliant' | 'non-compliant';
export type MissionEventCalendar = 'prevision' | 'pending' | 'completed';
export type EquipmentInterventionStatus = 'conforme' | 'non_conforme' | 'hors_service' | 'en_atelier' | 'remplacé';
export type EvaluationGrade = 'A' | 'B' | 'C' | 'D';

// ── Technician ──────────────────────────────────────────────────────────────

export interface Technician {
  id: number;
  technician_id: string;
  technician_name: string;
  technician_status: string;
  role: string; // 'chef_equipe' | 'technicien' | 'chauffeur'
  avatar_initials: string;
}

// ── Equipment Intervention (pivot table) ────────────────────────────────────

export interface EquipmentIntervention {
  id: number;
  equipment_id: number;
  intervention_id: number;
  equipment_qrc: string;
  equipment_type: string;
  equipment_model: string;
  inspection: string | null;
  raw_recharge: string | null;
  nitrogen_recharge: string | null;
  equipment_protection_id: string | null;
  equipment_protection_name: string | null;
  maintenance: string | null;
  additional_maintenance: string | null;
  supply: string | null;
  accessory: string | null;
  equipment_status: EquipmentInterventionStatus;
  // Action summary label for display
  action_summary: string;
}

// ── Equipment Workshop (pivot table) ────────────────────────────────────────

export interface EquipmentWorkshop {
  id: number;
  equipment_id: number;
  workshop_id: number;
  equipment_qrc: string;
  equipment_type: string;
  equipment_model: string;
  inspection: string | null;
  raw_recharge: string | null;
  nitrogen_recharge: string | null;
  maintenance: string | null;
  additional_maintenance: string | null;
  supply: string | null;
  standard_sign: string | null;
  numbering: string | null;
  pictogram: string | null;
  equipment_fixation: string | null;
  accessories: string | null;
  equipment_status: EquipmentInterventionStatus;
  action_summary: string;
  estimated_completion: string | null;
}

// ── Checklist ───────────────────────────────────────────────────────────────

export interface InterventionChecklist {
  id: number;
  intervention_id: number;
  mission_documents: boolean;
  team_documents: boolean;
  ppe: boolean;
  emergency_kit: boolean;
  vehicle_maintenance: boolean;
  materials_and_parts: boolean;
  tools_and_equipment: boolean;
}

// ── Intervention ────────────────────────────────────────────────────────────

export interface Intervention {
  id: number;
  mission_folder_id: number;
  intervention_id: string;
  intervention_date: string;
  mission_frequency: string | null;
  intervention_duration: string;
  intervention_status: InterventionStatus;
  // Team
  team_leader: string;
  team_driver: string | null;
  team_members: string;
  team_total: string;
  // Vehicle / logistics
  vehicle_model: string | null;
  target_in_km: string | null;
  // Client data
  client_name: string;
  park_title: string;
  park_city: string;
  // Equipment counts
  total_equipment: string;
  total_fire_extinguisher: string;
  total_fire_hose: string;
  total_others_equipment: string;
  // Client feedback
  client_feedback_quality_service: string | null;
  client_feedback_arrive_time: string | null;
  client_feedback_professionalism: string | null;
  client_feedback_specific_needs: string | null;
  client_feedback_recommend_our_services: string | null;
  client_feedback: string | null;
  // Nested
  equipment_intervened: EquipmentIntervention[];
  checklist: InterventionChecklist | null;
}

// ── Workshop ────────────────────────────────────────────────────────────────

export interface Workshop {
  id: number;
  mission_folder_id: number;
  workshop_id: string;
  workshop_date: string;
  mission_frequency: string | null;
  workshop_duration: string;
  workshop_status: WorkshopStatus;
  workshop_leader: string;
  team_members: string | null;
  workshop_notes: string | null;
  // Client data
  client_name: string;
  total_equipment: string;
  total_fire_extinguisher: string;
  total_fire_hose: string;
  // Nested
  equipment_workshop: EquipmentWorkshop[];
}

// ── Standard ────────────────────────────────────────────────────────────────

export interface Standard {
  id: number;
  standard_id: string;
  name: string;
  description: string | null;
  version: string | null;
}

// ── Recommendation ──────────────────────────────────────────────────────────

export interface Recommendation {
  id: number;
  name: string;
  priority: 'haute' | 'moyenne' | 'basse';
  recommendation_status: string;
}

// ── Compliance ──────────────────────────────────────────────────────────────

export interface Compliance {
  id: number;
  compliance_desc: string;
  applicable_standard: string;
  compliance_status: ComplianceStatus;
  action: string;
}

// ── Risk Assessment ─────────────────────────────────────────────────────────

export interface RiskAssessment {
  id: number;
  mission_folder_id: number;
  hazard: string;
  description: string | null;
  likelihood: string;
  severity: string;
  risk_level: string;
  mitigation_strategy: string | null;
}

// ── Suggestion ──────────────────────────────────────────────────────────────

export interface Suggestion {
  id: number;
  name: string;
}

// ── Out of Service Equipment ────────────────────────────────────────────────

export interface OutOfServiceEq {
  id: number;
  mission_folder_id: number;
  equipment: string;
  the_reason: string | null;
}

// ── Mission Service ─────────────────────────────────────────────────────────

export interface MissionService {
  id: number;
  service_id: string;
  name: string;
  description: string | null;
}

// ── Mission Report (Audit) ──────────────────────────────────────────────────

export interface MissionReport {
  overall_evaluation: EvaluationGrade;
  evaluation_score: number; // 0-100
  standards_used: Standard[];
  safety_details: string;
  technical_details: string;
  points_to_improve: string[];
  recommendations: Recommendation[];
  compliances: Compliance[];
  risk_assessments: RiskAssessment[];
  general_remarks: string;
}

// ── Documents ───────────────────────────────────────────────────────────────

export interface MissionDocuments {
  intervention_report: {
    name: string;
    status: 'available' | 'pending' | 'generating';
    url: string;
  };
  official_certification: {
    name: string;
    status: 'available' | 'pending' | 'generating';
    url: string;
  };
}

// ── Planning Event ──────────────────────────────────────────────────────────

export interface PlanningEvent {
  id: number;
  title: string;
  mission_id: string;
  mission_frequency: string | null;
  start: string;
  end: string;
  all_day: boolean;
  client: string;
  city: string;
  mission_type: string;
  calendar: MissionEventCalendar;
}

// ── Workshop Tracking Item (for Tab 2) ──────────────────────────────────────

export interface WorkshopTrackingItem {
  id: number;
  workshop_id: string;
  mission_id: string;
  equipment_qrc: string;
  equipment_type: string;
  equipment_model: string;
  entry_date: string;
  estimated_completion: string | null;
  workshop_status: WorkshopStatus;
  workshop_leader: string;
  actions: string[];
  notes: string | null;
}

// ── Mission Folder (root entity) ────────────────────────────────────────────

export interface MissionFolder {
  id: number;
  client_id: number;
  mission_id: string;
  mission_type: string;
  mission_date: string;
  mission_duration: string;
  mission_frequency: string | null;
  mission_status: MissionStatus;
  work_time_on_site: string;
  // Resources — human
  team_leader: string;
  team_driver: string | null;
  team_members: string;
  team_total: string;
  team: Technician[];
  // Resources — material / transport
  vehicle_model: string;
  target_in_km: string;
  // Client data
  client_name: string;
  client_email: string | null;
  address: string | null;
  city: string | null;
  // Park data
  park_id: string | null;
  park_title: string;
  park_city: string;
  park_address: string | null;
  // Equipment counts
  total_equipment: string;
  total_fire_extinguisher: string;
  total_fire_hose: string;
  total_others_equipment: string;
  // Evaluation fields (added via migration)
  operational_readiness: string | null;
  operational_readiness_desc: string | null;
  maintenance_quality: string | null;
  maintenance_quality_desc: string | null;
  safety_compliance: string | null;
  safety_compliance_desc: string | null;
  compliance_rate: string;
  park_status: string | null;
  park_status_desc: string | null;
  intervention_status: string | null;
  intervention_status_desc: string | null;
  // Mission notes
  mission_notes: string | null;
  // Nested objects
  interventions: Intervention[];
  workshops: Workshop[];
  report: MissionReport;
  documents: MissionDocuments;
  services: MissionService[];
  suggestions: Suggestion[];
  out_of_service_eqs: OutOfServiceEq[];
}

// ── Portal Data Root ────────────────────────────────────────────────────────

export interface MissionsPortalData {
  missions: MissionFolder[];
  workshopTracking: WorkshopTrackingItem[];
  planningEvents: PlanningEvent[];
}
