import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AssignmentConsent, Invoice } from '@/types';
import { toast } from 'sonner';

export default function AssignmentRegistryPage() {
  const { invoices, consents, requestConsent } = useData();
  const actor = useActor();

  const acceptedInvoices = invoices.filter(inv => inv.status === 'offer_accepted');

  const handleRequestConsent = (inv: Invoice) => {
    requestConsent({
      invoiceId: inv.id,
      iouRegistryId: inv.iouRegistryId,
      buyerId: inv.buyerId,
      buyerName: inv.buyerName,
      supplierId: inv.supplierId,
      supplierName: inv.supplierName,
      spvId: 'org-spv-1',
      amount: inv.amount,
    }, actor);
    toast.success(`Consent request sent to ${inv.buyerName}`);
  };

  const pendingColumns = [
    { key: 'iou', header: 'IOU ID', render: (inv: Invoice) => <span className="font-mono text-xs">{inv.iouRegistryId}</span> },
    { key: 'supplier', header: 'Supplier', render: (inv: Invoice) => inv.supplierName },
    { key: 'buyer', header: 'Buyer', render: (inv: Invoice) => inv.buyerName },
    { key: 'amount', header: 'Amount', render: (inv: Invoice) => <span className="font-mono">{formatCurrency(inv.amount)}</span> },
    { key: 'action', header: '', render: (inv: Invoice) => (
      <button
        onClick={(e) => { e.stopPropagation(); handleRequestConsent(inv); }}
        className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Request Consent
      </button>
    )},
  ];

  const consentColumns = [
    { key: 'iou', header: 'IOU ID', render: (c: AssignmentConsent) => <span className="font-mono text-xs">{c.iouRegistryId}</span> },
    { key: 'buyer', header: 'Buyer', render: (c: AssignmentConsent) => c.buyerName },
    { key: 'supplier', header: 'Supplier', render: (c: AssignmentConsent) => c.supplierName },
    { key: 'amount', header: 'Amount', render: (c: AssignmentConsent) => <span className="font-mono">{formatCurrency(c.amount)}</span> },
    { key: 'requested', header: 'Requested', render: (c: AssignmentConsent) => formatDate(c.requestedAt) },
    { key: 'status', header: 'Status', render: (c: AssignmentConsent) => <StatusBadge status={c.status} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Assignment Registry" subtitle="Manage receivable assignments and buyer consent" />

      {/* Invoices ready for assignment */}
      {acceptedInvoices.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-3">Ready for Assignment ({acceptedInvoices.length})</h3>
          <DataTable columns={pendingColumns} data={acceptedInvoices} emptyMessage="" />
        </div>
      )}

      {/* All consents */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Consent Registry ({consents.length})</h3>
        <DataTable columns={consentColumns} data={consents} emptyMessage="No consent requests yet" />
      </div>
    </div>
  );
}
