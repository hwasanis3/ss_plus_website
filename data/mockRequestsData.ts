import { PortalRequest } from "@/types/requestsPortal";

export const mockRequestsData: PortalRequest[] = [
  {
    id: "DEM-2024-089",
    title: "Intervention urgente extincteurs",
    type: "Intervention",
    priority: "critical",
    status: "open",
    date_submitted: "2024-11-01T09:12:00Z",
    site: "Siège Social",
    author: "Karim Mansour",
    history: [
      { date: "2024-11-01T09:12:00Z", action: "Demande créée par", actor: "Karim Mansour", type: "create" },
      { date: "2024-11-01T09:30:00Z", action: "Accusé de réception", actor: "SS Plus", type: "comment", details: "Votre demande a été prise en charge." },
      { date: "2024-11-01T11:00:00Z", action: "En cours de traitement", actor: "Ahmed B.", type: "status_change", details: "Technicien assigné : Ahmed B." }
    ]
  },
  {
    id: "DEM-2024-076",
    title: "Réunion bilan trimestriel",
    type: "Réunion",
    priority: "normal",
    status: "in_progress",
    date_submitted: "2024-10-15T14:00:00Z",
    site: "Siège Social",
    author: "Sonia Belhadj",
    history: [
      { date: "2024-10-15T14:00:00Z", action: "Demande créée", actor: "Sonia Belhadj", type: "create" },
      { date: "2024-10-16T10:00:00Z", action: "Planification en cours", actor: "Support SS Plus", type: "status_change" }
    ]
  },
  {
    id: "DEM-2024-061",
    title: "Réclamation qualité EPI (Gilets)",
    type: "Réclamation",
    priority: "urgent",
    status: "resolved",
    date_submitted: "2024-10-02T16:20:00Z",
    site: "Usine Nord",
    author: "Riadh Chaabane",
    history: [
      { date: "2024-10-02T16:20:00Z", action: "Demande créée", actor: "Riadh Chaabane", type: "create" },
      { date: "2024-10-03T09:00:00Z", action: "Analyse en cours", actor: "Service Qualité", type: "status_change" },
      { date: "2024-10-05T11:30:00Z", action: "Remplacement approuvé", actor: "Service Commercial", type: "status_change", details: "Gilets de remplacement expédiés via SO-2024-068" },
      { date: "2024-10-08T15:00:00Z", action: "Clôturé", actor: "Riadh Chaabane", type: "comment", details: "Réception confirmée, problème résolu." }
    ]
  },
  {
    id: "DEM-2024-055",
    title: "Devis pour installation RIA additionnelle",
    type: "Devis",
    priority: "normal",
    status: "resolved",
    date_submitted: "2024-09-20T10:45:00Z",
    site: "Entrepôt Logistique",
    author: "Karim Mansour",
    history: [
      { date: "2024-09-20T10:45:00Z", action: "Demande créée", actor: "Karim Mansour", type: "create" },
      { date: "2024-09-22T14:00:00Z", action: "Devis transmis", actor: "Commercial SS Plus", type: "status_change", details: "Voir devis QT-2024-121" },
      { date: "2024-09-25T09:00:00Z", action: "Clôturé", actor: "Système", type: "status_change" }
    ]
  }
];
