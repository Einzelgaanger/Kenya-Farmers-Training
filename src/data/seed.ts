import { User, Organisation, Invoice, PurchaseOffer, AssignmentConsent, SecuritisationPackage, Payment, Notification, ActivityLog } from '@/types';

// Demo Accounts (password: Afix2026!)
export const demoUsers: User[] = [
  {
    id: 'user-supplier-1',
    email: 'supplier@afix.co.ke',
    name: 'James Mwangi',
    role: 'supplier',
    organisationId: 'org-supplier-1',
    organisationName: 'Savannah Steel Ltd',
    createdAt: '2025-06-15T08:00:00Z',
  },
  {
    id: 'user-buyer-1',
    email: 'buyer@afix.co.ke',
    name: 'Grace Wanjiku',
    role: 'buyer',
    organisationId: 'org-buyer-1',
    organisationName: 'Kenya Breweries Corp',
    createdAt: '2025-05-20T08:00:00Z',
  },
  {
    id: 'user-spv-1',
    email: 'spv@afix.co.ke',
    name: 'David Ochieng',
    role: 'spv',
    organisationId: 'org-spv-1',
    organisationName: 'AFIX Capital SPV',
    createdAt: '2025-04-10T08:00:00Z',
  },
  {
    id: 'user-admin-1',
    email: 'admin@afix.co.ke',
    name: 'Sarah Kimani',
    role: 'admin',
    organisationId: 'org-spv-1',
    organisationName: 'AFIX Capital SPV',
    createdAt: '2025-03-01T08:00:00Z',
  },
  {
    id: 'user-supplier-2',
    email: 'supplier2@afix.co.ke',
    name: 'Peter Njoroge',
    role: 'supplier',
    organisationId: 'org-supplier-2',
    organisationName: 'Highland Logistics',
    createdAt: '2025-07-01T08:00:00Z',
  },
];

export const demoOrganisations: Organisation[] = [
  { id: 'org-supplier-1', name: 'Savannah Steel Ltd', type: 'supplier', sector: 'Manufacturing', registrationNumber: 'KE-2019-44521', contactEmail: 'finance@savannahsteel.co.ke', status: 'active', createdAt: '2025-06-15T08:00:00Z' },
  { id: 'org-supplier-2', name: 'Highland Logistics', type: 'supplier', sector: 'Transport & Logistics', registrationNumber: 'KE-2020-11234', contactEmail: 'accounts@highland.co.ke', status: 'active', createdAt: '2025-07-01T08:00:00Z' },
  { id: 'org-supplier-3', name: 'Nairobi Tech Solutions', type: 'supplier', sector: 'IT Services', registrationNumber: 'KE-2021-55789', contactEmail: 'billing@nts.co.ke', status: 'active', createdAt: '2025-08-10T08:00:00Z' },
  { id: 'org-supplier-4', name: 'Coastal Agri Exports', type: 'supplier', sector: 'Agriculture', registrationNumber: 'KE-2018-33456', contactEmail: 'trade@coastalagri.co.ke', status: 'active', createdAt: '2025-05-01T08:00:00Z' },
  { id: 'org-supplier-5', name: 'Rift Valley Cement', type: 'supplier', sector: 'Construction', registrationNumber: 'KE-2017-22100', contactEmail: 'finance@rvcement.co.ke', status: 'active', createdAt: '2025-04-15T08:00:00Z' },
  { id: 'org-buyer-1', name: 'Kenya Breweries Corp', type: 'buyer', sector: 'FMCG', registrationNumber: 'KE-2010-10001', contactEmail: 'procurement@kbc.co.ke', status: 'active', createdAt: '2025-05-20T08:00:00Z' },
  { id: 'org-buyer-2', name: 'Equity Bank Group', type: 'buyer', sector: 'Banking & Finance', registrationNumber: 'KE-2005-50023', contactEmail: 'vendor@equity.co.ke', status: 'active', createdAt: '2025-04-01T08:00:00Z' },
  { id: 'org-buyer-3', name: 'Safaricom PLC', type: 'buyer', sector: 'Telecommunications', registrationNumber: 'KE-2000-70010', contactEmail: 'suppliers@safaricom.co.ke', status: 'active', createdAt: '2025-03-15T08:00:00Z' },
  { id: 'org-buyer-4', name: 'East African Portland Cement', type: 'buyer', sector: 'Construction', registrationNumber: 'KE-2012-30044', contactEmail: 'accounts@eapcc.co.ke', status: 'active', createdAt: '2025-06-01T08:00:00Z' },
  { id: 'org-spv-1', name: 'AFIX Capital SPV', type: 'spv', sector: 'Structured Finance', registrationNumber: 'KE-2024-90001', contactEmail: 'operations@afix.co.ke', status: 'active', createdAt: '2025-01-01T08:00:00Z' },
];

