import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  DollarSign,
  Bell,
  AlertCircle,
  Search,
  Filter,
  Check,
  Trash2 } from
'lucide-react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { StarDoodle } from '../components/doodles/StarDoodle';
type NotificationType =
'project_update' |
'approval_request' |
'payment' |
'system' |
'alert';
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}
const MOCK_NOTIFICATIONS: Notification[] = [
{
  id: '1',
  type: 'approval_request',
  title: 'Quotation Approved',
  description:
  'Nike has approved the "E-commerce Redesign" quotation. The project is ready to begin.',
  timestamp: '2 mins ago',
  read: false
},
{
  id: '2',
  type: 'project_update',
  title: 'New Comment Added',
  description:
  'Alex Morgan added a comment on "Homepage Wireframes" in the design phase.',
  timestamp: '1 hour ago',
  read: false
},
{
  id: '3',
  type: 'payment',
  title: 'Invoice Payment Received',
  description:
  'Invoice #1023 has been successfully paid by Nike. Amount: $4,500.',
  timestamp: '3 hours ago',
  read: false
},
{
  id: '4',
  type: 'alert',
  title: 'Deadline Approaching',
  description:
  'Project "Uber MVP" phase 1 is due tomorrow at 5:00 PM. Please review progress.',
  timestamp: '5 hours ago',
  read: true
},
{
  id: '5',
  type: 'system',
  title: 'System Maintenance Scheduled',
  description:
  'Toiral Estimate will be down for maintenance on Oct 30 from 2:00 AM to 4:00 AM EST.',
  timestamp: '1 day ago',
  read: true
},
{
  id: '6',
  type: 'project_update',
  title: 'Design Phase Completed',
  description:
  'The design phase for "Airbnb Marketing Site" has been completed and is ready for review.',
  timestamp: '2 days ago',
  read: true
},
{
  id: '7',
  type: 'approval_request',
  title: 'Approval Required',
  description:
  'Client feedback on "Netflix Dashboard" wireframes requires your approval to proceed.',
  timestamp: '3 days ago',
  read: true
},
{
  id: '8',
  type: 'payment',
  title: 'Invoice Generated',
  description:
  'Invoice #1022 has been generated for Uber project. Total amount: $12,500.',
  timestamp: '4 days ago',
  read: true
}];

interface NotificationsProps {
  userRole: 'admin' | 'client';
}
export function Notifications({ userRole }: NotificationsProps) {
  const [notifications, setNotifications] =
  useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>(
    'all'
  );
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
    prev.map((n) =>
    n.id === id ?
    {
      ...n,
      read: true
    } :
    n
    )
    );
  };
  const markAllAsRead = () => {
    setNotifications((prev) =>
    prev.map((n) => ({
      ...n,
      read: true
    }))
    );
  };
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'project_update':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'approval_request':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <DollarSign className="w-5 h-5 text-purple-500" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case 'project_update':
        return 'bg-blue-100';
      case 'approval_request':
        return 'bg-green-100';
      case 'payment':
        return 'bg-purple-100';
      case 'alert':
        return 'bg-amber-100';
      case 'system':
        return 'bg-gray-100';
    }
  };
  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'project_update':
        return 'Project Updates';
      case 'approval_request':
        return 'Approvals';
      case 'payment':
        return 'Payments';
      case 'alert':
        return 'Alerts';
      case 'system':
        return 'System';
    }
  };
  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    const matchesFilter =
    filter === 'all' || (filter === 'unread' ? !n.read : n.read);
    const matchesSearch =
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || n.type === selectedType;
    return matchesFilter && matchesSearch && matchesType;
  });
  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative bg-toiral-dark rounded-3xl p-8 lg:p-12 overflow-hidden text-white shadow-xl">
          <StarDoodle
            className="absolute top-10 right-10 text-toiral-secondary opacity-50"
            size={60} />

          <StarDoodle
            className="absolute bottom-10 left-20 text-toiral-primary opacity-50"
            size={40} />


          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              {unreadCount > 0 &&
              <Badge
                variant="error"
                className="bg-red-500 text-white border-none">

                  {unreadCount} New
                </Badge>
              }
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">
              Notifications
            </h1>
            <p className="text-toiral-light text-lg">
              Stay updated with all your project activities, approvals, and
              system updates.
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}>

              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}>

              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}>

              Read ({notifications.length - unreadCount})
            </Button>
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-toiral-light/50 focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 text-sm" />

            </div>
            {unreadCount > 0 &&
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" /> Mark All Read
              </Button>
            }
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedType === 'all' ? 'bg-toiral-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>

            All Types
          </button>
          {(
          [
          'project_update',
          'approval_request',
          'payment',
          'alert',
          'system'] as
          NotificationType[]).
          map((type) =>
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${selectedType === type ? 'bg-toiral-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>

              {getTypeLabel(type)}
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ?
          <Card className="py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Bell className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No notifications found
              </h3>
              <p className="text-gray-500">
                {searchTerm ?
              'Try adjusting your search terms' :
              "You're all caught up!"}
              </p>
            </Card> :

          filteredNotifications.map((notification, index) =>
          <motion.div
            key={notification.id}
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

                <Card
              hoverable
              className={`relative ${notification.read ? 'bg-white' : 'bg-toiral-light/10 border-2 border-toiral-primary/20'}`}>

                  <div className="flex gap-4 items-start">
                    {/* Icon */}
                    <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>

                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                          className={`font-bold ${notification.read ? 'text-gray-700' : 'text-toiral-dark'}`}>

                              {notification.title}
                            </h3>
                            {!notification.read &&
                        <div className="w-2 h-2 rounded-full bg-toiral-primary" />
                        }
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {notification.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {notification.timestamp}
                        </span>
                        <div className="flex gap-2">
                          {!notification.read &&
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs">

                              <Check className="w-3 h-3 mr-1" /> Mark as read
                            </Button>
                      }
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50">

                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
          )
          }
        </div>
      </div>
    </DashboardLayout>);

}