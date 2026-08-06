import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMentors } from '../../services/mentorService';
import { getDepartments } from '../../services/departmentService';
import { UserGroupIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Badge } from '../../components/common/Badge';

export const MentorList = () => {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('full_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch mentors and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorsResponse, departmentsResponse] = await Promise.all([
          getAllMentors(),
          getDepartments()
        ]);

        setMentors(mentorsResponse);
        setDepartments(departmentsResponse);
        setError(null);
      } catch (err) {
        setError('Unable to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate initials-based avatar
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

  // Client side filtering
  const filteredMentors = mentors.filter((m) => {
    const matchesSearch =
      m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.staff_id?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentId === 'all' || m.department_id === parseInt(departmentId);
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && m.is_active === 1) ||
      (statusFilter === 'inactive' && m.is_active === 0);

    return matchesSearch && matchesDept && matchesRole && matchesStatus;
  });

  // Sorting
  const sortedMentors = [...filteredMentors].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'assigned_students') {
      aVal = parseInt(aVal) || 0;
      bVal = parseInt(bVal) || 0;
    }
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedMentors.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMentors = sortedMentors.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('all');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const handleExportCSV = () => {
    const headers = ['StaffID', 'Name', 'Department', 'Designation', 'Email', 'Role', 'Status', 'AssignedStudents'];
    const rows = paginatedMentors.map((m) => [
      m.staff_id,
      `"${m.full_name}"`,
      m.department_name || 'N/A',
      m.designation || 'N/A',
      m.email,
      m.role,
      m.is_active ? 'Active' : 'Inactive',
      m.assigned_students || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FXEC_Mentor_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Mentors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors min-h-[44px]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Mentor Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Institution-wide faculty directory with mentor allocation, department information and academic statistics. {mentors.length} mentor{mentors.length !== 1 ? 's' : ''} in the system
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-[#5B82C5]" /> Export CSV
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Mentor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Roles</option>
              <option value="MENTOR">Mentor</option>
              <option value="HOD">HOD</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleResetFilters}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px]"
        >
          <XMarkIcon className="w-4 h-4" /> Reset Filters
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto hidden xl:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Avatar</th>
                <th 
                  onClick={() => handleSort('full_name')}
                  className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-1">
                    Mentor Name
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Staff ID</th>
                <th 
                  onClick={() => handleSort('department_name')}
                  className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-1">
                    Department
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Designation</th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Email</th>
                <th 
                  onClick={() => handleSort('assigned_students')}
                  className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-1">
                    Assigned Students
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('is_active')}
                  className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  <div className="flex items-center gap-1">
                    Status
                    <span className="text-gray-400">↕</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMentors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No mentor records matched the active filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedMentors.map((mentor) => {
                  const avatar = getMentorAvatar(mentor.full_name);
                  return (
                    <tr key={mentor.user_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        {mentor.profile_photo ? (
                          <img
                            src={mentor.profile_photo}
                            alt={mentor.full_name}
                            className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                          />
                        ) : avatar ? (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-gray-800 border border-gray-200"
                            style={{ backgroundColor: avatar.backgroundColor }}
                          >
                            {avatar.initials}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-200">
                            <UserGroupIcon className="w-4 h-4 text-gray-500" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.full_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-mono font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded border border-[#5B82C5]/20">
                          {mentor.staff_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.department_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.designation || 'N/A'}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.email}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.assigned_students || 0}</td>
                      <td className="px-4 py-3">
                        <Badge variant={mentor.is_active ? 'success' : 'danger'} size="sm">
                          {mentor.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/mentors/${mentor.user_id}`)}
                            className="px-3 py-1.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-lg transition-colors min-h-[36px]"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/departments/${mentor.department_id}/mentors/${mentor.staff_id}/students`)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors min-h-[36px]"
                          >
                            View Students
                          </button>
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
          {paginatedMentors.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-medium">
              No mentor records matched the active filter criteria.
            </div>
          ) : (
            paginatedMentors.map((mentor) => {
              const avatar = getMentorAvatar(mentor.full_name);
              return (
                <div
                  key={mentor.user_id}
                  className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    {mentor.profile_photo ? (
                      <img
                        src={mentor.profile_photo}
                        alt={mentor.full_name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    ) : avatar ? (
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-sm font-black text-gray-800 border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: avatar.backgroundColor }}
                      >
                        {avatar.initials}
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <UserGroupIcon className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{mentor.full_name}</h3>
                      <span className="text-[11px] font-mono font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded border border-[#5B82C5]/20 inline-block mt-0.5">
                        {mentor.staff_id}
                      </span>
                    </div>
                    <Badge variant={mentor.is_active ? 'success' : 'danger'} size="sm">
                      {mentor.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Department</span>
                      <span className="text-xs font-bold text-gray-800 truncate block">{mentor.department_name || 'N/A'}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Designation</span>
                      <span className="text-xs font-bold text-gray-800 truncate block">{mentor.designation || 'N/A'}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg col-span-2">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Email</span>
                      <span className="text-xs font-bold text-gray-800 truncate block">{mentor.email}</span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg col-span-2">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Assigned Students</span>
                      <span className="text-sm font-black text-gray-900">{mentor.assigned_students || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => navigate(`/mentors/${mentor.user_id}`)}
                      className="flex-1 px-3 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl transition-all shadow-xs min-h-[44px]"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => navigate(`/departments/${mentor.department_id}/mentors/${mentor.staff_id}/students`)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs rounded-xl transition-all min-h-[44px]"
                    >
                      View Students
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-gray-600">
        <div>
          Showing {sortedMentors.length === 0 ? 0 : startIndex + 1} to{' '}
          {Math.min(startIndex + pageSize, sortedMentors.length)} of {sortedMentors.length} Mentors
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
              ‹
            </button>
            <span className="px-2 font-bold text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
