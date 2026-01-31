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
  MessageSquare } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
// Mock Data
const INITIAL_CLIENTS = [
{
  id: 1,
  name: 'Nike',
  contact: 'John Doe',
  email: 'john@nike.com',
  status: 'Active',
  projects: 3,
  dateAdded: '2023-09-15'
},
{
  id: 2,
  name: 'Uber',
  contact: 'Jane Smith',
  email: 'jane@uber.com',
  status: 'Pending',
  projects: 1,
  dateAdded: '2023-10-01'
},
{
  id: 3,
  name: 'Airbnb',
  contact: 'Mike Johnson',
  email: 'mike@airbnb.com',
  status: 'Active',
  projects: 2,
  dateAdded: '2023-08-20'
},
{
  id: 4,
  name: 'Netflix',
  contact: 'Sarah Connor',
  email: 'sarah@netflix.com',
  status: 'Inactive',
  projects: 0,
  dateAdded: '2023-11-05'
},
{
  id: 5,
  name: 'Spotify',
  contact: 'Alex Turner',
  email: 'alex@spotify.com',
  status: 'Active',
  projects: 5,
  dateAdded: '2023-07-12'
},
{
  id: 6,
  name: 'Slack',
  contact: 'Emily Blunt',
  email: 'emily@slack.com',
  status: 'Pending',
  projects: 1,
  dateAdded: '2023-10-25'
}];

type SortOption = 'name-asc' | 'name-desc' | 'projects-high' | 'date-newest';
type FilterStatus = 'All' | 'Active' | 'Pending' | 'Inactive';
export function ClientManagement() {
  const navigate = useNavigate();
  // State
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [filteredClients, setFilteredClients] = useState(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  // Filter and Sort Logic
  useEffect(() => {
    let result = [...clients];
    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (client) =>
        client.name.toLowerCase().includes(lowerTerm) ||
        client.contact.toLowerCase().includes(lowerTerm) ||
        client.email.toLowerCase().includes(lowerTerm)
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
          return b.projects - a.projects;
        case 'date-newest':
          return (
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

        default:
          return 0;
      }
    });
    setFilteredClients(result);
  }, [clients, searchTerm, filterStatus, sortOption]);
  // Handlers
  const handleDeleteClient = () => {
    if (clientToDelete) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete));
      setClientToDelete(null);
      setIsDeleteModalOpen(false);
      setActiveMenuId(null);
    }
  };
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
                onChange={(e) => setSearchTerm(e.target.value)} />

            </div>

            {/* Filters & Sort */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  className="appearance-none h-11 pl-10 pr-8 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary cursor-pointer"
                  value={filterStatus}
                  onChange={(e) =>
                  setFilterStatus(e.target.value as FilterStatus)
                  }>

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
                  onChange={(e) => setSortOption(e.target.value as SortOption)}>

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
        {filteredClients.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) =>
          <Card
            key={client.id}
            hoverable
            className="flex flex-col relative">

                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-toiral-light/30 flex items-center justify-center text-toiral-primary">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="relative">
                    <button
                  className="p-2 text-gray-400 hover:text-toiral-dark hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() =>
                  setActiveMenuId(
                    activeMenuId === client.id ? null : client.id
                  )
                  }>

                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Action Menu */}
                    {activeMenuId === client.id &&
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                        <button
                    onClick={() =>
                    navigate(`/admin/clients/${client.id}`)
                    }
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                          <Eye className="w-4 h-4" /> View Profile
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <Edit className="w-4 h-4" /> Edit Details
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Send Message
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    onClick={() => {
                      setClientToDelete(client.id);
                      setIsDeleteModalOpen(true);
                    }}>

                          <Trash2 className="w-4 h-4" /> Delete Client
                        </button>
                      </div>
                }
                  </div>
                </div>

                <h3 className="text-xl font-bold text-toiral-dark mb-1">
                  {client.name}
                </h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Mail className="w-4 h-4 mr-2" /> {client.email}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <Badge
                variant={
                client.status === 'Active' ?
                'success' :
                client.status === 'Pending' ?
                'warning' :
                'neutral'
                }>

                    {client.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    • {client.projects} Projects
                  </span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/admin/clients/${client.id}`)}>

                    View Profile
                  </Button>
                </div>
              </Card>
          )}
          </div> :

        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-toiral-dark mb-2">
              No clients found
            </h3>
            <p className="text-gray-500 max-w-md mb-8">
              We couldn't find any clients matching your search or filters. Try
              adjusting your criteria or add a new client.
            </p>
            <Button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('All');
            }}>

              Clear Filters
            </Button>
          </div>
        }

        {/* Add Client Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Client">

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddModalOpen(false);
              // Add client logic would go here
            }}>

            <Input label="Company Name" placeholder="e.g. Acme Corp" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contact Name" placeholder="John Doe" required />
              <Input
                label="Email"
                type="email"
                placeholder="john@example.com"
                required />

            </div>
            <Input label="Phone (Optional)" placeholder="+1 (555) 000-0000" />

            <div className="pt-4 flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddModalOpen(false)}>

                Cancel
              </Button>
              <Button type="submit">Create Client</Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Client">

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
            <Input placeholder="Type DELETE to confirm" />

            <div className="pt-4 flex gap-3 justify-end">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}>

                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteClient}>

                Delete Permanently
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>);

}