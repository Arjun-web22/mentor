import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, Student, Department, Mentor, College, NotificationItem } from '../types/dashboard';
import { mockUserProfiles } from '../services/mockData';
import { apiService } from '../services/api';

export type FontScale = 'normal' | 'large' | 'xlarge';

interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  title: string;
  message: string;
}

interface DashboardContextType {
  // Role & Auth State
  currentUser: UserProfile;
  setRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  login: (role: UserRole) => void;
  logout: () => void;

  // Accessibility Font Scaling
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;

  // Data Collections
  students: Student[];
  departments: Department[];
  mentors: Mentor[];
  colleges: College[];
  loading: boolean;
  refreshData: () => Promise<void>;

  // Student Actions
  getStudent: (id: string) => Promise<Student | undefined>;
  addCounselingNote: (
    studentId: string,
    category: 'Academic' | 'Attendance' | 'Personal' | 'Placement' | 'General',
    note: string,
    actionPlan: string,
    followUpDate: string
  ) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;

  // Toast System
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'danger' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUserProfiles.mentor_arulraj);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [fontScale, setFontScale] = useState<FontScale>('normal');

  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
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

  const setRole = (role: UserRole) => {
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

  const login = (role: UserRole) => {
    setRole(role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    addToast('info', 'Logged Out', 'Successfully logged out of FXEC ERP');
  };

  const addToast = (type: 'success' | 'danger' | 'info' | 'warning', title: string, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStudent = async (id: string) => {
    return apiService.getStudentById(id);
  };

  const addCounselingNote = async (
    studentId: string,
    category: 'Academic' | 'Attendance' | 'Personal' | 'Placement' | 'General',
    note: string,
    actionPlan: string,
    followUpDate: string
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

  const markNotificationAsRead = (id: string) => {
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
