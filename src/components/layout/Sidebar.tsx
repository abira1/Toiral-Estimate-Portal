import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Briefcase,
  PieChart,
  X,
  Bell,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
import { Button } from '../ui/Button';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
  userRole: 'admin' | 'client';
}
type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
  shortcut?: string;
};
type NavSection = {
  title?: string;
  items: NavItem[];
};
export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
  userRole
}: SidebarProps) {
  const location = useLocation();
  const { notifications, projects, getProjectsByClientId } = useData();
  const { adminUser, clientSession } = useAuth();

  // Calculate unread notification count for current user
  const currentUserId = userRole === 'admin' ? 'admin' : clientSession?.clientId || '';
  const unreadNotificationCount = notifications.filter(
    n => n.userId === currentUserId && !n.read
  ).length;

  // Get first project ID for client
  const clientProjects = clientSession ? getProjectsByClientId(clientSession.clientId) : [];
  const firstProjectId = clientProjects.length > 0 ? clientProjects[0].id : '1';

  const adminSections: NavSection[] = [
  {
    title: 'MAIN',
    items: [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
      shortcut: '⌘D'
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/admin/notifications',
      badge: unreadNotificationCount,
      shortcut: '⌘N'
    }]

  },
  {
    title: 'MANAGEMENT',
    items: [
    {
      icon: Users,
      label: 'Clients',
      path: '/admin/clients',
      shortcut: '⌘C'
    },
    {
      icon: Briefcase,
      label: 'Projects',
      path: '/admin/projects',
      shortcut: '⌘P'
    },
    {
      icon: FileText,
      label: 'Invoices',
      path: '/admin/invoices',
      shortcut: '⌘I'
    }]

  },
  {
    title: 'SYSTEM',
    items: [
    {
      icon: Settings,
      label: 'Settings',
      path: '/admin/settings',
      shortcut: '⌘S'
    }]

  }];

  const clientSections: NavSection[] = [
  {
    items: [
    {
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/client/dashboard'
    },
    {
      icon: Briefcase,
      label: 'My Projects',
      path: `/client/project/${firstProjectId}`
    },
    {
      icon: Bell,
      label: 'Notifications',
      path: '/client/notifications',
      badge: unreadNotificationCount
    },
    {
      icon: FileText,
      label: 'Quotations',
      path: '/client/quotation/1'
    },
    {
      icon: PieChart,
      label: 'Reports',
      path: '/client/reports'
    }]

  }];

  const sections = userRole === 'admin' ? adminSections : clientSections;
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen &&
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
          onClick={onClose}
          className="fixed inset-0 bg-toiral-dark/30 backdrop-blur-sm z-40 lg:hidden" />

        }
      </AnimatePresence>

      {/* Mobile Sidebar - Slide in from left */}
      <AnimatePresence>
        {isOpen &&
        <motion.aside
          initial={{
            x: '-100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '-100%'
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-white shadow-2xl flex flex-col border-r border-toiral-light/30 lg:hidden">

            <SidebarContent
            sections={sections}
            isCollapsed={false}
            onClose={onClose}
            onToggleCollapse={onToggleCollapse}
            location={location}
            showCloseButton={true} />

          </motion.aside>
        }
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible, collapsible */}
      <aside
        className={`
          hidden lg:flex flex-col bg-white border-r border-toiral-light/30
          transition-all duration-300 ease-in-out flex-shrink-0
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}>

        <SidebarContent
          sections={sections}
          isCollapsed={isCollapsed}
          onClose={onClose}
          onToggleCollapse={onToggleCollapse}
          location={location}
          showCloseButton={false} />

      </aside>
    </>);

}
// Extracted sidebar content for reuse
function SidebarContent({
  sections,
  isCollapsed,
  onClose,
  onToggleCollapse,
  location,
  showCloseButton







}: {sections: NavSection[];isCollapsed: boolean;onClose: () => void;onToggleCollapse: () => void;location: ReturnType<typeof useLocation>;showCloseButton: boolean;}) {
  const logoUrl = "/ChatGPT_Image_Apr_22,_2025,_02_48_04_AM_(1).png";

  return (
    <>
      {/* Header */}
      <div
        className={`
          h-16 flex items-center border-b border-toiral-light/30 flex-shrink-0
          ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}
        `}>

        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={logoUrl}
            alt="Toiral Logo"
            className="w-9 h-9 object-contain flex-shrink-0" />

          {!isCollapsed &&
          <span className="text-lg font-bold text-toiral-dark whitespace-nowrap">
              Toiral
            </span>
          }
        </div>
        {showCloseButton &&
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-toiral-dark hover:bg-gray-100 rounded-lg transition-colors">

            <X className="w-5 h-5" />
          </button>
        }
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {sections.map((section, sectionIdx) =>
        <div key={sectionIdx} className={sectionIdx > 0 ? 'mt-6' : ''}>
            {!isCollapsed && section.title &&
          <div className="px-5 mb-2 text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                {section.title}
              </div>
          }
            {isCollapsed && section.title &&
          <div className="mx-3 mb-2 border-t border-gray-100" />
          }
            <div className="space-y-1 px-3">
              {section.items.map((link) => {
              const isActive =
              location.pathname === link.path ||
              link.path !== '/notifications' &&
              location.pathname.startsWith(link.path);
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={`
                      group flex items-center gap-3 rounded-lg transition-all duration-200 relative
                      ${isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'}
                      ${isActive ? 'bg-toiral-primary text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-toiral-dark'}
                    `}>

                    <link.icon
                    className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-toiral-primary'}`} />


                    {!isCollapsed &&
                  <>
                        <span className="font-medium text-sm flex-1">
                          {link.label}
                        </span>
                        {link.badge && link.badge > 0 &&
                    <span
                      className={`
                              min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold flex items-center justify-center
                              ${isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}
                            `}>

                            {link.badge}
                          </span>
                    }
                        {link.shortcut && !link.badge &&
                    <span
                      className={`
                              text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 
                              opacity-0 group-hover:opacity-100 transition-opacity
                              ${isActive ? 'bg-white/20 text-white' : 'text-gray-400'}
                            `}>

                            {link.shortcut}
                          </span>
                    }
                      </>
                  }

                    {/* Tooltip for collapsed state */}
                    {isCollapsed &&
                  <div
                    className="
                        absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium 
                        rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                        transition-all duration-200 whitespace-nowrap z-50 shadow-lg
                        pointer-events-none
                      ">






                        {link.label}
                        {link.badge && link.badge > 0 &&
                    <span className="ml-2 bg-red-500 px-1.5 py-0.5 rounded text-[10px]">
                            {link.badge}
                          </span>
                    }
                        {/* Arrow */}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                      </div>
                  }
                  </NavLink>);

            })}
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-toiral-light/30 space-y-1 flex-shrink-0">
        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={onToggleCollapse}
          className={`
            hidden lg:flex w-full items-center gap-3 p-2.5 text-gray-400 
            hover:text-toiral-dark hover:bg-gray-50 rounded-lg transition-colors
            ${isCollapsed ? 'justify-center' : ''}
          `}>

          {isCollapsed ?
          <ChevronRight className="w-5 h-5" /> :

          <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          }
        </button>

        <NavLink to="/" className="block">
          <Button
            variant="ghost"
            className={`
              w-full text-red-500 hover:bg-red-50 hover:text-red-600
              ${isCollapsed ? 'justify-center px-0' : 'justify-start'}
            `}>

            <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && 'Sign Out'}
          </Button>
        </NavLink>
      </div>
    </>);

}