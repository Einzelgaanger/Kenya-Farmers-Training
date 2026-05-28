import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/shared/DataTable';
import StatusBadge from '@/components/shared/StatusBadge';
import { Organisation } from '@/types';
import { demoUsers } from '@/data/seed';
import { User } from '@/types';
import { toast } from 'sonner';

type Tab = 'organisations' | 'users' | 'invite';

export default function UsersPage() {
  const { organisations } = useData();
  const [tab, setTab] = useState<Tab>('organisations');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('supplier');

  const orgColumns = [
    { key: 'name', header: 'Organisation', render: (o: Organisation) => <span className="font-medium">{o.name}</span> },
    { key: 'type', header: 'Type', render: (o: Organisation) => <span className="capitalize">{o.type}</span> },
    { key: 'sector', header: 'Sector', render: (o: Organisation) => o.sector || '—' },
    { key: 'reg', header: 'Registration #', render: (o: Organisation) => <span className="font-mono text-xs">{o.registrationNumber}</span> },
    { key: 'status', header: 'Status', render: (o: Organisation) => <StatusBadge status={o.status} /> },
  ];

  const userColumns = [
    { key: 'name', header: 'Name', render: (u: User) => <span className="font-medium">{u.name}</span> },
    { key: 'email', header: 'Email', render: (u: User) => <span className="text-muted-foreground">{u.email}</span> },
    { key: 'role', header: 'Role', render: (u: User) => <span className="capitalize">{u.role}</span> },
    { key: 'org', header: 'Organisation', render: (u: User) => u.organisationName },
  ];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Invite sent to ${inviteEmail} as ${inviteRole} (demo)`);
    setInviteEmail('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Users & Organisations" subtitle="Manage platform participants" />

      <div className="flex gap-1 border-b">
        {(['organisations', 'users', 'invite'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t === 'invite' ? 'Invite User' : t}
          </button>
        ))}
      </div>

      {tab === 'organisations' && (
        <DataTable columns={orgColumns} data={organisations} emptyMessage="No organisations registered" />
      )}

      {tab === 'users' && (
        <DataTable columns={userColumns} data={demoUsers} emptyMessage="No users found" />
      )}

      {tab === 'invite' && (
        <form onSubmit={handleInvite} className="max-w-md border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold">Invite New User</h3>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="user@company.co.ke"
              className="w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Role</label>
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg text-sm appearance-none bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="supplier">Supplier</option>
              <option value="buyer">Buyer</option>
              <option value="spv">SPV</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Send Invite
          </button>
        </form>
      )}
    </div>
  );
}
