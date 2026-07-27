import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ToastContainer } from '../components/common/ToastContainer';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SuperAdminDashboard } from '../pages/admin/SuperAdminDashboard';
import { CollegeManagement } from '../pages/college/CollegeManagement';
import { DepartmentGrid } from '../pages/department/DepartmentGrid';
import { MentorDashboard } from '../pages/mentor/MentorDashboard';
import { StudentList } from '../pages/student/StudentList';
import { StudentProfile } from '../pages/student/StudentProfile';
import { SystemSettings } from '../pages/settings/SystemSettings';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useDashboard();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F8]">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <ToastContainer />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected ERP Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedLayout>
            <SuperAdminDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/colleges"
        element={
          <ProtectedLayout>
            <CollegeManagement />
          </ProtectedLayout>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedLayout>
            <DepartmentGrid />
          </ProtectedLayout>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedLayout>
            <MentorDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedLayout>
            <StudentList />
          </ProtectedLayout>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedLayout>
            <StudentProfile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedLayout>
            <SuperAdminDashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <SystemSettings />
          </ProtectedLayout>
        }
      />

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/mentor" replace />} />
    </Routes>
  );
};
