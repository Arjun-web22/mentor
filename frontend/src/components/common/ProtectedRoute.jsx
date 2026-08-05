import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child component to render if authorized
 * @param {string[]} props.allowedRoles - Array of allowed roles (e.g., ['SUPER_ADMIN', 'MENTOR'])
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EEF3F8]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#5B82C5] border-t-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const hasRequiredRole = allowedRoles.some(role => role.toUpperCase() === userRole);

    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's role
      const roleRedirects = {
        'SUPER_ADMIN': '/admin',
        'COLLEGE_ADMIN': '/college',
        'HOD': '/departments',
        'MENTOR': '/mentor',
        'STUDENT': '/student',
      };

      const redirectPath = roleRedirects[userRole] || '/departments';
      return <Navigate to={redirectPath} replace />;
    }
  }

  // Render protected component if all checks pass
  return children;
};
