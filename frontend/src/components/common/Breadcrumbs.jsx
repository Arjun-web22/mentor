import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

export const Breadcrumbs = ({ items: customItems }) => {
  const location = useLocation();
  const params = useParams();

  const { colleges, departments, mentors, students } = useDashboard();

  // If custom items passed, use them
  if (customItems && customItems.length > 0) {
    return (
      <nav className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-xs mb-6 text-xs font-bold text-gray-600 flex items-center flex-wrap gap-2">
        {customItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
            {item.path ? (
              <Link
                to={item.path}
                className="text-[#5B82C5] hover:text-[#4A6FA8] hover:underline flex items-center gap-1 transition-colors px-2 py-2 min-h-[44px]"
              >
                {idx === 0 && <HomeIcon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-900 font-extrabold flex items-center gap-1 px-2 py-2 min-h-[44px]">
                {idx === 0 && <HomeIcon className="w-4 h-4 text-gray-500" />}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  }

  // Auto-generate breadcrumb steps based on route params and location
  const path = location.pathname;
  const autoItems = [
    { label: 'Dashboard', path: '/dashboard' },
  ];

  // Resolve current student if on /students/:studentId
  const currentStudent = params.studentId ? students.find((s) => s.id === params.studentId || s.registerNo === params.studentId) : null;

  const currentCollegeId = params.collegeId || currentStudent?.collegeId || 'col-1';
  const currentCollege = colleges.find((c) => c.id === currentCollegeId) || colleges[0];

  const currentDepartmentId = params.departmentId || currentStudent?.departmentId;
  const currentDepartment = currentDepartmentId ? departments.find((d) => d.id === currentDepartmentId) : null;

  const currentMentorId = params.mentorId || currentStudent?.mentorId;
  const currentMentor = currentMentorId ? mentors.find((m) => m.id === currentMentorId) : null;

  // College level
  if (currentCollege) {
    autoItems.push({
      label: currentCollege.name.split(' (')[0], // Short name e.g. Francis Xavier Engineering College
      path: `/colleges`,
    });
  }

  // Department level
  if (currentDepartment) {
    autoItems.push({
      label: currentDepartment.name,
      path: `/departments/${currentDepartment.id}/mentors`,
    });
  } else if (path.includes('/departments') && !params.departmentId) {
    autoItems.push({
      label: 'Departments',
      path: '/departments',
    });
  }

  // Mentor level
  if (currentMentor && currentDepartment) {
    autoItems.push({
      label: currentMentor.name,
      path: `/departments/${currentDepartment.id}/mentors/${currentMentor.id}/students`,
    });
  }

  // Student level
  if (currentStudent) {
    autoItems.push({
      label: currentStudent.name,
    });
  }

  return (
    <nav className="bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-xs mb-6 text-xs font-bold text-gray-600 flex items-center flex-wrap gap-2 overflow-x-hidden">
      {autoItems.map((item, idx) => {
        const isLast = idx === autoItems.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRightIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
            {!isLast && item.path ? (
              <Link
                to={item.path}
                className="text-[#5B82C5] hover:text-[#4A6FA8] hover:underline flex items-center gap-1 transition-colors px-2 py-2 min-h-[44px]"
              >
                {idx === 0 && <HomeIcon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-900 font-extrabold flex items-center gap-1 px-2 py-2 min-h-[44px]">
                {idx === 0 && <HomeIcon className="w-4 h-4 text-gray-500" />}
                <span>{item.label}</span>
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
