import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const DashboardContext = createContext(undefined);


export const DashboardProvider = ({ children }) => {
  const { user: authUser, getUserAvatar } = useAuth();
  
  const [fontScale, setFontScale] = useState('normal');
  const [toasts, setToasts] = useState([]);
  
  // Initialize collections as empty arrays for backward compatibility
  const [students] = useState([]);
  const [departments] = useState([]);
  const [mentors] = useState([]);
  const [colleges] = useState([]);

  const [notifications, setNotifications] = useState([
    {
      id: 'n-1',
      studentId: 'stu-1002',
      studentName: 'R. Vignesh',
      type: 'multiple_arrears',
      message: '2 Pending Arrears in Operating Systems & Networks. High placement risk.',
      date: '2026-07-25',
      read: false,
      severity: 'danger',
    },
    {
      id: 'n-2',
      studentId: 'stu-1002',
      studentName: 'R. Vignesh',
      type: 'low_attendance',
      message: 'Attendance recorded at 74.0% (Below mandatory 75% threshold).',
      date: '2026-07-22',
      read: false,
      severity: 'warning',
    },
    {
      id: 'n-3',
      studentId: 'stu-1001',
      studentName: 'A. Karthi Krishna',
      type: 'placement_ready',
      message: 'Verified Zoho Offer letter (8.5 LPA CTC). Approved by Placement Cell.',
      date: '2026-07-18',
      read: true,
      severity: 'success',
    },
  ]);

  // Map authenticated user to currentUser format
  const currentUser = authUser ? {
    id: authUser.user_id,
    name: authUser.full_name,
    role: authUser.role?.toLowerCase() || 'mentor',
    email: authUser.email,
    avatar: getUserAvatar(),
    designation: authUser.designation,
    department_id: authUser.department_id,
    college_id: authUser.college_id,
    staff_id: authUser.staff_id,
  } : null;

  const isLoggedIn = !!authUser;

  const logout = () => {
    // AuthContext handles the actual logout
    // This is just for dashboard-specific cleanup if needed
    addToast('info', 'Logged Out', 'Successfully logged out of FXEC ERP');
  };

  const addToast = (type, title, message) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        logout,
        fontScale,
        setFontScale,
        students,
        departments,
        mentors,
        colleges,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        toasts,
        addToast,
        removeToast,
      }}
    >
      <div className={`font-sans ${fontScale === 'large' ? 'text-[17px]' : fontScale === 'xlarge' ? 'text-[19px]' : 'text-[15px]'}`}>
        {children}
      </div>
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
