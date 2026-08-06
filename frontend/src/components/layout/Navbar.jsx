import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
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
  Bars3Icon,
} from '@heroicons/react/24/outline';
export const Navbar = ({ onMenuToggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();
  const {
    currentUser,
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
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/students?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    authLogout();
    logout();
    setShowRoleMenu(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs flex-shrink-0">
      <div className="w-full px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Mobile Hamburger Menu */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>

          {/* Institutional Branding */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 bg-[#5B82C5] rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-base sm:text-lg lg:text-xl tracking-wider flex-shrink-0">
              FX
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-extrabold text-gray-900 tracking-tight text-sm sm:text-base lg:text-lg leading-tight">
                  FRANCIS XAVIER
                </span>
                <span className="hidden md:inline bg-[#EBF1FA] text-[#5B82C5] text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-md border border-[#5B82C5]/30 flex-shrink-0">
                  AUTONOMOUS
                </span>
              </div>
              <p className="text-[10px] sm:text-xs font-semibold text-gray-500 tracking-wide uppercase hidden lg:block">
                ENGINEERING COLLEGE • MENTOR MANAGEMENT ERP
              </p>
            </div>
          </div>

          {/* Global Quick Search Bar - Desktop/Tablet */}
          <div className="hidden md:flex flex-1 mx-3 sm:mx-4 lg:mx-6 min-w-0">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search student by name, register number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
                />
              </div>
            </form>
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
            aria-label="Toggle search"
          >
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Font Scale Accessibility Controller - Desktop only */}
            <div className="hidden lg:flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200" title="Text Size Adjuster for Senior Staff">
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 px-1.5 sm:px-2 flex items-center gap-1 flex-shrink-0">
                <AdjustmentsHorizontalIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Size:
              </span>
              {(['normal', 'large', 'xlarge']).map((scale) => (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  className={`px-1.5 sm:px-2.5 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all min-h-[36px] sm:min-h-[44px] ${
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
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 sm:p-2 lg:p-2.5 text-gray-600 hover:text-[#5B82C5] hover:bg-gray-100 rounded-xl transition-colors focus:outline-none min-h-[40px] sm:min-h-[44px] min-w-[40px] sm:min-w-[44px] flex items-center justify-center"
                aria-label="View notifications"
              >
                <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-0.5 sm:top-1 lg:top-1.5 right-0.5 sm:right-1 lg:right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-[#F44336] text-white text-[9px] sm:text-[10px] lg:text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-88 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                      <BellIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5B82C5]" /> Academic Notifications
                    </h3>
                    <span className="text-[10px] sm:text-xs font-semibold text-gray-500">
                      {notifications.length} alerts
                    </span>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.studentId) navigate(`/students/profile/${notif.studentId}`);
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 sm:p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {notif.severity === 'danger' && (
                            <ExclamationCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#F44336] flex-shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'warning' && (
                            <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF9800] flex-shrink-0 mt-0.5" />
                          )}
                          {notif.severity === 'success' && (
                            <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs font-bold text-gray-900 truncate">{notif.studentName}</p>
                            <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 leading-snug">{notif.message}</p>
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium block mt-1">
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
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center space-x-1.5 sm:space-x-2 p-1 sm:p-1.5 pr-1.5 sm:pr-2 lg:pr-3 hover:bg-gray-100 rounded-xl transition-colors focus:outline-none border border-gray-200 min-h-[40px] sm:min-h-[44px]"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg object-cover border border-gray-300 flex-shrink-0"
                />
                <div className="text-left hidden sm:block min-w-0">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-900 leading-none truncate">{currentUser.name}</p>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#5B82C5] capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <ChevronDownIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
              </button>

              {/* Role Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-1 sm:p-1.5">
                  <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-b border-gray-100 mb-1">
                    <p className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase">User Profile</p>
                  </div>
                  <div className="px-2 sm:px-3 py-2 sm:py-2.5">
                    <p className="text-[10px] sm:text-xs font-bold text-gray-900">{currentUser.name}</p>
                    <p className="text-[10px] sm:text-xs text-gray-600">{currentUser.designation || 'Faculty'}</p>
                    <p className="text-[10px] sm:text-xs text-[#5B82C5] font-semibold capitalize">{currentUser.role.replace('_', ' ')}</p>
                  </div>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 sm:px-3 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold text-[#F44336] hover:bg-red-50 rounded-lg flex items-center space-x-1.5 sm:space-x-2 min-h-[40px] sm:min-h-[44px]"
                  >
                    <ArrowRightOnRectangleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Expandable */}
        {showMobileSearch && (
          <div className="md:hidden pb-3 sm:pb-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search student by name, register number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};
