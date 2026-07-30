import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getMentorsByDepartment } from '../../services/departmentService';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  UserIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

export const MentorsDirectory = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('cards');

  useEffect(() => {
    const fetchMentorsData = async () => {
      try {
        setLoading(true);
        const data = await getMentorsByDepartment(departmentId);
        setMentors(data);
        setError(null);
      } catch (err) {
        setError('Unable to connect to server.');
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsData();
  }, [departmentId]);

  // Generate avatar from name
  const getMentorAvatar = (name) => {
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

  // Filter mentors by search
  const filteredMentors = mentors.filter(
    (m) =>
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.staff_id?.toLowerCase().includes(search.toLowerCase()) ||
      m.designation?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
            Department Mentors
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            {mentors.length} mentor{mentors.length !== 1 ? 's' : ''} in this department
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

          <div className="relative w-full sm:max-w-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Mentor by name, code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Mentors...</p>
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
      {!loading && !error && filteredMentors.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-xs">
          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900">No Mentors Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            No faculty mentors matched your search query in this department.
          </p>
        </div>
      )}

      {/* Cards Grid */}
      {!loading && !error && filteredMentors.length > 0 && viewMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMentors.map((mentor) => {
            const avatar = getMentorAvatar(mentor.full_name);
            return (
              <div
                key={mentor.user_id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md hover:border-[#5B82C5] transition-all duration-150 flex flex-col justify-between cursor-pointer min-h-[44px]"
              >
                <div>
                  {/* Avatar and Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-gray-800"
                          style={{ backgroundColor: avatar.backgroundColor }}
                        >
                          {avatar.initials}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                          {mentor.full_name}
                        </h3>
                        <span className="text-[11px] font-mono font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded border border-[#5B82C5]/20 inline-block mt-0.5">
                          {mentor.staff_id}
                        </span>
                      </div>
                    </div>

                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  </div>

                  {/* Designation */}
                  <p className="text-xs font-semibold text-gray-500 mb-3">{mentor.designation}</p>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs font-semibold text-gray-600 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-[#5B82C5] flex-shrink-0" />
                      <span className="truncate">{mentor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-3.5 h-3.5 text-[#5B82C5] flex-shrink-0" />
                      <span className="truncate">--</span>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <UserGroupIcon className="w-4 h-4 text-[#5B82C5] mx-auto mb-1" />
                      <p className="text-xs font-black text-gray-900">{mentor.student_count || 0}</p>
                      <p className="text-[10px] font-bold text-gray-500">Mentees</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <ChartBarIcon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs font-black text-gray-400">--</p>
                      <p className="text-[10px] font-bold text-gray-500">Avg CGPA</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <CheckCircleIcon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs font-black text-gray-400">--</p>
                      <p className="text-[10px] font-bold text-gray-500">Attendance</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 text-center">
                      <ExclamationTriangleIcon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs font-black text-gray-400">--</p>
                      <p className="text-[10px] font-bold text-gray-500">Placement</p>
                    </div>
                  </div>
                </div>

                {/* View Mentees Button */}
                <button
                  onClick={() =>
                    navigate(`/departments/${departmentId}/mentors/${mentor.staff_id}/students`)
                  }
                  className="w-full py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-3 min-h-[44px]"
                >
                  <span>View Mentees</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {!loading && !error && filteredMentors.length > 0 && viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Avatar</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Staff ID</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Mentor Name</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Designation</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Assigned Students</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMentors.map((mentor) => {
                  const avatar = getMentorAvatar(mentor.full_name);
                  return (
                    <tr key={mentor.user_id} className="hover:bg-gray-50 transition-colors">
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
                        <span className="text-[11px] font-mono font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded border border-[#5B82C5]/20">
                          {mentor.staff_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.full_name}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">--</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.designation}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.student_count || 0}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant="success" size="sm">Active</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            navigate(`/departments/${departmentId}/mentors/${mentor.staff_id}/students`)
                          }
                          className="px-3 py-1.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
                        >
                          <ArrowRightIcon className="w-3.5 h-3.5" />
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
