import React, { useState, useEffect } from 'react';
import { Check, X, Download, Calendar, DollarSign, Layers, Loader2, FileText } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ScribbleDoodle } from '../../components/doodles/ScribbleDoodle';
import { MorphLoading } from '../../components/ui/MorphLoading';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import type { Invoice } from '../../types';

export function QuotationReview() {
  const { clientSession } = useAuth();
  const { getInvoicesByClientId, invoicesLoading, updateInvoiceStatus } = useData();
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Get client's invoices
  const clientInvoices = clientSession ? getInvoicesByClientId(clientSession.clientId) : [];
  
  // Get the first pending invoice as the quotation
  const quotation = clientInvoices.find(inv => inv.status === 'Pending') || clientInvoices[0];

  useEffect(() => {
    if (quotation) {
      setSelectedInvoice(quotation);
    }
  }, [quotation]);

  const handleApprove = async () => {
    if (selectedInvoice) {
      await updateInvoiceStatus(selectedInvoice.id, 'Paid');
      setShowApproveModal(false);
    }
  };

  const handleReject = async () => {
    if (selectedInvoice) {
      // In a real app, you might want to store feedback or change status differently
      // For now, we'll just close the modal
      setShowRejectModal(false);
      setFeedback('');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Calculate timeline (estimate 8 weeks if not specified)
  const getTimeline = () => {
    if (selectedInvoice && selectedInvoice.dueDate) {
      const due = new Date(selectedInvoice.dueDate);
      const issued = new Date(selectedInvoice.issuedDate);
      const weeks = Math.ceil((due.getTime() - issued.getTime()) / (1000 * 60 * 60 * 24 * 7));
      return `${weeks} Weeks`;
    }
    return '8 Weeks';
  };

  // Break down invoice amount (simplified)
  const getInvoiceItems = () => {
    if (!selectedInvoice) return [];

    // This is a simplified breakdown. In a real app, you'd store line items
    const totalAmount = selectedInvoice.amount;
    return [
      {
        name: 'Project Development',
        desc: 'Full-stack development and implementation',
        price: formatCurrency(totalAmount * 0.6)
      },
      {
        name: 'Design & UX',
        desc: 'UI/UX design, wireframes, and prototypes',
        price: formatCurrency(totalAmount * 0.25)
      },
      {
        name: 'Testing & Deployment',
        desc: 'QA testing, bug fixes, and deployment',
        price: formatCurrency(totalAmount * 0.15)
      }
    ];
  };

  // Show loading
  if (invoicesLoading) {
    return (
      <DashboardLayout userRole="client">
        <div className="flex items-center justify-center min-h-[60vh]">
          <MorphLoading />
        </div>
      </DashboardLayout>
    );
  }

  // Show empty state if no invoices/quotations
  if (!selectedInvoice) {
    return (
      <DashboardLayout userRole="client">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Quotations Available</h2>
            <p className="text-gray-500 max-w-md">
              You don't have any pending quotations at the moment. Please contact your administrator if you're expecting one.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const items = getInvoiceItems();

  return (
    <DashboardLayout userRole="client">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-toiral-dark">
                Quotation Review
              </h1>
              <Badge
                variant={
                  selectedInvoice.status === 'Pending'
                    ? 'warning'
                    : selectedInvoice.status === 'Paid'
                    ? 'success'
                    : 'neutral'
                }
              >
                {selectedInvoice.status}
              </Badge>
            </div>
            <p className="text-gray-500">
              Reference: {selectedInvoice.id} • Issued {new Date(selectedInvoice.issuedDate).toLocaleDateString()}
              {selectedInvoice.dueDate && ` • Due ${new Date(selectedInvoice.dueDate).toLocaleDateString()}`}
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-bold text-toiral-dark mb-6 relative inline-block">
                Project Scope
                <ScribbleDoodle className="absolute -bottom-2 left-0 w-full" width={80} />
              </h2>

              <div className="space-y-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-bold text-toiral-dark">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <span className="font-bold text-toiral-primary">{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-500">Total Estimate</span>
                <span className="text-3xl font-bold text-toiral-dark">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">Terms & Conditions</h3>
              <p className="text-sm text-blue-600 leading-relaxed">
                Payment terms and conditions apply. Timeline estimates are subject to timely
                feedback and asset provision. All work is subject to our standard agreement.
              </p>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            <Card className="bg-toiral-dark text-white">
              <h3 className="font-bold text-lg mb-4">Project Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-toiral-secondary" />
                  <div>
                    <p className="text-xs text-gray-400">Timeline</p>
                    <p className="font-bold">{getTimeline()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-toiral-secondary" />
                  <div>
                    <p className="text-xs text-gray-400">Investment</p>
                    <p className="font-bold">{formatCurrency(selectedInvoice.amount)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-toiral-secondary" />
                  <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <p className="font-bold">{selectedInvoice.status}</p>
                  </div>
                </div>
              </div>
            </Card>

            {selectedInvoice.status === 'Pending' && (
              <div className="space-y-3">
                <Button
                  className="w-full h-14 text-lg"
                  onClick={() => setShowApproveModal(true)}
                >
                  Approve Quotation
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => setShowRejectModal(true)}
                >
                  Request Changes
                </Button>
              </div>
            )}

            {selectedInvoice.status === 'Paid' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-green-700">Quotation Approved</p>
              </div>
            )}
          </div>
        </div>

        {/* Approve Modal */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Confirm Approval"
        >
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-toiral-dark mb-2">Ready to start?</h3>
            <p className="text-gray-500 mb-6">
              By approving, you agree to the terms and conditions. The project will commence shortly.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-500 hover:bg-green-600"
                onClick={handleApprove}
              >
                Yes, Approve
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Request Changes"
        >
          <div className="space-y-4">
            <p className="text-gray-500">
              Please let us know what you'd like to change or discuss.
            </p>
            <textarea
              className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-toiral-primary focus:outline-none resize-none"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleReject}>
                Send Feedback
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
