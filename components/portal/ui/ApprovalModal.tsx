import React, { useState } from "react";
import { Modal } from "./Modal";
import { toast } from "sonner";
import { Badge } from "./Badge";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockPendingDocs = [
  { id: "CTR-2025-003", title: "MSA Annuel 2025", type: "Contrat", badgeVariant: "yellow" as const, actionLabel: "Approuver" },
  { id: "QT-2024-156", title: "Devis équipements 2024", type: "Devis — 8 450 TND", badgeVariant: "blue" as const, actionLabel: "Accepter" },
];

export function ApprovalModal({ isOpen, onClose }: ApprovalModalProps) {
  const [docs, setDocs] = useState(mockPendingDocs);

  const handleApprove = (id: string, actionName: string) => {
    toast.success(`✅ Document ${id} approuvé`);
    removeDoc(id);
  };

  const handleRefuse = (id: string) => {
    toast.error(`Document ${id} refusé`);
    removeDoc(id);
  };

  const removeDoc = (id: string) => {
    const updatedDocs = docs.filter((d) => d.id !== id);
    setDocs(updatedDocs);
    if (updatedDocs.length === 0) {
      setTimeout(onClose, 800); // close automatically after a short delay if empty
    }
  };

  // Reset docs if modal reopens
  React.useEffect(() => {
    if (isOpen && docs.length === 0) {
      setDocs(mockPendingDocs);
    }
  }, [isOpen]);

  const footer = (
    <button 
      onClick={onClose} 
      className="px-4 py-2 rounded-lg font-semibold text-sm bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all active:scale-[0.98]"
    >
      Fermer
    </button>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Documents en attente d'approbation" footer={footer}>
      {docs.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
          Aucun document en attente.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map((doc) => (
            <div key={doc.id} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">
                  {doc.id}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                  {doc.title}
                </span>
                <Badge variant={doc.badgeVariant}>{doc.type}</Badge>
                
                <div className="ml-auto flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={() => handleApprove(doc.id, doc.actionLabel)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all active:scale-[0.98]"
                  >
                    {doc.actionLabel}
                  </button>
                  <button 
                    onClick={() => handleRefuse(doc.id)}
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all active:scale-[0.98]"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
