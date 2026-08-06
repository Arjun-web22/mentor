import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { ToastContainer } from '../components/common/ToastContainer';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { SuperAdminDashboard } from '../pages/admin/SuperAdminDashboard';
import { CollegeManagement } from '../pages/college/CollegeManagement';
import { DepartmentGrid } from '../pages/department/DepartmentGrid';
import { MentorsDirectory } from '../pages/mentor/MentorsDirectory';
import { MentorList } from '../pages/mentor/MentorList';
import { MentorProfile } from '../pages/mentor/MentorProfile';
import { MentorStudentsDirectory } from '../pages/student/MentorStudentsDirectory';
import { StudentDetails } from '../pages/student/StudentDetails';
import { MentorDashboard } from '../pages/mentor/MentorDashboard';
import { HODDashboard } from '../pages/hod/HODDashboard';
import { StudentList } from '../pages/student/StudentList';
import { StudentProfile } from '../pages/student/StudentProfile';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { SystemSettings } from '../pages/settings/SystemSettings';

const ProtectedLayout = ({ children }) => {
  const { isLoggedIn } = useDashboard();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EEF3F8] overflow-hidden">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} isMobile={isMobile} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 min-w-0">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

const DepartmentRedirect = () => {
  const { departmentId } = useParams();
  return <Navigate to={`/departments/${departmentId}/mentors`} replace />;
};

const MentorRedirect = () => {
  const { departmentId, mentorId } = useParams();
  return <Navigate to={`/departments/${departmentId}/mentors/${mentorId}/students`} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected ERP Portal Hierarchical Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <ProtectedLayout>
              <SuperAdminDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <ProtectedLayout>
              <SuperAdminDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/colleges"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
            <ProtectedLayout>
              <CollegeManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/colleges/:collegeId"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN']}>
            <ProtectedLayout>
              <CollegeManagement />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <DepartmentGrid />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:departmentId"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <DepartmentRedirect />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:departmentId/mentors"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <MentorsDirectory />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:departmentId/mentors/:mentorId"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <MentorRedirect />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/:departmentId/mentors/:mentorId/students"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <MentorStudentsDirectory />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/profile/:id"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR', 'STUDENT']}>
            <ProtectedLayout>
              <StudentProfile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/details/:registerNo"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <StudentDetails />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentor"
        element={
          <ProtectedRoute allowedRoles={['MENTOR']}>
            <ProtectedLayout>
              <MentorDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <ProtectedLayout>
              <StudentDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hod"
        element={
          <ProtectedRoute allowedRoles={['HOD']}>
            <ProtectedLayout>
              <HODDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentors"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD']}>
            <ProtectedLayout>
              <MentorList />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mentors/:mentorId"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <MentorProfile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <StudentList />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR', 'STUDENT']}>
            <ProtectedLayout>
              <StudentProfile />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <ProtectedLayout>
              <SuperAdminDashboard />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'MENTOR']}>
            <ProtectedLayout>
              <SystemSettings />
            </ProtectedLayout>
          </ProtectedRoute>
        }
      />

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
