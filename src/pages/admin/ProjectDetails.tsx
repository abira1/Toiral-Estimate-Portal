import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
  MoreVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { FileUpload } from '../../components/ui/FileUpload';
import { TeamMemberCard } from '../../components/ui/TeamMemberCard';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { ProjectEditor } from '../../components/admin/ProjectEditor';
import { useData } from '../../contexts/DataContext';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, getClientById, teamMembers, projectsLoading, updateProject } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditor, setShowEditor] = useState(false);

  // Get project and client data
  const project = id ? getProjectById(id) : undefined;
  const client = project ? getClientById(project.clientId) : undefined;

  // Get team members for this project
  const projectTeam = teamMembers.filter(member =>
    project?.teamIds?.includes(member.id)
  );

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'team', label: 'Team' },
    { id: 'documents', label: 'Documents' }
  ];

  // Show loading
  if (projectsLoading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if project not found
  if (!project) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Project Not Found</h2>
          <p className="text-gray-500 mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin/projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
            className="mb-4 pl-0 hover:bg-transparent hover:text-toiral-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-toiral-dark">
                  {project.name}
                </h1>
                <Badge variant={
                  project.status === 'Completed' ? 'success' :
                  project.status === 'In Progress' ? 'info' :
                  project.status === 'Review' ? 'warning' : 'neutral'
                }>
                  {project.status}
                </Badge>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                Client: <span className="font-bold text-toiral-dark">{client?.name || 'Unknown'}</span>
                {client && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                  >
                    View Profile <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowEditor(true)} data-testid="edit-project-btn">
                Edit Project
              </Button>
              <Button>Update Status</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  pb-4 text-sm font-semibold relative whitespace-nowrap transition-colors
                  ${activeTab === tab.id ? 'text-toiral-primary' : 'text-gray-500 hover:text-gray-700'}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-4">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {project.description || 'No description available.'}
                    </p>
                  </Card>
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-6">Progress</h3>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-500">Overall Completion</span>
                      <span className="font-bold text-toiral-dark">{project.progress}%</span>
                    </div>
                    <ProgressBar progress={project.progress} showPercentage={false} />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Team Size</p>
                        <p className="text-xl font-bold text-toiral-dark">{projectTeam.length}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Milestones</p>
                        <p className="text-xl font-bold text-toiral-dark">
                          {project.milestones?.length || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Budget</p>
                        <p className="text-xl font-bold text-green-600">
                          ${project.budget?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Documents</p>
                        <p className="text-xl font-bold text-toiral-dark">
                          {project.documents?.length || 0}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-4">Key Details</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Start Date</span>
                        <span className="font-medium">{project.startDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Due Date</span>
                        <span className="font-medium">{project.dueDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Budget</span>
                        <span className="font-bold text-green-600">
                          ${project.budget?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <Card>
                <div className="relative pl-8 space-y-8 max-w-2xl">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                  {project.milestones && project.milestones.length > 0 ? (
                    project.milestones.map((milestone, index) => (
                      <div key={milestone.id || index} className="relative flex items-center gap-4">
                        <div
                          className={`
                            w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center bg-white
                            ${milestone.status === 'Completed' ? 'border-green-500 text-green-500' :
                              milestone.status === 'In Progress' ? 'border-toiral-primary text-toiral-primary' :
                              'border-gray-300 text-gray-300'}
                          `}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              milestone.status === 'Completed' ? 'bg-green-500' :
                              milestone.status === 'In Progress' ? 'bg-toiral-primary' :
                              'bg-transparent'
                            }`}
                          />
                        </div>
                        <div className="flex-1 bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                          <div>
                            <span
                              className={`font-bold ${
                                milestone.status === 'Pending' ? 'text-gray-400' : 'text-toiral-dark'
                              }`}
                            >
                              {milestone.title}
                            </span>
                            {milestone.description && (
                              <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {milestone.dueDate || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No milestones defined for this project.</p>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'team' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projectTeam.length > 0 ? (
                  projectTeam.map((member) => (
                    <TeamMemberCard key={member.id} {...member} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No team members assigned to this project.</p>
                  </div>
                )}
                <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl hover:border-toiral-primary hover:bg-toiral-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-toiral-primary mb-3">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-gray-500 group-hover:text-toiral-primary">
                    Add Member
                  </span>
                </button>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <FileUpload label="Upload New Document" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.documents && project.documents.length > 0 ? (
                    project.documents.map((doc, i) => (
                      <Card key={doc.id || i} hoverable className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-toiral-dark">{doc.name}</h4>
                          <p className="text-xs text-gray-500">{doc.size}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Project Editor Modal */}
      {showEditor && project && (
        <ProjectEditor
          project={project}
          onSave={async (updates) => {
            await updateProject(project.id, updates);
          }}
          onClose={() => setShowEditor(false)}
          allTeamMembers={teamMembers}
        />
      )}
    </DashboardLayout>
  );
}
