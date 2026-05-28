import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useActor } from '@/hooks/useActor';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/shared/StatusBadge';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AssignmentConsent } from '@/types';
import { toast } from 'sonner';

export default function ConsentInboxPage() {
  const { user } = useAuth();
  const { consents, signConsent } = useData();
  const actor = useActor();
  const [selected, setSelected] = useState<AssignmentConsent | null>(null);
  const [modal, setModal] = useState<{ consent: AssignmentConsent; approve: boolean } | null>(null);

  const myConsents = consents.filter(c => c.buyerId === user?.organisationId);
  const pending = myConsents.filter(c => c.status === 'pending');
  const completed = myConsents.filter(c => c.status !== 'pending');

  const handleSign = () => {
    if (!modal) return;
    signConsent(modal.consent.id, modal.approve, actor);
    toast.success(modal.approve ? 'Consent signed successfully' : 'Consent rejected');
    setModal(null);
    setSelected(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Consent Inbox"
        subtitle="Review and sign assignment consent requests"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-3 border-b bg-secondary/30">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending ({pending.length})
            </p>
          </div>
          <div className="divide-y max-h-[500px] overflow-y-auto">
            {pending.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No pending consents</p>
            ) : (
              pending.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`w-full text-left px-4 py-3 hover:bg-secondary/30 transition-colors ${selected?.id === c.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
                >
                  <p className="text-sm font-medium">{c.supplierName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.iouRegistryId}</p>
                  <p className="text-xs font-mono mt-1">{formatCurrency(c.amount)}</p>
                </button>
              ))
            )}
          </div>
          {completed.length > 0 && (
            <>
              <div className="p-3 border-b border-t bg-secondary/30">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Completed ({completed.length})
                </p>
              </div>
              <div className="divide-y max-h-48 overflow-y-auto">
                {completed.slice(0, 10).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`w-full text-left px-4 py-3 hover:bg-secondary/30 transition-colors ${selected?.id === c.id ? 'bg-primary/5' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm">{c.supplierName}</p>
                      <StatusBadge status={c.status} />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2 border rounded-lg p-6">
          {selected ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Assignment Consent Details</h3>
                <StatusBadge status={selected.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">IOU Registry ID</p><p className="font-mono">{selected.iouRegistryId}</p></div>
                <div><p className="text-muted-foreground text-xs">Amount</p><p className="font-mono font-medium">{formatCurrency(selected.amount)}</p></div>
                <div><p className="text-muted-foreground text-xs">Supplier</p><p>{selected.supplierName}</p></div>
                <div><p className="text-muted-foreground text-xs">Requested</p><p>{formatDate(selected.requestedAt)}</p></div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm">
                <p className="font-medium mb-2">Assignment Declaration</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  By signing this consent, you acknowledge that the receivable referenced above ({selected.iouRegistryId}) 
                  will be assigned from {selected.supplierName} to AFIX Capital SPV. Payment on the due date will be directed 
                  to the SPV's trust account. This consent is irrevocable once signed.
                </p>
              </div>
              {selected.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal({ consent: selected, approve: true })}
                    className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Sign Consent
                  </button>
                  <button
                    onClick={() => setModal({ consent: selected, approve: false })}
                    className="px-5 py-2.5 border rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
              {selected.respondedAt && (
                <p className="text-xs text-muted-foreground">Responded: {formatDate(selected.respondedAt)}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
              Select a consent request to view details
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={!!modal}
        title={modal?.approve ? 'Sign Consent' : 'Reject Consent'}
        description={modal?.approve ? 'This will irrevocably assign the receivable to the SPV. Continue?' : 'Are you sure you want to reject this assignment consent?'}
        confirmLabel={modal?.approve ? 'Sign' : 'Reject'}
        variant={modal?.approve ? 'default' : 'destructive'}
        onConfirm={handleSign}
        onCancel={() => setModal(null)}
      />
    </div>
  );
}
