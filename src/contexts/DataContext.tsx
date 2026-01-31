import React, {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext } from
'react';
// ==========================================
// DATA CONTEXT - Centralized State Management
// ==========================================

import { isFirebaseConfigured } from '../lib/firebase';
import {
  clientService,
  projectService,
  teamService,
  invoiceService,
  notificationService } from
'../lib/firebaseServices';
import {
  Client,
  Project,
  TeamMember,
  Invoice,
  Notification,
  ClientFormData } from
'../types';

// ==========================================
// CONTEXT DEFINITION
// ==========================================
interface DataContextType {
  // Clients
  clients: Client[];
  clientsLoading: boolean;
  createClient: (formData: ClientFormData) => Promise<{
    success: boolean;
    client?: Client;
    error?: string;
  }>;
  updateClient: (clientId: string, updates: Partial<Client>) => Promise<boolean>;
  deleteClient: (clientId: string) => Promise<boolean>;
  getClientById: (clientId: string) => Client | undefined;
  getClientByAccessCode: (accessCode: string) => Client | undefined;
  // Projects
  projects: Project[];
  projectsLoading: boolean;
  createProject: (
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>)
  => Promise<{
    success: boolean;
    project?: Project;
  }>;
  updateProject: (
  projectId: string,
  updates: Partial<Project>)
  => Promise<boolean>;
  deleteProject: (projectId: string) => Promise<boolean>;
  getProjectById: (projectId: string) => Project | undefined;
  getProjectsByClientId: (clientId: string) => Project[];
  // Team Members
  teamMembers: TeamMember[];
  teamLoading: boolean;
  // Invoices
  invoices: Invoice[];
  invoicesLoading: boolean;
  createInvoice: (
  invoice: Omit<Invoice, 'id' | 'createdAt'>)
  => Promise<boolean>;
  updateInvoiceStatus: (
  invoiceId: string,
  status: Invoice['status'])
  => Promise<boolean>;
  getInvoicesByClientId: (clientId: string) => Invoice[];
  // Notifications
  notifications: Notification[];
  notificationsLoading: boolean;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  // Refresh functions
  refreshClients: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshAll: () => Promise<void>;
  // Firebase status
  isFirebaseReady: boolean;
}
const DataContext = createContext<DataContextType | undefined>(undefined);
// ==========================================
// PROVIDER COMPONENT
// ==========================================
export function DataProvider({ children }: {children: ReactNode;}) {
  const isFirebaseReady = isFirebaseConfigured();

  // State - Initialize all as empty arrays since we're using real Firebase data
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  // ==========================================
  // DATA FETCHING & SUBSCRIPTIONS
  // ==========================================
  useEffect(() => {
    if (!isFirebaseReady) return;
    // Subscribe to real-time updates
    const unsubClients = clientService.subscribe(setClients);
    const unsubProjects = projectService.subscribe(setProjects);
    const unsubTeam = teamService.subscribe(setTeamMembers);
    const unsubInvoices = invoiceService.subscribe(setInvoices);
    setClientsLoading(false);
    setProjectsLoading(false);
    setTeamLoading(false);
    setInvoicesLoading(false);
    return () => {
      unsubClients();
      unsubProjects();
      unsubTeam();
      unsubInvoices();
    };
  }, [isFirebaseReady]);
  // ==========================================
  // CLIENT OPERATIONS
  // ==========================================
  const createClient = useCallback(
    async (
    formData: ClientFormData)
    : Promise<{
      success: boolean;
      client?: Client;
      error?: string;
    }> => {
      if (!isFirebaseReady) {
        return {
          success: false,
          error: 'Firebase not configured'
        };
      }

      const response = await clientService.create(formData);
      return {
        success: response.success,
        client: response.data,
        error: response.error
      };
    },
    [isFirebaseReady]
  );
  const updateClient = useCallback(
    async (clientId: string, updates: Partial<Client>): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await clientService.update(clientId, updates);
      return response.success;
    },
    [isFirebaseReady]
  );

  const deleteClient = useCallback(
    async (clientId: string): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await clientService.delete(clientId);
      return response.success;
    },
    [isFirebaseReady]
  );
  const getClientById = useCallback(
    (clientId: string): Client | undefined => {
      return clients.find((c) => c.id === clientId);
    },
    [clients]
  );
  const getClientByAccessCode = useCallback(
    (accessCode: string): Client | undefined => {
      return clients.find(
        (c) => c.accessCode.toUpperCase() === accessCode.toUpperCase()
      );
    },
    [clients]
  );
  // ==========================================
  // PROJECT OPERATIONS
  // ==========================================
  const createProject = useCallback(
    async (
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>)
    : Promise<{
      success: boolean;
      project?: Project;
    }> => {
      if (!isFirebaseReady) {
        return {
          success: false
        };
      }
      const response = await projectService.create(project);
      return {
        success: response.success,
        project: response.data
      };
    },
    [isFirebaseReady]
  );

  const updateProject = useCallback(
    async (projectId: string, updates: Partial<Project>): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await projectService.update(projectId, updates);
      return response.success;
    },
    [isFirebaseReady]
  );

  const deleteProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await projectService.delete(projectId);
      return response.success;
    },
    [isFirebaseReady]
  );
  const getProjectById = useCallback(
    (projectId: string): Project | undefined => {
      return projects.find((p) => p.id === projectId);
    },
    [projects]
  );
  const getProjectsByClientId = useCallback(
    (clientId: string): Project[] => {
      return projects.filter((p) => p.clientId === clientId);
    },
    [projects]
  );
  // ==========================================
  // INVOICE OPERATIONS
  // ==========================================
  const createInvoice = useCallback(
    async (invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await invoiceService.create(invoice);
      return response.success;
    },
    [isFirebaseReady]
  );

  const updateInvoiceStatus = useCallback(
    async (invoiceId: string, status: Invoice['status']): Promise<boolean> => {
      if (!isFirebaseReady) {
        return false;
      }
      const response = await invoiceService.updateStatus(invoiceId, status);
      return response.success;
    },
    [isFirebaseReady]
  );
  const getInvoicesByClientId = useCallback(
    (clientId: string): Invoice[] => {
      return invoices.filter((i) => i.clientId === clientId);
    },
    [invoices]
  );
  // ==========================================
  // NOTIFICATION OPERATIONS
  // ==========================================
  const markNotificationAsRead = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!isFirebaseReady) {
        return;
      }
      await notificationService.markAsRead(notificationId);
    },
    [isFirebaseReady]
  );

  const markAllNotificationsAsRead = useCallback(
    async (userId: string): Promise<void> => {
      if (!isFirebaseReady) {
        return;
      }
      await notificationService.markAllAsRead(userId);
    },
    [isFirebaseReady]
  );

  const deleteNotification = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!isFirebaseReady) {
        return;
      }
      await notificationService.delete(notificationId);
    },
    [isFirebaseReady]
  );
  // ==========================================
  // REFRESH FUNCTIONS
  // ==========================================
  const refreshClients = useCallback(async (): Promise<void> => {
    if (!isFirebaseReady) return;
    setClientsLoading(true);
    const response = await clientService.getAll();
    if (response.success && response.data) {
      setClients(response.data);
    }
    setClientsLoading(false);
  }, [isFirebaseReady]);
  const refreshProjects = useCallback(async (): Promise<void> => {
    if (!isFirebaseReady) return;
    setProjectsLoading(true);
    const response = await projectService.getAll();
    if (response.success && response.data) {
      setProjects(response.data);
    }
    setProjectsLoading(false);
  }, [isFirebaseReady]);
  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([refreshClients(), refreshProjects()]);
  }, [refreshClients, refreshProjects]);
  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value: DataContextType = {
    // Clients
    clients,
    clientsLoading,
    createClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientByAccessCode,
    // Projects
    projects,
    projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByClientId,
    // Team Members
    teamMembers,
    teamLoading,
    // Invoices
    invoices,
    invoicesLoading,
    createInvoice,
    updateInvoiceStatus,
    getInvoicesByClientId,
    // Notifications
    notifications,
    notificationsLoading,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    // Refresh
    refreshClients,
    refreshProjects,
    refreshAll,
    // Status
    isFirebaseReady
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
// ==========================================
// HOOK
// ==========================================
export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}