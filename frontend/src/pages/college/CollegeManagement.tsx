import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  MapPinIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export const CollegeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { colleges } = useDashboard();
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredColleges = colleges.filter((col) => {
    const matchesSearch =
      col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.code.toLowerCase().includes(search.toLowerCase()) ||
      col.hodName.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'all' || col.region.includes(regionFilter);
    const matchesStatus = statusFilter === 'all' || col.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BuildingLibraryIcon className="w-7 h-7 text-[#5B82C5]" /> College Campus Directory & Governance
          </h1>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Overview of affiliated engineering & management institutions under Francis Xavier Trust
          </p>
        </div>

        <button
          onClick={() => alert('Add College Modal: Contact Super Admin to provision a new campus code.')}
          className="px-4 py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          + Add New Campus
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campus name, code or Principal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          />
        </div>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
        >
          <option value="all">All Regions</option>
          <option value="Tirunelveli">Tirunelveli Region</option>
          <option value="Vannarpettai">Vannarpettai Campus</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active Accreditation</option>
          <option value="Under Audit">Under Audit</option>
        </select>
      </div>

      {/* Searchable Colleges Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="academic-table-th">College Name</th>
              <th className="academic-table-th">Code</th>
              <th className="academic-table-th">Location</th>
              <th className="academic-table-th">Departments</th>
              <th className="academic-table-th">Students</th>
              <th className="academic-table-th">Mentors</th>
              <th className="academic-table-th">Principal / HOD</th>
              <th className="academic-table-th">NAAC Grade</th>
              <th className="academic-table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredColleges.map((col, idx) => (
              <tr
                key={col.id}
                onClick={() => navigate('/departments')}
                className={`hover:bg-[#EBF1FA]/50 cursor-pointer transition-colors ${
                  idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                }`}
              >
                <td className="academic-table-td font-black text-gray-900 flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-[#5B82C5] text-white font-bold flex items-center justify-center text-xs">
                    {col.code}
                  </span>
                  <div>
                    <span>{col.name}</span>
                    <span className="block text-[11px] text-gray-400 font-normal">
                      Estd. {col.establishedYear}
                    </span>
                  </div>
                </td>
                <td className="academic-table-td font-mono font-bold text-[#5B82C5]">{col.code}</td>
                <td className="academic-table-td text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5 text-gray-400" /> {col.region}
                  </div>
                </td>
                <td className="academic-table-td font-bold text-gray-900">{col.departmentsCount} Depts</td>
                <td className="academic-table-td font-bold text-gray-800">{col.studentsCount}</td>
                <td className="academic-table-td font-semibold text-gray-700">{col.mentorsCount}</td>
                <td className="academic-table-td font-bold text-gray-800">{col.hodName}</td>
                <td className="academic-table-td">
                  <Badge variant="success" size="sm">Grade {col.naacGrade}</Badge>
                </td>
                <td className="academic-table-td text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate('/departments')}
                    className="px-3.5 py-1.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 ml-auto shadow-xs"
                  >
                    <span>View Departments</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
