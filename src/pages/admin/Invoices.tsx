import React, { useState } from 'react';
import {
  Download,
  Search,
  Filter,
  FileText,
  MoreHorizontal } from
'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useData } from '../../contexts/DataContext';

export function Invoices() {
  const { invoices, invoicesLoading, clients, projects } = useData();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === 'All' || inv.status === filter;
    const client = clients.find(c => c.id === inv.clientId);
    const matchesSearch =
    (client?.name || '').toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown';
  };
  
  // Get project name by ID
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'General';
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-8 pb-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-toiral-dark">Invoices</h1>
            <p className="text-gray-500 mt-1">Track payments and billings.</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50/50">
            <div className="flex gap-2 overflow-x-auto">
              {['All', 'Paid', 'Pending', 'Overdue'].map((status) =>
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${filter === status ? 'bg-white text-toiral-primary shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'}
                  `}>

                  {status}
                </button>
              )}
            </div>
            <div className="relative w-full lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                className="pl-10 h-10 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)} />

            </div>
          </div>

          {invoicesLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-toiral-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading invoices...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Invoice ID</th>
                      <th className="px-6 py-4 font-semibold">Client</th>
                      <th className="px-6 py-4 font-semibold">Project</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredInvoices.map((invoice) =>
                    <tr
                      key={invoice.id}
                      className="hover:bg-gray-50/50 transition-colors group">

                        <td className="px-6 py-4 font-mono font-medium text-toiral-primary">
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4 font-medium text-toiral-dark">
                          {getClientName(invoice.clientId)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {getProjectName(invoice.projectId)}
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-sm">
                          {formatDate(invoice.createdAt)}
                        </td>
                        <td className="px-6 py-4 font-bold text-toiral-dark">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                          variant={
                          invoice.status === 'Paid' ?
                          'success' :
                          invoice.status === 'Overdue' ?
                          'error' :
                          'warning'
                          }>

                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity">

                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredInvoices.length === 0 &&
              <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    {search || filter !== 'All' ? 'No invoices found matching your criteria.' : 'No invoices yet. They will appear here once created.'}
                  </p>
                </div>
              }
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>);

}