export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface PaymentInvoice {
  id: number;
  invoice_id: string;
  linked_order_id: string;
  amount: number;
  issue_date: string;
  due_date: string;
  status: PaymentStatus;
}

export interface PaymentsData {
  invoices: PaymentInvoice[];
}
