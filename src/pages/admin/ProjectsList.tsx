import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Briefcase,
  Clock,
  MoreVertical,
  Plus } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Input } from '../../components/ui/Input';
const PROJECTS = [
{
  id: 1,
  name: 'E-commerce Redesign',
  client: 'Nike',
  status: 'In Progress',
  progress: 65,
  dueDate: 'Oct 24, 2024',
  team: ['AM', 'SW', 'JD']
},
{
  id: 2,
  name: 'Mobile App MVP',
  client: 'Uber',
  status: 'Delayed',
  progress: 30,
  dueDate: 'Nov 12, 2024',
  team: ['CB', 'AM']
},
{
  id: 3,
  name: 'Marketing Site',
  client: 'Airbnb',
  status: 'Completed',
  progress: 100,
  dueDate: 'Sep 30, 2024',
  team: ['JD', 'SW']
},
{
  id: 4,
  name: 'Internal Dashboard',
  client: 'Netflix',
  status: 'Planning',
  progress: 15,
  dueDate: 'Dec 15, 2024',
  team: ['AM', 'CB']
}];

export function ProjectsList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filteredProjects = PROJECTS.filter((project) => {
    const matchesFilter = filter === 'All' || project.status === filter;
    const matchesSearch =
    project.name.toLowerCase().includes(search.toLowerCase()) ||
    project.client.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-toiral-dark">Projects</h1>
            <p className="text-gray-500 mt-1">
              Manage and track all ongoing client projects.
            </p>
          </div>
          <Button onClick={() => navigate('/admin/clients/new')}>
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            {['All', 'In Progress', 'Planning', 'Completed', 'Delayed'].map(
              (status) =>
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                  ${filter === status ? 'bg-toiral-primary text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}>

                  {status}
                </button>

            )}
          </div>
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              className="pl-10 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />

          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) =>
          <Card
            key={project.id}
            hoverable
            className="cursor-pointer flex flex-col"
            onClick={() => navigate(`/admin/projects/${project.id}`)}>

              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-toiral-light/20 flex items-center justify-center text-toiral-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <Badge
                variant={
                project.status === 'Completed' ?
                'success' :
                project.status === 'Delayed' ?
                'error' :
                project.status === 'Planning' ?
                'neutral' :
                'info'
                }>

                  {project.status}
                </Badge>
              </div>

              <h3 className="text-lg font-bold text-toiral-dark mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 mb-6">{project.client}</p>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-toiral-dark">
                    {project.progress}%
                  </span>
                </div>
                <ProgressBar
                progress={project.progress}
                showPercentage={false}
                className="h-2" />

              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {project.team.map((initial, i) =>
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">

                      {initial}
                    </div>
                )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {project.dueDate}
                </div>
              </div>
            </Card>
          )}
        </div>

        {filteredProjects.length === 0 &&
        <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No projects found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search.
            </p>
          </div>
        }
      </div>
    </DashboardLayout>);

}