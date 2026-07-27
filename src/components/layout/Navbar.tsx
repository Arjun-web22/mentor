import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { FontScale, UserRole } from '../../types/dashboard';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    setRole,
    logout,
    fontScale,
    setFontScale,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
  } = useDashboard();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setShowRoleMenu(false);
    if (role === 'super_admin') {
      navigate('/admin');
    } else if (role === 'hod') {
      navigate('/departments');
    } else {
      navigate('/mentor');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Institutional Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 bg-[#5B82C5] rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-xl tracking-wider">
              FX
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-gray-900 tracking-tight text-lg leading-tight">
                  FRANCIS XAVIER
                </span>
                <span className="bg-[#EBF1FA] text-[#5B82C5] text-xs font-bold px-2 py-0.5 rounded-md border border-[#5B82C5]/30">
                  AUTONOMOUS
                </span>
              </div>
              <p className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
                ENGINEERING COLLEGE • MENTOR MANAGEMENT ERP
              </p>
            </div>
          </div>

          {/* Global Quick Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name, register number (e.g. 960721104001)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
                />
              </div>
            </form>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            {/* Font Scale Accessibility Controller (for 40+ staff readability) */}
            <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200" title="Text Size Adjuster for Senior Staff">
              <span className="text-xs font-bold text-gray-500 px-2 flex items-center gap-1">
                <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" /> Size:
              </span>
              {(['normal', 'large', 'xlarge'] as FontScale[]).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    fontScale === scale
                      ? 'bg-[#5B82C5] text-white shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {scale === 'normal' ? 'Normal' : scale === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-gray-600 hover:text-[#5B82C5] hover:bg-gray-100 rounded-xl transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <BellIcon className="w-6 h-6" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#F44336] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-88 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <BellIcon className="w-4 h-4 text-[#5B82C5]" /> Academic Notifications
                    </h3>
                    <span className="text-xs font-semibold text-gray-500">
                      {notifications.length} alerts
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.studentId) navigate(`/students/${notif.studentId}`);
                          setShowNotifications(false);
                        }}
                        className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {notif.severity === 'danger' && (
                            <ExclamationCircleIcon className="w-5 h-5 text-[#F44336] flex-shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'warning' && (
                            <ExclamationTriangleIcon className="w-5 h-5 text-[#FF9800] flex-shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'success' && (
                            <CheckCircleIcon className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs font-bold text-gray-900">{notif.studentName}</p>
                            <p className="text-xs text-gray-600 mt-0.5 leading-snug">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 font-medium block mt-1">
                              {notif.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher & User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-2.5 p-1.5 pr-3 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none border border-gray-200"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-lg object-cover border border-gray-300"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-900 leading-none">{currentUser.name}</p>
                  <span className="text-[11px] font-semibold text-[#5B82C5] capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-1.5">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Switch User View</p>
                  </div>
                  <button
                    onClick={() => handleRoleChange('super_admin')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                      currentUser.role === 'super_admin'
                        ? 'bg-[#EBF1FA] text-[#5B82C5]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>1. Super Admin (Principal)</span>
                    {currentUser.role === 'super_admin' && <CheckCircleIcon className="w-4 h-4 text-[#5B82C5]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('hod')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                      currentUser.role === 'hod'
                        ? 'bg-[#EBF1FA] text-[#5B82C5]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>2. HOD Dashboard (CSE)</span>
                    {currentUser.role === 'hod' && <CheckCircleIcon className="w-4 h-4 text-[#5B82C5]" />}
                  </button>
                  <button
                    onClick={() => handleRoleChange('mentor')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                      currentUser.role === 'mentor'
                        ? 'bg-[#EBF1FA] text-[#5B82C5]'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>3. Mentor View (Dr. Arulraj)</span>
                    {currentUser.role === 'mentor' && <CheckCircleIcon className="w-4 h-4 text-[#5B82C5]" />}
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                      navigate('/login');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-[#F44336] hover:bg-red-50 rounded-lg flex items-center space-x-2"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
