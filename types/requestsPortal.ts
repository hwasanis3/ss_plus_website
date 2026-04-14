export type RequestStatus = "open" | "in_progress" | "resolved" | "cancelled";
export type RequestPriority = "normal" | "urgent" | "critical";

export interface PortalRequest {
  id: string; // e.g., DEM-2024-089
  title: string;
  type: string; // e.g., "Intervention", "Réunion", "Réclamation", etc.
  priority: RequestPriority;
  status: RequestStatus;
  date_submitted: string; // ISO date format
  site?: string;
  author: string;
  history?: {
    date: string;
    action: string;
    actor: string;
    details?: string;
    type?: "create" | "comment" | "status_change";
  }[];
}
