import { Invoice } from '@/types';

export function exportInvoicesToCsv(invoices: Invoice[], filename = 'afix-invoices.csv') {
  const headers = ['IOU Registry ID', 'Invoice Number', 'Supplier', 'Buyer', 'Amount', 'Currency', 'Issue Date', 'Due Date', 'Status'];
  const rows = invoices.map(inv => [
    inv.iouRegistryId,
    inv.invoiceNumber,
    inv.supplierName,
    inv.buyerName,
    inv.amount,
    inv.currency,
    inv.issueDate,
    inv.dueDate,
    inv.status,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
