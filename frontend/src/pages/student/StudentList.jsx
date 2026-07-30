import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel } from '../../components/common/FilterPanel';
import { DataTable } from '../../components/common/DataTable';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
import { getAllStudents } from '../../services/studentService';
import { getDepartments } from '../../services/departmentService';
import { UserGroupIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const StudentList = () => {
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [departmentId, setDepartmentId] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selectedStudentForCounseling, setSelectedStudentForCounseling] = useState(null);

  // Sync query params from URL if present
  useEffect(() => {
    const querySearch = searchParams.get('search');
    const queryDept = searchParams.get('dept');
    if (querySearch) setSearch(querySearch);
    if (queryDept) setDepartmentId(queryDept);
  }, [searchParams]);

  // Fetch students and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, departmentsResponse] = await Promise.all([
          getAllStudents(),
          getDepartments()
        ]);

        if (studentsResponse.success) {
          setStudents(studentsResponse.data);
        }

        if (departmentsResponse.success) {
          setDepartments(departmentsResponse.data);
        }

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

  // Client side filtering
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.register_no?.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_no?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = departmentId === 'all' || s.department_id === parseInt(departmentId);
    const matchesYear = yearFilter === 'all' || s.year === yearFilter;
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;

    return matchesSearch && matchesDept && matchesYear && matchesSection;
  });

  const handleResetFilters = () => {
    setSearch('');
    setDepartmentId('all');
    setYearFilter('all');
    setSectionFilter('all');
  };

  const handleExportCSV = () => {
    const headers = ['RegisterNo', 'RollNo', 'Name', 'Course', 'Year', 'Section', 'Mentor'];
    const rows = filteredStudents.map((s) => [
      s.register_no,
      s.roll_no,
      `"${s.student_name}"`,
      s.course_degree,
      s.year,
      s.section,
      s.staff_name || 'Not Assigned',
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Students...</p>
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
            <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Student Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            {students.length} student{students.length !== 1 ? 's' : ''} in the system
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
      <FilterPanel
        search={search}
        onSearchChange={setSearch}
        departmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        departments={departments}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        sectionFilter={sectionFilter}
        onSectionFilterChange={setSectionFilter}
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
          studentId={selectedStudentForCounseling.register_no}
          studentName={selectedStudentForCounseling.student_name}
        />
      )}
    </div>
  );
};
