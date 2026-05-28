import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Invoice, PurchaseOffer, AssignmentConsent, SecuritisationPackage, Payment, Organisation, ActivityLog, InvoiceStatus, OfferStatus, ConsentStatus } from '@/types';
import { seedInvoices, seedOffers, seedConsents, seedPackages, seedPayments, demoOrganisations, seedActivityLogs } from '@/data/seed';
import { generateId } from '@/lib/utils';
import { useNotifications } from './NotificationContext';

interface DataContextType {
  invoices: Invoice[];
  offers: PurchaseOffer[];
  consents: AssignmentConsent[];
  packages: SecuritisationPackage[];
  payments: Payment[];
  organisations: Organisation[];
  activityLogs: ActivityLog[];

  listInvoice: (invoice: Omit<Invoice, 'id' | 'iouRegistryId' | 'status' | 'createdAt' | 'listedAt'>, actor?: { userId: string; userName: string }) => Invoice;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus, actor?: { userId: string; userName: string }) => void;
  makeOffer: (offer: Omit<PurchaseOffer, 'id' | 'status' | 'createdAt'>, actor?: { userId: string; userName: string }) => PurchaseOffer;
  respondToOffer: (offerId: string, accept: boolean, actor?: { userId: string; userName: string }) => void;
  requestConsent: (consent: Omit<AssignmentConsent, 'id' | 'status' | 'requestedAt'>, actor?: { userId: string; userName: string }) => AssignmentConsent;
  signConsent: (consentId: string, approve: boolean, actor?: { userId: string; userName: string }) => void;
  createPackage: (pkg: Omit<SecuritisationPackage, 'id' | 'status' | 'createdAt'>, actor?: { userId: string; userName: string }) => SecuritisationPackage;
  updatePackageStatus: (packageId: string, status: SecuritisationPackage['status'], actor?: { userId: string; userName: string }) => void;
  confirmPayment: (paymentId: string, actor?: { userId: string; userName: string }) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices);
  const [offers, setOffers] = useState<PurchaseOffer[]>(seedOffers);
  const [consents, setConsents] = useState<AssignmentConsent[]>(seedConsents);
  const [packages, setPackages] = useState<SecuritisationPackage[]>(seedPackages);
  const [payments, setPayments] = useState<Payment[]>(seedPayments);
  const [organisations] = useState<Organisation[]>(demoOrganisations);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(seedActivityLogs);
  const { addNotification } = useNotifications();

  const addActivityLog = useCallback((log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const entry: ActivityLog = { ...log, id: generateId('log'), timestamp: new Date().toISOString() };
    setActivityLogs(prev => [entry, ...prev]);
  }, []);

  const listInvoice = useCallback((data: Omit<Invoice, 'id' | 'iouRegistryId' | 'status' | 'createdAt' | 'listedAt'>, actor?: { userId: string; userName: string }) => {
    const now = new Date().toISOString();
    const inv: Invoice = {
      ...data,
      id: generateId('inv'),
      iouRegistryId: `IOU-KE-${Date.now()}`,
      status: 'listed',
      listedAt: now,
      createdAt: now,
    };
    setInvoices(prev => [inv, ...prev]);
    addNotification({
      userId: 'user-spv-1',
      title: 'New Invoice Listed',
      message: `${data.supplierName} listed ${data.invoiceNumber} for KES ${data.amount.toLocaleString()}`,
      type: 'info',
      link: '/spv/registry',
    });
    if (actor) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: 'Listed invoice',
        entityType: 'invoice',
        entityId: inv.id,
        details: `${data.invoiceNumber} — ${inv.iouRegistryId}`,
      });
    }
    return inv;
  }, [addNotification, addActivityLog]);

  const updateInvoiceStatus = useCallback((invoiceId: string, status: InvoiceStatus, actor?: { userId: string; userName: string }) => {
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? { ...inv, status, verifiedAt: status === 'verified' ? new Date().toISOString() : inv.verifiedAt } : inv));
    const inv = invoices.find(i => i.id === invoiceId);
    if (actor && inv) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: `Updated status to ${status}`,
        entityType: 'invoice',
        entityId: invoiceId,
        details: inv.iouRegistryId,
      });
    }
  }, [invoices, addActivityLog]);

  const makeOffer = useCallback((data: Omit<PurchaseOffer, 'id' | 'status' | 'createdAt'>, actor?: { userId: string; userName: string }) => {
    const offer: PurchaseOffer = {
      ...data,
      id: generateId('offer'),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOffers(prev => [offer, ...prev]);
    setInvoices(prev => prev.map(inv => inv.id === data.invoiceId ? { ...inv, status: 'offer_received' } : inv));
    addNotification({
      userId: 'user-supplier-1',
      title: 'New Offer Received',
      message: `${data.spvName} offered ${data.discountRate}% discount on ${data.iouRegistryId}`,
      type: 'info',
      link: '/supplier/invoices',
    });
    if (actor) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: 'Made purchase offer',
        entityType: 'offer',
        entityId: offer.id,
        details: `${data.iouRegistryId} at ${data.discountRate}% discount`,
      });
    }
    return offer;
  }, [addNotification, addActivityLog]);

  const respondToOffer = useCallback((offerId: string, accept: boolean, actor?: { userId: string; userName: string }) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: (accept ? 'accepted' : 'rejected') as OfferStatus, respondedAt: new Date().toISOString() } : o));
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      if (accept) {
        setInvoices(prev => prev.map(inv => inv.id === offer.invoiceId ? { ...inv, status: 'offer_accepted' } : inv));
        addNotification({
          userId: 'user-spv-1',
          title: 'Offer Accepted',
          message: `Supplier accepted your offer on ${offer.iouRegistryId}`,
          type: 'success',
          link: '/spv/assignments',
        });
      }
      if (actor) {
        addActivityLog({
          userId: actor.userId,
          userName: actor.userName,
          action: accept ? 'Accepted offer' : 'Rejected offer',
          entityType: 'offer',
          entityId: offerId,
          details: offer.iouRegistryId,
        });
      }
    }
  }, [offers, addNotification, addActivityLog]);

  const requestConsent = useCallback((data: Omit<AssignmentConsent, 'id' | 'status' | 'requestedAt'>, actor?: { userId: string; userName: string }) => {
    const consent: AssignmentConsent = {
      ...data,
      id: generateId('consent'),
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    setConsents(prev => [consent, ...prev]);
    addNotification({
      userId: 'user-buyer-1',
      title: 'Assignment Consent Required',
      message: `Please review assignment consent for ${data.iouRegistryId}`,
      type: 'warning',
      link: '/buyer/consent',
    });
    if (actor) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: 'Requested assignment consent',
        entityType: 'consent',
        entityId: consent.id,
        details: data.iouRegistryId,
      });
    }
    return consent;
  }, [addNotification, addActivityLog]);

  const signConsent = useCallback((consentId: string, approve: boolean, actor?: { userId: string; userName: string }) => {
    setConsents(prev => prev.map(c => c.id === consentId ? { ...c, status: (approve ? 'signed' : 'rejected') as ConsentStatus, respondedAt: new Date().toISOString() } : c));
    const consent = consents.find(c => c.id === consentId);
    if (consent) {
      if (approve) {
        setInvoices(prev => prev.map(inv => inv.id === consent.invoiceId ? { ...inv, status: 'assigned' } : inv));
        addNotification({
          userId: 'user-spv-1',
          title: 'Consent Signed',
          message: `${consent.buyerName} signed assignment consent for ${consent.iouRegistryId}`,
          type: 'success',
          link: '/spv/packaging',
        });
      }
      if (actor) {
        addActivityLog({
          userId: actor.userId,
          userName: actor.userName,
          action: approve ? 'Signed consent' : 'Rejected consent',
          entityType: 'consent',
          entityId: consentId,
          details: consent.iouRegistryId,
        });
      }
    }
  }, [consents, addNotification, addActivityLog]);

  const createPackage = useCallback((data: Omit<SecuritisationPackage, 'id' | 'status' | 'createdAt'>, actor?: { userId: string; userName: string }) => {
    const pkg: SecuritisationPackage = {
      ...data,
      id: generateId('pkg'),
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    setPackages(prev => [pkg, ...prev]);
    data.invoiceIds.forEach(invId => {
      setInvoices(prev => prev.map(inv => inv.id === invId ? { ...inv, status: 'packaged' } : inv));
    });
    if (actor) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: 'Created securitisation package',
        entityType: 'package',
        entityId: pkg.id,
        details: `${data.name} — ${data.invoiceIds.length} IOUs`,
      });
    }
    return pkg;
  }, [addActivityLog]);

  const updatePackageStatus = useCallback((packageId: string, status: SecuritisationPackage['status'], actor?: { userId: string; userName: string }) => {
    setPackages(prev => prev.map(p => p.id === packageId ? { ...p, status, listedAt: status === 'listed' ? new Date().toISOString() : p.listedAt } : p));
    if (actor) {
      addActivityLog({
        userId: actor.userId,
        userName: actor.userName,
        action: `Package status → ${status}`,
        entityType: 'package',
        entityId: packageId,
        details: status === 'listed' ? 'Listed on NSE USP' : undefined,
      });
    }
  }, [addActivityLog]);

  const confirmPayment = useCallback((paymentId: string, actor?: { userId: string; userName: string }) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'paid', paidAt: new Date().toISOString() } : p));
    const payment = payments.find(p => p.id === paymentId);
    if (payment) {
      setInvoices(prev => prev.map(inv => inv.id === payment.invoiceId ? { ...inv, status: 'settled' } : inv));
      addNotification({
        userId: 'user-admin-1',
        title: 'Payment Confirmed',
        message: `${payment.buyerName} confirmed payment of KES ${payment.amount.toLocaleString()}`,
        type: 'success',
        link: '/admin/invoices',
      });
      if (actor) {
        addActivityLog({
          userId: actor.userId,
          userName: actor.userName,
          action: 'Confirmed payment',
          entityType: 'payment',
          entityId: paymentId,
          details: `Invoice ${payment.invoiceId} settled`,
        });
      }
    }
  }, [payments, addNotification, addActivityLog]);

  return (
    <DataContext.Provider value={{
      invoices, offers, consents, packages, payments, organisations, activityLogs,
      listInvoice, updateInvoiceStatus, makeOffer, respondToOffer,
      requestConsent, signConsent, createPackage, updatePackageStatus,
      confirmPayment, addActivityLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
}
