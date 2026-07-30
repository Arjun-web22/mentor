import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getMentorStudents } from '../../services/studentService';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ArrowPathIcon,
  UserIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

export const MentorStudentsDirectory = () => {
  const { departmentId, mentorId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('student_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true);
        const response = await getMentorStudents(mentorId);
        if (response.success) {
          setStudents(Array.isArray(response.data) ? response.data : []);
        } else {
          setStudents([]);
        }
        setError(null);
      } catch (err) {
        setError('Unable to load students.');
        console.error('Error fetching students:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, [mentorId]);

  // Generate avatar from student initials
  const getStudentAvatar = (studentName) => {
    if (!studentName) return null;
    const initials = studentName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Generate consistent pastel color based on name
    const colors = [
      '#FFE4E6', '#FCE7F3', '#F5D0FE', '#E9D5FF', '#DDD6FE',
      '#C4B5FD', '#A5B4FC', '#93C5FD', '#7DD3FC', '#67E8F9',
      '#5EEAD4', '#6EE7B7', '#86EFAC', '#A7F3D0', '#BBF7D0',
      '#D9F99D', '#FEF08A', '#FDE047', '#FDBA74', '#FB923C'
    ];
    
    const colorIndex = studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return {
      initials,
      backgroundColor
    };
  };

  // Filter students by search query
  const filteredStudents = (students || []).filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.student_name?.toLowerCase().includes(query) ||
      student.register_no?.toLowerCase().includes(query) ||
      student.roll_no?.toLowerCase().includes(query)
    );
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal = a[sortBy] || '';
    let bVal = b[sortBy] || '';
    
    if (sortBy === 'year') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Students Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            {(students || []).length} student{(students || []).length !== 1 ? 's' : ''} assigned to this mentor
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* View Switch */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[40px] ${
                viewMode === 'cards'
                  ? 'bg-white text-[#5B82C5] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Squares2X2Icon className="w-4 h-4" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors min-h-[40px] ${
                viewMode === 'table'
                  ? 'bg-white text-[#5B82C5] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TableCellsIcon className="w-4 h-4" />
              Table
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 lg:max-w-md relative">
            <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, register no, roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      {!loading && !error && students.length > 0 && (
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1">
            <ArrowsUpDownIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Sort by:
          </span>
          {[
            { field: 'student_name', label: 'Name' },
            { field: 'register_no', label: 'Register No' },
            { field: 'year', label: 'Year' },
            { field: 'section', label: 'Section' }
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all min-h-[36px] sm:min-h-[40px] ${
                sortBy === field
                  ? 'bg-[#5B82C5] text-white shadow-xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {label} {sortBy === field && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Students...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors min-h-[44px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && students.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-xs">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900">No students assigned to this mentor.</h3>
          <p className="text-xs text-gray-500 mt-1">
            Students will appear here once they are assigned.
          </p>
        </div>
      )}

      {/* Students Grid */}
      {!loading && !error && sortedStudents.length > 0 && viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {sortedStudents.map((student) => {
            const avatar = getStudentAvatar(student.student_name);
            return (
              <div
                key={student.register_no}
                className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Avatar */}
                <div className="flex items-center justify-center mb-3">
                  {avatar ? (
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-black text-gray-800"
                      style={{ backgroundColor: avatar.backgroundColor }}
                    >
                      {avatar.initials}
                    </div>
                  ) : (
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500" />
                    </div>
                  )}
                </div>

                {/* Student Name */}
                <h3 className="text-sm sm:text-base font-black text-gray-900 text-center mb-1 line-clamp-2">
                  {student.student_name}
                </h3>

                {/* Register Number */}
                <div className="text-center mb-3">
                  <Badge variant="info" size="sm">
                    {student.register_no}
                  </Badge>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500">Roll No:</span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-900">{student.roll_no}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500">Course:</span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-900">{student.course_degree}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500">Year:</span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-900">{student.year}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500">Section:</span>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-900">{student.section}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500">Mentor:</span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#5B82C5]">{student.staff_name}</span>
                  </div>
                </div>

                {/* View Button */}
                <button
                  onClick={() => navigate(`/students/${student.register_no}`)}
                  className="w-full mt-4 py-2 sm:py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <EyeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  View Profile
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Students Table */}
      {!loading && !error && sortedStudents.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Avatar</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Register No</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Roll No</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Student Name</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Course</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Year</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Section</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Mentor</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedStudents.map((student) => {
                  const avatar = getStudentAvatar(student.student_name);
                  return (
                    <tr key={student.register_no} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        {avatar ? (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-gray-800"
                            style={{ backgroundColor: avatar.backgroundColor }}
                          >
                            {avatar.initials}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="info" size="sm">{student.register_no}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{student.roll_no}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{student.student_name}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{student.course_degree}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{student.year}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{student.section}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-[#5B82C5]">{student.staff_name}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/students/${student.register_no}`)}
                          className="px-3 py-1.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                          <EyeIcon className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
