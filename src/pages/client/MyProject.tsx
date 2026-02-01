import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
  DollarSign,
  Download,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { notificationService } from '../../lib/firebaseServices';
import type { Phase, PaymentMilestone, Note, DocumentLink } from '../../types';

export function MyProject() {
  const navigate = useNavigate();
  const { clientSession } = useAuth();
  const { getProjectsByClientId, updateProject, teamMembers, projectsLoading } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [changeRequest, setChangeRequest] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clientProjects = clientSession ? getProjectsByClientId(clientSession.clientId) : [];
  const project = clientProjects[0]; // Get first project
  const client = clientSession?.client;

  // Get team members for this project
  const projectTeam = teamMembers.filter(member =>
    project?.teamIds?.includes(member.id)
  );

  useEffect(() => {
    if (!clientSession) {
      navigate('/');
    }
  }, [clientSession, navigate]);

  if (projectsLoading || !project || !client) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'timeline', label: 'Timeline & Phases', icon: Calendar },
    { id: 'financial', label: 'Financial Details', icon: DollarSign },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'documents', label: 'Documents', icon: Download },
    { id: 'notes', label: 'Notes & Updates', icon: MessageSquare }
  ];

  const handleFinancialApproval = async (action: 'approve' | 'reject') => {
    if (!project) return;
    
    setSubmitting(true);
    try {
      const updates: any = {
        financial: {
          ...project.financial,
          approvalStatus: action === 'approve' ? 'approved' : (changeRequest ? 'change_requested' : 'rejected'),
          approvedAt: action === 'approve' ? Date.now() : undefined,
          rejectedAt: action === 'reject' && !changeRequest ? Date.now() : undefined,
          changeRequestedAt: changeRequest ? Date.now() : undefined,
          changeRequest: changeRequest || undefined
        }
      };

      await updateProject(project.id, updates);

      // Create notification for admin
      await notificationService.create({
        userId: 'admin',
        type: 'approval_request',
        title: action === 'approve' ? 'Payment Plan Approved' : 'Payment Plan Feedback',
        description: action === 'approve' 
          ? `${client.name} has approved the payment plan for ${project.name}`
          : changeRequest 
            ? `${client.name} requested changes to the payment plan: ${changeRequest}`
            : `${client.name} has rejected the payment plan for ${project.name}`,
        read: false
      });

      setShowApprovalModal(false);
      setApprovalAction(null);
      setChangeRequest('');
    } catch (error) {
      console.error('Error submitting approval:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPhaseStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'Completed': return 'text-green-500 bg-green-50';
      case 'In Progress': return 'text-blue-500 bg-blue-50';
      case 'Delayed': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getPaymentStatusColor = (status: PaymentMilestone['status']) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
      default: return 'neutral';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: project.financial?.currency || 'USD'
    }).format(amount);
  };

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/client/dashboard')}
            className="mb-4 pl-0 hover:bg-transparent hover:text-toiral-primary"
            data-testid="back-to-dashboard-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          
          <div className="bg-toiral-dark rounded-3xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <Badge variant="info" className="mb-3 bg-white/20 text-white border-none">
                  {project.status}
                </Badge>
                <h1 className="text-3xl font-bold mb-2" data-testid="project-name">{project.name}</h1>
                <p className="text-toiral-light">
                  {project.category} {project.customCategory && `• ${project.customCategory}`}
                </p>
                <p className="text-sm text-toiral-light mt-2">
                  Started: {project.startDate} {project.dueDate && `• Due: ${project.dueDate}`}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm min-w-[200px]">
                <p className="text-sm text-gray-300 mb-1">Overall Progress</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold" data-testid="project-progress">{project.progress}%</span>
                  <span className="text-sm text-green-400 mb-1">
                    {project.status === 'Completed' ? 'Complete' : 
                     project.status === 'In Progress' ? 'On Track' : 
                     'Planned'}
                  </span>
                </div>
                <ProgressBar progress={project.progress} showPercentage={false} className="mt-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    pb-4 px-2 text-sm font-semibold relative whitespace-nowrap transition-colors flex items-center gap-2
                    ${activeTab === tab.id ? 'text-toiral-primary' : 'text-gray-500 hover:text-gray-700'}
                  `}
                  data-testid={`tab-${tab.id}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeClientTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-toiral-primary rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-testid="overview-tab">
                <Card className="lg:col-span-2">
                  <h2 className="text-xl font-bold text-toiral-dark mb-4">Project Overview</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                      <p className="text-gray-600">{project.description || project.overview || 'No description available.'}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Project Category</p>
                        <p className="font-semibold text-toiral-dark">
                          {project.category}
                          {project.customCategory && <span className="text-sm text-gray-500 ml-1">({project.customCategory})</span>}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Status</p>
                        <Badge variant={
                          project.status === 'Completed' ? 'success' :
                          project.status === 'In Progress' ? 'info' :
                          project.status === 'Review' ? 'warning' : 'neutral'
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Start Date</p>
                        <p className="font-semibold text-toiral-dark">{project.startDate || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Due Date</p>
                        <p className="font-semibold text-toiral-dark">{project.dueDate || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Phases</span>
                        <span className="font-bold text-toiral-dark">{project.phases?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Team Members</span>
                        <span className="font-bold text-toiral-dark">{projectTeam.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Documents</span>
                        <span className="font-bold text-toiral-dark">{project.documentLinks?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Notes</span>
                        <span className="font-bold text-toiral-dark">{project.notes?.length || 0}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-toiral-bg-light border-toiral-light">
                    <h3 className="font-bold text-toiral-dark mb-2">Need Help?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Have questions about your project?
                    </p>
                    <a
                      href="mailto:abirsabirhossain@gmail.com"
                      className="text-toiral-primary font-bold text-sm hover:underline"
                    >
                      Contact Project Manager →
                    </a>
                  </Card>
                </div>
              </div>
            )}

            {/* Timeline & Phases Tab */}
            {activeTab === 'timeline' && (
              <Card data-testid="timeline-tab">
                <h2 className="text-xl font-bold text-toiral-dark mb-6">Project Timeline & Phases</h2>
                {project.phases && project.phases.length > 0 ? (
                  <div className="space-y-4">
                    {project.phases.map((phase, index) => (
                      <div
                        key={phase.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-toiral-primary transition-colors"
                        data-testid={`phase-${index}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-sm font-bold text-gray-400">Phase {index + 1}</span>
                              <Badge className={getPhaseStatusColor(phase.status)}>
                                {phase.status}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-bold text-toiral-dark">{phase.name}</h3>
                            {phase.description && (
                              <p className="text-sm text-gray-600 mt-2">{phase.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Start:</span>
                            <span className="font-semibold text-toiral-dark">{phase.startDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">End:</span>
                            <span className="font-semibold text-toiral-dark">{phase.endDate}</span>
                          </div>
                        </div>

                        {phase.deliverables && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                              Deliverables
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{phase.deliverables}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No phases defined yet.</p>
                  </div>
                )}
              </Card>
            )}

            {/* Financial Details Tab */}
            {activeTab === 'financial' && (
              <div className="space-y-6" data-testid="financial-tab">
                {/* Financial Overview */}
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-toiral-dark">Financial Summary</h2>
                    {project.financial?.approvalStatus && (
                      <Badge variant={
                        project.financial.approvalStatus === 'approved' ? 'success' :
                        project.financial.approvalStatus === 'rejected' ? 'error' :
                        project.financial.approvalStatus === 'change_requested' ? 'warning' :
                        'neutral'
                      } data-testid="approval-status-badge">
                        {project.financial.approvalStatus === 'approved' && '✓ Approved'}
                        {project.financial.approvalStatus === 'rejected' && '✗ Rejected'}
                        {project.financial.approvalStatus === 'change_requested' && '↻ Changes Requested'}
                        {project.financial.approvalStatus === 'pending' && '⏳ Pending Review'}
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                      <p className="text-sm text-blue-600 font-semibold mb-2">Total Project Cost</p>
                      <p className="text-3xl font-bold text-blue-900" data-testid="total-cost">
                        {formatCurrency(project.financial?.totalCost || project.budget || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                      <p className="text-sm text-green-600 font-semibold mb-2">Total Paid</p>
                      <p className="text-3xl font-bold text-green-900" data-testid="total-paid">
                        {formatCurrency(project.financial?.totalPaid || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
                      <p className="text-sm text-amber-600 font-semibold mb-2">Balance Due</p>
                      <p className="text-3xl font-bold text-amber-900" data-testid="balance-due">
                        {formatCurrency(project.financial?.balance || (project.financial?.totalCost || project.budget || 0) - (project.financial?.totalPaid || 0))}
                      </p>
                    </div>
                  </div>

                  {/* Change Request Display */}
                  {project.financial?.changeRequest && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">Your Change Request</p>
                          <p className="text-sm text-amber-800">{project.financial.changeRequest}</p>
                          {project.financial.changeRequestedAt && (
                            <p className="text-xs text-amber-600 mt-2">
                              Submitted: {formatDate(project.financial.changeRequestedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Payment Milestones */}
                <Card>
                  <h3 className="text-lg font-bold text-toiral-dark mb-6">Payment Schedule</h3>
                  {project.financial?.paymentMilestones && project.financial.paymentMilestones.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Milestone</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Percentage</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Due Date</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.financial.paymentMilestones.map((milestone, index) => (
                            <tr
                              key={milestone.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                              data-testid={`payment-milestone-${index}`}
                            >
                              <td className="py-4 px-4">
                                <p className="font-semibold text-toiral-dark">{milestone.name}</p>
                                {milestone.notes && (
                                  <p className="text-xs text-gray-500 mt-1">{milestone.notes}</p>
                                )}
                              </td>
                              <td className="py-4 px-4 font-bold text-toiral-dark">
                                {formatCurrency(milestone.amount)}
                              </td>
                              <td className="py-4 px-4 text-gray-600">
                                {milestone.percentage}%
                              </td>
                              <td className="py-4 px-4 text-gray-600">
                                {milestone.dueDate}
                              </td>
                              <td className="py-4 px-4">
                                <Badge variant={getPaymentStatusColor(milestone.status)}>
                                  {milestone.status}
                                </Badge>
                                {milestone.paidDate && (
                                  <p className="text-xs text-gray-500 mt-1">Paid: {milestone.paidDate}</p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No payment milestones defined.</p>
                    </div>
                  )}
                </Card>

                {/* Approval Actions */}
                {project.financial && !project.financial.approvalStatus && (
                  <Card className="bg-blue-50 border-blue-200">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="w-6 h-6 text-blue-600 mt-1" />
                      <div className="flex-1">
                        <h3 className="font-bold text-blue-900 mb-2">Action Required: Review Payment Plan</h3>
                        <p className="text-sm text-blue-800 mb-4">
                          Please review the financial breakdown and payment schedule above. You can approve, reject, or request changes.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => {
                              setApprovalAction('approve');
                              setShowApprovalModal(true);
                            }}
                            className="bg-green-600 hover:bg-green-700"
                            data-testid="approve-payment-btn"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Approve Payment Plan
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setApprovalAction('reject');
                              setShowApprovalModal(true);
                            }}
                            className="border-red-600 text-red-600 hover:bg-red-50"
                            data-testid="reject-payment-btn"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Request Changes
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {project.financial?.approvalStatus === 'approved' && (
                  <Card className="bg-green-50 border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Payment Plan Approved</p>
                        <p className="text-sm text-green-700">
                          You approved this payment plan on {project.financial.approvedAt && formatDate(project.financial.approvedAt)}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Team Tab */}
            {activeTab === 'team' && (
              <Card data-testid="team-tab">
                <h2 className="text-xl font-bold text-toiral-dark mb-6">Project Team</h2>
                {projectTeam.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectTeam.map((member, index) => (
                      <div
                        key={member.id}
                        className="border border-gray-200 rounded-2xl p-6 hover:border-toiral-primary transition-colors"
                        data-testid={`team-member-${index}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-toiral-primary to-toiral-secondary flex items-center justify-center text-white text-xl font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-toiral-dark">{member.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{member.role}</p>
                            <a
                              href={`mailto:${member.email}`}
                              className="text-sm text-toiral-primary hover:underline flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              {member.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No team members assigned yet.</p>
                  </div>
                )}
              </Card>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <Card data-testid="documents-tab">
                <h2 className="text-xl font-bold text-toiral-dark mb-6">Project Documents</h2>
                {project.documentLinks && project.documentLinks.length > 0 ? (
                  <div className="space-y-3">
                    {project.documentLinks.map((doc, index) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-toiral-primary transition-colors"
                        data-testid={`document-${index}`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-toiral-bg-light rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-toiral-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-toiral-dark">{doc.name}</h4>
                              <Badge variant="neutral" className="text-xs">{doc.type}</Badge>
                            </div>
                            {doc.notes && (
                              <p className="text-sm text-gray-500">{doc.notes}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded: {formatDate(doc.uploadedAt)} by {doc.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                            data-testid={`view-document-btn-${index}`}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                            data-testid={`download-document-btn-${index}`}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No documents uploaded yet.</p>
                  </div>
                )}
              </Card>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <Card data-testid="notes-tab">
                <h2 className="text-xl font-bold text-toiral-dark mb-6">Notes & Updates</h2>
                {project.notes && project.notes.length > 0 ? (
                  <div className="space-y-4">
                    {[...project.notes].sort((a, b) => b.createdAt - a.createdAt).map((note, index) => (
                      <div
                        key={note.id}
                        className="border border-gray-200 rounded-xl p-6"
                        data-testid={`note-${index}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={
                            note.category === 'Client Decision' ? 'info' :
                            note.category === 'Technical Note' ? 'warning' :
                            note.category === 'Meeting Note' ? 'success' :
                            'neutral'
                          }>
                            {note.category}
                          </Badge>
                          <p className="text-xs text-gray-400">
                            {formatDate(note.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-3">
                          By: {note.createdBy}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No notes or updates yet.</p>
                  </div>
                )}
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Approval Modal */}
        {showApprovalModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
              data-testid="approval-modal"
            >
              <h3 className="text-2xl font-bold text-toiral-dark mb-4">
                {approvalAction === 'approve' ? 'Approve Payment Plan' : 'Request Changes'}
              </h3>
              
              {approvalAction === 'approve' ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    By approving this payment plan, you confirm that you agree with the proposed financial breakdown and payment schedule.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleFinancialApproval('approve')}
                      disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      data-testid="confirm-approve-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Confirm Approval
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowApprovalModal(false);
                        setApprovalAction(null);
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Please explain what changes you'd like to see in the payment plan:
                  </p>
                  <textarea
                    value={changeRequest}
                    onChange={(e) => setChangeRequest(e.target.value)}
                    placeholder="E.g., I would like to adjust the payment schedule, change milestone amounts, etc."
                    className="w-full border border-gray-300 rounded-xl p-4 mb-6 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                    data-testid="change-request-input"
                  />
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleFinancialApproval('reject')}
                      disabled={!changeRequest.trim() || submitting}
                      className="flex-1"
                      data-testid="submit-changes-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowApprovalModal(false);
                        setApprovalAction(null);
                        setChangeRequest('');
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
