import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Mail,
  Phone,
  Users,
  ArrowLeft,
  MessageSquare,
  FileText,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useData } from '../../contexts/DataContext';

export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getClientById,
    getProjectsByClientId,
    getInvoicesByClientId,
    clientsLoading,
    projectsLoading
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');

  // Get real data from Firebase
  const client = id ? getClientById(id) : undefined;
  const clientProjects = client ? getProjectsByClientId(client.id) : [];
  const clientInvoices = client ? getInvoicesByClientId(client.id) : [];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'invoices', label: 'Invoices' }
  ];

  // Show loading
  if (clientsLoading || projectsLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if client not found
  if (!client) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Client Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The client you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalSpent = clientInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 md:space-y-8 pb-20">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/clients')}
            className="mb-4 pl-0 hover:bg-transparent hover:text-toiral-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
          </Button>

          <div className="flex items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-toiral-dark flex items-center justify-center text-2xl md:text-4xl font-bold text-white shadow-lg">
              {client.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark truncate">
                  {client.name}
                </h1>
                <Badge variant="success" className="rounded-full px-2 md:px-3 text-xs">
                  {client.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-500 mb-3 md:mb-4">
                {client.companyName && (
                  <span className="flex items-center gap-1.5 text-xs md:text-sm">
                    <Building className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{client.companyName}</span>
                  </span>
                )}
                {client.email && (
                  <span className="flex items-center gap-1.5 text-xs md:text-sm">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 md:h-9 text-xs md:text-sm"
                >
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                  <span className="hidden sm:inline">Message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 md:gap-8 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-3 md:pb-4 text-xs md:text-sm font-semibold relative whitespace-nowrap transition-colors
                  ${
                    activeTab === tab.id
                      ? 'text-toiral-primary'
                      : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-toiral-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Contact Info */}
                <div className="space-y-4 md:space-y-6">
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                      Contact Info
                    </h3>
                    <div className="space-y-3 text-sm">
                      {client.email && (
                        <div className="flex items-center gap-3 text-gray-600 text-xs md:text-sm">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}
                      {client.phone && (
                        <div className="flex items-center gap-3 text-gray-600 text-xs md:text-sm">
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{client.phone}</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Stats */}
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                      Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Spent</span>
                        <span className="font-bold text-green-600">
                          ${totalSpent.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Active Projects</span>
                        <span className="font-bold text-toiral-dark">
                          {clientProjects.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Access Code</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {client.accessCode}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Projects Overview */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 md:mb-6 text-sm md:text-base">
                      Active Projects
                    </h3>
                    {clientProjects.length > 0 ? (
                      <div className="space-y-4">
                        {clientProjects.map((project) => (
                          <div
                            key={project.id}
                            className="p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(`/admin/projects/${project.id}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-toiral-dark">{project.name}</h4>
                              <Badge
                                variant={
                                  project.status === 'Completed'
                                    ? 'success'
                                    : project.status === 'In Progress'
                                    ? 'info'
                                    : 'neutral'
                                }
                              >
                                {project.status}
                              </Badge>
                            </div>
                            {project.description && (
                              <p className="text-sm text-gray-500 mb-3">
                                {project.description}
                              </p>
                            )}
                            <ProgressBar progress={project.progress} className="h-2" />
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Budget</p>
                                <p className="font-bold text-sm">
                                  ${project.budget?.toLocaleString() || 0}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Due</p>
                                <p className="font-bold text-sm">
                                  {project.dueDate || 'N/A'}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Progress</p>
                                <p className="font-bold text-sm">{project.progress}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No projects yet</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                {clientProjects.length > 0 ? (
                  clientProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="p-4 md:p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigate(`/admin/projects/${project.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-toiral-dark mb-1">{project.name}</h3>
                          {project.description && (
                            <p className="text-sm text-gray-500">{project.description}</p>
                          )}
                        </div>
                        <Badge
                          variant={
                            project.status === 'Completed'
                              ? 'success'
                              : project.status === 'In Progress'
                              ? 'info'
                              : 'neutral'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <ProgressBar progress={project.progress} className="mb-3" />
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-500">
                          Start: <span className="font-medium">{project.startDate || 'N/A'}</span>
                        </span>
                        <span className="text-gray-500">
                          Due: <span className="font-medium">{project.dueDate || 'N/A'}</span>
                        </span>
                        <span className="text-gray-500">
                          Budget:{' '}
                          <span className="font-bold text-green-600">
                            ${project.budget?.toLocaleString() || 0}
                          </span>
                        </span>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No projects for this client</p>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                {clientInvoices.length > 0 ? (
                  clientInvoices.map((invoice) => (
                    <Card key={invoice.id} className="p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-toiral-dark mb-1">{invoice.id}</h3>
                          {invoice.description && (
                            <p className="text-sm text-gray-500 mb-2">{invoice.description}</p>
                          )}
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>
                              Issued: {new Date(invoice.issuedDate).toLocaleDateString()}
                            </span>
                            {invoice.dueDate && (
                              <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              invoice.status === 'Paid'
                                ? 'success'
                                : invoice.status === 'Pending'
                                ? 'warning'
                                : 'neutral'
                            }
                            className="mb-2"
                          >
                            {invoice.status}
                          </Badge>
                          <p className="text-2xl font-bold text-toiral-dark">
                            ${invoice.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices for this client</p>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
