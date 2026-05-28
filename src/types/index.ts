export type UserRole = 'supplier' | 'buyer' | 'spv' | 'admin';

export type InvoiceStatus =
  | 'draft'
  | 'listed'
  | 'verified'
  | 'offer_received'
  | 'offer_accepted'
  | 'assigned'
  | 'packaged'
  | 'disbursed'
  | 'matured'
  | 'settled'
  | 'defaulted';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';

export type ConsentStatus = 'pending' | 'signed' | 'rejected';

export type PackageStatus = 'draft' | 'structured' | 'listed' | 'placed';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organisationId: string;
  organisationName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Organisation {
  id: string;
  name: string;
  type: 'supplier' | 'buyer' | 'spv';
  sector?: string;
  registrationNumber?: string;
  contactEmail: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export interface Invoice {
  id: string;
  iouRegistryId: string;
  supplierId: string;
  supplierName: string;
  buyerId: string;
  buyerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  issueDate: string;
  dueDate: string;
  description: string;
  status: InvoiceStatus;
  listedAt?: string;
  verifiedAt?: string;
  documents?: string[];
  createdAt: string;
}

export interface PurchaseOffer {
  id: string;
  invoiceId: string;
  iouRegistryId: string;
  spvId: string;
  spvName: string;
  supplierId: string;
  supplierName: string;
  faceValue: number;
  offerPrice: number;
  discountRate: number;
  tenor: number;
  status: OfferStatus;
  expiresAt: string;
  createdAt: string;
  respondedAt?: string;
}

export interface AssignmentConsent {
  id: string;
  invoiceId: string;
  iouRegistryId: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  spvId: string;
  amount: number;
  status: ConsentStatus;
  requestedAt: string;
  respondedAt?: string;
}

export interface SecuritisationPackage {
  id: string;
  name: string;
  spvId: string;
  invoiceIds: string[];
  totalFaceValue: number;
  weightedAvgDiscount: number;
  weightedAvgTenor: number;
  status: PackageStatus;
  createdAt: string;
  listedAt?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  status: 'upcoming' | 'due' | 'overdue' | 'paid';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'invoice' | 'offer' | 'consent' | 'package' | 'payment' | 'user';
  entityId: string;
  details?: string;
  timestamp: string;
}
