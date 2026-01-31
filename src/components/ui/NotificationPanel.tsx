import React, { useEffect, useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  useTransform } from
'framer-motion';
import {
  FileText,
  CheckCircle,
  DollarSign,
  Bell,
  AlertCircle,
  Check,
  X } from
'lucide-react';
import { Button } from './Button';
export type NotificationType =
'project_update' |
'approval_request' |
'payment' |
'system' |
'alert';
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}
interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}
const MOCK_NOTIFICATIONS: Notification[] = [
{
  id: '1',
  type: 'approval_request',
  title: 'Quotation Approved',
  description: 'Nike has approved the "E-commerce Redesign" quotation.',
  timestamp: '2 mins ago',
  read: false
},
{
  id: '2',
  type: 'project_update',
  title: 'New Comment',
  description: 'Alex added a comment on "Homepage Wireframes".',
  timestamp: '1 hour ago',
  read: false
},
{
  id: '3',
  type: 'payment',
  title: 'Invoice Paid',
  description: 'Invoice #1023 has been successfully paid.',
  timestamp: '3 hours ago',
  read: true
},
{
  id: '4',
  type: 'alert',
  title: 'Deadline Approaching',
  description: 'Project "Uber MVP" phase 1 is due tomorrow.',
  timestamp: '5 hours ago',
  read: true
},
{
  id: '5',
  type: 'system',
  title: 'System Update',
  description: 'Toiral Estimate will be down for maintenance at midnight.',
  timestamp: '1 day ago',
  read: true
}];

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] =
  useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 100], [1, 0]);
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Handle click outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      !isMobile &&
      panelRef.current &&
      !panelRef.current.contains(event.target as Node))
      {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, isMobile]);
  // Prevent body scroll on mobile when panel is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);
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
  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isMobile && info.offset.y > 100) {
      onClose();
    }
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
  // Mobile: Full screen with slide up animation
  // Desktop: Dropdown with slide down animation
  const panelVariants = {
    hidden: isMobile ?
    {
      y: '100%',
      opacity: 0
    } :
    {
      y: -20,
      opacity: 0,
      scale: 0.95
    },
    visible: isMobile ?
    {
      y: 0,
      opacity: 1
    } :
    {
      y: 0,
      opacity: 1,
      scale: 1
    }
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop - Full screen on mobile, subtle on desktop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={isMobile ? onClose : undefined}
          className={`
              fixed inset-0 z-40
              ${isMobile ? 'bg-toiral-dark/60 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}
            `} />


          {/* Panel Container */}
          <motion.div
          ref={panelRef}
          drag={isMobile ? 'y' : false}
          dragConstraints={{
            top: 0,
            bottom: 0
          }}
          dragElastic={{
            top: 0,
            bottom: 0.5
          }}
          onDragEnd={handleDragEnd}
          style={
          isMobile ?
          {
            y,
            opacity
          } :
          undefined
          }
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={panelVariants}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 40,
            mass: 0.8
          }}
          className={`
              z-50 bg-white overflow-hidden flex flex-col
              ${isMobile ? 'fixed inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh] shadow-2xl' : 'absolute right-0 top-14 w-full sm:w-[400px] md:w-[440px] lg:w-[480px] rounded-2xl shadow-xl border border-toiral-light/30 max-h-[500px]'}
            `}>

            {/* Drag Handle (Mobile Only) */}
            {isMobile &&
          <div className="flex justify-center pt-3 pb-2 bg-white sticky top-0 z-20">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>
          }

            {/* Header */}
            <div
            className={`
              flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10
              ${isMobile ? 'px-6 py-4' : 'p-4'}
            `}>

              <h3
              className={`font-bold text-toiral-dark ${isMobile ? 'text-xl' : 'text-lg'}`}>

                Notifications
              </h3>
              <div className="flex items-center gap-2">
                <button
                onClick={markAllAsRead}
                className={`font-semibold text-toiral-primary hover:text-toiral-dark transition-colors ${isMobile ? 'text-sm' : 'text-xs'}`}>

                  Mark all read
                </button>
                {isMobile &&
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2">

                    <X className="w-5 h-5 text-gray-500" />
                  </button>
              }
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              {notifications.length === 0 ?
            <div
              className={`flex flex-col items-center justify-center text-center ${isMobile ? 'py-16 px-6' : 'py-12 px-4'}`}>

                  <div
                className={`bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400 ${isMobile ? 'w-20 h-20' : 'w-16 h-16'}`}>

                    <Bell className={isMobile ? 'w-10 h-10' : 'w-8 h-8'} />
                  </div>
                  <h4
                className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-lg' : 'text-base'}`}>

                    No new notifications
                  </h4>
                  <p
                className={`text-gray-500 ${isMobile ? 'text-base' : 'text-sm'}`}>

                    You're all caught up! Check back later.
                  </p>
                </div> :

            <div className="divide-y divide-gray-50">
                  {notifications.map((notification, index) =>
              <motion.div
                key={notification.id}
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
                onClick={() => markAsRead(notification.id)}
                className={`
                        flex gap-4 cursor-pointer transition-colors duration-200 relative
                        ${isMobile ? 'p-5 min-h-[88px]' : 'p-4'}
                        ${notification.read ? 'bg-white hover:bg-gray-50' : 'bg-toiral-light/10 hover:bg-toiral-light/20'}
                      `}>

                      {/* Unread Indicator */}
                      {!notification.read &&
                <div
                  className={`absolute rounded-full bg-toiral-primary ${isMobile ? 'right-5 top-5 w-2.5 h-2.5' : 'right-4 top-4 w-2 h-2'}`} />

                }

                      {/* Icon */}
                      <div
                  className={`rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)} ${isMobile ? 'w-12 h-12' : 'w-10 h-10'}`}>

                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${isMobile ? 'pr-6' : 'pr-4'}`}>
                        <h4
                    className={`mb-0.5 ${isMobile ? 'text-base' : 'text-sm'} ${notification.read ? 'font-semibold text-gray-700' : 'font-bold text-toiral-dark'}`}>

                          {notification.title}
                        </h4>
                        <p
                    className={`text-gray-500 leading-relaxed mb-1.5 line-clamp-2 ${isMobile ? 'text-sm' : 'text-xs'}`}>

                          {notification.description}
                        </p>
                        <span
                    className={`font-medium text-gray-400 uppercase tracking-wide ${isMobile ? 'text-xs' : 'text-[10px]'}`}>

                          {notification.timestamp}
                        </span>
                      </div>
                    </motion.div>
              )}
                </div>
            }
            </div>

            {/* Footer */}
            <div
            className={`border-t border-gray-100 bg-gray-50 text-center sticky bottom-0 z-10 ${isMobile ? 'p-4 pb-safe' : 'p-3'}`}>

              <button
              className={`font-semibold text-toiral-primary hover:text-toiral-dark transition-colors flex items-center justify-center w-full ${isMobile ? 'text-base py-2' : 'text-sm py-1'}`}>

                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      }
    </AnimatePresence>);

}