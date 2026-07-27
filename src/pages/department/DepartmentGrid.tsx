import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
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

export const DepartmentGrid: React.FC = () => {
  const navigate = useNavigate();
  const { departments } = useDashboard();
  const [search, setSearch] = useState('');

  const getDepartmentIcon = (code: string) => {
    switch (code) {
      case 'CSE':
        return ComputerDesktopIcon;
      case 'IT':
        return CodeBracketIcon;
      case 'AI&DS':
        return CpuChipIcon;
      case 'ECE':
        return SignalIcon;
      case 'EEE':
        return BoltIcon;
      case 'MECH':
        return WrenchScrewdriverIcon;
      case 'CIVIL':
        return BuildingOfficeIcon;
      case 'MBA':
        return BriefcaseIcon;
      default:
        return FolderIcon;
    }
  };

  const filteredDepartments = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.hodName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FolderIcon className="w-7 h-7 text-[#5B82C5]" /> Academic Departments Directory
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Departmental performance metrics, faculty allocation, student counts and placement statistics
          </p>
        </div>

        <div className="relative min-w-[280px]">
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

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredDepartments.map((dept) => {
          const IconComp = getDepartmentIcon(dept.code);
          return (
            <div
              key={dept.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md hover:border-[#5B82C5] transition-all duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-[#EBF1FA] text-[#5B82C5] rounded-xl flex items-center justify-center font-black border border-[#5B82C5]/30">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200">
                    {dept.code}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-gray-900 leading-snug">{dept.name}</h3>
                <p className="text-xs font-semibold text-gray-500 mt-1">HOD: {dept.hodName}</p>

                <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-gray-100">
                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Students</span>
                    <span className="text-sm font-black text-gray-900">{dept.studentsCount}</span>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <span className="text-[11px] font-bold text-gray-400 block uppercase">Mentors</span>
                    <span className="text-sm font-black text-gray-900">{dept.mentorsCount}</span>
                  </div>

                  <div className="bg-[#EBF1FA] p-2.5 rounded-lg border border-[#5B82C5]/20">
                    <span className="text-[11px] font-bold text-[#5B82C5] block uppercase">Avg CGPA</span>
                    <span className="text-sm font-black text-[#5B82C5]">{dept.avgCgpa.toFixed(2)}</span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-600 block uppercase">Placement %</span>
                    <span className="text-sm font-black text-emerald-800">{dept.placementPercentage}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/students?dept=${dept.id}`)}
                className="w-full py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-2"
              >
                <span>Open Department Portal</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
