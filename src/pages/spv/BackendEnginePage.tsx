import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatCurrency } from '@/lib/utils';

type Tab = 'trust' | 'settlement' | 'reconciliation' | 'distributions';

const mockTrustAccounts = [
  { id: 'trust-001', name: 'Collection Account', bank: 'KCB Bank', balance: 45600000, currency: 'KES' },
  { id: 'trust-002', name: 'Distribution Account', bank: 'Equity Bank', balance: 12300000, currency: 'KES' },
  { id: 'trust-003', name: 'Reserve Account', bank: 'Stanbic Bank', balance: 8900000, currency: 'KES' },
];

const mockSettlement = [
  { id: 'stl-001', type: 'Buyer Payment', reference: 'PAY-KBC-20260115', amount: 5200000, status: 'completed', date: '2026-01-15' },
  { id: 'stl-002', type: 'Investor Disbursement', reference: 'DIS-INV-20260118', amount: 4800000, status: 'completed', date: '2026-01-18' },
  { id: 'stl-003', type: 'Buyer Payment', reference: 'PAY-EQB-20260120', amount: 3100000, status: 'pending', date: '2026-01-20' },
  { id: 'stl-004', type: 'Fee Disbursement', reference: 'FEE-SPV-20260122', amount: 150000, status: 'completed', date: '2026-01-22' },
];

const mockReconciliation = [
  { id: 'rec-001', period: 'Jan 2026 Wk 1', expected: 8200000, received: 8200000, variance: 0, status: 'matched' },
  { id: 'rec-002', period: 'Jan 2026 Wk 2', expected: 6500000, received: 6300000, variance: -200000, status: 'variance' },
  { id: 'rec-003', period: 'Jan 2026 Wk 3', expected: 7100000, received: 7100000, variance: 0, status: 'matched' },
];

const mockDistributions = [
  { id: 'dist-001', package: 'AFIX USP Series 1', investor: 'Fund Alpha', amount: 12500000, yield: '8.2%', date: '2026-01-10' },
  { id: 'dist-002', package: 'AFIX USP Series 2', investor: 'Fund Beta', amount: 8700000, yield: '7.8%', date: '2026-01-15' },
  { id: 'dist-003', package: 'AFIX USP Series 1', investor: 'Fund Gamma', amount: 6300000, yield: '8.5%', date: '2026-01-20' },
];

export default function BackendEnginePage() {
  const [tab, setTab] = useState<Tab>('trust');
  const { packages } = useData();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'trust', label: 'Trust Accounts' },
    { id: 'settlement', label: 'Settlement' },
    { id: 'reconciliation', label: 'Reconciliation' },
    { id: 'distributions', label: 'Distributions' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Backend Engine" subtitle="Financial operations and settlement management" />

      <div className="flex gap-1 border-b">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'trust' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTrustAccounts.map(account => (
            <div key={account.id} className="border rounded-lg p-5">
              <p className="text-sm font-medium">{account.name}</p>
              <p className="text-xs text-muted-foreground mb-3">{account.bank}</p>
              <p className="text-2xl font-bold font-mono">{formatCurrency(account.balance)}</p>
              <p className="text-xs text-muted-foreground mt-1">{account.currency}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'settlement' && (
        <div className="border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockSettlement.map(s => (
                <tr key={s.id}>
                  <td className="font-mono text-xs">{s.reference}</td>
                  <td>{s.type}</td>
                  <td className="font-mono">{formatCurrency(s.amount)}</td>
                  <td className="text-muted-foreground">{s.date}</td>
                  <td><span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'reconciliation' && (
        <div className="border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Expected</th>
                <th>Received</th>
                <th>Variance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockReconciliation.map(r => (
                <tr key={r.id}>
                  <td className="font-medium">{r.period}</td>
                  <td className="font-mono">{formatCurrency(r.expected)}</td>
                  <td className="font-mono">{formatCurrency(r.received)}</td>
                  <td className={`font-mono ${r.variance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(r.variance)}</td>
                  <td><span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${r.status === 'matched' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'distributions' && (
        <div className="border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Investor</th>
                <th>Amount</th>
                <th>Yield</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockDistributions.map(d => (
                <tr key={d.id}>
                  <td className="font-medium">{d.package}</td>
                  <td>{d.investor}</td>
                  <td className="font-mono">{formatCurrency(d.amount)}</td>
                  <td className="font-mono text-emerald-600">{d.yield}</td>
                  <td className="text-muted-foreground">{d.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
