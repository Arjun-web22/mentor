import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Student } from '../../types/dashboard';
import { Badge } from './Badge';
import {
  UserIcon,
  AcademicCapIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface DataTableProps {
  students: Student[];
  onOpenCounselingModal?: (student: Student) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ students, onOpenCounselingModal }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'departmentRank' | 'cgpa' | 'pendingArrearsCount' | 'attendancePercentage'>('departmentRank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: typeof sortField) => {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/90 border-b border-gray-200">
              <th
                onClick={() => handleSort('departmentRank')}
                className="academic-table-th cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  <span>Dept Rank</span>
                  <ArrowsUpDownIcon className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </th>
              <th className="academic-table-th">Register No</th>
              <th className="academic-table-th">Student Name</th>
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
              <th className="academic-table-th">Arrear History</th>
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
              <th className="academic-table-th">Mentor Remarks</th>
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
              paginatedStudents.map((student, idx) => (
                <tr
                  key={student.id}
                  className={`hover:bg-[#EBF1FA]/40 transition-colors ${
                    idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <td className="academic-table-td">
                    <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 text-xs">
                      #{student.departmentRank}
                    </span>
                  </td>
                  <td className="academic-table-td font-mono font-bold text-gray-700 text-xs">
                    {student.registerNo}
                  </td>
                  <td className="academic-table-td">
                    <div className="flex items-center space-x-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block leading-tight">{student.name}</span>
                        <span className="text-[11px] text-gray-500 font-medium">
                          {student.departmentName.split(' ')[0]} • Sem {student.semester}-{student.section}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="academic-table-td">
                    <span
                      className={`font-black text-sm px-2.5 py-1 rounded-lg border ${
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
                    {student.totalHistoryArrearsCount} Total ({student.totalHistoryArrearsCount - student.pendingArrearsCount} Cleared)
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
                        Placed: {student.companyName} ({student.packageCtc})
                      </Badge>
                    )}
                    {student.placementStatus === 'eligible_unplaced' && (
                      <Badge variant="info" size="sm">Eligible for Drives</Badge>
                    )}
                    {student.placementStatus === 'ineligible_arrears' && (
                      <Badge variant="danger" size="sm">Ineligible (Arrears)</Badge>
                    )}
                  </td>
                  <td className="academic-table-td max-w-xs truncate text-xs text-gray-600 font-medium">
                    {student.mentorRemarks}
                  </td>
                  <td className="academic-table-td text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="px-3 py-1.5 bg-[#5B82C5] text-white hover:bg-[#4A6FA8] font-bold text-xs rounded-xl flex items-center gap-1 transition-all shadow-xs"
                      >
                        <EyeIcon className="w-3.5 h-3.5" /> View Profile
                      </button>
                      {onOpenCounselingModal && (
                        <button
                          onClick={() => onOpenCounselingModal(student)}
                          className="px-2.5 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 font-bold text-xs rounded-xl transition-all"
                        >
                          Counsel
                        </button>
                      )}
                    </div>
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
              <option value={50}>50</option>
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
  );
};
