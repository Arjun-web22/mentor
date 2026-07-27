import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { FilterPanel } from '../../components/common/FilterPanel';
import { DataTable } from '../../components/common/DataTable';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
import { Student } from '../../types/dashboard';
import { UserGroupIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const StudentList: React.FC = () => {
  const { students, departments } = useDashboard();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [arrearsFilter, setArrearsFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState('all');
  const [selectedStudentForCounseling, setSelectedStudentForCounseling] = useState<Student | null>(null);

  // Sync query params from URL if present
  useEffect(() => {
    const querySearch = searchParams.get('search');
    const queryDept = searchParams.get('dept');
    if (querySearch) setSearch(querySearch);
    if (queryDept) setDepartmentId(queryDept);
  }, [searchParams]);

  // Client side filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentId === 'all' || s.departmentId === departmentId;

    let matchesArrears = true;
    if (arrearsFilter === 'zero') matchesArrears = s.pendingArrearsCount === 0;
    else if (arrearsFilter === 'pending') matchesArrears = s.pendingArrearsCount > 0;
    else if (arrearsFilter === 'cleared')
      matchesArrears = s.totalHistoryArrearsCount > 0 && s.pendingArrearsCount === 0;

    const matchesPlacement = placementFilter === 'all' || s.placementStatus === placementFilter;

    return matchesSearch && matchesDept && matchesArrears && matchesPlacement;
  });

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('all');
    setArrearsFilter('all');
    setPlacementFilter('all');
  };

  const handleExportCSV = () => {
    const headers = ['RegisterNo', 'Name', 'Department', 'CGPA', 'PendingArrears', 'Attendance', 'PlacementStatus'];
    const rows = filteredStudents.map((s) => [
      s.registerNo,
      `"${s.name}"`,
      s.departmentName,
      s.cgpa.toFixed(2),
      s.pendingArrearsCount,
      `${s.attendancePercentage}%`,
      s.placementStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FXEC_Student_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserGroupIcon className="w-7 h-7 text-[#5B82C5]" /> Student Directory & Academic Records
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Searchable institution-wide register with CGPA, arrears history, and mentor logs
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center gap-1.5"
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-[#5B82C5]" /> Export Student CSV Report
        </button>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        arrearsFilter={arrearsFilter}
        onArrearsFilterChange={setArrearsFilter}
        placementFilter={placementFilter}
        onPlacementFilterChange={setPlacementFilter}
        departments={departments}
        onReset={handleResetFilters}
      />

      {/* Data Table */}
      <DataTable
        students={filteredStudents}
        onOpenCounselingModal={(student) => setSelectedStudentForCounseling(student)}
      />

      {/* Counseling Modal */}
      {selectedStudentForCounseling && (
        <AddCounselingModal
          isOpen={Boolean(selectedStudentForCounseling)}
          onClose={() => setSelectedStudentForCounseling(null)}
          studentId={selectedStudentForCounseling.id}
          studentName={selectedStudentForCounseling.name}
        />
      )}
    </div>
  );
};
