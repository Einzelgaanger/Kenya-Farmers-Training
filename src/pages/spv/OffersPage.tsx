import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import IOURegistryId from '@/components/shared/IOURegistryId';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { Invoice, PurchaseOffer } from '@/types';
import { toast } from 'sonner';

export default function OffersPage() {
  const { invoices, offers, makeOffer } = useData();
  const actor = useActor();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [discountRate, setDiscountRate] = useState('5.0');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'available' | 'pending' | 'accepted' | 'receivables' | 'closed'>('available');

  const available = invoices.filter(inv => inv.status === 'verified');
  const pendingOffers = offers.filter(o => o.status === 'pending');
  const acceptedOffers = offers.filter(o => o.status === 'accepted');
  const receivableInvoices = invoices.filter(inv => ['disbursed', 'matured'].includes(inv.status));
  const closedOffers = offers.filter(o => ['rejected', 'expired', 'withdrawn'].includes(o.status));

  const handleMakeOffer = async () => {
    if (!selectedInvoice) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const rate = parseFloat(discountRate);
    const offerPrice = Math.round(selectedInvoice.amount * (1 - rate / 100));
    const tenor = Math.round((new Date(selectedInvoice.dueDate).getTime() - new Date(selectedInvoice.issueDate).getTime()) / 86400000);

    makeOffer({
      invoiceId: selectedInvoice.id,
      iouRegistryId: selectedInvoice.iouRegistryId,
      spvId: 'org-spv-1',
      spvName: 'AFIX Capital SPV',
      supplierId: selectedInvoice.supplierId,
      supplierName: selectedInvoice.supplierName,
      faceValue: selectedInvoice.amount,
      offerPrice,
      discountRate: rate,
      tenor,
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
    }, actor);

    setLoading(false);
    setSelectedInvoice(null);
    toast.success('Offer submitted successfully');
  };

  const availableColumns = [
    { key: 'iou', header: 'IOU ID', render: (inv: Invoice) => <IOURegistryId id={inv.iouRegistryId} /> },
    { key: 'supplier', header: 'Supplier', render: (inv: Invoice) => inv.supplierName },
    { key: 'amount', header: 'Face Value', render: (inv: Invoice) => <span className="font-mono">{formatCurrency(inv.amount)}</span> },
    { key: 'action', header: '', render: (inv: Invoice) => (
      <button
        onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}
        className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Make Offer
      </button>
    )},
  ];

  const offersColumns = [
    { key: 'iou', header: 'IOU ID', render: (o: PurchaseOffer) => <IOURegistryId id={o.iouRegistryId} /> },
    { key: 'supplier', header: 'Supplier', render: (o: PurchaseOffer) => o.supplierName },
    { key: 'face', header: 'Face Value', render: (o: PurchaseOffer) => <span className="font-mono">{formatCurrency(o.faceValue)}</span> },
    { key: 'offer', header: 'Offer Price', render: (o: PurchaseOffer) => <span className="font-mono">{formatCurrency(o.offerPrice)}</span> },
    { key: 'rate', header: 'Discount', render: (o: PurchaseOffer) => <span className="font-mono">{o.discountRate}%</span> },
    { key: 'status', header: 'Status', render: (o: PurchaseOffer) => <StatusBadge status={o.status} /> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Offers & Receivables" subtitle="Purchase offers and active receivable positions" />

      <div className="flex gap-1 border-b overflow-x-auto">
        {([
          { id: 'available' as const, label: 'Available', count: available.length },
          { id: 'pending' as const, label: 'Pending', count: pendingOffers.length },
          { id: 'accepted' as const, label: 'Accepted', count: acceptedOffers.length },
          { id: 'receivables' as const, label: 'Receivables', count: receivableInvoices.length },
          { id: 'closed' as const, label: 'Closed', count: closedOffers.length },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'available' && (
        <DataTable columns={availableColumns} data={available} emptyMessage="No verified IOUs available for offers" />
      )}

      {tab === 'pending' && (
        <DataTable columns={offersColumns} data={pendingOffers} emptyMessage="No pending offers" />
      )}

      {tab === 'accepted' && (
        <DataTable columns={offersColumns} data={acceptedOffers} emptyMessage="No accepted offers" />
      )}

      {tab === 'receivables' && (
        <DataTable
          columns={[
            { key: 'iou', header: 'IOU ID', render: (inv: Invoice) => <IOURegistryId id={inv.iouRegistryId} /> },
            { key: 'supplier', header: 'Supplier', render: (inv: Invoice) => inv.supplierName },
            { key: 'amount', header: 'Face Value', render: (inv: Invoice) => <span className="font-mono">{formatCurrency(inv.amount)}</span> },
            { key: 'status', header: 'Status', render: (inv: Invoice) => <StatusBadge status={inv.status} /> },
          ]}
          data={receivableInvoices}
          emptyMessage="No active receivables"
        />
      )}

      {tab === 'closed' && (
        <DataTable columns={offersColumns} data={closedOffers} emptyMessage="No closed offers" />
      )}

      {/* Offer modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedInvoice(null)} />
          <div className="relative bg-card rounded-lg shadow-lg border p-6 w-full max-w-md mx-4 animate-fade-in">
            <h2 className="text-lg font-semibold mb-4">Make Purchase Offer</h2>
            <div className="space-y-3 text-sm mb-5">
              <div><p className="text-muted-foreground text-xs">IOU Registry ID</p><p className="font-mono">{selectedInvoice.iouRegistryId}</p></div>
              <div><p className="text-muted-foreground text-xs">Supplier</p><p>{selectedInvoice.supplierName}</p></div>
              <div><p className="text-muted-foreground text-xs">Face Value</p><p className="font-mono font-medium">{formatCurrency(selectedInvoice.amount)}</p></div>
              <div>
                <label className="block text-muted-foreground text-xs mb-1">Discount Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="20"
                  value={discountRate}
                  onChange={e => setDiscountRate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Offer Price</p>
                <p className="font-mono font-bold text-lg">{formatCurrency(Math.round(selectedInvoice.amount * (1 - parseFloat(discountRate || '0') / 100)))}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleMakeOffer}
                disabled={loading}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Offer'}
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
