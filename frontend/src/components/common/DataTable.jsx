import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './Badge';
import {
  UserIcon,
  AcademicCapIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

export const DataTable = ({ students, onOpenCounselingModal }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('student_name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Generate initials-based avatar from name
  const getStudentAvatar = (name) => {
    if (!name) return null;
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = ['#5B82C5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    
    return {
      initials,
      backgroundColor: colors[colorIndex]
    };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + pageSize);

  // Mobile Card View Component
  const StudentCard = ({ student, idx }) => {
    const avatar = getStudentAvatar(student.student_name);
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-xs p-4 space-y-3 ${
          idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
        }`}
      >
        {/* Student Header */}
        <div className="flex items-center space-x-3">
          {avatar ? (
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm font-black text-gray-800 border border-gray-200"
              style={{ backgroundColor: avatar.backgroundColor }}
            >
              {avatar.initials}
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-200">
              <UserIcon className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">{student.student_name}</h3>
            <p className="text-xs text-gray-500 font-mono">{student.register_no}</p>
            <p className="text-[11px] text-gray-500 font-medium">
              {student.course_degree} • Year {student.year}-{student.section}
            </p>
          </div>
        </div>

        {/* Mentor Info */}
        <div className="bg-gray-50 p-2 rounded-lg">
          <span className="text-[10px] font-bold text-gray-400 block uppercase">Mentor</span>
          <p className="text-xs text-gray-600 font-medium truncate">{student.staff_name}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <button
            onClick={() => navigate(`/students/profile/${student.register_no}`)}
            className="flex-1 px-3 py-2 bg-[#5B82C5] text-white hover:bg-[#4A6FA8] font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs min-h-[44px]"
          >
            <EyeIcon className="w-4 h-4" /> View Profile
          </button>
          {onOpenCounselingModal && (
            <button
              onClick={() => onOpenCounselingModal(student)}
              className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs rounded-xl transition-all min-h-[44px]"
            >
              Counsel
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Desktop/Tablet Table View */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-100/90 border-b border-gray-200">
              <th
                onClick={() => handleSort('student_name')}
                className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Student Name</span>
                  <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </th>
              <th className="academic-table-th">Register No</th>
              <th className="academic-table-th">Roll No</th>
              <th className="academic-table-th">Course</th>
              <th className="academic-table-th">Year</th>
              <th className="academic-table-th">Section</th>
              <th className="academic-table-th">Mentor</th>
              <th className="academic-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500 font-medium">
                  No student records matched the active filter criteria.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student, idx) => {
                const avatar = getStudentAvatar(student.student_name);
                return (
                  <tr
                    key={student.register_no}
                    className={`hover:bg-[#EBF1FA]/40 transition-colors ${
                      idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="academic-table-td">
                      <div className="flex items-center space-x-2.5">
                        {avatar ? (
                          <div
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-black text-gray-800 border border-gray-200"
                            style={{ backgroundColor: avatar.backgroundColor }}
                          >
                            {avatar.initials}
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-200">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                        <span className="font-bold text-gray-900 block leading-tight">{student.student_name}</span>
                      </div>
                    </td>
                    <td className="academic-table-td font-mono font-bold text-gray-700 text-xs">
                      {student.register_no}
                    </td>
                    <td className="academic-table-td font-mono font-bold text-gray-700 text-xs">
                      {student.roll_no}
                    </td>
                    <td className="academic-table-td text-xs text-gray-600 font-semibold">
                      {student.course_degree}
                    </td>
                    <td className="academic-table-td text-xs text-gray-600 font-semibold">
                      {student.year}
                    </td>
                    <td className="academic-table-td text-xs text-gray-600 font-semibold">
                      {student.section}
                    </td>
                    <td className="academic-table-td text-xs text-gray-600 font-semibold">
                      {student.staff_name}
                    </td>
                    <td className="academic-table-td text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/students/profile/${student.register_no}`)}
                          className="px-3 py-1.5 bg-[#5B82C5] text-white hover:bg-[#4A6FA8] font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs min-h-[44px]"
                        >
                          <EyeIcon className="w-3.5 h-3.5" /> View Profile
                        </button>
                        {onOpenCounselingModal && (
                          <button
                            onClick={() => onOpenCounselingModal(student)}
                            className="px-2.5 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs rounded-xl transition-all min-h-[44px]"
                          >
                            Counsel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="xl:hidden space-y-3 p-4">
        {paginatedStudents.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-medium">
            No student records matched the active filter criteria.
          </div>
        ) : (
          paginatedStudents.map((student, idx) => (
            <StudentCard key={student.register_no} student={student} idx={idx} />
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-gray-600">
        <div>
          Showing {sortedStudents.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + pageSize, sortedStudents.length)} of {sortedStudents.length} Students
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 rounded-lg px-2 py-1 font-bold text-gray-800 focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
