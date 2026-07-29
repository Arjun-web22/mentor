import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getDepartments } from '../../services/departmentService';
import {
  FolderIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ComputerDesktopIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SignalIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

export const DepartmentGrid = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDepartmentsData = async () => {
      try {
        setLoading(true);
        const data = await getDepartments();
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError('Unable to connect to server.');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentsData();
  }, []);

  const getDepartmentIcon = (name) => {
    if (name.includes('Computer Science')) return ComputerDesktopIcon;
    if (name.includes('Information Technology')) return CodeBracketIcon;
    if (name.includes('Artificial Intelligence')) return CpuChipIcon;
    if (name.includes('Electronics')) return SignalIcon;
    if (name.includes('Electrical')) return BoltIcon;
    if (name.includes('Mechanical')) return WrenchScrewdriverIcon;
    if (name.includes('Civil')) return BuildingOfficeIcon;
    if (name.includes('MBA')) return BriefcaseIcon;
    return FolderIcon;
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FolderIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Academic Departments Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Departmental performance metrics, faculty allocation, student counts and placement statistics
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search department by name or HOD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Departments...</p>
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
      {!loading && !error && filteredDepartments.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-600">No departments available.</p>
        </div>
      )}

      {/* Grid of Department Cards */}
      {!loading && !error && filteredDepartments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredDepartments.map((dept) => {
            const IconComp = getDepartmentIcon(dept.department_name);
            return (
              <div
                key={dept.department_id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md hover:border-[#5B82C5] transition-all duration-150 flex flex-col justify-between cursor-pointer min-h-[44px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-[#EBF1FA] text-[#5B82C5] rounded-xl flex items-center justify-center font-black border border-[#5B82C5]/30">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
                      {dept.department_id}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-gray-900 leading-snug">{dept.department_name}</h3>

                  <button
                    onClick={() => navigate(`/departments/${dept.department_id}/mentors`)}
                    className="w-full py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-4 min-h-[44px]"
                  >
                    <span>Open Department Portal</span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
