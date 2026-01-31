import React, { useState, Component } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Briefcase,
  CheckCircle,
  DollarSign,
  Plus,
  FileText,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Eye,
  Loader2 } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Chart } from '../../components/ui/Chart';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
// Project status configuration with colors and icons
const STATUS_CONFIG = {
  Planning: {
    color: '#6B7280',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    icon: Clock,
    description: 'In planning phase'
  },
  'In Progress': {
    color: '#149499',
    bgColor: 'bg-toiral-light/30',
    textColor: 'text-toiral-primary',
    icon: PlayCircle,
    description: 'Currently active'
  },
  Review: {
    color: '#F59E0B',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-600',
    icon: Eye,
    description: 'Awaiting review'
  },
  Completed: {
    color: '#10B981',
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    icon: CheckCircle,
    description: 'Successfully delivered'
  },
  Delayed: {
    color: '#EF4444',
    bgColor: 'bg-red-100',
    textColor: 'text-red-500',
    icon: AlertCircle,
    description: 'Behind schedule'
  }
};
// Mock projects data (in real app, this would come from API/state)
const ALL_PROJECTS = [
{
  id: 1,
  name: 'E-commerce Redesign',
  client: 'Nike',
  status: 'In Progress',
  progress: 75
},
{
  id: 2,
  name: 'Mobile App MVP',
  client: 'Uber',
  status: 'Delayed',
  progress: 30
},
{
  id: 3,
  name: 'Marketing Site',
  client: 'Airbnb',
  status: 'Review',
  progress: 90
},
{
  id: 4,
  name: 'Internal Dashboard',
  client: 'Netflix',
  status: 'Planning',
  progress: 15
},
{
  id: 5,
  name: 'Brand Refresh',
  client: 'Spotify',
  status: 'In Progress',
  progress: 45
},
{
  id: 6,
  name: 'API Integration',
  client: 'Stripe',
  status: 'In Progress',
  progress: 60
},
{
  id: 7,
  name: 'Landing Page',
  client: 'Dropbox',
  status: 'Completed',
  progress: 100
},
{
  id: 8,
  name: 'Mobile Redesign',
  client: 'Slack',
  status: 'Completed',
  progress: 100
},
{
  id: 9,
  name: 'Dashboard v2',
  client: 'Notion',
  status: 'Review',
  progress: 85
},
{
  id: 10,
  name: 'Checkout Flow',
  client: 'Shopify',
  status: 'In Progress',
  progress: 55
},
{
  id: 11,
  name: 'Analytics Portal',
  client: 'Mixpanel',
  status: 'Planning',
  progress: 10
},
{
  id: 12,
  name: 'User Portal',
  client: 'Zendesk',
  status: 'Completed',
  progress: 100
}];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const stats = [
  {
    label: 'Total Clients',
    value: '124',
    icon: Users,
    color: 'text-blue-500',
    bg: 'bg-blue-100'
  },
  {
    label: 'Active Projects',
    value: '12',
    icon: Briefcase,
    color: 'text-toiral-primary',
    bg: 'bg-toiral-light/30'
  },
  {
    label: 'Completed',
    value: '48',
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-100'
  },
  {
    label: 'Revenue',
    value: '$84k',
    icon: DollarSign,
    color: 'text-purple-500',
    bg: 'bg-purple-100'
  }];

  const revenueData = [
  {
    label: 'May',
    value: 45000
  },
  {
    label: 'Jun',
    value: 52000
  },
  {
    label: 'Jul',
    value: 48000
  },
  {
    label: 'Aug',
    value: 61000
  },
  {
    label: 'Sep',
    value: 55000
  },
  {
    label: 'Oct',
    value: 84000
  }];

  // Calculate status counts from projects
  const statusCounts = ALL_PROJECTS.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const totalProjects = ALL_PROJECTS.length;
  // Status data for display
  const projectStatusData = [
  {
    label: 'Planning',
    value: statusCounts['Planning'] || 0
  },
  {
    label: 'In Progress',
    value: statusCounts['In Progress'] || 0
  },
  {
    label: 'Review',
    value: statusCounts['Review'] || 0
  },
  {
    label: 'Completed',
    value: statusCounts['Completed'] || 0
  },
  {
    label: 'Delayed',
    value: statusCounts['Delayed'] || 0
  }].
  filter((item) => item.value > 0);
  // Get filtered projects based on selected status
  const filteredProjects = selectedStatus ?
  ALL_PROJECTS.filter((p) => p.status === selectedStatus) :
  ALL_PROJECTS.filter((p) => p.status !== 'Completed').slice(0, 3);
  const handleStatusClick = (status: string) => {
    if (selectedStatus === status) {
      setSelectedStatus(null);
    } else {
      setSelectedStatus(status);
    }
  };
  const handleViewAllProjects = () => {
    if (selectedStatus) {
      navigate(`/admin/projects?status=${encodeURIComponent(selectedStatus)}`);
    } else {
      navigate('/admin/projects');
    }
  };
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 pb-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-toiral-dark">Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/invoices')}>

              <FileText className="w-4 h-4 mr-2" /> Invoices
            </Button>
            <Button size="sm" onClick={() => navigate('/admin/clients/new')}>
              <Plus className="w-4 h-4 mr-2" /> New Client
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}>

              <Card hoverable className="flex items-center gap-4">
                <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color}`}>

                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-toiral-dark">
                    {stat.value}
                  </h3>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="lg:col-span-2 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
              <h3 className="font-bold text-toiral-dark flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-toiral-primary" />
                Revenue Overview
              </h3>
              <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 cursor-pointer">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="w-full">
              <Chart
                data={revenueData}
                type="line"
                height={window.innerWidth < 640 ? 200 : 280}
                showGrid={true} />

            </div>
          </Card>

          {/* Enhanced Project Status Card */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-toiral-dark">Project Status</h3>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                {totalProjects} Total
              </span>
            </div>

            {/* Donut Chart Visual */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let cumulativePercent = 0;
                  return projectStatusData.map((item, index) => {
                    const percent = item.value / totalProjects * 100;
                    const config =
                    STATUS_CONFIG[item.label as keyof typeof STATUS_CONFIG];
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = -cumulativePercent;
                    cumulativePercent += percent;
                    return (
                      <motion.circle
                        key={item.label}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={config?.color || '#gray'}
                        strokeWidth="12"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300"
                        style={{
                          opacity:
                          selectedStatus && selectedStatus !== item.label ?
                          0.3 :
                          1
                        }}
                        initial={{
                          pathLength: 0
                        }}
                        animate={{
                          pathLength: 1
                        }}
                        transition={{
                          duration: 1,
                          delay: index * 0.1
                        }}
                        onClick={() => handleStatusClick(item.label)} />);


                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedStatus || 'all'}
                    initial={{
                      opacity: 0,
                      scale: 0.8
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.8
                    }}
                    className="text-center">

                    <span className="text-2xl font-bold text-toiral-dark">
                      {selectedStatus ?
                      statusCounts[selectedStatus] :
                      totalProjects}
                    </span>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {selectedStatus || 'Projects'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Status Legend - Interactive */}
            <div className="space-y-2">
              {projectStatusData.map((item, index) => {
                const config =
                STATUS_CONFIG[item.label as keyof typeof STATUS_CONFIG];
                const Icon = config?.icon || Briefcase;
                const percentage = Math.round(
                  item.value / totalProjects * 100
                );
                const isSelected = selectedStatus === item.label;
                return (
                  <motion.button
                    key={item.label}
                    initial={{
                      opacity: 0,
                      x: -10
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    transition={{
                      delay: 0.3 + index * 0.05
                    }}
                    onClick={() => handleStatusClick(item.label)}
                    className={`
                      w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200
                      ${isSelected ? `${config?.bgColor} ring-2 ring-offset-1` : 'hover:bg-gray-50'}
                      ${selectedStatus && !isSelected ? 'opacity-50' : 'opacity-100'}
                    `}
                    style={{
                      ['--tw-ring-color' as string]: config?.color
                    }}>

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${config?.bgColor}`}>

                      <Icon className={`w-4 h-4 ${config?.textColor}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-toiral-dark">
                          {item.label}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{
                            color: config?.color
                          }}>

                          {item.value}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: config?.color
                          }}
                          initial={{
                            width: 0
                          }}
                          animate={{
                            width: `${percentage}%`
                          }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5 + index * 0.1
                          }} />

                      </div>
                    </div>
                  </motion.button>);

              })}
            </div>

            {/* View Projects Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-toiral-primary"
              onClick={handleViewAllProjects}>

              {selectedStatus ?
              `View ${selectedStatus} Projects` :
              'View All Projects'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects - Now filtered by status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-toiral-dark">
                  {selectedStatus ?
                  `${selectedStatus} Projects` :
                  'Active Projects'}
                </h2>
                {selectedStatus &&
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="text-xs text-gray-500 hover:text-toiral-primary transition-colors flex items-center gap-1">

                    Clear filter ×
                  </button>
                }
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAllProjects}>
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedStatus || 'default'}
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
                }}
                className="space-y-4">

                {filteredProjects.length > 0 ?
                filteredProjects.slice(0, 4).map((project, index) => {
                  const config =
                  STATUS_CONFIG[
                  project.status as keyof typeof STATUS_CONFIG];

                  return (
                    <motion.div
                      key={project.id}
                      initial={{
                        opacity: 0,
                        x: -20
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      transition={{
                        delay: index * 0.05
                      }}>

                        <Card
                        hoverable
                        className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 cursor-pointer"
                        onClick={() =>
                        navigate(`/admin/projects/${project.id}`)
                        }>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-toiral-dark">
                                {project.name}
                              </h3>
                              <Badge
                              variant={
                              project.status === 'Delayed' ?
                              'error' :
                              project.status === 'Completed' ?
                              'success' :
                              project.status === 'Review' ?
                              'warning' :
                              project.status === 'Planning' ?
                              'neutral' :
                              'info'
                              }>

                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              {project.client}
                            </p>
                            <ProgressBar
                            progress={project.progress}
                            color={
                            config?.color ?
                            `bg-[${config.color}]` :
                            undefined
                            } />

                          </div>
                          <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto">

                            Details
                          </Button>
                        </Card>
                      </motion.div>);

                }) :

                <Card className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500">
                      No {selectedStatus?.toLowerCase()} projects found
                    </p>
                  </Card>
                }
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-toiral-dark">
              Quick Actions
            </h2>
            <Card>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => navigate('/admin/clients/new')}>

                  <Plus className="w-4 h-4 mr-3 text-toiral-primary" />
                  Add New Client
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => navigate('/admin/projects')}>

                  <Briefcase className="w-4 h-4 mr-3 text-toiral-primary" />
                  Manage Projects
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12"
                  onClick={() => navigate('/admin/invoices')}>

                  <FileText className="w-4 h-4 mr-3 text-toiral-primary" />
                  Create Invoice
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}