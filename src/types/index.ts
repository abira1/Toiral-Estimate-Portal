// ==========================================
// CORE DATA TYPES FOR FIREBASE INTEGRATION
// ==========================================

// Client Types
export interface Client {
  id: string;
  accessCode: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  status: 'Active' | 'Pending' | 'Inactive';
  projectIds: string[];
  createdAt: number;
  updatedAt: number;
}

// Project Category Types
export type ProjectCategory = 
  | 'Website Development'
  | 'Mobile App'
  | 'E-commerce'
  | 'Branding'
  | 'Marketing'
  | 'UI/UX Design'
  | 'Custom';

// Phase Types
export interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  deliverables: string;
  description?: string;
}

// Payment Milestone Types
export interface PaymentMilestone {
  id: string;
  name: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  paidDate?: string;
  notes?: string;
}

// Financial Details
export interface FinancialDetails {
  totalCost: number;
  currency: string;
  paymentMilestones: PaymentMilestone[];
  totalPaid: number;
  balance: number;
  // Payment approval workflow
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'change_requested';
  changeRequest?: string;
  approvedAt?: number;
  rejectedAt?: number;
  changeRequestedAt?: number;
}

// Note/Log Types
export type NoteCategory = 'Client Decision' | 'Technical Note' | 'Meeting Note' | 'General Update';

export interface Note {
  id: string;
  category: NoteCategory;
  content: string;
  createdAt: number;
  createdBy: string;
  updatedAt?: number;
}

// Document Link Types
export type DocumentType = 'Screenshot' | 'Quotation' | 'Invoice' | 'Contract' | 'Other';

export interface DocumentLink {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: number;
  uploadedBy: string;
  notes?: string;
}

export interface ClientFormData {
  // Client Info
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  
  // Project Details
  projectName: string;
  projectCategory: ProjectCategory;
  customCategory?: string;
  projectOverview: string;
  
  // Timeline & Phases
  phases: Phase[];
  
  // Financial
  financial: FinancialDetails;
  
  // Notes
  initialNotes: Note[];
  
  // Team
  team: string[];
}

// Project Types
export type ProjectStatus =
'Planning' |
'In Progress' |
'Review' |
'Completed' |
'Delayed';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: 'completed' | 'active' | 'pending';
  description?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  size: string;
  url: string;
  uploadedAt: number;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  category: ProjectCategory;
  customCategory?: string;
  description: string;
  overview: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  teamIds: string[];
  
  // Enhanced fields
  phases: Phase[];
  financial: FinancialDetails;
  notes: Note[];
  documentLinks: DocumentLink[];
  
  // Legacy fields (keep for backward compatibility)
  milestones: Milestone[];
  documents: ProjectDocument[];
  
  createdAt: number;
  updatedAt: number;
}

// Team Member Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  projectCount: number;
}

// Invoice Types
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  clientId: string;
  projectId: string;
  clientName: string;
  projectName: string;
  amount: number;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  createdAt: number;
}

// Notification Types
export type NotificationType =
'project_update' |
'approval_request' |
'payment' |
'system' |
'alert';

export interface Notification {
  id: string;
  userId: string; // clientId or 'admin'
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: number;
}

// Auth Types
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface ClientSession {
  clientId: string;
  accessCode: string;
  client: Client;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}