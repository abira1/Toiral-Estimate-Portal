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
const INVOICES = [
{
  id: 'INV-001',
  client: 'Nike',
  project: 'E-commerce Redesign',
  amount: '$15,000',
  status: 'Paid',
  date: 'Oct 01, 2024'
},
{
  id: 'INV-002',
  client: 'Uber',
  project: 'Mobile App MVP',
  amount: '$4,500',
  status: 'Pending',
  date: 'Oct 15, 2024'
},
{
  id: 'INV-003',
  client: 'Airbnb',
  project: 'Marketing Site',
  amount: '$12,000',
  status: 'Overdue',
  date: 'Sep 28, 2024'
},
{
  id: 'INV-004',
  client: 'Netflix',
  project: 'Internal Dashboard',
  amount: '$8,000',
  status: 'Paid',
  date: 'Sep 15, 2024'
},
{
  id: 'INV-005',
  client: 'Nike',
  project: 'E-commerce Redesign',
  amount: '$5,000',
  status: 'Pending',
  date: 'Oct 20, 2024'
}];

export function Invoices() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const filteredInvoices = INVOICES.filter((inv) => {
    const matchesFilter = filter === 'All' || inv.status === filter;
    const matchesSearch =
    inv.client.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });
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
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {invoice.project}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {invoice.date}
                    </td>
                    <td className="px-6 py-4 font-bold text-toiral-dark">
                      {invoice.amount}
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
              <p className="text-gray-500">No invoices found.</p>
            </div>
          }
        </Card>
      </div>
    </DashboardLayout>);

}