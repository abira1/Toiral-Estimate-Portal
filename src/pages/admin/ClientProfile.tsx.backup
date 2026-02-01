import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Plus,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  Edit,
  CreditCard,
  Download,
  Send,
  ArrowUpRight,
  Trash2,
  Save,
  X,
  Calendar,
  DollarSign,
  Target,
  Users,
  Layers,
  Camera,
  Upload,
  ArrowLeft,
  Loader2 } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { FileUpload } from '../../components/ui/FileUpload';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { StarDoodle } from '../../components/doodles/StarDoodle';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useData } from '../../contexts/DataContext';
export function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getClientById, getProjectsByClientId, getInvoicesByClientId, clientsLoading, projectsLoading } = useData();
  
  // Get real data from Firebase
  const client = id ? getClientById(id) : undefined;
  const clientProjects = client ? getProjectsByClientId(client.id) : [];
  const clientInvoices = client ? getInvoicesByClientId(client.id) : [];
  const activeProject = clientProjects[0]; // Get first project for display

  const [activeTab, setActiveTab] = useState('overview');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Client Not Found</h2>
          <p className="text-gray-500 mb-6">The client you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/clients')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Clients
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalSpent = clientInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 md:space-y-8 pb-20">
        {/* Header Section - Mobile Optimized */}
        <div className="relative">
          <div className="absolute top-0 right-0 -z-10 opacity-10 hidden md:block">
            <StarDoodle size={120} className="text-toiral-primary rotate-12" />
          </div>

          <div className="flex flex-col gap-4 md:gap-6">
            {/* Mobile: Stacked Layout */}
            <div className="flex items-start gap-4 md:gap-6">
              {/* Clickable Profile Avatar */}
              <button
                onClick={() => setIsProfileImageModalOpen(true)}
                className="relative group flex-shrink-0">

                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-toiral-dark flex items-center justify-center text-2xl md:text-4xl font-bold text-white shadow-lg shadow-toiral-dark/20 overflow-hidden transition-transform group-hover:scale-105">
                  {profileImage ?
                  <img
                    src={profileImage}
                    alt={CLIENT_DATA.name}
                    className="w-full h-full object-cover" /> :


                  CLIENT_DATA.avatar
                  }
                </div>
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                {/* Edit badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-toiral-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark truncate">
                    {CLIENT_DATA.name}
                  </h1>
                  <Badge
                    variant="success"
                    className="rounded-full px-2 md:px-3 text-xs">

                    {CLIENT_DATA.status}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-500 mb-3 md:mb-4">
                  <span className="flex items-center gap-1.5 text-xs md:text-sm">
                    <Building className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{CLIENT_DATA.industry}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs md:text-sm">
                    <Globe className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="truncate">{CLIENT_DATA.website}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 md:h-9 text-xs md:text-sm"
                    onClick={() => setIsMessageModalOpen(true)}>

                    <MessageSquare className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden sm:inline">Message</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 md:h-9 text-xs md:text-sm">

                    <Edit className="w-3 h-3 md:w-4 md:h-4 md:mr-2" />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Mobile Scrollable */}
        <div className="border-b border-gray-200 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-px">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                  pb-3 md:pb-4 text-xs md:text-sm font-semibold relative whitespace-nowrap transition-colors
                  ${activeTab === tab.id ? 'text-toiral-primary' : 'text-gray-500 hover:text-gray-700'}
                `}>

                {tab.label}
                {activeTab === tab.id &&
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-toiral-primary rounded-full" />

              }
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{
              opacity: 0,
              y: 10
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -10
            }}
            transition={{
              duration: 0.2
            }}>

            {activeTab === 'overview' &&
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {/* Contact Info - Mobile Full Width */}
                <div className="space-y-4 md:space-y-6 lg:order-1">
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                      Contact Info
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-xs">
                            {CLIENT_DATA.contact.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-toiral-dark text-sm truncate">
                            {CLIENT_DATA.contact.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {CLIENT_DATA.contact.role}
                          </p>
                        </div>
                      </div>
                      <div className="h-px bg-gray-100 my-2" />
                      <div className="flex items-center gap-3 text-gray-600 text-xs md:text-sm">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {CLIENT_DATA.contact.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 text-xs md:text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {CLIENT_DATA.contact.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-3 text-gray-600 text-xs md:text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="break-words">
                          {CLIENT_DATA.contact.address}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main Content - Mobile Full Width */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:order-2">
                  {/* Active Project Snapshot */}
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 md:mb-6 text-sm md:text-base">
                      Active Project Snapshot
                    </h3>
                    <div className="mb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                        <h4 className="font-bold text-toiral-dark text-sm md:text-base">
                          E-commerce Redesign
                        </h4>
                        <Badge
                        variant="info"
                        className="self-start sm:self-auto">

                          In Progress
                        </Badge>
                      </div>
                      <ProgressBar progress={65} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
                      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="font-bold text-toiral-dark text-sm md:text-base">
                          $45k
                        </p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Spent</p>
                        <p className="font-bold text-toiral-dark text-sm md:text-base">
                          $29k
                        </p>
                      </div>
                      <div className="text-center p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl">
                        <p className="text-xs text-gray-500 mb-1">Due</p>
                        <p className="font-bold text-toiral-dark text-sm md:text-base">
                          Oct 24
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Complete Project Plan Section */}
                  <Card className="p-4 md:p-6">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <h3 className="font-bold text-toiral-dark text-sm md:text-base">
                        Complete Project Plan
                      </h3>
                      <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 md:h-8 px-2 md:px-3"
                      onClick={() => setIsEditPlanModalOpen(true)}>

                        <Edit className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {/* Objective */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-toiral-primary" />
                          <h4 className="font-bold text-toiral-dark text-xs md:text-sm">
                            Objective
                          </h4>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed pl-6">
                          {PROJECT_PLAN.objective}
                        </p>
                      </div>

                      {/* Scope */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="w-4 h-4 text-toiral-primary" />
                          <h4 className="font-bold text-toiral-dark text-xs md:text-sm">
                            Scope
                          </h4>
                        </div>
                        <ul className="space-y-1.5 pl-6">
                          {PROJECT_PLAN.scope.map((item, i) =>
                        <li
                          key={i}
                          className="text-xs md:text-sm text-gray-600 flex items-start gap-2">

                              <span className="text-toiral-primary mt-1">
                                •
                              </span>
                              <span>{item}</span>
                            </li>
                        )}
                        </ul>
                      </div>

                      {/* Deliverables */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-toiral-primary" />
                          <h4 className="font-bold text-toiral-dark text-xs md:text-sm">
                            Deliverables
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-2 pl-6">
                          {PROJECT_PLAN.deliverables.map((item, i) =>
                        <span
                          key={i}
                          className="px-2 md:px-3 py-1 bg-toiral-light/20 text-toiral-dark rounded-lg text-xs font-medium">

                              {item}
                            </span>
                        )}
                        </div>
                      </div>

                      {/* Timeline & Team */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <h4 className="font-bold text-gray-700 text-xs md:text-sm">
                              Timeline
                            </h4>
                          </div>
                          <p className="text-sm md:text-base font-bold text-toiral-primary pl-6">
                            {PROJECT_PLAN.timeline}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <h4 className="font-bold text-gray-700 text-xs md:text-sm">
                              Team
                            </h4>
                          </div>
                          <div className="space-y-1 pl-6">
                            {PROJECT_PLAN.team.map((member, i) =>
                          <p
                            key={i}
                            className="text-xs md:text-sm text-gray-600">

                                {member}
                              </p>
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }

            {activeTab === 'phases' &&
            <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                  <h3 className="font-bold text-toiral-dark text-sm md:text-base">
                    Project Phases
                  </h3>
                  <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedPhase(null);
                    setIsEditPhaseModalOpen(true);
                  }}
                  className="h-8 text-xs md:text-sm">

                    <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Add
                    Phase
                  </Button>
                </div>
                <div className="relative pl-6 md:pl-8 space-y-6 md:space-y-8 max-w-3xl">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                  {phases.map((phase, index) =>
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -20
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  transition={{
                    delay: index * 0.1
                  }}
                  className="relative">

                      <div className="flex items-start gap-3 md:gap-4">
                        <div
                      className={`
                            w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center bg-white flex-shrink-0
                            ${phase.status === 'Completed' ? 'border-green-500 text-green-500' : phase.status === 'In Progress' ? 'border-toiral-primary text-toiral-primary' : 'border-gray-300 text-gray-300'}
                          `}>

                          <div
                        className={`w-2 h-2 rounded-full ${phase.status === 'Completed' ? 'bg-green-500' : phase.status === 'In Progress' ? 'bg-toiral-primary' : 'bg-transparent'}`} />

                        </div>
                        <div className="flex-1 bg-gray-50 p-3 md:p-4 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                            <div className="flex-1">
                              <span className="font-bold text-toiral-dark text-sm md:text-base block mb-1">
                                {phase.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {phase.date !== '-' ?
                            `Completed: ${phase.date}` :
                            'Not started'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                            variant={
                            phase.status === 'Completed' ?
                            'success' :
                            phase.status === 'In Progress' ?
                            'info' :
                            'neutral'
                            }
                            className="text-xs">

                                {phase.status}
                              </Badge>
                              <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setSelectedPhase({
                                ...phase,
                                index
                              });
                              setIsEditPhaseModalOpen(true);
                            }}>

                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          {phase.status === 'In Progress' &&
                      <ProgressBar
                        progress={phase.progress}
                        className="h-2" />

                      }
                        </div>
                      </div>
                    </motion.div>
                )}
                </div>
              </Card>
            }

            {activeTab === 'financials' &&
            <div className="space-y-4 md:space-y-6">
                <Card className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="font-bold text-toiral-dark text-sm md:text-base">
                      Cost Breakdown
                    </h3>
                    <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddCostModalOpen(true)}
                    className="h-8 text-xs md:text-sm">

                      <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />{' '}
                      Add Item
                    </Button>
                  </div>

                  {/* Mobile: Card Layout */}
                  <div className="block md:hidden space-y-3">
                    {costs.map((item) =>
                  <div key={item.id} className="bg-gray-50 p-3 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-toiral-dark text-sm truncate">
                              {item.item}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 ml-2"
                        onClick={() => handleDeleteCost(item.id)}>

                            <Trash2 className="w-3 h-3 text-red-500" />
                          </Button>
                        </div>
                        <p className="text-right font-bold text-toiral-primary">
                          ${item.cost.toLocaleString()}
                        </p>
                      </div>
                  )}
                    <div className="bg-toiral-dark text-white p-3 rounded-xl flex justify-between items-center">
                      <span className="font-bold text-sm">Total</span>
                      <span className="text-lg font-bold">
                        ${totalCost.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Desktop: Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">Item</th>
                          <th className="px-4 py-3">Description</th>
                          <th className="px-4 py-3 text-right">Cost</th>
                          <th className="px-4 py-3 rounded-r-lg text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {costs.map((item) =>
                      <tr key={item.id}>
                            <td className="px-4 py-3 font-medium">
                              {item.item}
                            </td>
                            <td className="px-4 py-3 text-gray-500 text-sm">
                              {item.desc}
                            </td>
                            <td className="px-4 py-3 text-right font-bold">
                              ${item.cost.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteCost(item.id)}>

                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                      )}
                        <tr className="bg-gray-50/50">
                          <td className="px-4 py-3 font-bold">Total</td>
                          <td></td>
                          <td className="px-4 py-3 text-right font-bold text-toiral-primary text-lg">
                            ${totalCost.toLocaleString()}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                      Quotations
                    </h3>
                    <FileUpload label="Upload New Quote" className="mb-4" />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-xs md:text-sm font-medium truncate">
                            Initial_Quote_v1.pdf
                          </span>
                        </div>
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 md:h-8 md:w-8 p-0 ml-2">

                          <Download className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 md:p-6">
                    <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                      Payment Receipts
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-medium truncate">
                              Deposit Payment
                            </p>
                            <p className="text-xs text-gray-500">
                              Sep 01 • $15,000
                            </p>
                          </div>
                        </div>
                        <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 md:h-8 md:w-8 p-0 ml-2">

                          <Download className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }

            {activeTab === 'documents' &&
            <div className="space-y-4 md:space-y-6">
                <FileUpload label="Upload Document" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card
                  hoverable
                  className="flex items-center gap-3 md:gap-4 p-4">

                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-toiral-dark text-sm md:text-base truncate">
                        Contract.pdf
                      </h4>
                      <p className="text-xs text-gray-500">2.4 MB • Signed</p>
                    </div>
                    <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs md:text-sm">

                      Download
                    </Button>
                  </Card>
                </div>
              </div>
            }

            {activeTab === 'notes' &&
            <div className="space-y-4 md:space-y-6">
                <Card className="p-4 md:p-6">
                  <h3 className="font-bold text-toiral-dark mb-4 text-sm md:text-base">
                    Add Note
                  </h3>
                  <Textarea
                  placeholder="Type your note here..."
                  className="mb-3"
                  rows={4} />

                  <div className="flex justify-end">
                    <Button size="sm">Add Note</Button>
                  </div>
                </Card>
                <div className="space-y-4">
                  <Card className="bg-yellow-50/50 border-yellow-100 p-4">
                    <p className="text-xs md:text-sm text-gray-700 mb-2">
                      Client requested changes to the homepage layout. Discussed
                      in meeting on Oct 12.
                    </p>
                    <p className="text-xs text-gray-400">
                      Added by Admin • 2 days ago
                    </p>
                  </Card>
                </div>
              </div>
            }
          </motion.div>
        </AnimatePresence>

        {/* Profile Image Upload Modal */}
        <Modal
          isOpen={isProfileImageModalOpen}
          onClose={() => {
            setIsProfileImageModalOpen(false);
            setTempProfileImage(null);
          }}
          title="Update Client Profile Image">

          <div className="space-y-6">
            {/* Current/Preview Image */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-3xl bg-toiral-dark flex items-center justify-center text-5xl font-bold text-white shadow-lg overflow-hidden mb-4">
                {tempProfileImage ?
                <img
                  src={tempProfileImage}
                  alt="Preview"
                  className="w-full h-full object-cover" /> :

                profileImage ?
                <img
                  src={profileImage}
                  alt={CLIENT_DATA.name}
                  className="w-full h-full object-cover" /> :


                CLIENT_DATA.avatar
                }
              </div>
              <p className="text-sm text-gray-500">
                {tempProfileImage ?
                'New image preview' :
                profileImage ?
                'Current profile image' :
                'No image uploaded'}
              </p>
            </div>

            {/* Upload Area */}
            <div
              className={`
                relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer
                border-gray-200 hover:border-toiral-primary/50 hover:bg-gray-50
              `}
              onClick={() =>
              document.getElementById('profile-image-input')?.click()
              }>

              <input
                id="profile-image-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleProfileImageSelect(e.target.files[0]);
                  }
                }} />

              <div className="w-12 h-12 bg-toiral-light/30 text-toiral-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-toiral-dark">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG or WEBP (max. 5MB)
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {(profileImage || tempProfileImage) &&
              <Button
                variant="ghost"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleRemoveProfileImage}>

                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Image
                </Button>
              }
              <div className="flex-1" />
              <Button
                variant="ghost"
                onClick={() => {
                  setIsProfileImageModalOpen(false);
                  setTempProfileImage(null);
                }}>

                Cancel
              </Button>
              <Button
                onClick={handleSaveProfileImage}
                disabled={!tempProfileImage}>

                <Save className="w-4 h-4 mr-2" />
                Save Image
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Phase Modal */}
        <Modal
          isOpen={isEditPhaseModalOpen}
          onClose={() => {
            setIsEditPhaseModalOpen(false);
            setSelectedPhase(null);
          }}
          title={selectedPhase ? 'Edit Phase' : 'Add Phase'}>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditPhaseModalOpen(false);
              setSelectedPhase(null);
            }}>

            <Input
              label="Phase Name"
              placeholder="e.g. Development"
              defaultValue={selectedPhase?.name || ''} />

            <Select
              label="Status"
              options={[
              {
                value: 'Pending',
                label: 'Pending'
              },
              {
                value: 'In Progress',
                label: 'In Progress'
              },
              {
                value: 'Completed',
                label: 'Completed'
              }]
              }
              defaultValue={selectedPhase?.status || 'Pending'} />

            <Input
              label="Completion Date"
              type="date"
              defaultValue={
              selectedPhase?.date !== '-' ? selectedPhase?.date : ''
              } />

            <Input
              label="Progress (%)"
              type="number"
              min="0"
              max="100"
              defaultValue={selectedPhase?.progress || 0} />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setIsEditPhaseModalOpen(false);
                  setSelectedPhase(null);
                }}>

                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Phase
              </Button>
            </div>
          </form>
        </Modal>

        {/* Add Cost Modal */}
        <Modal
          isOpen={isAddCostModalOpen}
          onClose={() => {
            setIsAddCostModalOpen(false);
            setNewCost({
              item: '',
              desc: '',
              cost: ''
            });
          }}
          title="Add Cost Item">

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCost();
            }}>

            <Input
              label="Item Name"
              placeholder="e.g. Backend Development"
              value={newCost.item}
              onChange={(e) =>
              setNewCost({
                ...newCost,
                item: e.target.value
              })
              }
              required />

            <Textarea
              label="Description"
              placeholder="Brief description of the cost item"
              value={newCost.desc}
              onChange={(e) =>
              setNewCost({
                ...newCost,
                desc: e.target.value
              })
              }
              rows={3} />

            <Input
              label="Cost ($)"
              type="number"
              placeholder="0.00"
              value={newCost.cost}
              onChange={(e) =>
              setNewCost({
                ...newCost,
                cost: e.target.value
              })
              }
              required />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setIsAddCostModalOpen(false);
                  setNewCost({
                    item: '',
                    desc: '',
                    cost: ''
                  });
                }}>

                Cancel
              </Button>
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" /> Add Cost
              </Button>
            </div>
          </form>
        </Modal>

        {/* Edit Plan Modal */}
        <Modal
          isOpen={isEditPlanModalOpen}
          onClose={() => setIsEditPlanModalOpen(false)}
          title="Edit Project Plan"
          className="max-w-2xl">

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditPlanModalOpen(false);
            }}>

            <Textarea
              label="Objective"
              placeholder="Project objective..."
              defaultValue={PROJECT_PLAN.objective}
              rows={3} />

            <Textarea
              label="Scope (one item per line)"
              placeholder="Enter scope items..."
              defaultValue={PROJECT_PLAN.scope.join('\n')}
              rows={6} />

            <Input
              label="Timeline"
              placeholder="e.g. 12 weeks"
              defaultValue={PROJECT_PLAN.timeline} />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsEditPlanModalOpen(false)}>

                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Plan
              </Button>
            </div>
          </form>
        </Modal>

        {/* Message Modal */}
        <Modal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          title="Send Message to Client">

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setIsMessageModalOpen(false);
            }}>

            <Input label="Subject" placeholder="e.g. Project Update" />
            <Textarea
              label="Message"
              placeholder="Type your message..."
              rows={6} />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsMessageModalOpen(false)}>

                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>);

}