function generateInvoices(): Invoice[] {
  const suppliers = [
    { id: 'org-supplier-1', name: 'Savannah Steel Ltd' },
    { id: 'org-supplier-2', name: 'Highland Logistics' },
    { id: 'org-supplier-3', name: 'Nairobi Tech Solutions' },
    { id: 'org-supplier-4', name: 'Coastal Agri Exports' },
    { id: 'org-supplier-5', name: 'Rift Valley Cement' },
  ];
  const buyers = [
    { id: 'org-buyer-1', name: 'Kenya Breweries Corp' },
    { id: 'org-buyer-2', name: 'Equity Bank Group' },
    { id: 'org-buyer-3', name: 'Safaricom PLC' },
    { id: 'org-buyer-4', name: 'East African Portland Cement' },
  ];
  const statuses: Invoice['status'][] = [
    'listed', 'listed', 'verified', 'verified', 'verified',
    'offer_received', 'offer_received', 'offer_accepted',
    'assigned', 'assigned', 'packaged', 'disbursed',
    'disbursed', 'matured', 'settled', 'settled',
  ];
  const descriptions = [
    'Steel reinforcement bars – 40T delivery',
    'Fleet maintenance Q1 2026',
    'Cloud infrastructure services',
    'Macadamia nut export shipment',
    'Cement supply – 500MT',
    'Office equipment & IT hardware',
    'Logistics & warehousing services',
    'Agricultural machinery parts',
    'Construction material – Phase 2',
    'Software licensing & support',
    'Fuel supply contract Q2',
    'Packaging materials – bulk order',
  ];

  const invoices: Invoice[] = [];
  for (let i = 0; i < 104; i++) {
    const supplier = suppliers[i % suppliers.length];
    const buyer = buyers[i % buyers.length];
    const status = statuses[i % statuses.length];
    const amount = Math.round((500000 + Math.random() * 9500000) / 1000) * 1000;
    const issueDate = new Date(2025, 8 + Math.floor(i / 20), 1 + (i % 28));
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 60 + Math.floor(Math.random() * 30));

    invoices.push({
      id: `inv-${String(i + 1).padStart(4, '0')}`,
      iouRegistryId: `IOU-KE-${String(2025)}${String(i + 1).padStart(5, '0')}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      buyerId: buyer.id,
      buyerName: buyer.name,
      invoiceNumber: `INV-${supplier.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
      amount,
      currency: 'KES',
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      description: descriptions[i % descriptions.length],
      status,
      listedAt: ['listed', 'verified', 'offer_received', 'offer_accepted', 'assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(status)
        ? new Date(issueDate.getTime() + 86400000).toISOString() : undefined,
      verifiedAt: ['verified', 'offer_received', 'offer_accepted', 'assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(status)
        ? new Date(issueDate.getTime() + 86400000 * 3).toISOString() : undefined,
      createdAt: issueDate.toISOString(),
    });
  }
  return invoices;
}

function generateOffers(invoices: Invoice[]): PurchaseOffer[] {
  const offers: PurchaseOffer[] = [];
  const eligibleInvoices = invoices.filter(inv =>
    ['offer_received', 'offer_accepted', 'assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(inv.status)
  );

  eligibleInvoices.forEach((inv, idx) => {
    const discountRate = 3 + Math.random() * 5;
    const offerPrice = Math.round(inv.amount * (1 - discountRate / 100));
    const tenor = Math.round((new Date(inv.dueDate).getTime() - new Date(inv.issueDate).getTime()) / 86400000);
    const accepted = ['offer_accepted', 'assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(inv.status);

    offers.push({
      id: `offer-${String(idx + 1).padStart(4, '0')}`,
      invoiceId: inv.id,
      iouRegistryId: inv.iouRegistryId,
      spvId: 'org-spv-1',
      spvName: 'AFIX Capital SPV',
      supplierId: inv.supplierId,
      supplierName: inv.supplierName,
      faceValue: inv.amount,
      offerPrice,
      discountRate: Math.round(discountRate * 100) / 100,
      tenor,
      status: accepted ? 'accepted' : 'pending',
      expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      createdAt: new Date(new Date(inv.createdAt).getTime() + 4 * 86400000).toISOString(),
      respondedAt: accepted ? new Date(new Date(inv.createdAt).getTime() + 5 * 86400000).toISOString() : undefined,
    });
  });
  return offers;
}

function generateConsents(invoices: Invoice[]): AssignmentConsent[] {
  const consents: AssignmentConsent[] = [];
  const eligible = invoices.filter(inv =>
    ['assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(inv.status)
  );

  eligible.forEach((inv, idx) => {
    consents.push({
      id: `consent-${String(idx + 1).padStart(4, '0')}`,
      invoiceId: inv.id,
      iouRegistryId: inv.iouRegistryId,
      buyerId: inv.buyerId,
      buyerName: inv.buyerName,
      supplierId: inv.supplierId,
      supplierName: inv.supplierName,
      spvId: 'org-spv-1',
      amount: inv.amount,
      status: 'signed',
      requestedAt: new Date(new Date(inv.createdAt).getTime() + 6 * 86400000).toISOString(),
      respondedAt: new Date(new Date(inv.createdAt).getTime() + 7 * 86400000).toISOString(),
    });
  });
  return consents;
}

function generatePayments(invoices: Invoice[]): Payment[] {
  const payments: Payment[] = [];
  const eligible = invoices.filter(inv =>
    ['assigned', 'packaged', 'disbursed', 'matured', 'settled'].includes(inv.status)
  );

  eligible.forEach((inv, idx) => {
    const isPaid = inv.status === 'settled';
    const isOverdue = inv.status === 'matured';
    payments.push({
      id: `pay-${String(idx + 1).padStart(4, '0')}`,
      invoiceId: inv.id,
      buyerId: inv.buyerId,
      buyerName: inv.buyerName,
      amount: inv.amount,
      dueDate: inv.dueDate,
      paidAt: isPaid ? new Date(new Date(inv.dueDate).getTime() - 2 * 86400000).toISOString() : undefined,
      status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'upcoming',
    });
  });
  return payments;
}

function generatePackages(invoices: Invoice[]): SecuritisationPackage[] {
  const packaged = invoices.filter(inv =>
    ['packaged', 'disbursed', 'matured', 'settled'].includes(inv.status)
  );

  const packages: SecuritisationPackage[] = [];
  for (let i = 0; i < Math.ceil(packaged.length / 5); i++) {
    const batch = packaged.slice(i * 5, (i + 1) * 5);
    const totalFace = batch.reduce((sum, inv) => sum + inv.amount, 0);
    packages.push({
      id: `pkg-${String(i + 1).padStart(3, '0')}`,
      name: `AFIX USP Series ${i + 1}`,
      spvId: 'org-spv-1',
      invoiceIds: batch.map(b => b.id),
      totalFaceValue: totalFace,
      weightedAvgDiscount: 4.5 + Math.random() * 2,
      weightedAvgTenor: 75 + Math.floor(Math.random() * 15),
      status: i === 0 ? 'draft' : i === 1 ? 'structured' : 'listed',
      createdAt: new Date(2026, 0, 10 + i * 7).toISOString(),
      listedAt: i > 1 ? new Date(2026, 0, 15 + i * 7).toISOString() : undefined,
    });
  }
  return packages;
}

export const seedInvoices = generateInvoices();
export const seedOffers = generateOffers(seedInvoices);
export const seedConsents = generateConsents(seedInvoices);
export const seedPayments = generatePayments(seedInvoices);
export const seedPackages = generatePackages(seedInvoices);

export const seedNotifications: Notification[] = [
  { id: 'notif-1', userId: 'user-supplier-1', title: 'Offer Received', message: 'AFIX Capital SPV made an offer on INV-SAV-0006 at 5.2% discount.', type: 'info', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), link: '/supplier/invoices' },
  { id: 'notif-2', userId: 'user-supplier-1', title: 'Invoice Verified', message: 'INV-SAV-0003 has been verified by the buyer.', type: 'success', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), link: '/supplier/invoices' },
  { id: 'notif-3', userId: 'user-buyer-1', title: 'Assignment Consent Required', message: 'Please review and sign assignment consent for IOU-KE-202500001.', type: 'warning', read: false, createdAt: new Date(Date.now() - 7200000).toISOString(), link: '/buyer/consent' },
  { id: 'notif-4', userId: 'user-spv-1', title: 'New Listing Available', message: '12 new verified invoices available in the IOU Registry.', type: 'info', read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), link: '/spv/registry' },
  { id: 'notif-5', userId: 'user-admin-1', title: 'Platform Alert', message: '3 invoices approaching maturity date within 7 days.', type: 'warning', read: false, createdAt: new Date(Date.now() - 900000).toISOString(), link: '/admin/invoices' },
];

export const seedActivityLogs: ActivityLog[] = [
  { id: 'log-1', userId: 'user-supplier-1', userName: 'James Mwangi', action: 'Listed invoice', entityType: 'invoice', entityId: 'inv-0001', details: 'Listed INV-SAV-0001 for KES 2,500,000', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'log-2', userId: 'user-spv-1', userName: 'David Ochieng', action: 'Made offer', entityType: 'offer', entityId: 'offer-0001', details: 'Offered 95.2% face value on INV-SAV-0001', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'log-3', userId: 'user-buyer-1', userName: 'Grace Wanjiku', action: 'Signed consent', entityType: 'consent', entityId: 'consent-0001', details: 'Approved assignment for IOU-KE-202500001', timestamp: new Date(Date.now() - 1800000).toISOString() },
  { id: 'log-4', userId: 'user-admin-1', userName: 'Sarah Kimani', action: 'Approved user', entityType: 'user', entityId: 'user-supplier-2', details: 'Activated Highland Logistics account', timestamp: new Date(Date.now() - 900000).toISOString() },
];
