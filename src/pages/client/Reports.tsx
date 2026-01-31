import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  FileText,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Chart } from '../../components/ui/Chart';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StarDoodle } from '../../components/doodles/StarDoodle';
const MONTHLY_PROGRESS = [
{
  label: 'Jun',
  value: 15
},
{
  label: 'Jul',
  value: 28
},
{
  label: 'Aug',
  value: 42
},
{
  label: 'Sep',
  value: 55
},
{
  label: 'Oct',
  value: 65
},
{
  label: 'Nov',
  value: 72
}];

const PROJECT_PHASES = [
{
  name: 'Discovery & Strategy',
  progress: 100,
  status: 'completed',
  hours: 24
},
{
  name: 'UX/UI Design',
  progress: 100,
  status: 'completed',
  hours: 48
},
{
  name: 'Frontend Development',
  progress: 65,
  status: 'in-progress',
  hours: 86
},
{
  name: 'Backend Integration',
  progress: 20,
  status: 'in-progress',
  hours: 18
},
{
  name: 'Testing & QA',
  progress: 0,
  status: 'pending',
  hours: 0
},
{
  name: 'Launch & Deployment',
  progress: 0,
  status: 'pending',
  hours: 0
}];

const RECENT_ACTIVITY = [
{
  action: 'Design mockups approved',
  date: 'Oct 18, 2024',
  type: 'approval'
},
{
  action: 'Frontend sprint completed',
  date: 'Oct 15, 2024',
  type: 'milestone'
},
{
  action: 'Invoice #1023 paid',
  date: 'Oct 12, 2024',
  type: 'payment'
},
{
  action: 'New comment on wireframes',
  date: 'Oct 10, 2024',
  type: 'comment'
},
{
  action: 'Phase 2 started',
  date: 'Oct 05, 2024',
  type: 'milestone'
}];

export function Reports() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>(
    'month'
  );
  const stats = [
  {
    label: 'Overall Progress',
    value: '65%',
    change: '+12%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-toiral-primary',
    bg: 'bg-toiral-light/30'
  },
  {
    label: 'Hours Logged',
    value: '176',
    change: '+24h',
    trend: 'up',
    icon: Clock,
    color: 'text-blue-500',
    bg: 'bg-blue-100'
  },
  {
    label: 'Tasks Completed',
    value: '48/72',
    change: '67%',
    trend: 'neutral',
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-100'
  },
  {
    label: 'Days Remaining',
    value: '28',
    change: 'On Track',
    trend: 'neutral',
    icon: Calendar,
    color: 'text-purple-500',
    bg: 'bg-purple-100'
  }];

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
              {(['week', 'month', 'quarter'] as const).map((range) =>
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${timeRange === range ? 'bg-white text-toiral-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              )}
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) =>
          <motion.div
            key={stat.label}
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
            }}
            className="h-full">

              <Card className="relative overflow-hidden h-full">
                <div className="flex items-start justify-between h-full">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-toiral-dark">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-auto pt-2">
                      {stat.trend === 'up' &&
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    }
                      {stat.trend === 'down' &&
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    }
                      <span
                      className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>

                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                  className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center flex-shrink-0`}>

                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
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
              data={MONTHLY_PROGRESS}
              type="bar"
              height={240}
              color="#149499"
              formatValue={(v) => `${v}%`} />

          </Card>

          {/* Project Health */}
          <Card className="relative overflow-hidden">
            <StarDoodle
              className="absolute top-4 right-4 opacity-20"
              size={40} />

            <h3 className="font-bold text-toiral-dark mb-6">Project Health</h3>

            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#E4F0EF"
                  strokeWidth="12" />

                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#149499"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  initial={{
                    strokeDashoffset: 251.2
                  }}
                  animate={{
                    strokeDashoffset: 251.2 * (1 - 0.65)
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut'
                  }} />

              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-toiral-dark">65%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-600">On Schedule</span>
                </div>
                <Badge variant="success">Good</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600">Budget Status</span>
                </div>
                <Badge variant="info">64% Used</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-gray-600">Open Issues</span>
                </div>
                <Badge variant="warning">2 Items</Badge>
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
              <Badge variant="info">6 Phases</Badge>
            </div>
            <div className="space-y-4">
              {PROJECT_PHASES.map((phase, index) =>
              <motion.div
                key={phase.name}
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
                }}>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                      className={`w-2 h-2 rounded-full ${phase.status === 'completed' ? 'bg-green-500' : phase.status === 'in-progress' ? 'bg-toiral-primary' : 'bg-gray-300'}`} />

                      <span
                      className={`text-sm font-medium ${phase.status === 'pending' ? 'text-gray-400' : 'text-toiral-dark'}`}>

                        {phase.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {phase.hours}h
                    </span>
                  </div>
                  <ProgressBar
                  progress={phase.progress}
                  showPercentage={false}
                  className="h-2"
                  color={
                  phase.status === 'completed' ?
                  'bg-green-500' :
                  phase.status === 'in-progress' ?
                  'bg-toiral-primary' :
                  'bg-gray-200'
                  } />

                </motion.div>
              )}
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
            <div className="space-y-4">
              {RECENT_ACTIVITY.map((activity, index) =>
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 10
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.1
                }}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">

                  <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'approval' ? 'bg-green-100 text-green-600' : activity.type === 'milestone' ? 'bg-blue-100 text-blue-600' : activity.type === 'payment' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>

                    {activity.type === 'approval' &&
                  <CheckCircle className="w-4 h-4" />
                  }
                    {activity.type === 'milestone' &&
                  <Activity className="w-4 h-4" />
                  }
                    {activity.type === 'payment' &&
                  <FileText className="w-4 h-4" />
                  }
                    {activity.type === 'comment' &&
                  <FileText className="w-4 h-4" />
                  }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-toiral-dark">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {activity.date}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
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
              className="!border-white !text-white hover:!bg-white/10 whitespace-nowrap">

              <Download className="w-4 h-4 mr-2" /> Download Full Report
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>);

}