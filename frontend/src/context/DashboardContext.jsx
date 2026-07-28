import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserProfiles } from '../services/mockData';
import { apiService } from '../services/api';

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockUserProfiles.mentor_arulraj);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [fontScale, setFontScale] = useState('normal');

  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

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

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [stus, depts, mens, cols] = await Promise.all([
        apiService.getStudents(),
        apiService.getDepartments(),
        apiService.getMentors(),
        apiService.getColleges(),
      ]);
      setStudents(stus);
      setDepartments(depts);
      setMentors(mens);
      setColleges(cols);
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const setRole = (role) => {
    if (role === 'super_admin') {
      setCurrentUser(mockUserProfiles.super_admin);
      addToast('info', 'Switched Role', 'Viewing as Super Admin (Principal)');
    } else if (role === 'hod') {
      setCurrentUser(mockUserProfiles.hod_cse);
      addToast('info', 'Switched Role', 'Viewing as Head of Department (CSE)');
    } else {
      setCurrentUser(mockUserProfiles.mentor_arulraj);
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

  const getStudent = async (id) => {
    return apiService.getStudentById(id);
  };

  const addCounselingNote = async (
    studentId,
    category,
    note,
    actionPlan,
    followUpDate
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    await apiService.addCounselingNote(studentId, {
      studentId,
      studentName: student.name,
      mentorId: currentUser.mentorId || 'men-101',
      mentorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      category,
      note,
      actionPlan,
      followUpDate,
    });

    await loadAllData();
    addToast('success', 'Counseling Record Saved', `Added counseling session for ${student.name}`);
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
        loading,
        refreshData: loadAllData,
        getStudent,
        addCounselingNote,
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
