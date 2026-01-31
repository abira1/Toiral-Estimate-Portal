import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Building,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit,
  Eye,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useData } from '../../contexts/DataContext';
import type { Client } from '../../types';

type SortOption = 'name-asc' | 'name-desc' | 'projects-high' | 'date-newest';
type FilterStatus = 'All' | 'Active' | 'Pending' | 'Inactive';

export function ClientManagement() {
  const navigate = useNavigate();
  const { clients, clientsLoading, deleteClient, getProjectsByClientId } = useData();
  
  // State
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  
  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Filter and Sort Logic
  useEffect(() => {
    let result = [...clients];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (client) =>
          client.name.toLowerCase().includes(lowerTerm) ||
          client.email.toLowerCase().includes(lowerTerm) ||
          (client.companyName && client.companyName.toLowerCase().includes(lowerTerm))
      );
    }

    // Filter
    if (filterStatus !== 'All') {
      result = result.filter((client) => client.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'projects-high':
          return (b.projectIds?.length || 0) - (a.projectIds?.length || 0);
        case 'date-newest':
          return b.createdAt - a.createdAt;
        default:
          return 0;
      }
    });

    setFilteredClients(result);
  }, [clients, searchTerm, filterStatus, sortOption]);

  // Handlers
  const handleDeleteClient = async () => {
    if (clientToDelete && deleteConfirmText === 'DELETE') {
      const success = await deleteClient(clientToDelete);
      if (success) {
        setClientToDelete(null);
        setIsDeleteModalOpen(false);
        setActiveMenuId(null);
        setDeleteConfirmText('');
      }
    }
  };

  const getProjectCount = (clientId: string) => {
    return getProjectsByClientId(clientId).length;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Show loading state
  if (clientsLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 relative min-h-[calc(100vh-100px)]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-toiral-dark">Clients</h1>
            <p className="text-gray-500 mt-1">
              Manage your client relationships and access.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/clients/new')}>
            <Plus className="w-4 h-4 mr-2" /> Add Client
          </Button>
        </div>

        {/* Controls Bar */}
        <Card className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search clients by name, contact, or email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="appearance-none h-11 pl-10 pr-8 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none h-11 pl-10 pr-8 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary cursor-pointer"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="projects-high">Projects (High-Low)</option>
                  <option value="date-newest">Date Added (Newest)</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-bold text-toiral-dark">
                {filteredClients.length}
              </span>{' '}
              clients
            </span>
          </div>
        </Card>

        {/* Client Grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} hoverable className="flex flex-col relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-toiral-light/30 flex items-center justify-center text-toiral-primary">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 text-gray-400 hover:text-toiral-dark hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setActiveMenuId(activeMenuId === client.id ? null : client.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Menu */}
                    {activeMenuId === client.id && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                        <button
                          onClick={() => navigate(`/admin/clients/${client.id}`)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" /> View Profile
                        </button>
                        <button 
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => window.location.href = `mailto:${client.email}`}
                        >
                          <MessageSquare className="w-4 h-4" /> Send Message
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => {
                            setClientToDelete(client.id);
                            setIsDeleteModalOpen(true);
                            setActiveMenuId(null);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete Client
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-toiral-dark mb-1">
                  {client.name}
                </h3>
                {client.companyName && (
                  <p className="text-sm text-gray-500 mb-2">{client.companyName}</p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Mail className="w-4 h-4 mr-2" /> {client.email}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant={
                      client.status === 'Active'
                        ? 'success'
                        : client.status === 'Pending'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {client.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    • {getProjectCount(client.id)} Projects
                  </span>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  Added {formatDate(client.createdAt)}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-toiral-dark mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 max-w-md mb-8">
              {clients.length === 0
                ? "You haven't added any clients yet. Click 'Add Client' to get started."
                : "We couldn't find any clients matching your search or filters. Try adjusting your criteria."}
            </p>
            {clients.length === 0 ? (
              <Button onClick={() => navigate('/admin/clients/new')}>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Client
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('All');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteConfirmText('');
          }}
          title="Delete Client"
        >
          <div className="space-y-4">
            <div className="bg-red-50 text-red-800 p-4 rounded-xl flex gap-3 items-start">
              <Trash2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">
                  Warning: This action cannot be undone
                </p>
                <p className="text-sm mt-1 opacity-90">
                  This will permanently delete the client and all associated
                  projects, invoices, and data.
                </p>
              </div>
            </div>

            <p className="text-gray-600">
              Are you sure you want to delete this client? Please type{' '}
              <span className="font-bold select-all">DELETE</span> to confirm.
            </p>
            <Input 
              placeholder="Type DELETE to confirm" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
            />

            <div className="pt-4 flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteConfirmText('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteClient}
                disabled={deleteConfirmText !== 'DELETE'}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>

        {/* Click outside to close menu */}
        {activeMenuId && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setActiveMenuId(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
