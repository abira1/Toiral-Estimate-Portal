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
  // State
  const [clients, setClients] = useState<Client[]>(
    isFirebaseReady ? [] : MOCK_CLIENTS
  );
  const [clientsLoading, setClientsLoading] = useState(isFirebaseReady);
  const [projects, setProjects] = useState<Project[]>(
    isFirebaseReady ? [] : MOCK_PROJECTS
  );
  const [projectsLoading, setProjectsLoading] = useState(isFirebaseReady);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    isFirebaseReady ? [] : MOCK_TEAM_MEMBERS
  );
  const [teamLoading, setTeamLoading] = useState(isFirebaseReady);
  const [invoices, setInvoices] = useState<Invoice[]>(
    isFirebaseReady ? [] : MOCK_INVOICES
  );
  const [invoicesLoading, setInvoicesLoading] = useState(isFirebaseReady);
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
        // Mock mode: create locally
        const newClient: Client = {
          id: String(Date.now()),
          accessCode: `PRJ-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
          name: formData.clientName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          status: 'Active',
          projectIds: [],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        setClients((prev) => [...prev, newClient]);
        return {
          success: true,
          client: newClient
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
        setClients((prev) =>
        prev.map((c) =>
        c.id === clientId ?
        {
          ...c,
          ...updates,
          updatedAt: Date.now()
        } :
        c
        )
        );
        return true;
      }
      const response = await clientService.update(clientId, updates);
      return response.success;
    },
    [isFirebaseReady]
  );
  const deleteClient = useCallback(
    async (clientId: string): Promise<boolean> => {
      if (!isFirebaseReady) {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
        setProjects((prev) => prev.filter((p) => p.clientId !== clientId));
        return true;
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
        const newProject: Project = {
          ...project,
          id: String(Date.now()),
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        setProjects((prev) => [...prev, newProject]);
        return {
          success: true,
          project: newProject
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
        setProjects((prev) =>
        prev.map((p) =>
        p.id === projectId ?
        {
          ...p,
          ...updates,
          updatedAt: Date.now()
        } :
        p
        )
        );
        return true;
      }
      const response = await projectService.update(projectId, updates);
      return response.success;
    },
    [isFirebaseReady]
  );
  const deleteProject = useCallback(
    async (projectId: string): Promise<boolean> => {
      if (!isFirebaseReady) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        return true;
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
        const newInvoice: Invoice = {
          ...invoice,
          id: `INV-${String(Date.now()).slice(-6)}`,
          createdAt: Date.now()
        };
        setInvoices((prev) => [...prev, newInvoice]);
        return true;
      }
      const response = await invoiceService.create(invoice);
      return response.success;
    },
    [isFirebaseReady]
  );
  const updateInvoiceStatus = useCallback(
    async (invoiceId: string, status: Invoice['status']): Promise<boolean> => {
      if (!isFirebaseReady) {
        setInvoices((prev) =>
        prev.map((i) =>
        i.id === invoiceId ?
        {
          ...i,
          status
        } :
        i
        )
        );
        return true;
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
        setNotifications((prev) =>
        prev.map((n) =>
        n.id === notificationId ?
        {
          ...n,
          read: true
        } :
        n
        )
        );
        return;
      }
      await notificationService.markAsRead(notificationId);
    },
    [isFirebaseReady]
  );
  const markAllNotificationsAsRead = useCallback(
    async (userId: string): Promise<void> => {
      if (!isFirebaseReady) {
        setNotifications((prev) =>
        prev.map((n) =>
        n.userId === userId ?
        {
          ...n,
          read: true
        } :
        n
        )
        );
        return;
      }
      await notificationService.markAllAsRead(userId);
    },
    [isFirebaseReady]
  );
  const deleteNotification = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!isFirebaseReady) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
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