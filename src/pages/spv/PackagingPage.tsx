import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { Invoice, SecuritisationPackage } from '@/types';
import { toast } from 'sonner';

export default function PackagingPage() {
  const { invoices, packages, createPackage, updatePackageStatus } = useData();
  const actor = useActor();
  const [tab, setTab] = useState<'create' | 'packages'>('packages');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [packageName, setPackageName] = useState('');

  const assignedInvoices = invoices.filter(inv => inv.status === 'assigned');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleCreatePackage = () => {
    if (selectedIds.length < 2) {
      toast.error('Select at least 2 invoices to create a package');
      return;
    }
    if (!packageName.trim()) {
      toast.error('Enter a package name');
      return;
    }
    const selectedInvs = invoices.filter(inv => selectedIds.includes(inv.id));
    const totalFace = selectedInvs.reduce((sum, inv) => sum + inv.amount, 0);

    createPackage({
      name: packageName,
      spvId: 'org-spv-1',
      invoiceIds: selectedIds,
      totalFaceValue: totalFace,
      weightedAvgDiscount: 4.8,
      weightedAvgTenor: 82,
    }, actor);

    toast.success('Package created successfully');
    setSelectedIds([]);
    setPackageName('');
    setTab('packages');
  };

  const assignedColumns = [
    { key: 'select', header: '', render: (inv: Invoice) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(inv.id)}
        onChange={() => toggleSelect(inv.id)}
        className="rounded border-gray-300"
      />
    )},
    { key: 'iou', header: 'IOU ID', render: (inv: Invoice) => <span className="font-mono text-xs">{inv.iouRegistryId}</span> },
    { key: 'supplier', header: 'Supplier', render: (inv: Invoice) => inv.supplierName },
    { key: 'amount', header: 'Face Value', render: (inv: Invoice) => <span className="font-mono">{formatCurrency(inv.amount)}</span> },
  ];

  const packageColumns = [
    { key: 'name', header: 'Package Name', render: (p: SecuritisationPackage) => <span className="font-medium">{p.name}</span> },
    { key: 'count', header: 'IOUs', render: (p: SecuritisationPackage) => p.invoiceIds.length },
    { key: 'face', header: 'Total Face Value', render: (p: SecuritisationPackage) => <span className="font-mono">{formatCurrency(p.totalFaceValue)}</span> },
    { key: 'discount', header: 'Avg Discount', render: (p: SecuritisationPackage) => <span className="font-mono">{p.weightedAvgDiscount.toFixed(1)}%</span> },
    { key: 'status', header: 'Status', render: (p: SecuritisationPackage) => <StatusBadge status={p.status} /> },
    { key: 'action', header: '', render: (p: SecuritisationPackage) => (
      p.status === 'draft' ? (
        <button
          onClick={(e) => { e.stopPropagation(); updatePackageStatus(p.id, 'structured', actor); toast.success('Package structured'); }}
          className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Structure
        </button>
      ) : p.status === 'structured' ? (
        <button
          onClick={(e) => { e.stopPropagation(); updatePackageStatus(p.id, 'listed', actor); toast.success('Package listed on NSE USP'); }}
          className="px-3 py-1 text-xs font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          List on NSE
        </button>
      ) : null
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Packaging & NSE USP" subtitle="Structure and list securitisation packages" />

      <div className="flex gap-1 border-b">
        <button
          onClick={() => setTab('packages')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'packages' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          My Packages ({packages.length})
        </button>
        <button
          onClick={() => setTab('create')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'create' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
        >
          Create Package ({assignedInvoices.length} available)
        </button>
      </div>

      {tab === 'packages' && (
        <DataTable columns={packageColumns} data={packages} emptyMessage="No packages created yet" />
      )}

      {tab === 'create' && (
        <div className="space-y-4">
          <div className="max-w-sm">
            <label className="block text-sm font-medium mb-1.5">Package Name</label>
            <input
              value={packageName}
              onChange={e => setPackageName(e.target.value)}
              placeholder="AFIX USP Series X"
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <DataTable columns={assignedColumns} data={assignedInvoices} emptyMessage="No assigned invoices available for packaging" />
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm"><span className="font-medium">{selectedIds.length}</span> invoices selected · Total: <span className="font-mono font-medium">{formatCurrency(invoices.filter(i => selectedIds.includes(i.id)).reduce((s, i) => s + i.amount, 0))}</span></p>
              <button
                onClick={handleCreatePackage}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Create Package
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
