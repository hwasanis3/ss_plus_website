'use client';

import { useState } from 'react';
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { TabButton } from "../ui/TabButton";
import { ProgressBar } from "../ui/ProgressBar";
import { 
  Search, 
  Shirt, 
  Package, 
  Clock, 
  X, 
  ChevronRight, 
  Settings2,
  Activity,
  History,
  AlertCircle,
  FileText,
  ImageIcon,
  Scan
} from 'lucide-react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { mockWorkwearData, Employee, AssignedItem, WorkwearStatus, WorkwearModel } from '@/types/workwearPortal';

export default function Workwear() {
  const [activeTab, setActiveTab] = useState<'models' | 'attributions' | 'orders'>('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedModel, setSelectedModel] = useState<WorkwearModel | null>(null);

  // Filter employees
  const filteredEmployees = mockWorkwearData.employees.filter(emp => {
    const q = searchQuery.toLowerCase();
    const matchName = emp.name.toLowerCase().includes(q);
    const matchRole = emp.role.toLowerCase().includes(q);
    const matchQR = emp.assignments.some(item => item.qr_code.toLowerCase().includes(q));
    return matchName || matchRole || matchQR;
  });

  const getStatusBadge = (status: WorkwearStatus) => {
    switch (status) {
      case 'active': return <Badge variant="green">Actif</Badge>;
      case 'returned': return <Badge variant="slate">Restitué</Badge>;
      case 'expired': return <Badge variant="red">Expiré</Badge>;
      default: return <Badge variant="slate">{status}</Badge>;
    }
  };

  const getOverallStatus = (assignments: AssignedItem[]) => {
    if (assignments.length === 0) return <Badge variant="yellow">En Attente</Badge>;
    const hasExpired = assignments.some(a => a.status === 'expired');
    if (hasExpired) return <Badge variant="red">Alerte (Expiré)</Badge>;
    return <Badge variant="green">Complet</Badge>;
  };

  const stats = {
    totalStockCirculation: mockWorkwearData.models.reduce((acc, m) => acc + m.stock_in_circulation, 0),
    totalStockWarehouse: mockWorkwearData.models.reduce((acc, m) => acc + m.stock_in_warehouse, 0),
    totalEmployees: mockWorkwearData.employees.length,
    activeAssignments: mockWorkwearData.employees.reduce((acc, emp) => acc + emp.assignments.filter(a => a.status === 'active').length, 0)
  };

  return (
    <div className="p-4 lg:p-8 animate-in relative overflow-hidden flex flex-col h-full min-h-[85vh]">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Shirt className="h-8 w-8 text-indigo-500" />
            Gestion Workwear
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking des uniformes & EPI personnalisés par code QR.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-max">
          <TabButton 
            active={activeTab === 'models'} 
            onClick={() => setActiveTab('models')}
            icon={<Package size={16} />}
          >
            Modèles & Stock
          </TabButton>
          <TabButton 
            active={activeTab === 'attributions'} 
            onClick={() => setActiveTab('attributions')}
            icon={<Activity size={16} />}
          >
            Attributions & Équipe
          </TabButton>
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
            icon={<Clock size={16} />}
          >
            Commandes
          </TabButton>
        </div>
      </div>

      {activeTab === 'models' && (
        <div className="flex-1 flex flex-col space-y-6">
          {/* KPI Matrix Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-indigo-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Total Modèles</span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-200">{mockWorkwearData.models.length}</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-blue-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Stock en circulation</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalStockCirculation}</span>
              <span className="text-xs text-slate-500 ml-2">articles</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Stock au dépôt</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.totalStockWarehouse}</span>
              <span className="text-xs text-slate-500 ml-2">réserve (neuf)</span>
            </Card>
            <Card className="p-4 border-l-4 border-l-slate-300 dark:border-l-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-1">Taux d'utilisation</span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-200">
                {Math.round((stats.totalStockCirculation / (stats.totalStockCirculation + stats.totalStockWarehouse)) * 100)}%
              </span>
            </Card>
          </div>

          {/* Models Table */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur z-10">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Modèle</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Spécifications</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Tailles</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500 w-48">Stock global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950/50">
                  {mockWorkwearData.models.map((model) => {
                    const totalStock = model.stock_in_circulation + model.stock_in_warehouse;
                    const circulationPercent = (model.stock_in_circulation / totalStock) * 100;

                    return (
                      <tr 
                        key={model.model_id} 
                        onClick={() => setSelectedModel(model)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <Badge variant="blue" className="mb-1.5">{model.model_id}</Badge>
                          <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{model.name}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs truncate" title={model.fabric_specs}>Tissu: {model.fabric_specs}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">Perso: {model.customization}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {model.available_sizes.map(size => (
                              <span key={size} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono text-slate-700 dark:text-slate-300">
                                {size}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                            <span>{model.stock_in_circulation} Actif</span>
                            <span>{model.stock_in_warehouse} Neuf</span>
                          </div>
                          <ProgressBar value={circulationPercent} color="bg-indigo-600" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'attributions' && (
        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-96 text-slate-900 dark:text-slate-100">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Chercher agent, poste ou QR..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <button 
                onClick={() => setShowScanner(!showScanner)}
                className={`p-2 border rounded-lg transition-colors flex items-center justify-center shrink-0
                  ${showScanner 
                    ? "bg-indigo-600 border-indigo-600 text-white" 
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900"}
                `}
                title="Scanner QR Code"
              >
                <Scan size={18} />
              </button>
            </div>
            {/* Action buttons removed from client view since operations are internal */}
          </div>

          {showScanner && (
            <div className="p-4 bg-slate-50 border-b border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 flex justify-center rounded-xl animate-in fade-in zoom-in-95">
              <div className="relative w-full max-w-sm rounded-xl overflow-hidden bg-black aspect-video flex-shrink-0 shadow-inner">
                <Scanner 
                  onScan={(res) => {
                    if (res.length > 0) {
                      setSearchQuery(res[0].rawValue);
                      setShowScanner(false);
                    }
                  }}
                  components={{ finder: true, zoom: false }}
                />
                <button 
                  onClick={() => setShowScanner(false)} 
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none z-10">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                    Scanner un QR équipement
                  </span>
                </div>
              </div>
            </div>
          )}

          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1">
              <table className="w-full text-sm border-collapse min-w-[800px]">
                <thead className="sticky top-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur z-10">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Agent</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Poste</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Taille (Std)</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Articles Assignés</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Dernière Attribution</th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-slate-500">Statut Global</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950/50">
                  {filteredEmployees.map((emp) => {
                    const lastAssignedDate = emp.assignments.length > 0 
                      ? emp.assignments.reduce((latest, a) => a.assigned_date > latest ? a.assigned_date : latest, '1900-01-01')
                      : '-';

                    return (
                      <tr 
                        key={emp.employee_id} 
                        onClick={() => setSelectedEmployee(emp)}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors group"
                      >
                        <td className="px-5 py-4 font-medium text-slate-900 dark:text-slate-100">
                          {emp.name}
                          <span className="block text-xs text-slate-500 font-normal mt-0.5">{emp.employee_id}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {emp.role}
                          <span className="block text-xs text-slate-400 dark:text-slate-500">{emp.department}</span>
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-700 dark:text-slate-300">{emp.standard_size}</td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {emp.assignments.length > 0 ? (
                              emp.assignments.map(a => (
                                <Badge key={a.qr_code} variant="slate" className="font-mono text-[10px]">
                                  {a.qr_code}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-slate-400 italic text-xs">Aucun article</span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                          {lastAssignedDate !== '-' ? new Date(lastAssignedDate).toLocaleDateString('fr-FR') : '-'}
                        </td>
                        <td className="px-5 py-4 flex items-center justify-between">
                          {getOverallStatus(emp.assignments)}
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {mockWorkwearData.orders.map(order => (
            <Card key={order.order_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{order.order_id}</h3>
                  <Badge variant={order.status === 'delivered' ? 'green' : order.status === 'in_production' ? 'blue' : 'yellow'}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{order.summary_description}</p>
              </div>
              <div className="text-right flex flex-col gap-1">
                <span className="text-xs text-slate-500">Date de commande: {new Date(order.order_date).toLocaleDateString('fr-FR')}</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                  Livraison prévue: {new Date(order.expected_delivery).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Model Detail Drawer ─── */}
      {selectedModel && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedModel(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Package size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{selectedModel.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedModel.model_id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedModel(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Image & Description */}
              <div className="flex flex-col gap-4">
                <div className="w-full h-48 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center relative overflow-hidden group">
                  <ImageIcon size={40} className="text-slate-300 dark:text-slate-600 mb-2" />
                  <span className="absolute bottom-4 text-xs font-semibold text-slate-400">Photo Produit Non Disponible</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-indigo-500 pl-3">
                  {selectedModel.description}
                </p>
              </div>

              {/* Specs */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                  <Settings2 className="h-4 w-4 text-slate-400" />
                  Spécifications Techniques
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="grid grid-cols-3 p-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs uppercase font-bold text-slate-500">Tissus</span>
                    <span className="col-span-2 text-sm text-slate-800 dark:text-slate-200">{selectedModel.fabric_specs}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs uppercase font-bold text-slate-500">Personnalisation</span>
                    <span className="col-span-2 text-sm text-slate-800 dark:text-slate-200">{selectedModel.customization}</span>
                  </div>
                  <div className="grid grid-cols-3 p-3">
                    <span className="text-xs uppercase font-bold text-slate-500">Tailles dispo.</span>
                    <div className="col-span-2 flex flex-wrap gap-1">
                      {selectedModel.available_sizes.map(size => (
                        <span key={size} className="px-1.5 py-0.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono text-[10px] rounded shadow-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents & Patrons */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-slate-400" />
                  Documents Techniques & Patrons
                </h4>
                <div className="grid gap-3">
                  <div className="flex flex-row items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mr-3">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Fiche Technique_FR.pdf</p>
                      <p className="text-[10px] text-slate-500">PDF Document • 1.2 MB</p>
                    </div>
                    <span className="ml-auto text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Voir</span>
                  </div>
                  <div className="flex flex-row items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mr-3">
                      <ImageIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Patron_De_Design_V2.png</p>
                      <p className="text-[10px] text-slate-500">Image • 3.4 MB</p>
                    </div>
                    <span className="ml-auto text-xs font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">Voir</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 mt-auto">
              <button 
                onClick={() => setSelectedModel(null)}
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Employee Detail Drawer ─── */}
      {selectedEmployee && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/20 dark:bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setSelectedEmployee(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{selectedEmployee.name}</h3>
                  <p className="text-xs text-slate-500">{selectedEmployee.employee_id} • {selectedEmployee.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Profile Block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Département</span>
                  <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{selectedEmployee.department}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1">Taille Std.</span>
                  <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400">{selectedEmployee.standard_size}</span>
                </div>
              </div>

              {/* Extra Specifications */}
              {selectedEmployee.specifications && Object.keys(selectedEmployee.specifications).length > 0 && (
                <div className="border border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-950/20 rounded-lg p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">Spécifications Extra</h4>
                  <div className="grid grid-cols-2 gap-y-3">
                    {Object.entries(selectedEmployee.specifications).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-[10px] uppercase text-slate-500 block">{key}</span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Inventory Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Shirt className="h-4 w-4 text-slate-400" />
                    Inventaire Actuel
                  </h4>
                  <Badge variant="slate">{selectedEmployee.assignments.length} Articles</Badge>
                </div>
                
                {selectedEmployee.assignments.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-slate-500">QR / Modèle</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-500">Taille</th>
                          <th className="px-4 py-3 text-left font-medium text-slate-500">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {selectedEmployee.assignments.map(item => (
                          <tr key={item.qr_code}>
                            <td className="px-4 py-3">
                              <span className="font-mono font-medium block text-slate-900 dark:text-slate-100">{item.qr_code}</span>
                              <span className="text-xs text-slate-500">{item.model_id}</span>
                            </td>
                            <td className="px-4 py-3 font-mono">{item.size_assigned}</td>
                            <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Aucun équipement assigné actuellement.</p>
                  </div>
                )}
              </div>

              {/* History Timeline */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                  <History className="h-4 w-4 text-slate-400" />
                  Cycle de vie
                </h4>
                
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {selectedEmployee.assignments.flatMap(a => a.assignment_history).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).length > 0 ? (
                    selectedEmployee.assignments.flatMap(a => a.assignment_history).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((event, idx) => (
                      <div key={idx} className="relative flex items-center z-10">
                        <div className={`w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center shrink-0 shadow-sm
                          ${event.eventType === 'Assigned' ? 'bg-indigo-100 text-indigo-500 dark:bg-indigo-900/50' : 
                            event.eventType === 'Expired' ? 'bg-red-100 text-red-500 dark:bg-red-900/50' : 
                            'bg-slate-100 text-slate-500 dark:bg-slate-800'}
                        `}>
                          <Activity size={14} />
                        </div>
                        <div className="ml-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{event.eventType === 'Assigned' ? 'Dotation Initiale' : event.eventType === 'Returned' ? 'Restitution' : 'Expiration'}</span>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400">{event.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm text-center py-4">Aucun historique disponible.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer without action buttons since operations are internal */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 mt-auto">
              <button 
                onClick={() => setSelectedEmployee(null)}
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
