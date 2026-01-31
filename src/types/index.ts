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

export interface ClientFormData {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  projectName: string;
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
  description: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  dueDate: string;
  budget: number;
  teamIds: string[];
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