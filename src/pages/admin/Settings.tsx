import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Trash2,
  Shield,
  User,
  Upload,
  X,
  Users,
  Crown,
  CheckCircle,
  Camera } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useData } from '../../contexts/DataContext';
import { teamService } from '../../lib/firebaseServices';

const INITIAL_ADMINS = [
{
  id: 1,
  name: 'Admin User',
  email: 'admin@toiral.com',
  role: 'Administrator',
  hasAccess: true,
  canModerate: true
},
{
  id: 2,
  name: 'Alex Morgan',
  email: 'alex@toiral.com',
  role: 'Moderator',
  hasAccess: true,
  canModerate: true
}];

export function Settings() {
  const { teamMembers, teamLoading } = useData();
  const [activeTab, setActiveTab] = useState<'team' | 'admin'>('team');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: '',
    image: null as File | null,
    imagePreview: null as string | null
  });
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewMember({
        ...newMember,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };
  const handleRemoveImage = () => {
    setNewMember({
      ...newMember,
      image: null,
      imagePreview: null
    });
  };
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = {
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      projectCount: 0
    };
    
    await teamService.create(member);
    
    setNewMember({
      name: '',
      email: '',
      role: '',
      image: null,
      imagePreview: null
    });
    setIsAddMemberModalOpen(false);
  };
  const handleRemoveMember = async () => {
    if (memberToRemove) {
      // Firebase deletion would go here if we had a delete method
      // For now, just close the modal
      setMemberToRemove(null);
      setIsRemoveMemberModalOpen(false);
    }
  };
  const handleToggleModeratorAccess = (adminId: number) => {
    setAdmins(
      admins.map((admin) =>
      admin.id === adminId ?
      {
        ...admin,
        canModerate: !admin.canModerate,
        role: !admin.canModerate ? 'Moderator' : 'Team Member'
      } :
      admin
      )
    );
  };
  const tabs = [
  {
    id: 'team',
    label: 'Team Members',
    icon: Users
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Shield
  }];

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-toiral-dark">
              Settings
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Manage team members and admin access control.
            </p>
          </div>
          {activeTab === 'team' &&
          <Button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="w-full md:w-auto">

              <Plus className="w-4 h-4 mr-2" /> Add Team Member
            </Button>
          }
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'team' | 'admin')}
              className={`
                  pb-3 md:pb-4 text-sm md:text-base font-semibold relative whitespace-nowrap transition-colors flex items-center gap-2
                  ${activeTab === tab.id ? 'text-toiral-primary' : 'text-gray-500 hover:text-gray-700'}
                `}>

                <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                {tab.label}
                {activeTab === tab.id &&
              <motion.div
                layoutId="activeSettingsTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-toiral-primary rounded-full" />

              }
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'team' &&
        <div className="space-y-4">
            <Card className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-toiral-dark">
                  Team Members ({teamMembers.length})
                </h2>
                <Badge variant="success" className="text-xs">
                  Real-time Data
                </Badge>
              </div>

              {teamLoading ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 border-4 border-toiral-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 mt-4">Loading team members...</p>
                </div>
              ) : (
                <>
                  {/* Mobile: Card Layout */}
                  <div className="block md:hidden space-y-3">
                    {teamMembers.map((member, index) =>
                  <motion.div
                    key={member.id}
                    initial={{
                      opacity: 0,
                      y: 20
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      delay: index * 0.05
                    }}>

                        <Card className="p-4 bg-gray-50 border-gray-100">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-toiral-light/30 flex items-center justify-center text-toiral-primary font-bold flex-shrink-0">
                              {member.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-toiral-dark truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <Badge variant="neutral" className="text-xs">
                                {member.role}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {member.projectCount} projects
                              </span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                  )}
                  </div>

                  {/* Desktop: Table Layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-semibold rounded-l-lg">
                            Member
                          </th>
                          <th className="px-6 py-4 font-semibold">Role</th>
                          <th className="px-6 py-4 font-semibold">Email</th>
                          <th className="px-6 py-4 font-semibold">Projects</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {teamMembers.map((member, index) =>
                      <motion.tr
                        key={member.id}
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
                        }}
                        className="hover:bg-gray-50/50 transition-colors">

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-toiral-light/30 flex items-center justify-center text-toiral-primary font-bold text-sm">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-toiral-dark">
                                    {member.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant="neutral">{member.role}</Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {member.email}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600">
                              {member.projectCount} Active
                            </td>
                          </motion.tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {!teamLoading && teamMembers.length === 0 &&
            <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 mb-4">No team members yet</p>
                  <Button onClick={() => setIsAddMemberModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add First Member
                  </Button>
                </div>
            }
            </Card>
          </div>
        }

        {activeTab === 'admin' &&
        <div className="space-y-4">
            <Card className="p-4 md:p-6">
              <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-blue-900 text-sm md:text-base">
                    Admin Access Control
                  </h3>
                  <p className="text-xs md:text-sm text-blue-700 mt-1">
                    Grant moderator access to allow users to manage the admin
                    panel. Only administrators can assign moderator roles.
                  </p>
                </div>
              </div>

              <h2 className="text-lg md:text-xl font-bold text-toiral-dark mb-4 md:mb-6">
                Administration ({admins.length})
              </h2>

              {/* Mobile: Card Layout */}
              <div className="block md:hidden space-y-3">
                {admins.map((admin, index) =>
              <motion.div
                key={admin.id}
                initial={{
                  opacity: 0,
                  y: 20
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.05
                }}>

                    <Card className="p-4 bg-gray-50 border-gray-100">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-toiral-dark flex items-center justify-center text-white font-bold flex-shrink-0">
                          {admin.role === 'Administrator' ?
                      <Crown className="w-6 h-6" /> :

                      <Shield className="w-6 h-6" />
                      }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-toiral-dark truncate">
                            {admin.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <Badge
                      variant={
                      admin.role === 'Administrator' ?
                      'error' :
                      admin.canModerate ?
                      'warning' :
                      'neutral'
                      }
                      className="text-xs">

                          {admin.role}
                        </Badge>
                        {admin.role !== 'Administrator' &&
                    <button
                      onClick={() =>
                      handleToggleModeratorAccess(admin.id)
                      }
                      className={`
                              flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                              ${admin.canModerate ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                            `}>

                            {admin.canModerate ?
                      <>
                                <CheckCircle className="w-3 h-3" /> Revoke
                                Access
                              </> :

                      <>
                                <Shield className="w-3 h-3" /> Grant Access
                              </>
                      }
                          </button>
                    }
                      </div>
                    </Card>
                  </motion.div>
              )}
              </div>

              {/* Desktop: Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold rounded-l-lg">
                        User
                      </th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Access Level</th>
                      <th className="px-6 py-4 font-semibold text-right rounded-r-lg">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {admins.map((admin, index) =>
                  <motion.tr
                    key={admin.id}
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
                    }}
                    className="hover:bg-gray-50/50 transition-colors">

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-toiral-dark flex items-center justify-center text-white">
                              {admin.role === 'Administrator' ?
                          <Crown className="w-5 h-5" /> :

                          <Shield className="w-5 h-5" />
                          }
                            </div>
                            <div>
                              <p className="font-bold text-toiral-dark">
                                {admin.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {admin.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                        variant={
                        admin.role === 'Administrator' ?
                        'error' :
                        admin.canModerate ?
                        'warning' :
                        'neutral'
                        }>

                            {admin.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {admin.canModerate ?
                        <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">
                                  Full Admin Access
                                </span>
                              </> :

                        <>
                                <X className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  No Access
                                </span>
                              </>
                        }
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {admin.role !== 'Administrator' &&
                      <Button
                        variant={
                        admin.canModerate ? 'outline' : 'primary'
                        }
                        size="sm"
                        onClick={() =>
                        handleToggleModeratorAccess(admin.id)
                        }
                        className="h-9">

                              {admin.canModerate ?
                        <>
                                  <X className="w-4 h-4 mr-2" /> Revoke Access
                                </> :

                        <>
                                  <Shield className="w-4 h-4 mr-2" /> Grant
                                  Moderator
                                </>
                        }
                            </Button>
                      }
                          {admin.role === 'Administrator' &&
                      <span className="text-xs text-gray-400 italic">
                              Protected
                            </span>
                      }
                        </td>
                      </motion.tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        }

        {/* Add Team Member Modal - MOBILE OPTIMIZED */}
        <Modal
          isOpen={isAddMemberModalOpen}
          onClose={() => {
            setIsAddMemberModalOpen(false);
            setNewMember({
              name: '',
              email: '',
              role: '',
              image: null,
              imagePreview: null
            });
          }}
          title="Add New Team Member"
          className="max-w-lg">

          <form onSubmit={handleAddMember} className="space-y-4 md:space-y-5">
            {/* Image Upload - Mobile Optimized */}
            <div>
              <label className="block text-sm font-medium text-toiral-dark mb-3">
                Profile Image (Optional)
              </label>
              {!newMember.imagePreview ?
              <div className="relative">
                  <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="member-image" />

                  <label
                  htmlFor="member-image"
                  className="flex flex-col items-center justify-center w-full h-40 md:h-32 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-toiral-primary hover:bg-toiral-primary/5 transition-all active:scale-[0.98]">

                    <div className="w-12 h-12 md:w-10 md:h-10 bg-toiral-light/30 rounded-full flex items-center justify-center mb-3 md:mb-2">
                      <Camera className="w-6 h-6 md:w-5 md:h-5 text-toiral-primary" />
                    </div>
                    <span className="text-sm md:text-sm font-medium text-gray-700">
                      Tap to upload photo
                    </span>
                    <span className="text-xs text-gray-400 mt-1.5 md:mt-1">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div> :

              <div className="relative w-32 h-32 md:w-28 md:h-28 mx-auto">
                  <img
                  src={newMember.imagePreview}
                  alt="Preview"
                  className="w-full h-full rounded-2xl object-cover shadow-lg" />

                  <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-8 h-8 md:w-7 md:h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all shadow-lg">

                    <X className="w-4 h-4" />
                  </button>
                </div>
              }
            </div>

            {/* Form Fields - Mobile Optimized Spacing */}
            <div className="space-y-3.5 md:space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Jane Doe"
                value={newMember.name}
                onChange={(e) =>
                setNewMember({
                  ...newMember,
                  name: e.target.value
                })
                }
                required
                className="text-base md:text-sm" />

              <Input
                label="Email Address"
                type="email"
                placeholder="jane@toiral.com"
                value={newMember.email}
                onChange={(e) =>
                setNewMember({
                  ...newMember,
                  email: e.target.value
                })
                }
                required
                className="text-base md:text-sm" />

              <Input
                label="Role / Position"
                placeholder="e.g. Frontend Developer"
                value={newMember.role}
                onChange={(e) =>
                setNewMember({
                  ...newMember,
                  role: e.target.value
                })
                }
                required
                className="text-base md:text-sm" />

            </div>

            {/* Info Box - Mobile Optimized */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 md:p-4">
              <div className="flex gap-2 md:gap-3">
                <Shield className="w-4 h-4 md:w-4 md:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs md:text-xs text-blue-700 leading-relaxed">
                  <strong>Note:</strong> Team members will be added to the team
                  list and can be assigned to projects. They will not have admin
                  panel access unless granted moderator role in the
                  Administration section.
                </p>
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="pt-2 md:pt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setIsAddMemberModalOpen(false);
                  setNewMember({
                    name: '',
                    email: '',
                    role: '',
                    image: null,
                    imagePreview: null
                  });
                }}
                className="w-full sm:w-auto h-11 md:h-10">

                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto h-11 md:h-10">
                <Plus className="w-4 h-4 mr-2" /> Add Member
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>);

}