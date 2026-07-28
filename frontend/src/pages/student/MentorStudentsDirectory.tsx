import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
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
} from '@heroicons/react/24/outline';

export const MentorStudentsDirectory: React.FC = () => {
  const { departmentId, mentorId } = useParams<{ departmentId: string; mentorId: string }>();
  const navigate = useNavigate();
  const { mentors, students, departments } = useDashboard();

  // Find mentor & department
  const mentor = mentors.find((m) => m.id === mentorId) || {
    id: mentorId || 'men-102',
    name: 'Dr. A. Anand',
    employeeCode: 'EMP-IT-01',
    title: 'Professor & Head',
    departmentId: departmentId || 'dept-it',
    departmentName: 'Information Technology',
  };

  const department = departments.find((d) => d.id === (departmentId || mentor.departmentId)) || {
    id: 'dept-it',
    name: 'Information Technology',
    code: 'IT',
  };

  // State for search and filters
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [arrearsFilter, setArrearsFilter] = useState('all');
  const [cgpaFilter, setCgpaFilter] = useState('all');

  // Table pagination & sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'departmentRank' | 'collegeRank' | 'cgpa' | 'pendingArrearsCount' | 'attendancePercentage'>('departmentRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter students assigned to this mentor
  // If no students assigned specifically to mentorId in mock, fallback to department students
  const mentorAssignedStudents = students.filter(
    (s) => s.mentorId === mentor.id || (s.departmentId === department.id && (!mentorId || mentorId === 'all'))
  );

  const finalStudentsList = mentorAssignedStudents.length > 0
    ? mentorAssignedStudents
    : students.filter((s) => s.departmentId === department.id);

  // Apply filters
  const filteredStudents = finalStudentsList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesYear = yearFilter === 'all' || s.year === Number(yearFilter);
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;
    const matchesPlacement = placementFilter === 'all' || s.placementStatus === placementFilter;

    let matchesArrears = true;
    if (arrearsFilter === 'zero') matchesArrears = s.pendingArrearsCount === 0;
    else if (arrearsFilter === 'pending') matchesArrears = s.pendingArrearsCount > 0;
    else if (arrearsFilter === 'cleared') matchesArrears = s.totalHistoryArrearsCount > 0 && s.pendingArrearsCount === 0;

    let matchesCgpa = true;
    if (cgpaFilter === '9_plus') matchesCgpa = s.cgpa >= 9.0;
    else if (cgpaFilter === '8_to_9') matchesCgpa = s.cgpa >= 8.0 && s.cgpa < 9.0;
    else if (cgpaFilter === '7_to_8') matchesCgpa = s.cgpa >= 7.0 && s.cgpa < 8.0;
    else if (cgpaFilter === 'below_7') matchesCgpa = s.cgpa < 7.0;

    return matchesSearch && matchesYear && matchesSection && matchesPlacement && matchesArrears && matchesCgpa;
  });

  // Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setYearFilter('all');
    setSectionFilter('all');
    setPlacementFilter('all');
    setArrearsFilter('all');
    setCgpaFilter('all');
  };

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedStudents.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = sortedStudents.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <UserGroupIcon className="w-7 h-7 text-[#5B82C5]" /> Students Assigned to {mentor.name}
            </h1>
          </div>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Faculty Mentor: <strong className="text-gray-800">{mentor.name}</strong> • {department.name} ({mentor.employeeCode})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 bg-[#EBF1FA] text-[#5B82C5] border border-[#5B82C5]/30 rounded-xl text-xs font-black">
            Total Mentees: {finalStudentsList.length}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <FunnelIcon className="w-4 h-4 text-[#5B82C5]" /> Student Directory Filters
          </h3>
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-gray-500 hover:text-[#5B82C5] flex items-center gap-1 transition-colors"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or register no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>

          {/* Filter Year */}
          <div>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Filter Section */}
          <div>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {/* Filter Placement Eligible */}
          <div>
            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Placement Status</option>
              <option value="eligible_placed">Eligible - Placed</option>
              <option value="eligible_unplaced">Eligible - Unplaced</option>
              <option value="ineligible_arrears">Ineligible (Arrears)</option>
              <option value="opted_higher_studies">Higher Studies</option>
            </select>
          </div>

          {/* Filter Arrears */}
          <div>
            <select
              value={arrearsFilter}
              onChange={(e) => setArrearsFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Arrear Status</option>
              <option value="zero">Zero Backlogs</option>
              <option value="pending">Pending Arrears</option>
              <option value="cleared">Cleared History</option>
            </select>
          </div>

          {/* Filter CGPA Range */}
          <div>
            <select
              value={cgpaFilter}
              onChange={(e) => setCgpaFilter(e.target.value)}
              className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All CGPA Ranges</option>
              <option value="9_plus">9.00 - 10.00 CGPA</option>
              <option value="8_to_9">8.00 - 8.99 CGPA</option>
              <option value="7_to_8">7.00 - 7.99 CGPA</option>
              <option value="below_7">&lt; 7.00 CGPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Professional Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th
                  onClick={() => handleSort('departmentRank')}
                  className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Rank</span>
                    <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th className="academic-table-th">Register Number</th>
                <th className="academic-table-th">Photo</th>
                <th className="academic-table-th">Student Name</th>
                <th className="academic-table-th">Year</th>
                <th className="academic-table-th">Section</th>
                <th
                  onClick={() => handleSort('cgpa')}
                  className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>CGPA</span>
                    <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pendingArrearsCount')}
                  className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Current Arrears</span>
                    <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th className="academic-table-th">History Arrears</th>
                <th
                  onClick={() => handleSort('attendancePercentage')}
                  className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Attendance %</span>
                    <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                </th>
                <th className="academic-table-th">Placement Status</th>
                <th className="academic-table-th">Dept Rank</th>
                <th className="academic-table-th">College Rank</th>
                <th className="academic-table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={14} className="px-4 py-8 text-center text-gray-500 font-medium">
                    No assigned student records matched the active filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-[#EBF1FA]/40 transition-colors ${
                      idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                    }`}
                  >
                    <td className="academic-table-td">
                      <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 text-xs">
                        #{student.classRank}
                      </span>
                    </td>
                    <td className="academic-table-td font-mono font-bold text-gray-700 text-xs">
                      {student.registerNo}
                    </td>
                    <td className="academic-table-td">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                      />
                    </td>
                    <td className="academic-table-td">
                      <div>
                        <span className="font-bold text-gray-900 block leading-tight">{student.name}</span>
                        <span className="text-[11px] text-gray-500 font-medium">{student.email}</span>
                      </div>
                    </td>
                    <td className="academic-table-td font-bold text-gray-800 text-xs">Year {student.year}</td>
                    <td className="academic-table-td font-bold text-gray-800 text-xs">Sec {student.section}</td>
                    <td className="academic-table-td">
                      <span
                        className={`font-black text-xs px-2.5 py-1 rounded-lg border ${
                          student.cgpa >= 8.5
                            ? 'bg-emerald-50 text-[#4CAF50] border-emerald-200'
                            : student.cgpa >= 7.5
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {student.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="academic-table-td">
                      {student.pendingArrearsCount === 0 ? (
                        <Badge variant="success" size="sm">0 Backlogs</Badge>
                      ) : (
                        <Badge variant="danger" size="sm">
                          {student.pendingArrearsCount} Pending
                        </Badge>
                      )}
                    </td>
                    <td className="academic-table-td text-xs text-gray-600 font-semibold">
                      {student.totalHistoryArrearsCount} Total
                    </td>
                    <td className="academic-table-td">
                      <span
                        className={`font-extrabold text-xs px-2.5 py-1 rounded-lg border ${
                          student.attendancePercentage >= 85
                            ? 'bg-emerald-50 text-[#4CAF50] border-emerald-200'
                            : student.attendancePercentage >= 75
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-red-50 text-[#F44336] border-red-200'
                        }`}
                      >
                        {student.attendancePercentage}%
                      </span>
                    </td>
                    <td className="academic-table-td">
                      {student.placementStatus === 'eligible_placed' && (
                        <Badge variant="success" size="sm">
                          Placed ({student.companyName})
                        </Badge>
                      )}
                      {student.placementStatus === 'eligible_unplaced' && (
                        <Badge variant="info" size="sm">Eligible</Badge>
                      )}
                      {student.placementStatus === 'ineligible_arrears' && (
                        <Badge variant="danger" size="sm">Ineligible</Badge>
                      )}
                      {student.placementStatus === 'opted_higher_studies' && (
                        <Badge variant="warning" size="sm">Higher Studies</Badge>
                      )}
                    </td>
                    <td className="academic-table-td font-extrabold text-gray-800 text-xs">#{student.departmentRank}</td>
                    <td className="academic-table-td font-extrabold text-gray-800 text-xs">#{student.collegeRank}</td>
                    <td className="academic-table-td text-right">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="px-3 py-1.5 bg-[#5B82C5] text-white hover:bg-[#4A6FA8] font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs ml-auto"
                      >
                        <EyeIcon className="w-3.5 h-3.5" /> View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-gray-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
