import React, { useState } from 'react';
import { Check, X, Download, Calendar, DollarSign, Layers } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ScribbleDoodle } from '../../components/doodles/ScribbleDoodle';
export function QuotationReview() {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const quotation = {
    id: 'Q-2024-001',
    title: 'E-commerce Platform Redesign',
    total: '$12,500',
    timeline: '8 Weeks',
    validUntil: 'Oct 30, 2024',
    items: [
    {
      name: 'UX/UI Design Phase',
      desc: 'Wireframes, High-fidelity mockups, Prototype',
      price: '$4,000'
    },
    {
      name: 'Frontend Development',
      desc: 'React, Tailwind, Responsive implementation',
      price: '$5,500'
    },
    {
      name: 'Backend Integration',
      desc: 'API setup, Database schema, Auth',
      price: '$3,000'
    }]

  };
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
              <Badge variant="warning">Pending Approval</Badge>
            </div>
            <p className="text-gray-500">
              Reference: {quotation.id} • Valid until {quotation.validUntil}
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
                <ScribbleDoodle
                  className="absolute -bottom-2 left-0 w-full"
                  width={80} />

              </h2>

              <div className="space-y-6">
                {quotation.items.map((item, index) =>
                <div
                  key={index}
                  className="flex justify-between items-start pb-6 border-b border-gray-100 last:border-0 last:pb-0">

                    <div>
                      <h3 className="font-bold text-toiral-dark">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <span className="font-bold text-toiral-primary">
                      {item.price}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-500">
                  Total Estimate
                </span>
                <span className="text-3xl font-bold text-toiral-dark">
                  {quotation.total}
                </span>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <h3 className="font-bold text-blue-800 mb-2">
                Terms & Conditions
              </h3>
              <p className="text-sm text-blue-600 leading-relaxed">
                50% deposit required to commence work. Remaining 50% due upon
                project completion. Timeline estimates are subject to timely
                feedback and asset provision.
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
                    <p className="font-bold">{quotation.timeline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-toiral-secondary" />
                  <div>
                    <p className="text-xs text-gray-400">Investment</p>
                    <p className="font-bold">{quotation.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-toiral-secondary" />
                  <div>
                    <p className="text-xs text-gray-400">Deliverables</p>
                    <p className="font-bold">Design + Dev</p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <Button
                className="w-full h-14 text-lg"
                onClick={() => setShowApproveModal(true)}>

                Approve Quotation
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => setShowRejectModal(true)}>

                Reject / Request Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Approve Modal */}
        <Modal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          title="Confirm Approval">

          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-toiral-dark mb-2">
              Ready to start?
            </h3>
            <p className="text-gray-500 mb-6">
              By approving, you agree to the terms and conditions. We'll send
              the initial invoice shortly.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setShowApproveModal(false)}>

                Cancel
              </Button>
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                Yes, Approve
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Request Changes">

          <div className="space-y-4">
            <p className="text-gray-500">
              Please let us know what you'd like to change or discuss.
            </p>
            <textarea
              className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-toiral-primary focus:outline-none resize-none"
              placeholder="Enter your feedback here..." />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowRejectModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">Send Feedback</Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>);

}