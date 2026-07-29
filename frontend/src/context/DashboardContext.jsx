import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(undefined);

const userProfiles = {
  super_admin: {
    id: 'user-1',
    name: 'Dr. S. Raja',
    role: 'super_admin',
    email: 'principal@francisxavier.ac.in',
    avatar: 'https://ui-avatars.com/api/?name=Dr+S+Raja&background=5B82C5&color=fff',
  },
  hod: {
    id: 'user-2',
    name: 'Dr. K. Suresh',
    role: 'hod',
    email: 'hod.cse@francisxavier.ac.in',
    avatar: 'https://ui-avatars.com/api/?name=Dr+K+Suresh&background=5B82C5&color=fff',
  },
  mentor: {
    id: 'user-3',
    name: 'Dr. K. Arulraj',
    role: 'mentor',
    email: 'arulraj@francisxavier.ac.in',
    avatar: 'https://ui-avatars.com/api/?name=Dr+K+Arulraj&background=5B82C5&color=fff',
  },
};

export const DashboardProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(userProfiles.mentor);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
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

  const setRole = (role) => {
    if (role === 'super_admin') {
      setCurrentUser(userProfiles.super_admin);
      addToast('info', 'Switched Role', 'Viewing as Super Admin (Principal)');
    } else if (role === 'hod') {
      setCurrentUser(userProfiles.hod);
      addToast('info', 'Switched Role', 'Viewing as Head of Department (CSE)');
    } else {
      setCurrentUser(userProfiles.mentor);
      addToast('info', 'Switched Role', 'Viewing as Faculty Mentor (Dr. K. Arulraj)');
    }
  };

  const login = (role) => {
    setRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
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
        setRole,
        isLoggedIn,
        login,
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
