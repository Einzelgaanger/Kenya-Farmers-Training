import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Payment } from '@/types';
import { toast } from 'sonner';

export default function PaymentSchedulePage() {
  const { user } = useAuth();
  const { payments, confirmPayment } = useData();
  const actor = useActor();

  const myPayments = payments.filter(p => p.buyerId === user?.organisationId);
  const upcoming = myPayments.filter(p => p.status === 'upcoming' || p.status === 'due');
  const overdue = myPayments.filter(p => p.status === 'overdue');
  const paid = myPayments.filter(p => p.status === 'paid');

  const handleConfirmPayment = (paymentId: string) => {
    confirmPayment(paymentId, actor);
    toast.success('Payment confirmed');
  };

  const columns = [
    { key: 'invoice', header: 'Invoice', render: (p: Payment) => <span className="font-mono text-xs">{p.invoiceId}</span> },
    { key: 'buyer', header: 'Payee', render: (_p: Payment) => 'AFIX Capital SPV' },
    { key: 'amount', header: 'Amount', render: (p: Payment) => <span className="font-mono">{formatCurrency(p.amount)}</span> },
    { key: 'due', header: 'Due Date', render: (p: Payment) => formatDate(p.dueDate) },
    { key: 'status', header: 'Status', render: (p: Payment) => <StatusBadge status={p.status} /> },
    {
      key: 'action', header: '', render: (p: Payment) => (
        p.status !== 'paid' ? (
          <button
            onClick={(e) => { e.stopPropagation(); handleConfirmPayment(p.id); }}
            className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Confirm Payment
          </button>
        ) : <span className="text-xs text-muted-foreground">{p.paidAt ? formatDate(p.paidAt) : ''}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Payment Schedule"
        subtitle="Track and confirm payments to the SPV trust account"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card border-l-4 border-l-amber-500">
          <p className="text-sm text-muted-foreground">Upcoming</p>
          <p className="text-2xl font-bold font-mono mt-1">{upcoming.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold font-mono mt-1">{overdue.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-emerald-500">
          <p className="text-sm text-muted-foreground">Paid</p>
          <p className="text-2xl font-bold font-mono mt-1">{paid.length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={myPayments} emptyMessage="No payments scheduled" />
    </div>
  );
}
