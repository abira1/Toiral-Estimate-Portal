import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Circle, Clock, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MorphLoading } from '../components/ui/MorphLoading';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export function ProjectTracking() {
  const { id } = useParams();
  const { clientSession } = useAuth();
  const { getProjectById, getClientById, teamMembers, projectsLoading } = useData();

  // Get project ID from URL or from client session
  const projectId = id || (clientSession ? clientSession.client.projectIds?.[0] : undefined);
  const project = projectId ? getProjectById(projectId) : undefined;
  const client = project ? getClientById(project.clientId) : undefined;

  // Get team members for this project
  const projectTeam = teamMembers.filter((member) =>
    project?.teamIds?.includes(member.id)
  );

  // Show loading
  if (projectsLoading) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  // Show error if project not found
  if (!project) {
    return (
      <DashboardLayout userRole="client">
        <div className="space-y-8">
          <Card className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Project Found</h2>
            <p className="text-gray-500">
              Unable to find project details. Please contact your administrator.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8">
        <div className="bg-toiral-dark rounded-3xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Badge variant="info" className="mb-3 bg-white/20 text-white border-none">
                {project.status}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
              <p className="text-toiral-light">
                {client ? `Client: ${client.name}` : 'Project Details'} •{' '}
                {project.startDate ? `Started ${project.startDate}` : 'In Progress'}
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm min-w-[200px]">
              <p className="text-sm text-gray-300 mb-1">Overall Progress</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{project.progress}%</span>
                <span className="text-sm text-green-400 mb-1">
                  {project.status === 'Completed' ? 'Complete' : 
                   project.status === 'In Progress' ? 'On Track' : 
                   'Planned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-toiral-dark mb-6">Project Timeline</h2>
              <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100" />

                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((milestone) => (
                    <div key={milestone.id} className="relative flex items-start gap-4">
                      <div
                        className={`
                          w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white
                          ${
                            milestone.status === 'Completed'
                              ? 'text-green-500'
                              : milestone.status === 'In Progress'
                              ? 'text-toiral-primary ring-4 ring-toiral-primary/20'
                              : 'text-gray-300'
                          }
                        `}
                      >
                        {milestone.status === 'Completed' ? (
                          <CheckCircle className="w-6 h-6 fill-green-100" />
                        ) : milestone.status === 'In Progress' ? (
                          <Clock className="w-6 h-6 fill-toiral-light" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`font-bold ${
                                milestone.status === 'Pending'
                                  ? 'text-gray-400'
                                  : 'text-toiral-dark'
                              }`}
                            >
                              {milestone.title}
                            </h3>
                            {milestone.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 font-medium ml-4">
                            {milestone.dueDate || 'TBD'}
                          </span>
                        </div>
                        {milestone.status === 'In Progress' && (
                          <div className="mt-3">
                            <ProgressBar
                              progress={50}
                              className="h-2"
                              showPercentage={false}
                            />
                            <p className="text-xs text-toiral-primary mt-2 font-medium">
                              Currently in progress
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No milestones defined for this project yet.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-bold text-toiral-dark mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                {project.budget > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-bold text-green-600">
                      ${project.budget.toLocaleString()}
                    </span>
                  </div>
                )}
                {project.startDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date</span>
                    <span className="font-medium">{project.startDate}</span>
                  </div>
                )}
                {project.dueDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Due Date</span>
                    <span className="font-medium">{project.dueDate}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-toiral-primary">{project.progress}%</span>
                </div>
              </div>
            </Card>

            {projectTeam.length > 0 && (
              <Card>
                <h3 className="font-bold text-toiral-dark mb-4">Project Team</h3>
                <div className="space-y-4">
                  {projectTeam.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-toiral-dark">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="bg-toiral-bg-light border-toiral-light">
              <h3 className="font-bold text-toiral-dark mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about the timeline or deliverables?
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
      </div>
    </DashboardLayout>
  );
}
