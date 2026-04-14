import type { LogisticsData } from '@/types/logisticsPortal';

export const mockLogisticsData: LogisticsData = {
  shipments: [
    {
      id: 1,
      delivery_id: 'BL-2024-112',
      linked_order_id: 'CMD-2024-102',
      destination_site: 'Usine Nord — Route de Tunis Km 7',
      estimated_delivery: '2024-11-18',
      driver_name: 'Ahmed Bousselmi',
      status: 'in_transit',
      tracking_steps: [
        {
          name: 'Préparation',
          status: 'done',
          date: '04/11/2024 10:30',
          note: 'Colisage et étiquetage terminés',
        },
        {
          name: 'Expédié',
          status: 'done',
          date: '08/11/2024 14:00',
          note: 'Prise en charge par le transporteur',
        },
        {
          name: 'En transit',
          status: 'active',
          date: 'Aujourd\'hui',
          note: 'En route vers Usine Nord',
        },
        {
          name: 'Livré',
          status: 'todo',
          date: 'Prévu 18/11/2024',
          note: 'En attente de réception',
        },
      ],
    },
    {
      id: 2,
      delivery_id: 'BL-2024-095',
      linked_order_id: 'CMD-2024-095',
      destination_site: 'Unité Recyclage — ZI Thyna, BP 245',
      estimated_delivery: '2024-10-20',
      driver_name: 'Sami Trabelsi',
      status: 'delivered',
      tracking_steps: [
        {
          name: 'Préparation',
          status: 'done',
          date: '15/10/2024 09:00',
          note: 'Matériel préparé',
        },
        {
          name: 'Expédié',
          status: 'done',
          date: '16/10/2024 10:30',
          note: 'Chargé dans le camion TR-402',
        },
        {
          name: 'En transit',
          status: 'done',
          date: '17/10/2024 08:15',
          note: 'Arrivée à Sfax',
        },
        {
          name: 'Livré',
          status: 'done',
          date: '18/10/2024 14:30',
          note: 'Confirmé par Mohamed Trabelsi',
        },
      ],
    },
    {
      id: 3,
      delivery_id: 'BL-2024-115',
      linked_order_id: 'CMD-2024-098',
      destination_site: 'Siège Social — ZI Sfax Sud',
      estimated_delivery: '2024-11-20',
      driver_name: 'Nizar Ben Ali',
      status: 'pending',
      tracking_steps: [
        {
          name: 'Préparation',
          status: 'active',
          date: 'Aujourd\'hui',
          note: 'Impression et reliure des documents de certification',
        },
        {
          name: 'Expédié',
          status: 'todo',
          date: '-',
          note: 'Non démarré',
        },
        {
          name: 'En transit',
          status: 'todo',
          date: '-',
          note: 'Non démarré',
        },
        {
          name: 'Livré',
          status: 'todo',
          date: '-',
          note: 'Non démarré',
        },
      ],
    },
  ]
};
