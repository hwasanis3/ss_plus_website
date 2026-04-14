import type { PaymentsData } from '@/types/paymentsPortal';

export const mockPaymentsData: PaymentsData = {
  invoices: [
    {
      id: 1,
      invoice_id: 'FAC-2024-089',
      linked_order_id: 'CMD-2024-098',
      amount: 4767.140,
      issue_date: '2024-11-01',
      due_date: '2024-12-01',
      status: 'overdue',
    },
    {
      id: 2,
      invoice_id: 'FAC-2024-105',
      linked_order_id: 'CMD-2024-102',
      amount: 5892.880,
      issue_date: '2024-11-15',
      due_date: '2024-12-15',
      status: 'pending',
    },
    {
      id: 3,
      invoice_id: 'FAC-2024-082',
      linked_order_id: 'CMD-2024-095',
      amount: 1552.950,
      issue_date: '2024-10-20',
      due_date: '2024-11-20',
      status: 'paid',
    },
    {
      id: 4,
      invoice_id: 'FAC-2024-067',
      linked_order_id: 'CMD-2024-078',
      amount: 9220.715,
      issue_date: '2024-07-10',
      due_date: '2024-08-10',
      status: 'paid',
    },
    {
      id: 5,
      invoice_id: 'FAC-2024-051',
      linked_order_id: 'CMD-2024-065',
      amount: 5652.500,
      issue_date: '2024-03-22',
      due_date: '2024-04-22',
      status: 'paid',
    },
  ]
};
