import React, { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  User,
  Plus,
  ChevronRight,
  Home,
  Command } from
'lucide-react';
import { Button } from '../ui/Button';
interface HeaderProps {
  onMenuToggle: () => void;
  onProfileClick?: () => void;
  userName?: string;
  userRole?: 'admin' | 'client';
  isSidebarCollapsed?: boolean;
}
export function Header({
  onMenuToggle,
  onProfileClick,
  userName = 'User',
  userRole,
  isSidebarCollapsed
}: HeaderProps) {
  const location = useLocation();
  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
        <Link
          to={userRole === 'admin' ? '/admin/dashboard' : '/client/dashboard'}
          className="hover:text-toiral-primary transition-colors">

          <Home className="w-4 h-4" />
        </Link>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const formattedName =
          name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
          return (
            <Fragment key={name}>
              <ChevronRight className="w-4 h-4 text-gray-300" />
              {isLast ?
              <span className="font-semibold text-toiral-dark">
                  {formattedName}
                </span> :

              <Link
                to={routeTo}
                className="hover:text-toiral-primary transition-colors">

                  {formattedName}
                </Link>
              }
            </Fragment>);

        })}
      </div>);

  };
  return (
    <header className="h-16 px-4 lg:px-6 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">

          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumbs - Desktop */}
        {getBreadcrumbs()}
      </div>

      {/* Center Search - Desktop */}
      <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl px-6">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-toiral-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 focus:border-toiral-primary focus:bg-white transition-all"
            placeholder="Search..." />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 border border-gray-200 rounded text-[10px] font-medium text-gray-400 bg-white">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
        {/* Quick Actions - Desktop */}
        {userRole === 'admin' &&
        <div className="hidden xl:flex items-center gap-1">
            <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-toiral-primary h-8 px-2.5">

              <Plus className="w-4 h-4 mr-1" /> Client
            </Button>
            <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-toiral-primary h-8 px-2.5">

              <Plus className="w-4 h-4 mr-1" /> Project
            </Button>
          </div>
        }

        {/* Profile */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-toiral-dark leading-none">
              {userName}
            </p>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wide">
              {userRole}
            </p>
          </div>
          <button
            onClick={onProfileClick}
            className={`
              w-9 h-9 rounded-full bg-toiral-light/50 flex items-center justify-center 
              text-toiral-primary transition-all 
              ${onProfileClick ? 'hover:bg-toiral-primary hover:text-white cursor-pointer' : ''}
            `}>

            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>);

}