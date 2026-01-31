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
// MOCK DATA (used when Firebase is not configured)
// ==========================================
const MOCK_CLIENTS: Client[] = [
{
  id: '1',
  accessCode: 'PRJ-2024-NIKE',
  name: 'John Doe',
  companyName: 'Nike',
  email: 'john@nike.com',
  phone: '+1 555-0001',
  status: 'Active',
  projectIds: ['1'],
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now()
},
{
  id: '2',
  accessCode: 'PRJ-2024-UBER',
  name: 'Jane Smith',
  companyName: 'Uber',
  email: 'jane@uber.com',
  phone: '+1 555-0002',
  status: 'Pending',
  projectIds: ['2'],
  createdAt: Date.now() - 86400000 * 20,
  updatedAt: Date.now()
},
{
  id: '3',
  accessCode: 'PRJ-2024-AIRB',
  name: 'Mike Johnson',
  companyName: 'Airbnb',
  email: 'mike@airbnb.com',
  phone: '+1 555-0003',
  status: 'Active',
  projectIds: ['3'],
  createdAt: Date.now() - 86400000 * 45,
  updatedAt: Date.now()
}];

const MOCK_PROJECTS: Project[] = [
{
  id: '1',
  clientId: '1',
  name: 'E-commerce Redesign',
  description:
  'Complete overhaul of the main e-commerce platform including new UX/UI, React frontend, and headless CMS integration.',
  status: 'In Progress',
  progress: 65,
  startDate: '2024-09-01',
  dueDate: '2024-10-24',
  budget: 45000,
  teamIds: ['1', '2'],
  milestones: [
  {
    id: '1',
    title: 'Discovery',
    date: 'Sep 15',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Design',
    date: 'Oct 01',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Development',
    date: 'Oct 20',
    status: 'active'
  },
  {
    id: '4',
    title: 'Testing',
    date: 'Oct 24',
    status: 'pending'
  }],

  documents: [],
  createdAt: Date.now() - 86400000 * 30,
  updatedAt: Date.now()
},
{
  id: '2',
  clientId: '2',
  name: 'Mobile App MVP',
  description:
  'Build a minimum viable product for the ride-sharing mobile application.',
  status: 'Delayed',
  progress: 30,
  startDate: '2024-09-15',
  dueDate: '2024-11-12',
  budget: 35000,
  teamIds: ['2', '4'],
  milestones: [
  {
    id: '1',
    title: 'Planning',
    date: 'Sep 20',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Development',
    date: 'Oct 15',
    status: 'active'
  },
  {
    id: '3',
    title: 'Testing',
    date: 'Nov 01',
    status: 'pending'
  }],

  documents: [],
  createdAt: Date.now() - 86400000 * 20,
  updatedAt: Date.now()
},
{
  id: '3',
  clientId: '3',
  name: 'Marketing Site',
  description:
  'Create a new marketing website with modern design and animations.',
  status: 'Completed',
  progress: 100,
  startDate: '2024-08-01',
  dueDate: '2024-09-30',
  budget: 25000,
  teamIds: ['1', '3'],
  milestones: [
  {
    id: '1',
    title: 'Design',
    date: 'Aug 15',
    status: 'completed'
  },
  {
    id: '2',
    title: 'Development',
    date: 'Sep 15',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Launch',
    date: 'Sep 30',
    status: 'completed'
  }],

  documents: [],
  createdAt: Date.now() - 86400000 * 60,
  updatedAt: Date.now()
}];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
{
  id: '1',
  name: 'Alex Morgan',
  role: 'Project Manager',
  email: 'alex@toiral.com',
  projectCount: 3
},
{
  id: '2',
  name: 'Sam Wilson',
  role: 'Lead Developer',
  email: 'sam@toiral.com',
  projectCount: 5
},
{
  id: '3',
  name: 'Jordan Lee',
  role: 'UI Designer',
  email: 'jordan@toiral.com',
  projectCount: 2
},
{
  id: '4',
  name: 'Casey Brown',
  role: 'Backend Dev',
  email: 'casey@toiral.com',
  projectCount: 4
}];

const MOCK_INVOICES: Invoice[] = [
{
  id: 'INV-001',
  clientId: '1',
  projectId: '1',
  clientName: 'Nike',
  projectName: 'E-commerce Redesign',
  amount: 15000,
  status: 'Paid',
  date: '2024-10-01',
  dueDate: '2024-10-15',
  createdAt: Date.now()
},
{
  id: 'INV-002',
  clientId: '2',
  projectId: '2',
  clientName: 'Uber',
  projectName: 'Mobile App MVP',
  amount: 4500,
  status: 'Pending',
  date: '2024-10-15',
  dueDate: '2024-10-30',
  createdAt: Date.now()
},
{
  id: 'INV-003',
  clientId: '3',
  projectId: '3',
  clientName: 'Airbnb',
  projectName: 'Marketing Site',
  amount: 12000,
  status: 'Overdue',
  date: '2024-09-28',
  dueDate: '2024-10-12',
  createdAt: Date.now()
}];

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