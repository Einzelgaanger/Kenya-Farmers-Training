import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserNotifications } from '@/hooks/useNotifications';
import NotificationPanel from '@/components/shared/NotificationPanel';
import { UserRole } from '@/types';
import {
  LayoutDashboard, FileText, FilePlus, History, User, Bell,
  LogOut, ShoppingCart, ClipboardCheck, Calendar,
  Database, Send, Layers, GitBranch, Cpu, Users, Activity,
  BarChart3, ShieldCheck, Menu, X
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

function getNavItems(role: UserRole): NavItem[] {
  const iconSize = 18;
  switch (role) {
    case 'supplier':
      return [
        { label: 'Dashboard', path: '/supplier', icon: <LayoutDashboard size={iconSize} /> },
        { label: 'My Invoices', path: '/supplier/invoices', icon: <FileText size={iconSize} /> },
        { label: 'List Invoice', path: '/supplier/list', icon: <FilePlus size={iconSize} /> },
        { label: 'Trade History', path: '/supplier/history', icon: <History size={iconSize} /> },
        { label: 'Profile', path: '/supplier/profile', icon: <User size={iconSize} /> },
      ];
    case 'buyer':
      return [
        { label: 'Dashboard', path: '/buyer', icon: <LayoutDashboard size={iconSize} /> },
        { label: 'Invoice Register', path: '/buyer/register', icon: <ShoppingCart size={iconSize} /> },
        { label: 'Consent Inbox', path: '/buyer/consent', icon: <ClipboardCheck size={iconSize} /> },
        { label: 'Payment Schedule', path: '/buyer/payments', icon: <Calendar size={iconSize} /> },
        { label: 'Profile', path: '/buyer/profile', icon: <User size={iconSize} /> },
      ];
    case 'spv':
      return [
        { label: 'Dashboard', path: '/spv', icon: <LayoutDashboard size={iconSize} /> },
        { label: 'IOU Registry', path: '/spv/registry', icon: <Database size={iconSize} /> },
        { label: 'Offers & Receivables', path: '/spv/offers', icon: <Send size={iconSize} /> },
        { label: 'Packaging', path: '/spv/packaging', icon: <Layers size={iconSize} /> },
        { label: 'Assignments', path: '/spv/assignments', icon: <GitBranch size={iconSize} /> },
        { label: 'Backend Engine', path: '/spv/engine', icon: <Cpu size={iconSize} /> },
        { label: 'Profile', path: '/spv/profile', icon: <User size={iconSize} /> },
      ];
    case 'admin':
      return [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={iconSize} /> },
        { label: 'All Invoices', path: '/admin/invoices', icon: <FileText size={iconSize} /> },
        { label: 'Users & Orgs', path: '/admin/users', icon: <Users size={iconSize} /> },
        { label: 'Workflow', path: '/admin/workflow', icon: <Activity size={iconSize} /> },
        { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={iconSize} /> },
      ];
  }
}

function getRoleLabel(role: UserRole): string {
  return { supplier: 'Supplier', buyer: 'Buyer', spv: 'SPV', admin: 'Admin' }[role];
}

export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { unreadCount } = useUserNotifications();
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const navItems = getNavItems(user.role);

  const sidebar = (
    <>
      <div className="p-5 border-b">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">AFIX</span>
            <p className="text-[10px] text-muted-foreground -mt-0.5">{getRoleLabel(user.role)} Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${user.role}`}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-brand-blue-light hover:text-primary'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center text-sm font-semibold text-accent">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.organisationName}</p>
          </div>
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-1.5 rounded-md hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden lg:flex w-64 border-r bg-card flex-col shrink-0">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card flex flex-col shadow-xl animate-fade-in">
            <button
              className="absolute right-3 top-4 p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b bg-card">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-md hover:bg-secondary">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <span className="font-display font-bold">AFIX</span>
          </div>
          <button onClick={() => setNotifOpen(true)} className="relative p-2 rounded-md hover:bg-secondary">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
            )}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}
