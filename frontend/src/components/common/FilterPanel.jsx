import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const FilterPanel = ({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  yearFilter,
  onYearFilterChange,
  sectionFilter,
  onSectionFilterChange,
  departments,
  onReset,
}) => {
  const years = ['1', '2', '3', '4'];
  const sections = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs space-y-3 mb-6">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <FunnelIcon className="w-4 h-4 text-[#5B82C5]" /> Search & Filters
        </h4>
        <button
          onClick={onReset}
          className="text-xs font-bold text-gray-500 hover:text-[#5B82C5] flex items-center gap-1 transition-colors px-2 py-2 min-h-[44px]"
        >
          <ArrowPathIcon className="w-4 h-4" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Search input */}
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, register no, roll no..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          />
        </div>

        {/* Department filter */}
        <div>
          <select
            value={departmentId}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year filter */}
        <div>
          <select
            value={yearFilter}
            onChange={(e) => onYearFilterChange(e.target.value)}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
        </div>

        {/* Section filter */}
        <div>
          <select
            value={sectionFilter}
            onChange={(e) => onSectionFilterChange(e.target.value)}
            className="w-full py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          >
            <option value="all">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
