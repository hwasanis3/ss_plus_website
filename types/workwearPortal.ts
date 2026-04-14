// ──────────────────────────────────────────────────────────────────────────────
// TypeScript interfaces and Mock Data for the "Workwear" module.
// Domain: Industrial Safety — Custom Workwear & PPE Tracking for PROTEX INDUSTRIES.
// ──────────────────────────────────────────────────────────────────────────────

export type WorkwearStatus = 'active' | 'returned' | 'expired';

export interface AssignmentHistoryEvent {
  date: string;
  eventType: 'Assigned' | 'Returned' | 'Expired';
  description: string;
}

export interface AssignedItem {
  qr_code: string;
  model_id: string;
  size_assigned: string;
  assigned_date: string;
  status: WorkwearStatus;
  assignment_history: AssignmentHistoryEvent[];
}

export interface Employee {
  employee_id: string;
  name: string;
  role: string;
  department: string;
  standard_size: string;
  specifications?: Record<string, string>; // e.g. Shoe size, allergic to latex, etc.
  assignments: AssignedItem[];
}

export interface WorkwearModel {
  model_id: string;
  name: string;
  description: string;
  fabric_specs: string;
  customization: string;
  available_sizes: string[];
  stock_in_circulation: number;
  stock_in_warehouse: number;
}

export interface WorkwearOrder {
  order_id: string;
  order_date: string;
  expected_delivery: string;
  status: 'pending_approval' | 'in_production' | 'shipped' | 'delivered';
  summary_description: string;
}

export interface WorkwearData {
  models: WorkwearModel[];
  employees: Employee[];
  orders: WorkwearOrder[];
}

export const mockWorkwearData: WorkwearData = {
  models: [
    {
      model_id: 'WW-MOD-PTX-001',
      name: 'Combinaison Premium Antistatique',
      description: 'Combinaison de travail robuste, multipoches, bicolore (Marine/Orange).',
      fabric_specs: '65% Polyester, 35% Coton, 245 g/m² - Traitement antistatique',
      customization: 'Broderie logo cœur, Nom au dos en blanc',
      available_sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      stock_in_circulation: 45,
      stock_in_warehouse: 15,
    },
    {
      model_id: 'WW-MOD-PTX-002',
      name: 'Gilet Haute Visibilité Classe 2',
      description: 'Gilet sans manches orange fluo avec bandes rétro-réfléchissantes.',
      fabric_specs: '100% Polyester Mesh, respirant',
      customization: 'Logo PROTEX thermocollé dos et cœur',
      available_sizes: ['Unique'],
      stock_in_circulation: 60,
      stock_in_warehouse: 40,
    },
    {
      model_id: 'WW-MOD-PTX-003',
      name: 'Veste Hiver Haute Visibilité',
      description: 'Parka imperméable et doublée polaire pour interventions extérieures en hiver.',
      fabric_specs: 'Oxford 300D enduit PU, coutures étanchées, 100% Imperméable',
      customization: 'Broderie logo cœur',
      available_sizes: ['M', 'L', 'XL', 'XXL'],
      stock_in_circulation: 25,
      stock_in_warehouse: 5,
    }
  ],
  employees: [
    {
      employee_id: 'EMP-PTX-104',
      name: 'Mohamed Trabelsi',
      role: 'Chef d\'Équipe Maintenance',
      department: 'Maintenance Industrielle',
      standard_size: 'XL',
      specifications: {
        "Pointure": "44",
        "Remarques spéciales": "Besoin de manches extra-longues"
      },
      assignments: [
        {
          qr_code: 'WW-QR-2024-001',
          model_id: 'WW-MOD-PTX-001',
          size_assigned: 'XL',
          assigned_date: '2023-11-03',
          status: 'active',
          assignment_history: [
            { date: '2023-11-03', eventType: 'Assigned', description: 'Combinaison WW-MOD-PTX-001 assignée (Neuve)' }
          ]
        },
        {
          qr_code: 'WW-QR-2024-045',
          model_id: 'WW-MOD-PTX-003',
          size_assigned: 'XL',
          assigned_date: '2023-12-05',
          status: 'active',
          assignment_history: [
            { date: '2023-12-05', eventType: 'Assigned', description: 'Parka Hiver assignée' }
          ]
        }
      ]
    },
    {
      employee_id: 'EMP-PTX-112',
      name: 'Sarra Hamdi',
      role: 'Technicienne Qualité',
      department: 'Contrôle Qualité',
      standard_size: 'S',
      specifications: {
        "Pointure": "38"
      },
      assignments: [
        {
          qr_code: 'WW-QR-2024-005',
          model_id: 'WW-MOD-PTX-001',
          size_assigned: 'S',
          assigned_date: '2024-02-10',
          status: 'active',
          assignment_history: [
            { date: '2024-02-10', eventType: 'Assigned', description: 'Première dotation Combinaison' }
          ]
        },
        {
          qr_code: 'WW-QR-2024-110',
          model_id: 'WW-MOD-PTX-002',
          size_assigned: 'Unique',
          assigned_date: '2022-02-10',
          status: 'expired',
          assignment_history: [
            { date: '2022-02-10', eventType: 'Assigned', description: 'Gilet HV assigné' },
            { date: '2024-04-05', eventType: 'Expired', description: 'Date de fin de vie dépassée, à renouveler' }
          ]
        }
      ]
    },
    {
      employee_id: 'EMP-PTX-089',
      name: 'Tahar Rekik',
      role: 'Opérateur de Production',
      department: 'Production',
      standard_size: 'L',
      assignments: []
    },
    {
      employee_id: 'EMP-PTX-201',
      name: 'Amina Frikha',
      role: 'Responsable Logistique',
      department: 'Logistique',
      standard_size: 'M',
      assignments: [
        {
          qr_code: 'WW-QR-2024-220',
          model_id: 'WW-MOD-PTX-002',
          size_assigned: 'Unique',
          assigned_date: '2024-01-20',
          status: 'returned',
          assignment_history: [
            { date: '2024-01-20', eventType: 'Assigned', description: 'Dotation Gilet HV' },
            { date: '2024-06-15', eventType: 'Returned', description: 'Article restitué au dépôt' }
          ]
        }
      ]
    }
  ],
  orders: [
    {
      order_id: 'CMD-PTX-24-009',
      order_date: '2024-03-15',
      expected_delivery: '2024-04-20',
      status: 'in_production',
      summary_description: 'Renouvellement stock: 30x Combinaisons (WW-MOD-PTX-001) et 15x Gilets HV.'
    },
    {
      order_id: 'CMD-PTX-24-012',
      order_date: '2024-04-05',
      expected_delivery: '2024-05-10',
      status: 'pending_approval',
      summary_description: 'Dotation été: 50x Polos respirants brodés PROTEX.'
    }
  ]
};
