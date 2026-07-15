import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import PageHeader from '@/components/layout/PageHeader';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';

type Tab = 'volume' | 'pipeline' | 'participants' | 'performance';

export default function AnalyticsPage() {
  const { invoices, offers, packages, payments, organisations } = useData();
  const [tab, setTab] = useState<Tab>('volume');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'volume', label: 'Volume' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'participants', label: 'Participants' },
    { id: 'performance', label: 'Performance' },
  ];

  // Volume data: monthly
  const monthlyVolume = Array.from({ length: 6 }, (_, i) => {
    const month = new Date(2025, 8 + i, 1);
    const monthInvs = invoices.filter(inv => {
      const d = new Date(inv.createdAt);
      return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear();
    });
    return {
      month: month.toLocaleDateString('en', { month: 'short' }),
      count: monthInvs.length,
      value: monthInvs.reduce((s, i) => s + i.amount, 0),
    };
  });

  // Pipeline data
  const pipelineData = [
    { name: 'Listed', value: invoices.filter(i => i.status === 'listed').length },
    { name: 'Verified', value: invoices.filter(i => i.status === 'verified').length },
    { name: 'Offer Stage', value: invoices.filter(i => ['offer_received', 'offer_accepted'].includes(i.status)).length },
    { name: 'Assigned', value: invoices.filter(i => i.status === 'assigned').length },
    { name: 'Packaged', value: invoices.filter(i => i.status === 'packaged').length },
    { name: 'Completed', value: invoices.filter(i => ['disbursed', 'settled'].includes(i.status)).length },
  ];
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#8b5cf6', '#14b8a6'];

  // Participants
  const participantData = [
    { type: 'Suppliers', count: organisations.filter(o => o.type === 'supplier').length },
    { type: 'Buyers', count: organisations.filter(o => o.type === 'buyer').length },
    { type: 'SPV', count: organisations.filter(o => o.type === 'spv').length },
  ];

  // Performance
  const avgDiscount = offers.length > 0 ? (offers.reduce((s, o) => s + o.discountRate, 0) / offers.length).toFixed(1) : '0';
  const avgTenor = offers.length > 0 ? Math.round(offers.reduce((s, o) => s + o.tenor, 0) / offers.length) : 0;
  const settlementRate = payments.length > 0 ? ((payments.filter(p => p.status === 'paid').length / payments.length) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Analytics" subtitle="Platform performance metrics and insights" />

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

      {tab === 'volume' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card border-l-4 border-l-blue-500">
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold font-mono mt-1">{invoices.length}</p>
            </div>
            <div className="stat-card border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(invoices.reduce((s, i) => s + i.amount, 0))}</p>
            </div>
            <div className="stat-card border-l-4 border-l-emerald-500">
              <p className="text-sm text-muted-foreground">Avg Invoice Size</p>
              <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(Math.round(invoices.reduce((s, i) => s + i.amount, 0) / invoices.length))}</p>
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-sm mb-4">Monthly Invoice Volume</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="value" stroke="#1B6BB5" fill="#1B6BB5" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-sm mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pipelineData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {pipelineData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-sm mb-4">Pipeline Funnel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={12} width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#1B6BB5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {tab === 'participants' && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-sm mb-4">Organisation Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={participantData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="type" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#1B6BB5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {participantData.map(p => (
              <div key={p.type} className="stat-card border-l-4 border-l-primary">
                <p className="text-sm text-muted-foreground">{p.type}</p>
                <p className="text-2xl font-bold font-mono mt-1">{p.count}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="stat-card border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground">Avg Discount Rate</p>
              <p className="text-2xl font-bold font-mono mt-1">{avgDiscount}%</p>
            </div>
            <div className="stat-card border-l-4 border-l-blue-500">
              <p className="text-sm text-muted-foreground">Avg Tenor (days)</p>
              <p className="text-2xl font-bold font-mono mt-1">{avgTenor}</p>
            </div>
            <div className="stat-card border-l-4 border-l-emerald-500">
              <p className="text-sm text-muted-foreground">Settlement Rate</p>
              <p className="text-2xl font-bold font-mono mt-1">{settlementRate}%</p>
            </div>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-sm mb-4">Offers Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1B6BB5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
