import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  MessageSquare,
  Loader2 } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StarDoodle } from '../../components/doodles/StarDoodle';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { notificationService } from '../../lib/firebaseServices';
import type { Notification } from '../../types';

export function ClientDashboard() {
  const navigate = useNavigate();
  const { clientSession, logoutClient } = useAuth();
  const { projects, getProjectsByClientId, projectsLoading } = useData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!clientSession) {
      navigate('/');
    }
  }, [clientSession, navigate]);

  // Fetch notifications
  useEffect(() => {
    if (!clientSession) return;

    const fetchNotifications = async () => {
      const response = await notificationService.getByUserId(clientSession.clientId);
      if (response.success && response.data) {
        setNotifications(response.data.slice(0, 3)); // Show latest 3
      }
      setNotificationsLoading(false);
    };

    fetchNotifications();
  }, [clientSession]);

  // Get client's projects
  const clientProjects = clientSession
    ? getProjectsByClientId(clientSession.clientId)
    : [];
  const project = clientProjects[0]; // Get first project
  const client = clientSession?.client;

  // Show loading state
  if (projectsLoading || !client) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  // Format date helper
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Get next pending milestone
  const nextMilestone = project?.milestones?.find(m => m.status === 'In Progress' || m.status === 'Pending');
  
  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Planning': return 'warning';
      default: return 'default';
    }
  };

  // Show empty state if no projects
  if (!project) {
    return (
      <DashboardLayout userRole="client">
        <div className="space-y-8">
          <Card className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Active Projects</h2>
            <p className="text-gray-500 mb-6">
              You don't have any active projects yet. Please contact your administrator.
            </p>
            <Button onClick={logoutClient} variant="outline">
              Logout
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative bg-toiral-dark rounded-3xl p-8 lg:p-12 overflow-hidden text-white shadow-xl">
          <StarDoodle
            className="absolute top-10 right-10 text-toiral-secondary opacity-50"
            size={60} />

          <StarDoodle
            className="absolute bottom-10 left-20 text-toiral-primary opacity-50"
            size={40} />


          <div className="relative z-10 max-w-2xl">
            <Badge
              variant="info"
              className="mb-4 bg-white/10 text-white border-white/20">

              {project.status}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Hello, {client.name}! 👋
            </h1>
            <p className="text-toiral-light text-lg mb-8">
              Your project{' '}
              <span className="font-bold text-white">"{project.name}"</span>
              {project.description && ` - ${project.description}`}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/client/project/${project.id}`)}
                className="bg-white !text-toiral-dark hover:!bg-toiral-light border-white shadow-soft">

                View Timeline
              </Button>
              <Button
                variant="outline"
                className="!border-white !text-white hover:!bg-white/10"
                onClick={() => window.location.href = 'mailto:abirsabirhossain@gmail.com'}>

                Contact Admin
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Status */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-toiral-dark">
                Project Status
              </h2>
              <Badge variant="success">On Track</Badge>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Overall Progress</span>
                  <span className="font-bold text-toiral-primary">
                    {project.progress}%
                  </span>
                </div>
                <ProgressBar
                  progress={project.progress}
                  showPercentage={false} />

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <Clock className="w-5 h-5 text-toiral-primary mb-2" />
                  <p className="text-xs text-gray-400">Next Milestone</p>
                  <p className="font-bold text-toiral-dark">
                    {project.nextMilestone}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <AlertCircle className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="font-bold text-toiral-dark">
                    {project.dueDate}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-gray-100">
                  <FileText className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-xs text-gray-400">Pending Actions</p>
                  <p className="font-bold text-toiral-dark">1 Approval</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-toiral-dark">Updates</h2>
            <div className="space-y-4">
              {notifications.map((notif, index) =>
              <Card key={index} className="!p-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-toiral-primary mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-toiral-dark text-sm">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
                      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">
                        {notif.date}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
              <Button variant="ghost" className="w-full text-sm">
                View All Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-toiral-dark mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 items-center justify-center border-dashed">

              <FileText className="w-6 h-6" />
              <span>Review Quotation</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 items-center justify-center border-dashed">

              <MessageSquare className="w-6 h-6" />
              <span>Send Message</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col gap-2 items-center justify-center border-dashed">

              <CheckCircle className="w-6 h-6" />
              <span>Approve Phase</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}