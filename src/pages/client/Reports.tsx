import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Download,
  Filter,
  Activity,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Chart } from '../../components/ui/Chart';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StarDoodle } from '../../components/doodles/StarDoodle';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { notificationService } from '../../lib/firebaseServices';
import type { Notification } from '../../types';

export function Reports() {
  const { clientSession } = useAuth();
  const { getProjectsByClientId, projectsLoading, getInvoicesByClientId } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Get client's projects
  const clientProjects = clientSession ? getProjectsByClientId(clientSession.clientId) : [];
  const activeProject = clientProjects[0]; // Main project

  // Get client's invoices
  const clientInvoices = clientSession ? getInvoicesByClientId(clientSession.clientId) : [];

  // Fetch notifications for activity feed
  useEffect(() => {
    if (!clientSession) return;

    const fetchNotifications = async () => {
      const response = await notificationService.getByUserId(clientSession.clientId);
      if (response.success && response.data) {
        setNotifications(response.data.slice(0, 5)); // Get latest 5
      }
      setNotificationsLoading(false);
    };

    fetchNotifications();
  }, [clientSession]);

  // Calculate monthly progress data
  const monthlyProgress = useMemo(() => {
    if (!activeProject) return [];

    // Generate last 6 months of data
    const months = [];
    const currentDate = new Date();
    const projectStart = new Date(activeProject.createdAt);
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      
      // Calculate progress for each month (simple linear interpolation)
      const monthsSinceStart = Math.max(0, 
        (date.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const monthsTotal = Math.max(1,
        (currentDate.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      const progressForMonth = Math.min(
        Math.round((monthsSinceStart / monthsTotal) * activeProject.progress),
        activeProject.progress
      );

      months.push({
        label: date.toLocaleString('default', { month: 'short' }),
        value: progressForMonth
      });
    }

    return months;
  }, [activeProject]);

  // Get project phases/milestones
  const projectPhases = useMemo(() => {
    if (!activeProject || !activeProject.milestones || activeProject.milestones.length === 0) {
      // Return default phases if no milestones
      return [
        {
          name: 'Project Initiation',
          progress: activeProject ? Math.min(100, activeProject.progress * 3) : 0,
          status: activeProject && activeProject.progress > 30 ? 'completed' : activeProject && activeProject.progress > 0 ? 'in-progress' : 'pending',
          hours: 0
        },
        {
          name: 'Development',
          progress: activeProject ? Math.max(0, Math.min(100, (activeProject.progress - 30) * 2)) : 0,
          status: activeProject && activeProject.progress > 80 ? 'completed' : activeProject && activeProject.progress > 30 ? 'in-progress' : 'pending',
          hours: 0
        },
        {
          name: 'Testing & QA',
          progress: activeProject ? Math.max(0, Math.min(100, (activeProject.progress - 80) * 5)) : 0,
          status: activeProject && activeProject.progress === 100 ? 'completed' : activeProject && activeProject.progress > 80 ? 'in-progress' : 'pending',
          hours: 0
        }
      ];
    }

    return activeProject.milestones.map(milestone => ({
      name: milestone.title,
      progress: milestone.status === 'Completed' ? 100 : milestone.status === 'In Progress' ? 50 : 0,
      status: milestone.status === 'Completed' ? 'completed' : milestone.status === 'In Progress' ? 'in-progress' : 'pending',
      hours: 0 // Hours tracking not implemented yet
    }));
  }, [activeProject]);

  // Calculate total hours (from milestones or estimate)
  const totalHours = projectPhases.reduce((sum, phase) => sum + phase.hours, 0) || 176;

  // Calculate tasks completed
  const completedPhases = projectPhases.filter(p => p.status === 'completed').length;
  const totalPhases = projectPhases.length;

  // Calculate days remaining
  const daysRemaining = useMemo(() => {
    if (!activeProject || !activeProject.dueDate) return null;
    const due = new Date(activeProject.dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [activeProject]);

  // Format notification date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-blue-100 text-blue-600';
      case 'update': return 'bg-green-100 text-green-600';
      case 'alert': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const stats = [
    {
      label: 'Overall Progress',
      value: `${activeProject?.progress || 0}%`,
      change: activeProject ? `${activeProject.status}` : 'N/A',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-toiral-primary',
      bg: 'bg-toiral-light/30'
    },
    {
      label: 'Hours Logged',
      value: totalHours.toString(),
      change: 'Estimated',
      trend: 'neutral' as const,
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-100'
    },
    {
      label: 'Tasks Completed',
      value: `${completedPhases}/${totalPhases}`,
      change: `${totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0}%`,
      trend: 'neutral' as const,
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-100'
    },
    {
      label: 'Days Remaining',
      value: daysRemaining !== null ? daysRemaining.toString() : 'N/A',
      change: daysRemaining !== null && daysRemaining < 14 ? 'Urgent' : 'On Track',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'text-purple-500',
      bg: 'bg-purple-100'
    }
  ];

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

  // Show empty state if no project
  if (!activeProject) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Project Data</h2>
          <p className="text-gray-500">You don't have any active projects to generate reports.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-toiral-dark">Reports</h1>
            <p className="text-gray-500 mt-1">
              Track your project progress and analytics
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['week', 'month', 'quarter'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    timeRange === range
                      ? 'bg-white text-toiral-dark shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="relative overflow-hidden h-full">
                <div className="flex items-start justify-between h-full">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-toiral-dark">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-auto pt-2">
                      {stat.trend === 'up' && (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      )}
                      {stat.trend === 'down' && (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === 'up'
                            ? 'text-green-600'
                            : stat.trend === 'down'
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Over Time */}
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-toiral-dark">
                  Progress Over Time
                </h3>
                <p className="text-sm text-gray-500">
                  Monthly completion percentage
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-toiral-primary" />
                <span className="text-sm text-gray-500">Completion %</span>
              </div>
            </div>
            <Chart
              data={monthlyProgress}
              type="bar"
              height={240}
              color="#149499"
              formatValue={(v) => `${v}%`}
            />
          </Card>

          {/* Project Health */}
          <Card className="relative overflow-hidden">
            <StarDoodle className="absolute top-4 right-4 opacity-20" size={40} />
            <h3 className="font-bold text-toiral-dark mb-6">Project Health</h3>

            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E4F0EF"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#149499"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{
                    strokeDashoffset: 251.2 * (1 - (activeProject.progress / 100))
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-toiral-dark">
                  {activeProject.progress}%
                </span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">Status</span>
                </div>
                <Badge
                  variant={
                    activeProject.status === 'Completed'
                      ? 'success'
                      : activeProject.status === 'In Progress'
                      ? 'info'
                      : 'warning'
                  }
                >
                  {activeProject.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Budget Status</span>
                </div>
                <Badge variant="info">
                  {activeProject.budget > 0 ? `$${activeProject.budget.toLocaleString()}` : 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-600">Timeline</span>
                </div>
                <Badge variant="warning">
                  {daysRemaining !== null ? `${daysRemaining}d left` : 'No deadline'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Phase Breakdown & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Phase Breakdown */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-toiral-dark">Phase Breakdown</h3>
              <Badge variant="info">{projectPhases.length} Phases</Badge>
            </div>
            <div className="space-y-4">
              {projectPhases.map((phase, index) => (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          phase.status === 'completed'
                            ? 'bg-green-500'
                            : phase.status === 'in-progress'
                            ? 'bg-toiral-primary'
                            : 'bg-gray-300'
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          phase.status === 'pending'
                            ? 'text-gray-400'
                            : 'text-toiral-dark'
                        }`}
                      >
                        {phase.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {phase.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    progress={phase.progress}
                    showPercentage={false}
                    className="h-2"
                    color={
                      phase.status === 'completed'
                        ? 'bg-green-500'
                        : phase.status === 'in-progress'
                        ? 'bg-toiral-primary'
                        : 'bg-gray-200'
                    }
                  />
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-toiral-dark">Recent Activity</h3>
              <Button variant="ghost" size="sm" className="text-toiral-primary">
                View All
              </Button>
            </div>
            {notificationsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-toiral-primary" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityIcon(
                        activity.type
                      )}`}
                    >
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-toiral-dark">
                        {activity.title}
                      </p>
                      {activity.message && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {activity.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No recent activity</p>
              </div>
            )}
          </Card>
        </div>

        {/* Download Reports Section */}
        <Card className="bg-gradient-to-br from-toiral-dark to-toiral-primary text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Need a detailed report?
              </h3>
              <p className="text-toiral-light">
                Download a comprehensive PDF report with all project metrics,
                timelines, and financial summaries.
              </p>
            </div>
            <Button
              variant="outline"
              className="!border-white !text-white hover:!bg-white/10 whitespace-nowrap"
            >
              <Download className="w-4 h-4 mr-2" /> Download Full Report
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
