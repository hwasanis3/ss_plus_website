import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { mockLogisticsData } from "@/data/mockLogisticsData";
import { ShipmentStatus } from "@/types/logisticsPortal";
import { ProgressBar } from "../ui/ProgressBar";

function shipmentStatusBadge(status: ShipmentStatus): { variant: "green" | "blue" | "gray" | "orange"; label: string } {
  const map: Record<ShipmentStatus, { variant: "green" | "blue" | "gray" | "orange"; label: string }> = {
    pending: { variant: "gray", label: "En attente" },
    in_transit: { variant: "blue", label: "En cours" },
    delivered: { variant: "green", label: "Livré" }
  };
  return map[status];
}

export default function Logistique() {
  const { shipments } = mockLogisticsData;

  const inTransitCount = shipments.filter(s => s.status === 'in_transit' || s.status === 'pending').length;
  const deliveredThisMonth = shipments.filter(s => s.status === 'delivered').length; // Simplification for demo

  return (
    <div className="p-4 lg:p-8 animate-in space-y-6">
      <div>
        <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">🚚 Suivi des Livraisons</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Suivi en temps réel de vos expéditions de la préparation à la réception.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Expéditions en cours</p>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">{inTransitCount}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl">
            📦
          </div>
        </Card>
        
        <Card className="p-5 border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Livrées ce mois</p>
            <p className="text-3xl font-black text-emerald-500 dark:text-emerald-400">{deliveredThisMonth}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl">
            ✅
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => {
          const badge = shipmentStatusBadge(shipment.status);
          
          return (
            <Card key={shipment.id} className="p-5 lg:p-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-lg font-mono text-slate-900 dark:text-white">
                      {shipment.delivery_id}
                    </h3>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-medium">
                      Réf: {shipment.linked_order_id}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>📍 <span className="font-medium text-slate-700 dark:text-slate-300">Destination :</span> {shipment.destination_site}</p>
                    <p>📅 <span className="font-medium text-slate-700 dark:text-slate-300">Livraison estimée :</span> {shipment.estimated_delivery}</p>
                    <p>👤 <span className="font-medium text-slate-700 dark:text-slate-300">Livreur :</span> {shipment.driver_name}</p>
                  </div>
                </div>
                <button className="px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                  Télécharger le Bon de Livraison (BL)
                </button>
              </div>

              {/* Stepper Timeline */}
              <div className="mt-6">
                <div className="relative flex items-start justify-between max-w-4xl w-full">
                  {/* Background Track Line */}
                  <div className="absolute top-[13px] left-8 right-8 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                  
                  {shipment.tracking_steps.map((step, idx) => {
                    const isDone = step.status === "done";
                    const isActive = step.status === "active";
                    
                    // Connecting line color logic
                    const isNextStepDoneOrActive = shipment.tracking_steps[idx + 1]?.status === "done" || shipment.tracking_steps[idx + 1]?.status === "active";
                    const lineColor = isDone && isNextStepDoneOrActive ? "bg-emerald-500" : isDone ? "bg-blue-500" : "bg-transparent";

                    return (
                      <div key={idx} className="relative flex flex-col items-center flex-1 text-center">
                        {/* Connecting Line (Foreground) */}
                        {idx < shipment.tracking_steps.length - 1 && (
                          <div className={`absolute top-[13px] left-[50%] right-[-50%] h-1 ${lineColor} z-0 origin-left transition-colors`} />
                        )}
                        
                        {/* Dot */}
                        <div className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full border-4 ${
                          isDone 
                            ? "bg-emerald-500 border-emerald-100 dark:border-emerald-900/30" 
                            : isActive 
                              ? "bg-blue-600 border-blue-100 dark:border-blue-900/30 ring-4 ring-blue-500/20" 
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        }`}>
                          {isDone && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isActive && (
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          )}
                        </div>
                        
                        {/* Labe & Date */}
                        <div className="mt-3">
                          <p className={`text-xs font-bold uppercase tracking-wider ${
                            isDone ? "text-emerald-700 dark:text-emerald-400" : isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-500"
                          }`}>
                            {step.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{step.date}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-[120px] mx-auto">{step.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
