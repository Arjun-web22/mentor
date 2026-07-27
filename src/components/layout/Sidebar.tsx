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
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

export const Sidebar: React.FC = () => {
  const { currentUser } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { name: 'Super Admin', path: '/admin', icon: HomeIcon, roles: ['super_admin'] },
    { name: 'Colleges', path: '/colleges', icon: BuildingLibraryIcon, roles: ['super_admin'] },
    { name: 'Departments', path: '/departments', icon: FolderIcon },
    { name: 'Mentor Dashboard', path: '/mentor', icon: AcademicCapIcon },
    { name: 'Students Directory', path: '/students', icon: UserGroupIcon },
    { name: 'System Analytics', path: '/analytics', icon: ChartBarIcon },
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
  ];

  // Filter items based on active role if applicable, or show all for super admin
  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    if (currentUser.role === 'super_admin') return true;
    return item.roles.includes(currentUser.role);
  });

  return (
    <aside
      className={`bg-white border-r border-gray-200 min-h-[calc(100vh-4.5rem)] transition-all duration-200 relative flex flex-col z-20 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
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

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#5B82C5] hover:text-white transition-colors w-full flex items-center justify-center space-x-2 text-xs font-bold"
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
    </aside>
  );
};
