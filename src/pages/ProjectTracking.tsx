import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
export function ProjectTracking() {
  const milestones = [
  {
    id: 1,
    title: 'Discovery & Strategy',
    status: 'completed',
    date: 'Sep 15'
  },
  {
    id: 2,
    title: 'Wireframing',
    status: 'completed',
    date: 'Sep 22'
  },
  {
    id: 3,
    title: 'UI Design',
    status: 'completed',
    date: 'Oct 05'
  },
  {
    id: 4,
    title: 'Frontend Development',
    status: 'active',
    date: 'In Progress'
  },
  {
    id: 5,
    title: 'Backend Integration',
    status: 'pending',
    date: 'Upcoming'
  },
  {
    id: 6,
    title: 'QA & Testing',
    status: 'pending',
    date: 'Upcoming'
  },
  {
    id: 7,
    title: 'Launch',
    status: 'pending',
    date: 'Nov 15'
  }];

  return (
    <DashboardLayout userRole="client">
      <div className="space-y-8">
        <div className="bg-toiral-dark rounded-3xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <Badge
                variant="info"
                className="mb-3 bg-white/20 text-white border-none">

                Active Project
              </Badge>
              <h1 className="text-3xl font-bold mb-2">E-commerce Redesign</h1>
              <p className="text-toiral-light">
                Client: Nike • Started Sep 01, 2024
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm min-w-[200px]">
              <p className="text-sm text-gray-300 mb-1">Overall Progress</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">57%</span>
                <span className="text-sm text-green-400 mb-1">On Track</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-bold text-toiral-dark mb-6">
                Project Timeline
              </h2>
              <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100" />

                {milestones.map((milestone) =>
                <div
                  key={milestone.id}
                  className="relative flex items-start gap-4">

                    <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center z-10 bg-white
                      ${milestone.status === 'completed' ? 'text-green-500' : milestone.status === 'active' ? 'text-toiral-primary ring-4 ring-toiral-primary/20' : 'text-gray-300'}
                    `}>

                      {milestone.status === 'completed' ?
                    <CheckCircle className="w-6 h-6 fill-green-100" /> :
                    milestone.status === 'active' ?
                    <Clock className="w-6 h-6 fill-toiral-light" /> :

                    <Circle className="w-6 h-6" />
                    }
                    </div>
                    <div className="flex-1 pt-0.5">
                      <div className="flex justify-between items-start">
                        <h3
                        className={`font-bold ${milestone.status === 'pending' ? 'text-gray-400' : 'text-toiral-dark'}`}>

                          {milestone.title}
                        </h3>
                        <span className="text-sm text-gray-500 font-medium">
                          {milestone.date}
                        </span>
                      </div>
                      {milestone.status === 'active' &&
                    <div className="mt-3">
                          <ProgressBar
                        progress={45}
                        className="h-2"
                        showPercentage={false} />

                          <p className="text-xs text-toiral-primary mt-2 font-medium">
                            Currently working on component library
                          </p>
                        </div>
                    }
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <h3 className="font-bold text-toiral-dark mb-4">Project Team</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <p className="font-bold text-sm text-toiral-dark">
                      Alex Morgan
                    </p>
                    <p className="text-xs text-gray-500">Project Manager</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div>
                    <p className="font-bold text-sm text-toiral-dark">
                      Sam Wilson
                    </p>
                    <p className="text-xs text-gray-500">Lead Developer</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-toiral-bg-light border-toiral-light">
              <h3 className="font-bold text-toiral-dark mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about the timeline or deliverables?
              </p>
              <button className="text-toiral-primary font-bold text-sm hover:underline">
                Contact Project Manager →
              </button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>);

}