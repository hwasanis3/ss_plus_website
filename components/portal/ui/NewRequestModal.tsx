import React, { useState } from "react";
import { Modal } from "./Modal";
import { toast } from "sonner";
import { Badge } from "./Badge";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const reqTypes = [
  { id: "Intervention", emoji: "🔧", label: "Intervention", full: "Demande d'intervention" },
  { id: "Réunion", emoji: "📅", label: "Réunion", full: "Demande de réunion" },
  { id: "Réclamation", emoji: "⚠️", label: "Réclamation", full: "Réclamation" },
  { id: "Devis", emoji: "📋", label: "Devis", full: "Demande de devis" },
  { id: "Non-conformité", emoji: "🔴", label: "Non-conf.", full: "Non-conformité sécurité" },
  { id: "Autre", emoji: "💬", label: "Autre", full: "Autre demande" },
];

export function NewRequestModal({ isOpen, onClose }: NewRequestModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<{ id: string; full: string } | null>(null);

  // Form State
  const [objet, setObjet] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    // Reset state on close
    setStep(1);
    setSelectedType(null);
    setObjet("");
    setDescription("");
    onClose();
  };

  const submitRequest = () => {
    if (!objet.trim() || !description.trim()) {
      toast.error("Veuillez remplir les champs obligatoires (Objet et Description).");
      return;
    }
    toast.success("Demande envoyée avec succès !");
    handleClose();
  };

  const footer = (
    <>
      {step === 2 && (
        <button 
          onClick={() => setStep(1)} 
          className="px-4 py-2 rounded-lg font-semibold text-sm bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all active:scale-[0.98]"
        >
          Retour
        </button>
      )}
      <button 
        onClick={handleClose} 
        className="px-4 py-2 rounded-lg font-semibold text-sm bg-transparent border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition-all active:scale-[0.98]"
      >
        Annuler
      </button>
      {step === 2 && (
        <button 
          onClick={submitRequest} 
          className="px-4 py-2 rounded-lg font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all active:scale-[0.98]"
        >
          Envoyer la demande
        </button>
      )}
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nouvelle demande" footer={footer}>
      {step === 1 ? (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Sélectionnez le type de demande :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reqTypes.map((rt) => (
              <button
                key={rt.id}
                onClick={() => {
                  setSelectedType({ id: rt.id, full: rt.full });
                  setStep(2);
                }}
                className={`p-4 rounded-xl border transition-all text-center group active:scale-[0.98] ${
                  selectedType?.id === rt.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                }`}
              >
                <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">{rt.emoji}</div>
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{rt.label}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300 space-y-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="text-[13px] font-bold text-slate-700 dark:text-slate-300">Type sélectionné:</div>
            <Badge variant="blue">{selectedType?.full}</Badge>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-1.5">Objet *</label>
            <input 
              type="text" 
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
              placeholder="Objet de la demande" 
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-1.5">Description *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3} 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors resize-y" 
              placeholder="Décrivez votre demande en détail…" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-1.5">Priorité</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>Normale</option>
                <option>Urgente</option>
                <option>Critique</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-1.5">Site concerné</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                <option>Siège Social</option>
                <option>Usine Nord</option>
                <option>Entrepôt Logistique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-slate-900 dark:text-white mb-1.5">Pièce jointe</label>
            <input 
              type="file" 
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400 cursor-pointer" 
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
