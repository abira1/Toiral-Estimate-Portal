import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Copy,
  UserPlus,
  Building,
  Mail,
  Phone,
  Briefcase,
  Share2,
  Send,
  Check,
  Key,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Stepper } from '../../components/ui/Stepper';
import { TeamMemberCard } from '../../components/ui/TeamMemberCard';
import { Badge } from '../../components/ui/Badge';
import { useData } from '../../contexts/DataContext';
import type { 
  ProjectCategory, 
  Phase, 
  PaymentMilestone, 
  Note, 
  NoteCategory 
} from '../../types';

const STEPS = [
  { label: 'Client Info', description: 'Basic details' },
  { label: 'Project', description: 'Project details' },
  { label: 'Timeline', description: 'Phases' },
  { label: 'Financial', description: 'Budget & payments' },
  { label: 'Notes', description: 'Initial notes' },
  { label: 'Team', description: 'Assign members' },
  { label: 'Complete', description: 'Success' }
];

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Website Development',
  'Mobile App',
  'E-commerce',
  'Branding',
  'Marketing',
  'UI/UX Design',
  'Custom'
];

const NOTE_CATEGORIES: NoteCategory[] = [
  'Client Decision',
  'Technical Note',
  'Meeting Note',
  'General Update'
];

export function ClientOnboarding() {
  const navigate = useNavigate();
  const { teamMembers, teamLoading, createClient } = useData();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    companyName: '',
    email: '',
    phone: '',
    
    // Project Details
    projectName: '',
    projectCategory: 'Website Development' as ProjectCategory,
    customCategory: '',
    projectOverview: '',
    
    // Timeline & Phases
    phases: [] as Phase[],
    
    // Financial
    totalCost: 0,
    currency: 'USD',
    paymentMilestones: [] as PaymentMilestone[],
    
    // Notes
    initialNotes: [] as Note[],
    
    // Team
    team: [] as string[]
  });
  
  const [accessCode, setAccessCode] = useState('');

  // Input change handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Phase management
  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: '',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      deliverables: '',
      description: ''
    };
    setFormData({
      ...formData,
      phases: [...formData.phases, newPhase]
    });
  };

  const updatePhase = (id: string, field: keyof Phase, value: any) => {
    setFormData({
      ...formData,
      phases: formData.phases.map(phase =>
        phase.id === id ? { ...phase, [field]: value } : phase
      )
    });
  };

  const removePhase = (id: string) => {
    setFormData({
      ...formData,
      phases: formData.phases.filter(phase => phase.id !== id)
    });
  };

  // Payment milestone management
  const addPaymentMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: Date.now().toString(),
      name: '',
      percentage: 0,
      amount: 0,
      dueDate: '',
      status: 'Pending',
      notes: ''
    };
    setFormData({
      ...formData,
      paymentMilestones: [...formData.paymentMilestones, newMilestone]
    });
  };

  const updatePaymentMilestone = (id: string, field: keyof PaymentMilestone, value: any) => {
    setFormData({
      ...formData,
      paymentMilestones: formData.paymentMilestones.map(milestone => {
        if (milestone.id === id) {
          const updated = { ...milestone, [field]: value };
          // Auto-calculate amount when percentage changes
          if (field === 'percentage') {
            updated.amount = (formData.totalCost * (value as number)) / 100;
          }
          return updated;
        }
        return milestone;
      })
    });
  };

  const removePaymentMilestone = (id: string) => {
    setFormData({
      ...formData,
      paymentMilestones: formData.paymentMilestones.filter(m => m.id !== id)
    });
  };

  // Notes management
  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      category: 'General Update',
      content: '',
      createdAt: Date.now(),
      createdBy: 'Admin'
    };
    setFormData({
      ...formData,
      initialNotes: [...formData.initialNotes, newNote]
    });
  };

  const updateNote = (id: string, field: keyof Note, value: any) => {
    setFormData({
      ...formData,
      initialNotes: formData.initialNotes.map(note =>
        note.id === id ? { ...note, [field]: value } : note
      )
    });
  };

  const removeNote = (id: string) => {
    setFormData({
      ...formData,
      initialNotes: formData.initialNotes.filter(note => note.id !== id)
    });
  };

  // Team management
  const toggleTeamMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      team: prev.team.includes(id)
        ? prev.team.filter(t => t !== id)
        : [...prev.team, id]
    }));
  };

  // Navigation
  const handleNext = async () => {
    if (currentStep === 5) {
      // Final submission
      setLoading(true);
      setError(null);

      try {
        // Calculate financial totals
        const totalPaid = formData.paymentMilestones
          .filter(m => m.status === 'Paid')
          .reduce((sum, m) => sum + m.amount, 0);
        
        const balance = formData.totalCost - totalPaid;

        const submissionData = {
          clientName: formData.clientName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          projectName: formData.projectName,
          projectCategory: formData.projectCategory,
          customCategory: formData.customCategory,
          projectOverview: formData.projectOverview,
          phases: formData.phases,
          financial: {
            totalCost: formData.totalCost,
            currency: formData.currency,
            paymentMilestones: formData.paymentMilestones,
            totalPaid,
            balance
          },
          initialNotes: formData.initialNotes,
          team: formData.team
        };

        const response = await createClient(submissionData);
        
        if (response.success && response.client) {
          setAccessCode(response.client.accessCode);
          setCreatedClientId(response.client.id);
          setCurrentStep(6);
        } else {
          setError(response.error || 'Failed to create client. Please try again.');
        }
      } catch (err) {
        console.error('Error creating client:', err);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      `Your Project Access Code - ${formData.projectName}`
    );
    const body = encodeURIComponent(
      `Hi ${formData.clientName},\n\nYour project "${formData.projectName}" has been set up successfully!\n\nUse the following Access Code to track your project progress:\n\n${accessCode}\n\nVisit our portal and enter this code to view real-time updates on your project.\n\nBest regards,\nToiral Team`
    );
    window.open(`mailto:${formData.email}?subject=${subject}&body=${body}`);
  };

  const shareMessage = `Hi ${formData.clientName}! Your project access code is: ${accessCode} - Use this to track your project progress at our portal.`;

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`);
  };

  const shareViaSMS = () => {
    window.open(`sms:${formData.phone}?body=${encodeURIComponent(shareMessage)}`);
  };

  // Calculate total percentage for payment milestones
  const totalPercentage = formData.paymentMilestones.reduce(
    (sum, m) => sum + (m.percentage || 0),
    0
  );

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-toiral-dark mb-2">
            New Client Onboarding
          </h1>
          <p className="text-gray-500">
            Complete comprehensive client and project setup
          </p>
        </div>

        <Stepper steps={STEPS} currentStep={currentStep} className="mb-12" />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* STEP 1: Client Information */}
            {currentStep === 0 && (
              <Card className="p-8">
                <h2 className="text-xl font-bold text-toiral-dark mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-toiral-primary" />
                  Client Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Client Name"
                    name="clientName"
                    placeholder="e.g. John Doe"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="e.g. Acme Corp"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </Card>
            )}

            {/* STEP 2: Project Details */}
            {currentStep === 1 && (
              <Card className="p-8">
                <h2 className="text-xl font-bold text-toiral-dark mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-toiral-primary" />
                  Project Details
                </h2>
                <div className="space-y-6">
                  <Input
                    label="Project Name"
                    name="projectName"
                    placeholder="e.g. Corporate Website Redesign"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Category
                    </label>
                    <select
                      name="projectCategory"
                      value={formData.projectCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary"
                    >
                      {PROJECT_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {formData.projectCategory === 'Custom' && (
                    <Input
                      label="Custom Category Name"
                      name="customCategory"
                      placeholder="Enter custom category"
                      value={formData.customCategory}
                      onChange={handleInputChange}
                      required
                    />
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Overview
                    </label>
                    <textarea
                      name="projectOverview"
                      value={formData.projectOverview}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Provide a detailed overview of the project scope, objectives, and deliverables..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary resize-none"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* STEP 3: Timeline & Phases */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-toiral-dark flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-toiral-primary" />
                    Timeline & Phases
                  </h2>
                  <Button onClick={addPhase} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Phase
                  </Button>
                </div>

                {formData.phases.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No phases added yet. Add phases to structure your project timeline.
                    </p>
                    <Button onClick={addPhase} variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Add First Phase
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {formData.phases.map((phase, index) => (
                      <Card key={phase.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="info">Phase {index + 1}</Badge>
                          <button
                            onClick={() => removePhase(phase.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Phase Name"
                            placeholder="e.g. Design Phase"
                            value={phase.name}
                            onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
                            required
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Status
                            </label>
                            <select
                              value={phase.status}
                              onChange={(e) => updatePhase(phase.id, 'status', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary"
                            >
                              <option value="Not Started">Not Started</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Delayed">Delayed</option>
                            </select>
                          </div>
                          
                          <Input
                            label="Start Date"
                            type="date"
                            value={phase.startDate}
                            onChange={(e) => updatePhase(phase.id, 'startDate', e.target.value)}
                            required
                          />
                          
                          <Input
                            label="End Date"
                            type="date"
                            value={phase.endDate}
                            onChange={(e) => updatePhase(phase.id, 'endDate', e.target.value)}
                            required
                          />
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Deliverables
                            </label>
                            <textarea
                              value={phase.deliverables}
                              onChange={(e) => updatePhase(phase.id, 'deliverables', e.target.value)}
                              rows={2}
                              placeholder="List key deliverables for this phase..."
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary resize-none"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Financial Breakdown */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-toiral-dark flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-toiral-primary" />
                  Financial Breakdown
                </h2>

                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Total Project Cost"
                      type="number"
                      name="totalCost"
                      placeholder="0"
                      value={formData.totalCost || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        totalCost: parseFloat(e.target.value) || 0
                      })}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </Card>

                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-toiral-dark">
                    Payment Milestones
                  </h3>
                  <Button onClick={addPaymentMilestone} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Milestone
                  </Button>
                </div>

                {totalPercentage > 0 && (
                  <div className={`p-4 rounded-xl ${
                    totalPercentage === 100 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    <p className="text-sm font-medium">
                      Total Percentage: {totalPercentage}% 
                      {totalPercentage !== 100 && ` (${100 - totalPercentage}% remaining)`}
                    </p>
                  </div>
                )}

                {formData.paymentMilestones.length === 0 ? (
                  <Card className="p-12 text-center">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No payment milestones added yet. Break down the payment schedule.
                    </p>
                    <Button onClick={addPaymentMilestone} variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Add First Milestone
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {formData.paymentMilestones.map((milestone, index) => (
                      <Card key={milestone.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="success">Milestone {index + 1}</Badge>
                          <button
                            onClick={() => removePaymentMilestone(milestone.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Milestone Name"
                            placeholder="e.g. Initial Payment"
                            value={milestone.name}
                            onChange={(e) => updatePaymentMilestone(milestone.id, 'name', e.target.value)}
                            required
                          />
                          
                          <Input
                            label="Percentage (%)"
                            type="number"
                            placeholder="30"
                            value={milestone.percentage || ''}
                            onChange={(e) => updatePaymentMilestone(
                              milestone.id, 
                              'percentage', 
                              parseFloat(e.target.value) || 0
                            )}
                            required
                          />
                          
                          <Input
                            label="Amount"
                            type="number"
                            placeholder="Auto-calculated"
                            value={milestone.amount || ''}
                            disabled
                          />
                          
                          <Input
                            label="Due Date"
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updatePaymentMilestone(milestone.id, 'dueDate', e.target.value)}
                            required
                          />
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Payment Status
                            </label>
                            <select
                              value={milestone.status}
                              onChange={(e) => updatePaymentMilestone(milestone.id, 'status', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: Notes & Logs */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-toiral-dark flex items-center gap-2">
                    <FileText className="w-5 h-5 text-toiral-primary" />
                    Initial Notes & Documentation
                  </h2>
                  <Button onClick={addNote} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Add Note
                  </Button>
                </div>

                {formData.initialNotes.length === 0 ? (
                  <Card className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">
                      No notes added yet. Add initial project notes, client decisions, or meeting summaries.
                    </p>
                    <Button onClick={addNote} variant="outline">
                      <Plus className="w-4 h-4 mr-2" /> Add First Note
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {formData.initialNotes.map((note, index) => (
                      <Card key={note.id} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant="neutral">Note {index + 1}</Badge>
                          <button
                            onClick={() => removeNote(note.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Note Category
                            </label>
                            <select
                              value={note.category}
                              onChange={(e) => updateNote(note.id, 'category', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary"
                            >
                              {NOTE_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Note Content
                            </label>
                            <textarea
                              value={note.content}
                              onChange={(e) => updateNote(note.id, 'content', e.target.value)}
                              rows={4}
                              placeholder="Enter your note here..."
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary resize-none"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 6: Team Assignment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-toiral-dark flex items-center gap-2">
                    <Users className="w-5 h-5 text-toiral-primary" />
                    Assign Team Members
                  </h2>
                  <Badge variant="info">{formData.team.length} Selected</Badge>
                </div>
                
                {teamLoading ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">Loading team members...</p>
                  </Card>
                ) : teamMembers.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">
                      No team members found. Please add team members first.
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamMembers.map((member) => (
                      <TeamMemberCard
                        key={member.id}
                        {...member}
                        selected={formData.team.includes(member.id)}
                        onSelect={() => toggleTeamMember(member.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 7: Success */}
            {currentStep === 6 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-toiral-dark mb-2">
                  Client Successfully Onboarded!
                </h2>
                <p className="text-gray-500 mb-8">
                  Share the access code with your client to give them instant project access.
                </p>

                {/* Access Code Card */}
                <Card className="max-w-md mx-auto p-6 bg-toiral-dark text-white mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Key className="w-5 h-5 text-toiral-secondary" />
                    <h3 className="font-bold text-lg">Access Code</h3>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl mb-4">
                    <p className="text-3xl font-mono font-bold tracking-wider text-center">
                      {accessCode}
                    </p>
                  </div>

                  <button
                    onClick={copyToClipboard}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Client uses this code to access their comprehensive project dashboard
                  </p>
                </Card>

                {/* Share Options */}
                <Card className="max-w-md mx-auto p-6 mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-toiral-primary" />
                    <h3 className="font-bold text-toiral-dark">
                      Share with Client
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={shareViaEmail}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        Email
                      </span>
                    </button>

                    <button
                      onClick={shareViaWhatsApp}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Send className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        WhatsApp
                      </span>
                    </button>

                    <button
                      onClick={shareViaSMS}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-toiral-light/20 rounded-xl transition-colors group"
                    >
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        SMS
                      </span>
                    </button>
                  </div>
                </Card>

                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                  <Button onClick={() => navigate(`/admin/clients/${createdClientId}`)}>
                    View Client Profile
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:pl-80 z-20">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className={currentStep === 0 ? 'invisible' : ''}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} loading={loading}>
                {currentStep === 5 ? 'Create Client' : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
