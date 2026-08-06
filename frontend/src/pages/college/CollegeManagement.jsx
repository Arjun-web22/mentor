import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getAllColleges } from '../../services/collegeService';
import { useCollege } from '../../context/CollegeContext';
import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowRightIcon,
  MapPinIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

export const CollegeManagement = () => {
  const navigate = useNavigate();
  const { setCollege } = useCollege();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        console.log("========== COLLEGE MANAGEMENT MOUNT ==========");
        setLoading(true);
        console.log("Calling getAllColleges API...");
        const response = await getAllColleges();
        console.log("API Response before setColleges:", response);
        if (response.success) {
          console.log("Setting colleges state with data:", response.data);
          setColleges(response.data);
          console.log("setColleges called - state will update on next render");
        } else {
          console.error("API returned success=false:", response);
        }
        setError(null);
      } catch (err) {
        setError('Unable to load colleges');
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegesData();
  }, []);

  useEffect(() => {
    console.log("========== COLLEGES STATE UPDATED ==========");
    console.log("colleges state:", colleges);
    console.log("colleges.length:", colleges.length);
  }, [colleges]);

  const filteredColleges = colleges.filter((col) => {
    const matchesSearch =
      col.college_name.toLowerCase().includes(search.toLowerCase()) ||
      col.college_code.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'all' || col.location.toLowerCase().includes(regionFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || statusFilter === 'Active';
    return matchesSearch && matchesRegion && matchesStatus;
  });

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BuildingLibraryIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> College Campus Directory & Governance
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Overview of affiliated engineering & management institutions under Francis Xavier Trust
          </p>
        </div>

        <button
          onClick={() => alert('Add College Modal: Contact Super Admin to provision a new campus code.')}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-md transition-all min-h-[44px]"
        >
          + Add New Campus
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Colleges...</p>
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

      {/* Filters */}
      {!loading && !error && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search campus name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="flex-1 sm:flex-none py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Regions</option>
              <option value="Tirunelveli">Tirunelveli</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none py-2 px-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      )}

      {/* Searchable Colleges Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto hidden xl:block">
            <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="academic-table-th">College Name</th>
                <th className="academic-table-th">Code</th>
                <th className="academic-table-th">Location</th>
                <th className="academic-table-th">Departments</th>
                <th className="academic-table-th">Students</th>
                <th className="academic-table-th">Mentors</th>
                <th className="academic-table-th">Principal</th>
                <th className="academic-table-th">NAAC Grade</th>
                <th className="academic-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredColleges.map((col, idx) => {
                console.log("========== RENDERING COLLEGE ROW ==========");
                console.log({
                  college_name: col.college_name,
                  college_code: col.college_code,
                  location: col.location,
                  department_count: col.department_count,
                  student_count: col.student_count,
                  mentor_count: col.mentor_count
                });
                return (
                <tr
                  key={col.college_id}
                  onClick={() => navigate('/departments')}
                  className={`hover:bg-[#EBF1FA]/50 cursor-pointer transition-colors ${
                    idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
                  }`}
                >
                  <td className="academic-table-td font-black text-gray-900 flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-lg bg-[#5B82C5] text-white font-bold flex items-center justify-center text-xs">
                      {col.college_code}
                    </span>
                    <div>
                      <span>{col.college_name}</span>
                    </div>
                  </td>
                  <td className="academic-table-td font-mono font-bold text-[#5B82C5]">{col.college_code}</td>
                  <td className="academic-table-td text-xs text-gray-600 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-gray-400" /> {col.location}
                    </div>
                  </td>
                  <td className="academic-table-td font-bold text-gray-900">{col.department_count} Depts</td>
                  <td className="academic-table-td font-bold text-gray-800">{col.student_count}</td>
                  <td className="academic-table-td font-semibold text-gray-700">{col.mentor_count}</td>
                  <td className="academic-table-td font-bold text-gray-800">--</td>
                  <td className="academic-table-td">
                    <Badge variant="success" size="sm">--</Badge>
                  </td>
                  <td className="academic-table-td text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setCollege(col.college_id);
                        navigate(`/departments?collegeId=${col.college_id}`);
                      }}
                      className="px-3.5 py-1.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-xs min-h-[44px]"
                    >
                      <span>View Departments</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          </div>

          {/* Mobile Card View */}
          <div className="xl:hidden space-y-4 p-4">
            {filteredColleges.map((col, idx) => {
              return (
              <div key={col.college_id} className={`bg-white rounded-xl p-4 border border-gray-200 shadow-xs ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="w-10 h-10 rounded-lg bg-[#5B82C5] text-white font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {col.college_code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{col.college_name}</h3>
                  </div>
                  <Badge variant="success" size="sm">--</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5 text-gray-400" /> {col.location}
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Departments</span>
                    <span className="text-sm font-black text-gray-900">{col.department_count}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Students</span>
                    <span className="text-sm font-black text-gray-900">{col.student_count}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Mentors</span>
                    <span className="text-sm font-black text-gray-900">{col.mentor_count}</span>
                  </div>
                  <div className="bg-[#EBF1FA] p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-[#5B82C5] block uppercase">Principal</span>
                    <span className="text-xs font-black text-[#5B82C5] truncate block">--</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCollege(col.college_id);
                    navigate(`/departments?collegeId=${col.college_id}`);
                  }}
                  className="w-full py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs min-h-[44px]"
                >
                  <span>View Departments</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
