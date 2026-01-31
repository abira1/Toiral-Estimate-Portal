import React, { useState } from 'react';
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
  ExternalLink } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { FileUpload } from '../../components/ui/FileUpload';
import { TeamMemberCard } from '../../components/ui/TeamMemberCard';
const PROJECT = {
  id: 1,
  name: 'E-commerce Redesign',
  client: 'Nike',
  description:
  'Complete overhaul of the main e-commerce platform including new UX/UI, React frontend, and headless CMS integration.',
  status: 'In Progress',
  progress: 65,
  startDate: 'Sep 01, 2024',
  dueDate: 'Oct 24, 2024',
  budget: '$45,000',
  team: [
  {
    id: '1',
    name: 'Alex Morgan',
    role: 'Project Manager',
    projectCount: 3
  },
  {
    id: '2',
    name: 'Sam Wilson',
    role: 'Lead Developer',
    projectCount: 5
  }],

  milestones: [
  {
    title: 'Discovery',
    date: 'Sep 15',
    status: 'completed'
  },
  {
    title: 'Design',
    date: 'Oct 01',
    status: 'completed'
  },
  {
    title: 'Development',
    date: 'Oct 20',
    status: 'active'
  },
  {
    title: 'Testing',
    date: 'Oct 24',
    status: 'pending'
  }],

  documents: [
  {
    name: 'Project_Brief.pdf',
    size: '2.4 MB',
    date: 'Sep 01'
  },
  {
    name: 'Design_System_v1.fig',
    size: '14 MB',
    date: 'Sep 15'
  }]

};
export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
  {
    id: 'overview',
    label: 'Overview'
  },
  {
    id: 'timeline',
    label: 'Timeline'
  },
  {
    id: 'team',
    label: 'Team'
  },
  {
    id: 'documents',
    label: 'Documents'
  }];

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/projects')}
            className="mb-4 pl-0 hover:bg-transparent hover:text-toiral-primary">

            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-toiral-dark">
                  {PROJECT.name}
                </h1>
                <Badge variant="info">{PROJECT.status}</Badge>
              </div>
              <p className="text-gray-500 flex items-center gap-2">
                Client:{' '}
                <span className="font-bold text-toiral-dark">
                  {PROJECT.client}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => navigate('/admin/clients/1')}>

                  View Profile <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Edit Project</Button>
              <Button>Update Status</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                  pb-4 text-sm font-semibold relative whitespace-nowrap transition-colors
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-4">
                      Description
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {PROJECT.description}
                    </p>
                  </Card>
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-6">
                      Progress
                    </h3>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-500">Overall Completion</span>
                      <span className="font-bold text-toiral-dark">
                        {PROJECT.progress}%
                      </span>
                    </div>
                    <ProgressBar
                    progress={PROJECT.progress}
                    showPercentage={false} />


                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Days Left</p>
                        <p className="text-xl font-bold text-toiral-dark">14</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Tasks Done</p>
                        <p className="text-xl font-bold text-toiral-dark">
                          24/32
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Issues</p>
                        <p className="text-xl font-bold text-red-500">2</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl text-center">
                        <p className="text-xs text-gray-500 mb-1">Team</p>
                        <p className="text-xl font-bold text-toiral-dark">
                          {PROJECT.team.length}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
                <div className="space-y-6">
                  <Card>
                    <h3 className="font-bold text-toiral-dark mb-4">
                      Key Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">
                          Start Date
                        </span>
                        <span className="font-medium">{PROJECT.startDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Due Date</span>
                        <span className="font-medium">{PROJECT.dueDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 text-sm">Budget</span>
                        <span className="font-bold text-green-600">
                          {PROJECT.budget}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            }

            {activeTab === 'timeline' &&
            <Card>
                <div className="relative pl-8 space-y-8 max-w-2xl">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                  {PROJECT.milestones.map((milestone, index) =>
                <div
                  key={index}
                  className="relative flex items-center gap-4">

                      <div
                    className={`
                        w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center bg-white
                        ${milestone.status === 'completed' ? 'border-green-500 text-green-500' : milestone.status === 'active' ? 'border-toiral-primary text-toiral-primary' : 'border-gray-300 text-gray-300'}
                      `}>

                        <div
                      className={`w-2 h-2 rounded-full ${milestone.status === 'completed' ? 'bg-green-500' : milestone.status === 'active' ? 'bg-toiral-primary' : 'bg-transparent'}`} />

                      </div>
                      <div className="flex-1 bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                        <span
                      className={`font-bold ${milestone.status === 'pending' ? 'text-gray-400' : 'text-toiral-dark'}`}>

                          {milestone.title}
                        </span>
                        <span className="text-sm text-gray-500">
                          {milestone.date}
                        </span>
                      </div>
                    </div>
                )}
                </div>
              </Card>
            }

            {activeTab === 'team' &&
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROJECT.team.map((member) =>
              <TeamMemberCard key={member.id} {...member} />
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
            }

            {activeTab === 'documents' &&
            <div className="space-y-6">
                <FileUpload label="Upload New Document" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PROJECT.documents.map((doc, i) =>
                <Card key={i} hoverable className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-toiral-dark">
                          {doc.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {doc.size} • {doc.date}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </Card>
                )}
                </div>
              </div>
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>);

}