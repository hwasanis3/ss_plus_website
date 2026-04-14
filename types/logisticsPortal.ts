export type ShipmentStatus = 'pending' | 'in_transit' | 'delivered';

export interface TrackingStep {
  name: string;
  status: 'done' | 'active' | 'todo';
  date: string;
  note: string;
}

export interface Shipment {
  id: number;
  delivery_id: string;
  linked_order_id: string;
  destination_site: string;
  estimated_delivery: string;
  driver_name: string;
  status: ShipmentStatus;
  tracking_steps: TrackingStep[];
}

export interface LogisticsData {
  shipments: Shipment[];
}
