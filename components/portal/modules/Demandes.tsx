"use client";

import React, { useState, Fragment } from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { NewRequestModal } from "../ui/NewRequestModal";
import { mockRequestsData } from "@/data/mockRequestsData";
import { PortalRequest } from "@/types/requestsPortal";

function getPriorityBadge(priority: PortalRequest["priority"]) {
  switch (priority) {
    case "critical":
      return { variant: "red" as const, label: "🔴 Critique" };
    case "urgent":
      return { variant: "orange" as const, label: "⚠️ Urgente" };
    case "normal":
      return { variant: "yellow" as const, label: "🟡 Normale" };
    default:
      return { variant: "gray" as const, label: priority };
  }
}

function getStatusBadge(status: PortalRequest["status"]) {
  switch (status) {
    case "open":
      return { variant: "orange" as const, label: "En attente" };
    case "in_progress":
      return { variant: "blue" as const, label: "En cours" };
    case "resolved":
      return { variant: "green" as const, label: "Résolu ✅" };
    case "cancelled":
      return { variant: "gray" as const, label: "Annulé" };
    default:
      return { variant: "gray" as const, label: status };
  }
}

export default function Demandes() {
  const [isNewReqOpen, setIsNewReqOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            📝 Mes Demandes & Tickets
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos demandes d'intervention, réunions, et réclamations.
          </p>
        </div>
        <button
          onClick={() => setIsNewReqOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all active:scale-[0.98] shrink-0"
        >
          + Nouvelle demande
        </button>
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/40">
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Référence</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Objet / Type</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Priorité</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Statut</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-slate-500 font-semibold">Date</th>
                <th className="px-4 py-3 text-center text-xs uppercase text-slate-500 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockRequestsData.map((req) => {
                const priorityBadge = getPriorityBadge(req.priority);
                const statusBadge = getStatusBadge(req.status);
                const isExpanded = expandedId === req.id;
                
                return (
                  <Fragment key={req.id}>
                    <tr
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
                      onClick={() => toggleExpand(req.id)}
                    >
                      <td className="px-4 py-4 font-mono text-[13px] font-semibold text-blue-600 dark:text-blue-400">
                        {req.id}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 mb-0.5">{req.title}</div>
                        <div className="text-xs text-slate-500">[{req.type}] {req.site ? `— ${req.site}` : ""}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={priorityBadge.variant}>{priorityBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                      </td>
                      <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(req.date_submitted).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300/60 dark:group-hover:bg-slate-700 transition-colors">
                          {isExpanded ? "Fermer" : "Voir suivi"}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Detail Row */}
                    {isExpanded && (
                      <tr className="bg-slate-50/60 dark:bg-slate-900/40">
                        <td colSpan={6} className="px-4 py-5 border-t border-slate-100 dark:border-slate-800">
                          <div className="max-w-4xl space-y-4">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                              Historique de la demande
                            </h4>
                            <div className="space-y-3">
                              {req.history?.map((entry, idx) => (
                                <div key={idx} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                      entry.type === "create" ? "bg-green-500" :
                                      entry.type === "status_change" ? "bg-orange-500" :
                                      "bg-blue-500"
                                    }`} />
                                    {idx !== req.history!.length - 1 && (
                                      <div className="w-[1px] h-full bg-slate-200 dark:bg-slate-700 mt-1" />
                                    )}
                                  </div>
                                  <div className="pb-3 flex-1">
                                    <div className="flex flex-wrap items-baseline gap-x-2">
                                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                        {entry.action}
                                      </span>
                                      <span className="text-xs text-slate-500">par {entry.actor}</span>
                                      <span className="text-xs text-slate-500 ml-auto">
                                        {new Date(entry.date).toLocaleString("fr-FR", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit"
                                        })}
                                      </span>
                                    </div>
                                    {entry.details && (
                                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/50 p-2.5 rounded border border-slate-100 dark:border-slate-700">
                                        {entry.details}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <NewRequestModal isOpen={isNewReqOpen} onClose={() => setIsNewReqOpen(false)} />
    </div>
  );
}
