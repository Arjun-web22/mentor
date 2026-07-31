import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import {
  HomeIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { currentUser } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  // const navItems = [
  //   { name: 'Super Admin', path: '/admin', icon: HomeIcon, roles: ['super_admin'] },
  //   { name: 'Colleges', path: '/colleges', icon: BuildingLibraryIcon, roles: ['super_admin'] },
  //   { name: 'Departments', path: '/departments', icon: FolderIcon },
  //   { name: 'Mentor Directory', path: '/mentors', icon: UserIcon, roles: ['super_admin', 'hod'] },
  //   { name: 'Mentor Dashboard', path: '/mentor', icon: AcademicCapIcon, roles: ['hod', 'mentor'] },
  //   { name: 'Students Directory', path: '/students', icon: UserGroupIcon },
  //   { name: 'System Analytics', path: '/analytics', icon: ChartBarIcon },
  //   { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  // ];
  const navItems = [
  { name: 'Super Admin', path: '/admin', icon: HomeIcon, roles: ['super_admin'] },
  { name: 'Colleges', path: '/colleges', icon: BuildingLibraryIcon, roles: ['super_admin'] },

  { name: 'Departments', path: '/departments', icon: FolderIcon, roles: ['super_admin', 'hod'] },

  // Super Admin only
  { name: 'Mentor Directory', path: '/mentors', icon: UserIcon, roles: ['super_admin'] },

  // HOD only
  { name: 'Dashboard', path: '/hod', icon: AcademicCapIcon, roles: ['hod'] },

  // Mentor only
  { name: 'Mentor Dashboard', path: '/mentor', icon: AcademicCapIcon, roles: ['mentor'] },

  { name: 'Students Directory', path: '/students', icon: UserGroupIcon, roles: ['super_admin', 'hod', 'mentor'] },

  { name: 'System Analytics', path: '/analytics', icon: ChartBarIcon, roles: ['super_admin'] },

  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, roles: ['super_admin', 'hod', 'mentor'] },
];

  // Filter items based on active role if applicable, or show all for super admin
  // const visibleNavItems = navItems.filter((item) => {
  //   if (!item.roles) return true;
  //   if (currentUser.role === 'super_admin') return true;
  //   return item.roles.includes(currentUser.role);
  // });
  const visibleNavItems = navItems.filter((item) => {
  if (!item.roles) return true;
  return item.roles.includes(currentUser.role);
});

  const handleNavClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  // Mobile: Hidden by default, slide-in with overlay
  // Tablet: Collapsible
  // Desktop: Fixed left sidebar
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          bg-white border-r border-gray-200 transition-all duration-300 relative flex flex-col z-20 flex-shrink-0 min-w-0
          ${collapsed ? 'w-20' : 'w-64'}
          ${isMobile
            ? `fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'hidden lg:flex'
          }
          ${!isMobile && 'lg:flex'}
        `}
      >
        {/* Mobile Close Button */}
        {isMobile && (
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Role Badge Indicator */}
        {!collapsed && (
          <div className="p-4 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50] animate-pulse"></span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {currentUser.role === 'super_admin'
                  ? 'Super Admin Portal'
                  : currentUser.role === 'hod'
                  ? 'HOD CSE Portal'
                  : 'Faculty Mentor View'}
              </span>
            </div>
          </div>
        )}

        {/* Nav List */}
        <nav className="p-3 space-y-1.5 flex-1">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-3.5 py-3 rounded-xl font-bold text-sm transition-all duration-150 group min-h-[48px] ${
                  isActive
                    ? 'bg-[#5B82C5] text-white shadow-md shadow-[#5B82C5]/20'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-6 h-6 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle Button - Hidden on mobile */}
        {!isMobile && (
          <div className="p-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#5B82C5] hover:text-white transition-colors w-full flex items-center justify-center space-x-2 text-xs font-bold min-h-[44px]"
            >
              {collapsed ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
