import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ClientProfile } from '../../pages/client/ClientProfile';
interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'admin' | 'client';
}
export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
  useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Load collapsed state preference from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsDesktopSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);
  const toggleDesktopSidebar = () => {
    const newState = !isDesktopSidebarCollapsed;
    setIsDesktopSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };
  return (
    <div className="flex h-screen bg-toiral-bg overflow-hidden">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        isCollapsed={isDesktopSidebarCollapsed}
        onClose={() => setIsMobileSidebarOpen(false)}
        onToggleCollapse={toggleDesktopSidebar}
        userRole={userRole} />


      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <Header
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
          onProfileClick={
          userRole === 'client' ? () => setIsProfileOpen(true) : undefined
          }
          userName={userRole === 'admin' ? 'Admin User' : 'Client User'}
          userRole={userRole}
          isSidebarCollapsed={isDesktopSidebarCollapsed} />


        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 xl:p-10 scroll-smooth">
          <div className="max-w-7xl xl:max-w-[1600px] mx-auto w-full transition-all duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* Client Profile Panel (client role only) */}
      {userRole === 'client' &&
      <ClientProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)} />

      }
    </div>);

}