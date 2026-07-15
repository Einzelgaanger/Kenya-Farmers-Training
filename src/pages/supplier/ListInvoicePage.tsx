import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import PageHeader from '@/components/layout/PageHeader';
import { toast } from 'sonner';
import { demoOrganisations } from '@/data/seed';
import DocumentAttach from '@/components/shared/DocumentAttach';

export default function ListInvoicePage() {
  const { user } = useAuth();
  const { listInvoice } = useData();
  const actor = useActor();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const buyers = demoOrganisations.filter(o => o.type === 'buyer');

  const [form, setForm] = useState({
    buyerId: '',
    invoiceNumber: '',
    amount: '',
    issueDate: '',
    dueDate: '',
    description: '',
    currency: 'KES',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const buyer = buyers.find(b => b.id === form.buyerId);
    listInvoice({
      supplierId: user.organisationId,
      supplierName: user.organisationName,
      buyerId: form.buyerId,
      buyerName: buyer?.name || '',
      invoiceNumber: form.invoiceNumber,
      amount: Number(form.amount),
      currency: form.currency,
      issueDate: form.issueDate,
      dueDate: form.dueDate,
      description: form.description,
    }, actor);

    setLoading(false);
    toast.success('Invoice listed successfully');
    navigate('/supplier/invoices');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="List New Invoice" subtitle="Submit a trade receivable for securitisation" />

      <form onSubmit={handleSubmit} className="max-w-2xl border rounded-lg p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Invoice Number</label>
            <input
              required
              value={form.invoiceNumber}
              onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
              placeholder="INV-XXX-0001"
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Buyer</label>
            <select
              required
              value={form.buyerId}
              onChange={e => setForm({ ...form, buyerId: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm appearance-none bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select buyer</option>
              {buyers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount (KES)</label>
            <input
              required
              type="number"
              min="1"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              placeholder="1,000,000"
              className="w-full px-3 py-2.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Currency</label>
            <select
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm appearance-none bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Issue Date</label>
            <input
              required
              type="date"
              value={form.issueDate}
              onChange={e => setForm({ ...form, issueDate: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Due Date</label>
            <input
              required
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Brief description of goods/services..."
            className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Supporting documents</label>
          <DocumentAttach />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Listing...' : 'List Invoice'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
