import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Users
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Project, Phase, PaymentMilestone, Note, DocumentLink, ProjectStatus, NoteCategory, DocumentType } from '../../types';

interface ProjectEditorProps {
  project: Project;
  onSave: (updates: Partial<Project>) => Promise<void>;
  onClose: () => void;
  allTeamMembers: any[];
}

export function ProjectEditor({ project, onSave, onClose, allTeamMembers }: ProjectEditorProps) {
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'basic' | 'phases' | 'financial' | 'notes' | 'documents' | 'team'>('basic');
  
  // Basic Info State
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [progress, setProgress] = useState(project.progress);
  const [startDate, setStartDate] = useState(project.startDate);
  const [dueDate, setDueDate] = useState(project.dueDate);
  
  // Phases State
  const [phases, setPhases] = useState<Phase[]>(project.phases || []);
  
  // Financial State
  const [financial, setFinancial] = useState(project.financial || {
    totalCost: project.budget || 0,
    currency: 'USD',
    paymentMilestones: [],
    totalPaid: 0,
    balance: project.budget || 0
  });
  
  // Notes State
  const [notes, setNotes] = useState<Note[]>(project.notes || []);
  
  // Documents State
  const [documentLinks, setDocumentLinks] = useState<DocumentLink[]>(project.documentLinks || []);
  
  // Team State
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(project.teamIds || []);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        name,
        description,
        status,
        progress,
        startDate,
        dueDate,
        phases,
        financial: {
          ...financial,
          balance: financial.totalCost - financial.totalPaid
        },
        notes,
        documentLinks,
        teamIds: selectedTeamIds,
        budget: financial.totalCost
      });
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setSaving(false);
    }
  };

  const addPhase = () => {
    setPhases([...phases, {
      id: generateId(),
      name: 'New Phase',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      deliverables: '',
      description: ''
    }]);
  };

  const updatePhase = (index: number, updates: Partial<Phase>) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], ...updates };
    setPhases(newPhases);
  };

  const deletePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const addPaymentMilestone = () => {
    setFinancial({
      ...financial,
      paymentMilestones: [...financial.paymentMilestones, {
        id: generateId(),
        name: 'New Milestone',
        percentage: 0,
        amount: 0,
        dueDate: '',
        status: 'Pending'
      }]
    });
  };

  const updatePaymentMilestone = (index: number, updates: Partial<PaymentMilestone>) => {
    const newMilestones = [...financial.paymentMilestones];
    newMilestones[index] = { ...newMilestones[index], ...updates };
    setFinancial({ ...financial, paymentMilestones: newMilestones });
  };

  const deletePaymentMilestone = (index: number) => {
    setFinancial({
      ...financial,
      paymentMilestones: financial.paymentMilestones.filter((_, i) => i !== index)
    });
  };

  const addNote = () => {
    setNotes([{
      id: generateId(),
      category: 'General Update',
      content: '',
      createdAt: Date.now(),
      createdBy: 'Admin'
    }, ...notes]);
  };

  const updateNote = (index: number, updates: Partial<Note>) => {
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], ...updates };
    setNotes(newNotes);
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const addDocument = () => {
    setDocumentLinks([...documentLinks, {
      id: generateId(),
      type: 'Other',
      name: '',
      url: '',
      uploadedAt: Date.now(),
      uploadedBy: 'Admin'
    }]);
  };

  const updateDocument = (index: number, updates: Partial<DocumentLink>) => {
    const newDocs = [...documentLinks];
    newDocs[index] = { ...newDocs[index], ...updates };
    setDocumentLinks(newDocs);
  };

  const deleteDocument = (index: number) => {
    setDocumentLinks(documentLinks.filter((_, i) => i !== index));
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'phases', label: 'Phases', icon: Calendar },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'team', label: 'Team', icon: Users }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-6xl my-8"
        data-testid="project-editor-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-toiral-dark">Edit Project</h2>
            <p className="text-sm text-gray-500 mt-1">Update all project information</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            data-testid="close-editor-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-6 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left
                    ${activeSection === section.id 
                      ? 'bg-toiral-primary text-white' 
                      : 'hover:bg-gray-100 text-gray-600'}
                  `}
                  data-testid={`section-${section.id}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{section.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 p-8 max-h-[calc(100vh-300px)] overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Basic Info Section */}
                {activeSection === 'basic' && (
                  <div className="space-y-6" data-testid="basic-section">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                        data-testid="project-name-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                        data-testid="project-description-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                          data-testid="project-status-select"
                        >
                          <option value="Planning">Planning</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Delayed">Delayed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Progress (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={(e) => setProgress(Number(e.target.value))}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                          data-testid="project-progress-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                          data-testid="project-start-date-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-toiral-primary"
                          data-testid="project-due-date-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Phases Section */}
                {activeSection === 'phases' && (
                  <div className="space-y-6" data-testid="phases-section">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-toiral-dark">Project Phases</h3>
                      <Button onClick={addPhase} size="sm" data-testid="add-phase-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Phase
                      </Button>
                    </div>

                    {phases.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No phases added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {phases.map((phase, index) => (
                          <div key={phase.id} className="border border-gray-200 rounded-xl p-6" data-testid={`phase-editor-${index}`}>
                            <div className="flex items-start justify-between mb-4">
                              <span className="text-sm font-bold text-gray-400">Phase {index + 1}</span>
                              <button
                                onClick={() => deletePhase(index)}
                                className="text-red-500 hover:text-red-700"
                                data-testid={`delete-phase-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-4">
                              <input
                                type="text"
                                value={phase.name}
                                onChange={(e) => updatePhase(index, { name: e.target.value })}
                                placeholder="Phase Name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <textarea
                                value={phase.description || ''}
                                onChange={(e) => updatePhase(index, { description: e.target.value })}
                                placeholder="Description (optional)"
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <div className="grid grid-cols-2 gap-4">
                                <input
                                  type="date"
                                  value={phase.startDate}
                                  onChange={(e) => updatePhase(index, { startDate: e.target.value })}
                                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                                <input
                                  type="date"
                                  value={phase.endDate}
                                  onChange={(e) => updatePhase(index, { endDate: e.target.value })}
                                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                />
                              </div>

                              <select
                                value={phase.status}
                                onChange={(e) => updatePhase(index, { status: e.target.value as Phase['status'] })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Delayed">Delayed</option>
                              </select>

                              <textarea
                                value={phase.deliverables}
                                onChange={(e) => updatePhase(index, { deliverables: e.target.value })}
                                placeholder="Deliverables"
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Financial Section */}
                {activeSection === 'financial' && (
                  <div className="space-y-6" data-testid="financial-section">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Cost
                        </label>
                        <input
                          type="number"
                          value={financial.totalCost}
                          onChange={(e) => setFinancial({ ...financial, totalCost: Number(e.target.value) })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                          data-testid="total-cost-input"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Total Paid
                        </label>
                        <input
                          type="number"
                          value={financial.totalPaid}
                          onChange={(e) => setFinancial({ ...financial, totalPaid: Number(e.target.value) })}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3"
                          data-testid="total-paid-input"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-toiral-dark">Payment Milestones</h3>
                      <Button onClick={addPaymentMilestone} size="sm" data-testid="add-payment-milestone-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Milestone
                      </Button>
                    </div>

                    {financial.paymentMilestones.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No payment milestones added</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {financial.paymentMilestones.map((milestone, index) => (
                          <div key={milestone.id} className="border border-gray-200 rounded-xl p-4" data-testid={`milestone-editor-${index}`}>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-bold text-gray-400">Milestone {index + 1}</span>
                              <button
                                onClick={() => deletePaymentMilestone(index)}
                                className="text-red-500 hover:text-red-700"
                                data-testid={`delete-milestone-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={milestone.name}
                                onChange={(e) => updatePaymentMilestone(index, { name: e.target.value })}
                                placeholder="Milestone Name"
                                className="col-span-2 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <input
                                type="number"
                                value={milestone.amount}
                                onChange={(e) => updatePaymentMilestone(index, { amount: Number(e.target.value) })}
                                placeholder="Amount"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <input
                                type="number"
                                value={milestone.percentage}
                                onChange={(e) => updatePaymentMilestone(index, { percentage: Number(e.target.value) })}
                                placeholder="Percentage"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <input
                                type="date"
                                value={milestone.dueDate}
                                onChange={(e) => updatePaymentMilestone(index, { dueDate: e.target.value })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <select
                                value={milestone.status}
                                onChange={(e) => updatePaymentMilestone(index, { status: e.target.value as PaymentMilestone['status'] })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Display Approval Status */}
                    {financial.approvalStatus && (
                      <div className={`p-4 rounded-xl ${
                        financial.approvalStatus === 'approved' ? 'bg-green-50 border border-green-200' :
                        financial.approvalStatus === 'rejected' ? 'bg-red-50 border border-red-200' :
                        financial.approvalStatus === 'change_requested' ? 'bg-amber-50 border border-amber-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <p className="font-semibold text-sm mb-2">
                          Client Approval Status: <Badge variant={
                            financial.approvalStatus === 'approved' ? 'success' :
                            financial.approvalStatus === 'rejected' ? 'error' :
                            financial.approvalStatus === 'change_requested' ? 'warning' : 'neutral'
                          }>{financial.approvalStatus}</Badge>
                        </p>
                        {financial.changeRequest && (
                          <p className="text-sm text-gray-700">
                            <strong>Client Feedback:</strong> {financial.changeRequest}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Section */}
                {activeSection === 'notes' && (
                  <div className="space-y-6" data-testid="notes-section">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-toiral-dark">Project Notes</h3>
                      <Button onClick={addNote} size="sm" data-testid="add-note-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>

                    {notes.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No notes added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notes.map((note, index) => (
                          <div key={note.id} className="border border-gray-200 rounded-xl p-4" data-testid={`note-editor-${index}`}>
                            <div className="flex items-center justify-between mb-3">
                              <select
                                value={note.category}
                                onChange={(e) => updateNote(index, { category: e.target.value as NoteCategory })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="General Update">General Update</option>
                                <option value="Client Decision">Client Decision</option>
                                <option value="Technical Note">Technical Note</option>
                                <option value="Meeting Note">Meeting Note</option>
                              </select>
                              <button
                                onClick={() => deleteNote(index)}
                                className="text-red-500 hover:text-red-700"
                                data-testid={`delete-note-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <textarea
                              value={note.content}
                              onChange={(e) => updateNote(index, { content: e.target.value })}
                              placeholder="Note content..."
                              rows={3}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Documents Section */}
                {activeSection === 'documents' && (
                  <div className="space-y-6" data-testid="documents-section">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-toiral-dark">Project Documents</h3>
                      <Button onClick={addDocument} size="sm" data-testid="add-document-btn">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Document
                      </Button>
                    </div>

                    {documentLinks.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No documents added yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {documentLinks.map((doc, index) => (
                          <div key={doc.id} className="border border-gray-200 rounded-xl p-4" data-testid={`document-editor-${index}`}>
                            <div className="flex items-center justify-between mb-3">
                              <select
                                value={doc.type}
                                onChange={(e) => updateDocument(index, { type: e.target.value as DocumentType })}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              >
                                <option value="Screenshot">Screenshot</option>
                                <option value="Quotation">Quotation</option>
                                <option value="Invoice">Invoice</option>
                                <option value="Contract">Contract</option>
                                <option value="Other">Other</option>
                              </select>
                              <button
                                onClick={() => deleteDocument(index)}
                                className="text-red-500 hover:text-red-700"
                                data-testid={`delete-document-${index}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <input
                                type="text"
                                value={doc.name}
                                onChange={(e) => updateDocument(index, { name: e.target.value })}
                                placeholder="Document Name"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <input
                                type="url"
                                value={doc.url}
                                onChange={(e) => updateDocument(index, { url: e.target.value })}
                                placeholder="Document URL"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />

                              <input
                                type="text"
                                value={doc.notes || ''}
                                onChange={(e) => updateDocument(index, { notes: e.target.value })}
                                placeholder="Notes (optional)"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Team Section */}
                {activeSection === 'team' && (
                  <div className="space-y-6" data-testid="team-section">
                    <h3 className="text-lg font-bold text-toiral-dark">Assign Team Members</h3>
                    
                    {allTeamMembers.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No team members available</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allTeamMembers.map((member) => (
                          <label
                            key={member.id}
                            className={`
                              border-2 rounded-xl p-4 cursor-pointer transition-all
                              ${selectedTeamIds.includes(member.id)
                                ? 'border-toiral-primary bg-toiral-primary/5'
                                : 'border-gray-200 hover:border-gray-300'}
                            `}
                            data-testid={`team-member-${member.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedTeamIds.includes(member.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTeamIds([...selectedTeamIds, member.id]);
                                  } else {
                                    setSelectedTeamIds(selectedTeamIds.filter(id => id !== member.id));
                                  }
                                }}
                                className="w-5 h-5"
                              />
                              <div>
                                <p className="font-semibold text-toiral-dark">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-8 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} data-testid="save-project-btn">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
