// ==========================================
// FIREBASE DATABASE SERVICES
// ==========================================

import {
  ref,
  set,
  get,
  update,
  remove,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  DataSnapshot } from
'firebase/database';
import { database, isFirebaseConfigured } from './firebase';
import {
  Client,
  ClientFormData,
  Project,
  TeamMember,
  Invoice,
  Notification,
  ApiResponse } from
'../types';

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const generateAccessCode = (): string => {
  const year = new Date().getFullYear();
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRJ-${year}-${randomPart}`;
};

const generateId = (): string => {
  return push(ref(database, 'temp')).key || Date.now().toString();
};

// ==========================================
// CLIENT SERVICES
// ==========================================

export const clientService = {
  // Create a new client
  async create(formData: ClientFormData): Promise<ApiResponse<Client>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const clientId = generateId();
      const accessCode = generateAccessCode();
      const now = Date.now();

      const client: Client = {
        id: clientId,
        accessCode,
        name: formData.clientName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        status: 'Active',
        projectIds: [],
        createdAt: now,
        updatedAt: now
      };

      // Save client
      await set(ref(database, `clients/${clientId}`), client);

      // Save access code mapping for quick lookup
      await set(ref(database, `accessCodes/${accessCode}`), { clientId });

      // Create initial project if project name provided
      if (formData.projectName) {
        const projectId = generateId();
        const project: Project = {
          id: projectId,
          clientId,
          name: formData.projectName,
          description: '',
          status: 'Planning',
          progress: 0,
          startDate: new Date().toISOString().split('T')[0],
          dueDate: '',
          budget: 0,
          teamIds: formData.team,
          milestones: [],
          documents: [],
          createdAt: now,
          updatedAt: now
        };

        await set(ref(database, `projects/${projectId}`), project);

        // Update client with project reference
        await update(ref(database, `clients/${clientId}`), {
          projectIds: [projectId]
        });
      }

      return { success: true, data: client };
    } catch (error) {
      console.error('Error creating client:', error);
      return { success: false, error: 'Failed to create client' };
    }
  },

  // Get all clients
  async getAll(): Promise<ApiResponse<Client[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'clients'));
      if (snapshot.exists()) {
        const clients = Object.values(snapshot.val()) as Client[];
        return { success: true, data: clients };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { success: false, error: 'Failed to fetch clients' };
    }
  },

  // Get client by ID
  async getById(clientId: string): Promise<ApiResponse<Client>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, `clients/${clientId}`));
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() as Client };
      }
      return { success: false, error: 'Client not found' };
    } catch (error) {
      console.error('Error fetching client:', error);
      return { success: false, error: 'Failed to fetch client' };
    }
  },

  // Get client by access code (for client login)
  async getByAccessCode(accessCode: string): Promise<ApiResponse<Client>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      // First, look up the clientId from accessCodes
      const codeSnapshot = await get(ref(database, `accessCodes/${accessCode}`));
      if (!codeSnapshot.exists()) {
        return { success: false, error: 'Invalid access code' };
      }

      const { clientId } = codeSnapshot.val();
      return this.getById(clientId);
    } catch (error) {
      console.error('Error fetching client by access code:', error);
      return { success: false, error: 'Failed to verify access code' };
    }
  },

  // Update client
  async update(
  clientId: string,
  updates: Partial<Client>)
  : Promise<ApiResponse<Client>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      await update(ref(database, `clients/${clientId}`), updateData);
      return this.getById(clientId);
    } catch (error) {
      console.error('Error updating client:', error);
      return { success: false, error: 'Failed to update client' };
    }
  },

  // Delete client
  async delete(clientId: string): Promise<ApiResponse<void>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      // Get client to find access code
      const clientSnapshot = await get(ref(database, `clients/${clientId}`));
      if (clientSnapshot.exists()) {
        const client = clientSnapshot.val() as Client;

        // Delete access code mapping
        await remove(ref(database, `accessCodes/${client.accessCode}`));

        // Delete associated projects
        for (const projectId of client.projectIds || []) {
          await remove(ref(database, `projects/${projectId}`));
        }
      }

      // Delete client
      await remove(ref(database, `clients/${clientId}`));

      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return { success: false, error: 'Failed to delete client' };
    }
  },

  // Subscribe to clients (real-time updates)
  subscribe(callback: (clients: Client[]) => void): () => void {
    const clientsRef = ref(database, 'clients');

    const unsubscribe = onValue(clientsRef, (snapshot) => {
      if (snapshot.exists()) {
        const clients = Object.values(snapshot.val()) as Client[];
        callback(clients);
      } else {
        callback([]);
      }
    });

    return () => off(clientsRef);
  }
};

// ==========================================
// PROJECT SERVICES
// ==========================================

export const projectService = {
  // Create a new project
  async create(
  project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>)
  : Promise<ApiResponse<Project>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const projectId = generateId();
      const now = Date.now();

      const newProject: Project = {
        ...project,
        id: projectId,
        createdAt: now,
        updatedAt: now
      };

      await set(ref(database, `projects/${projectId}`), newProject);

      // Update client's projectIds
      const clientSnapshot = await get(
        ref(database, `clients/${project.clientId}`)
      );
      if (clientSnapshot.exists()) {
        const client = clientSnapshot.val() as Client;
        const projectIds = [...(client.projectIds || []), projectId];
        await update(ref(database, `clients/${project.clientId}`), {
          projectIds
        });
      }

      return { success: true, data: newProject };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: 'Failed to create project' };
    }
  },

  // Get all projects
  async getAll(): Promise<ApiResponse<Project[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'projects'));
      if (snapshot.exists()) {
        const projects = Object.values(snapshot.val()) as Project[];
        return { success: true, data: projects };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching projects:', error);
      return { success: false, error: 'Failed to fetch projects' };
    }
  },

  // Get project by ID
  async getById(projectId: string): Promise<ApiResponse<Project>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, `projects/${projectId}`));
      if (snapshot.exists()) {
        return { success: true, data: snapshot.val() as Project };
      }
      return { success: false, error: 'Project not found' };
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, error: 'Failed to fetch project' };
    }
  },

  // Get projects by client ID
  async getByClientId(clientId: string): Promise<ApiResponse<Project[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'projects'));
      if (snapshot.exists()) {
        const allProjects = Object.values(snapshot.val()) as Project[];
        const clientProjects = allProjects.filter(
          (p) => p.clientId === clientId
        );
        return { success: true, data: clientProjects };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching client projects:', error);
      return { success: false, error: 'Failed to fetch projects' };
    }
  },

  // Update project
  async update(
  projectId: string,
  updates: Partial<Project>)
  : Promise<ApiResponse<Project>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: Date.now()
      };
      await update(ref(database, `projects/${projectId}`), updateData);
      return this.getById(projectId);
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: 'Failed to update project' };
    }
  },

  // Update project progress
  async updateProgress(
  projectId: string,
  progress: number)
  : Promise<ApiResponse<Project>> {
    return this.update(projectId, { progress });
  },

  // Update project status
  async updateStatus(
  projectId: string,
  status: Project['status'])
  : Promise<ApiResponse<Project>> {
    return this.update(projectId, { status });
  },

  // Delete project
  async delete(projectId: string): Promise<ApiResponse<void>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      // Get project to find client
      const projectSnapshot = await get(ref(database, `projects/${projectId}`));
      if (projectSnapshot.exists()) {
        const project = projectSnapshot.val() as Project;

        // Update client's projectIds
        const clientSnapshot = await get(
          ref(database, `clients/${project.clientId}`)
        );
        if (clientSnapshot.exists()) {
          const client = clientSnapshot.val() as Client;
          const projectIds = (client.projectIds || []).filter(
            (id) => id !== projectId
          );
          await update(ref(database, `clients/${project.clientId}`), {
            projectIds
          });
        }
      }

      await remove(ref(database, `projects/${projectId}`));
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: 'Failed to delete project' };
    }
  },

  // Subscribe to projects (real-time updates)
  subscribe(callback: (projects: Project[]) => void): () => void {
    const projectsRef = ref(database, 'projects');

    onValue(projectsRef, (snapshot) => {
      if (snapshot.exists()) {
        const projects = Object.values(snapshot.val()) as Project[];
        callback(projects);
      } else {
        callback([]);
      }
    });

    return () => off(projectsRef);
  }
};

// ==========================================
// TEAM MEMBER SERVICES
// ==========================================

export const teamService = {
  // Get all team members
  async getAll(): Promise<ApiResponse<TeamMember[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'teamMembers'));
      if (snapshot.exists()) {
        const members = Object.values(snapshot.val()) as TeamMember[];
        return { success: true, data: members };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching team members:', error);
      return { success: false, error: 'Failed to fetch team members' };
    }
  },

  // Create team member
  async create(
  member: Omit<TeamMember, 'id'>)
  : Promise<ApiResponse<TeamMember>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const memberId = generateId();
      const newMember: TeamMember = {
        ...member,
        id: memberId
      };

      await set(ref(database, `teamMembers/${memberId}`), newMember);
      return { success: true, data: newMember };
    } catch (error) {
      console.error('Error creating team member:', error);
      return { success: false, error: 'Failed to create team member' };
    }
  },

  // Subscribe to team members
  subscribe(callback: (members: TeamMember[]) => void): () => void {
    const membersRef = ref(database, 'teamMembers');

    onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) {
        const members = Object.values(snapshot.val()) as TeamMember[];
        callback(members);
      } else {
        callback([]);
      }
    });

    return () => off(membersRef);
  }
};

// ==========================================
// INVOICE SERVICES
// ==========================================

export const invoiceService = {
  // Create invoice
  async create(
  invoice: Omit<Invoice, 'id' | 'createdAt'>)
  : Promise<ApiResponse<Invoice>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const invoiceId = `INV-${String(Date.now()).slice(-6)}`;
      const newInvoice: Invoice = {
        ...invoice,
        id: invoiceId,
        createdAt: Date.now()
      };

      await set(ref(database, `invoices/${invoiceId}`), newInvoice);
      return { success: true, data: newInvoice };
    } catch (error) {
      console.error('Error creating invoice:', error);
      return { success: false, error: 'Failed to create invoice' };
    }
  },

  // Get all invoices
  async getAll(): Promise<ApiResponse<Invoice[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'invoices'));
      if (snapshot.exists()) {
        const invoices = Object.values(snapshot.val()) as Invoice[];
        return { success: true, data: invoices };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return { success: false, error: 'Failed to fetch invoices' };
    }
  },

  // Get invoices by client ID
  async getByClientId(clientId: string): Promise<ApiResponse<Invoice[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'invoices'));
      if (snapshot.exists()) {
        const allInvoices = Object.values(snapshot.val()) as Invoice[];
        const clientInvoices = allInvoices.filter(
          (i) => i.clientId === clientId
        );
        return { success: true, data: clientInvoices };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      return { success: false, error: 'Failed to fetch invoices' };
    }
  },

  // Update invoice status
  async updateStatus(
  invoiceId: string,
  status: Invoice['status'])
  : Promise<ApiResponse<Invoice>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      await update(ref(database, `invoices/${invoiceId}`), { status });
      const snapshot = await get(ref(database, `invoices/${invoiceId}`));
      return { success: true, data: snapshot.val() as Invoice };
    } catch (error) {
      console.error('Error updating invoice:', error);
      return { success: false, error: 'Failed to update invoice' };
    }
  },

  // Subscribe to invoices
  subscribe(callback: (invoices: Invoice[]) => void): () => void {
    const invoicesRef = ref(database, 'invoices');

    onValue(invoicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const invoices = Object.values(snapshot.val()) as Invoice[];
        callback(invoices);
      } else {
        callback([]);
      }
    });

    return () => off(invoicesRef);
  }
};

// ==========================================
// NOTIFICATION SERVICES
// ==========================================

export const notificationService = {
  // Create notification
  async create(
  notification: Omit<Notification, 'id' | 'createdAt'>)
  : Promise<ApiResponse<Notification>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const notificationId = generateId();
      const newNotification: Notification = {
        ...notification,
        id: notificationId,
        createdAt: Date.now()
      };

      await set(
        ref(database, `notifications/${notificationId}`),
        newNotification
      );
      return { success: true, data: newNotification };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: 'Failed to create notification' };
    }
  },

  // Get notifications by user ID
  async getByUserId(userId: string): Promise<ApiResponse<Notification[]>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'notifications'));
      if (snapshot.exists()) {
        const allNotifications = Object.values(snapshot.val()) as Notification[];
        const userNotifications = allNotifications.
        filter((n) => n.userId === userId).
        sort((a, b) => b.createdAt - a.createdAt);
        return { success: true, data: userNotifications };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { success: false, error: 'Failed to fetch notifications' };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      await update(ref(database, `notifications/${notificationId}`), {
        read: true
      });
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: 'Failed to update notification' };
    }
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      const snapshot = await get(ref(database, 'notifications'));
      if (snapshot.exists()) {
        const updates: Record<string, any> = {};
        Object.entries(snapshot.val()).forEach(([id, notification]) => {
          const notif = notification as Notification;
          if (notif.userId === userId && !notif.read) {
            updates[`notifications/${id}/read`] = true;
          }
        });
        if (Object.keys(updates).length > 0) {
          await update(ref(database), updates);
        }
      }
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: 'Failed to update notifications' };
    }
  },

  // Delete notification
  async delete(notificationId: string): Promise<ApiResponse<void>> {
    if (!isFirebaseConfigured()) {
      return { success: false, error: 'Firebase not configured' };
    }

    try {
      await remove(ref(database, `notifications/${notificationId}`));
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  }
};

// ==========================================
// SEED DATA FUNCTION (for initial setup)
// ==========================================

export const seedInitialData = async (): Promise<void> => {
  if (!isFirebaseConfigured()) {
    console.warn('Firebase not configured. Skipping seed.');
    return;
  }

  // Check if data already exists
  const clientsSnapshot = await get(ref(database, 'clients'));
  if (clientsSnapshot.exists()) {
    console.log('Data already exists. Skipping seed.');
    return;
  }

  console.log('Seeding initial data...');

  // Seed team members
  const teamMembers: Omit<TeamMember, 'id'>[] = [
  {
    name: 'Alex Morgan',
    role: 'Project Manager',
    email: 'alex@toiral.com',
    projectCount: 3
  },
  {
    name: 'Sam Wilson',
    role: 'Lead Developer',
    email: 'sam@toiral.com',
    projectCount: 5
  },
  {
    name: 'Jordan Lee',
    role: 'UI Designer',
    email: 'jordan@toiral.com',
    projectCount: 2
  },
  {
    name: 'Casey Brown',
    role: 'Backend Dev',
    email: 'casey@toiral.com',
    projectCount: 4
  }];


  for (const member of teamMembers) {
    await teamService.create(member);
  }

  console.log('Initial data seeded successfully!');
};