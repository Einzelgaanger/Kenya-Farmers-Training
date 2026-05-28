import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getRoleRedirect } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from 'sonner';

import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/layout/PortalLayout';
import IdleWarningModal from '@/components/shared/IdleWarningModal';
import AuthPage from '@/pages/AuthPage';

// Supplier pages
import SupplierDashboard from '@/pages/supplier/SupplierDashboard';
import MyInvoicesPage from '@/pages/supplier/MyInvoicesPage';
import InvoiceDetailPage from '@/pages/supplier/InvoiceDetailPage';
import ListInvoicePage from '@/pages/supplier/ListInvoicePage';
import TradeHistoryPage from '@/pages/supplier/TradeHistoryPage';
import SupplierProfilePage from '@/pages/supplier/SupplierProfilePage';

// Buyer pages
import BuyerDashboard from '@/pages/buyer/BuyerDashboard';
import InvoiceRegisterPage from '@/pages/buyer/InvoiceRegisterPage';
import ConsentInboxPage from '@/pages/buyer/ConsentInboxPage';
import PaymentSchedulePage from '@/pages/buyer/PaymentSchedulePage';
import BuyerProfilePage from '@/pages/buyer/BuyerProfilePage';

// SPV pages
import SPVDashboard from '@/pages/spv/SPVDashboard';
import IOURegistryPage from '@/pages/spv/IOURegistryPage';
import OffersPage from '@/pages/spv/OffersPage';
import PackagingPage from '@/pages/spv/PackagingPage';
import AssignmentRegistryPage from '@/pages/spv/AssignmentRegistryPage';
import BackendEnginePage from '@/pages/spv/BackendEnginePage';
import SPVProfilePage from '@/pages/spv/SPVProfilePage';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AllInvoicesPage from '@/pages/admin/AllInvoicesPage';
import UsersPage from '@/pages/admin/UsersPage';
import WorkflowMonitorPage from '@/pages/admin/WorkflowMonitorPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import NotFound from '@/pages/NotFound';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated && user ? <Navigate to={getRoleRedirect(user.role)} /> : <AuthPage />} />

      {/* Supplier Portal */}
      <Route path="/supplier" element={<ProtectedRoute allowedRole="supplier"><PortalLayout /></ProtectedRoute>}>
        <Route index element={<SupplierDashboard />} />
        <Route path="invoices" element={<MyInvoicesPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="list" element={<ListInvoicePage />} />
        <Route path="history" element={<TradeHistoryPage />} />
        <Route path="profile" element={<SupplierProfilePage />} />
      </Route>

      {/* Buyer Portal */}
      <Route path="/buyer" element={<ProtectedRoute allowedRole="buyer"><PortalLayout /></ProtectedRoute>}>
        <Route index element={<BuyerDashboard />} />
        <Route path="register" element={<InvoiceRegisterPage />} />
        <Route path="consent" element={<ConsentInboxPage />} />
        <Route path="payments" element={<PaymentSchedulePage />} />
        <Route path="profile" element={<BuyerProfilePage />} />
      </Route>

      {/* SPV Portal */}
      <Route path="/spv" element={<ProtectedRoute allowedRole="spv"><PortalLayout /></ProtectedRoute>}>
        <Route index element={<SPVDashboard />} />
        <Route path="registry" element={<IOURegistryPage />} />
        <Route path="offers" element={<OffersPage />} />
        <Route path="packaging" element={<PackagingPage />} />
        <Route path="assignments" element={<AssignmentRegistryPage />} />
        <Route path="engine" element={<BackendEnginePage />} />
        <Route path="profile" element={<SPVProfilePage />} />
      </Route>

      {/* Admin Portal */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><PortalLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="invoices" element={<AllInvoicesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="workflow" element={<WorkflowMonitorPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated && user ? getRoleRedirect(user.role) : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <IdleWarningModal />
          <Toaster position="top-right" richColors />
        </DataProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
