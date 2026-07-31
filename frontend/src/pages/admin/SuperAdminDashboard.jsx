import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { getDepartments } from '../../services/departmentService';
import { getSuperAdminDashboard } from '../../services/dashboardService';
import {
  BuildingLibraryIcon,
  FolderIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  DocumentChartBarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { colleges, departments: contextDepartments, mentors, students } = useDashboard();
  const [departments, setDepartments] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [departmentsResponse, dashboardResponse] = await Promise.all([
          getDepartments(),
          getSuperAdminDashboard()
        ]);
        
        setDepartments(departmentsResponse);
        setDashboardData(dashboardResponse);
        setError(null);
      } catch (err) {
        setError('Unable to load dashboard data.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Use real data from API or fallback to context values
  const totalColleges = dashboardData?.summary?.totalColleges ?? (colleges || []).length;
  const totalDepartments = dashboardData?.summary?.totalDepartments ?? departments.length;
  const totalMentors = dashboardData?.summary?.totalMentors ?? (mentors || []).length;
  const totalStudents = dashboardData?.summary?.totalStudents ?? 0;

  // Data for Department CGPA Bar Chart
  const deptCgpaData = dashboardData?.cgpaChart?.map((d) => ({
    name: d.department_name || d.department_id,
    cgpa: Number(d.avg_cgpa || 0),
  })) || [];

  // Data for Department Attendance Bar Chart
  const deptAttendanceData = dashboardData?.attendanceChart?.map((d) => ({
    name: d.department_name || d.department_id,
    attendance: Number(d.avg_attendance || 0),
  })) || [];

  // Data for Student Distribution Chart
  const studentDistributionData = dashboardData?.studentDistribution?.map((d) => ({
    name: d.department_name || d.department_id,
    students: Number(d.total_students || 0),
  })) || [];

  // Data for Mentor Distribution Chart
  const mentorDistributionData = dashboardData?.mentorDistribution?.map((d) => ({
    name: d.department_name || d.department_id,
    mentors: Number(d.total_mentors || 0),
  })) || [];

  // Data for Arrear Distribution Pie Chart
  const arrearPieData = dashboardData?.arrearChart ? [
    { name: 'Zero Arrears', value: dashboardData.arrearChart.zeroArrears, color: '#4CAF50' },
    { name: '1 Pending Arrear', value: dashboardData.arrearChart.oneArrear, color: '#FF9800' },
    { name: '2+ Pending Arrears', value: dashboardData.arrearChart.twoPlusArrears, color: '#F44336' },
  ] : [];

  // Statistics data
  const statistics = dashboardData?.statistics || {};

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading dashboard...</p>
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

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <div className="w-full sm:w-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Super Admin Executive Dashboard</h1>
            <Badge variant="primary" size="sm">AY 2025 - 2026</Badge>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Francis Xavier Group of Institutions • Central Academic ERP Portal
          </p>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => navigate('/colleges')}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <BuildingLibraryIcon className="w-4 h-4 text-[#5B82C5]" /> Manage Colleges
          </button>
          <button
            onClick={() => alert('Opening NAAC Academic Audit Export Tool...')}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#5B82C5]/20 flex items-center gap-1.5"
          >
            <DocumentChartBarIcon className="w-4 h-4" /> Export NAAC Audit Data
          </button>
        </div>
      </div>

      {/* Top 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Colleges"
          value={totalColleges}
          subtitle="FXEC Central & FX Tech"
          icon={BuildingLibraryIcon}
          trend={{ value: '2 Campuses', isPositive: true }}
          onClick={() => navigate('/colleges')}
        />
        <StatCard
          title="Total Departments"
          value={totalDepartments}
          subtitle="CSE, IT, MECH, ECE, EEE..."
          icon={FolderIcon}
          trend={{ value: '8 Active Depts', isPositive: true }}
          onClick={() => navigate('/departments')}
        />
        <StatCard
          title="Faculty Mentors"
          value={totalMentors}
          subtitle="1:20 Mentor-Student Ratio"
          icon={AcademicCapIcon}
          trend={{ value: '100% Allocated', isPositive: true }}
        />
        <StatCard
          title="Total Enrolled Students"
          value={totalStudents.toLocaleString()}
          subtitle="Undergraduate & Postgraduate"
          icon={UserGroupIcon}
          trend={{ value: '91.4% Pass Rate', isPositive: true }}
          onClick={() => navigate('/students')}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-[#5B82C5]" />
            <span className="text-xs font-bold text-gray-500 uppercase">Avg CGPA</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{Number(statistics.avgCgpa || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Avg Attendance</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{Number(statistics.avgAttendance || 0).toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <ExclamationCircleIcon className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-gray-500 uppercase">Low Attendance</span>
          </div>
          <p className="text-2xl font-black text-orange-600">{Number(statistics.lowAttendanceCount || 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <AcademicCapIcon className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Top Students</span>
          </div>
          <p className="text-2xl font-black text-purple-600">{Number(statistics.topStudentsCount || 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-gray-500 uppercase">Highest CGPA</span>
          </div>
          <p className="text-2xl font-black text-emerald-600">{Number(statistics.highestCgpa || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Department CGPA Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Department Average CGPA Benchmark</h3>
              <p className="text-xs text-gray-500 font-medium">Comparison of mean academic score by department</p>
            </div>
            <Badge variant="info">Scale: 0.00 - 10.00</Badge>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptCgpaData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <YAxis domain={[5, 10]} tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="cgpa" fill="#5B82C5" radius={[4, 4, 0, 0]} name="Average CGPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Arrear Breakdown Donut Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Institutional Arrear Spectrum</h3>
            <p className="text-xs text-gray-500 font-medium">Distribution of student backlog standing</p>

            <div className="h-48 sm:h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={arrearPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {arrearPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            {arrearPieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900">{item.value} ({totalStudents > 0 ? ((item.value / totalStudents) * 100).toFixed(1) : 0}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Attendance Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Department Average Attendance</h3>
              <p className="text-xs text-gray-500 font-medium">Comparison of mean attendance by department</p>
            </div>
            <Badge variant="info">Scale: 0 - 100%</Badge>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAttendanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="attendance" fill="#10B981" radius={[4, 4, 0, 0]} name="Average Attendance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Distribution Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Student Distribution</h3>
              <p className="text-xs text-gray-500 font-medium">Students per department</p>
            </div>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentDistributionData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="students" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mentor Distribution Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Mentor Distribution</h3>
              <p className="text-xs text-gray-500 font-medium">Mentors per department</p>
            </div>
          </div>

          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mentorDistributionData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="mentors" fill="#F59E0B" radius={[0, 4, 4, 0]} name="Mentors" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Mentors Table */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Top 5 Performing Mentors</h3>
            <p className="text-xs text-gray-500 font-medium">Mentors with highest average student CGPA</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="academic-table-th">Rank</th>
                <th className="academic-table-th">Staff ID</th>
                <th className="academic-table-th">Mentor Name</th>
                <th className="academic-table-th">Avg CGPA</th>
                <th className="academic-table-th">Total Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData?.topMentors?.map((mentor, idx) => (
                <tr key={mentor.staff_id} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="academic-table-td font-extrabold text-gray-900">#{idx + 1}</td>
                  <td className="academic-table-td font-bold text-gray-800">{mentor.staff_id}</td>
                  <td className="academic-table-td font-bold text-gray-900">{mentor.full_name}</td>
                  <td className="academic-table-td">
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {Number(mentor.avg_cgpa || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="academic-table-td font-bold">{Number(mentor.total_students || 0)}</td>
                </tr>
              ))}
              {(!dashboardData?.topMentors || dashboardData.topMentors.length === 0) && (
                <tr>
                  <td colSpan="5" className="academic-table-td text-center text-gray-500 py-8">
                    No mentor data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Performance Leaderboard Table */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Department Performance Leaderboard</h3>
            <p className="text-xs text-gray-500 font-medium">Comprehensive academic metrics across all departments</p>
          </div>
          <button
            onClick={() => navigate('/departments')}
            className="text-xs font-bold text-[#5B82C5] hover:underline"
          >
            View Department Cards →
          </button>
        </div>

        <div className="overflow-x-auto hidden md:block">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="academic-table-th">Dept Code</th>
                <th className="academic-table-th">Department Name</th>
                <th className="academic-table-th">Students</th>
                <th className="academic-table-th">Mentors</th>
                <th className="academic-table-th">Avg CGPA</th>
                <th className="academic-table-th">Avg Attendance</th>
                <th className="academic-table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dashboardData?.studentDistribution?.map((dept, idx) => {
                const mentorCount = dashboardData.mentorDistribution?.find(m => m.department_id === dept.department_id)?.total_mentors || 0;
                const cgpaData = dashboardData.cgpaChart?.find(c => c.department_id === dept.department_id)?.avg_cgpa;
                const attendanceData = dashboardData.attendanceChart?.find(a => a.department_id === dept.department_id)?.avg_attendance;
                
                return (
                  <tr key={dept.department_id} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                    <td className="academic-table-td font-extrabold text-gray-900">{dept.department_id}</td>
                    <td className="academic-table-td font-bold text-gray-800">{dept.department_name}</td>
                    <td className="academic-table-td font-bold">{Number(dept.total_students || 0)}</td>
                    <td className="academic-table-td font-semibold">{Number(mentorCount)}</td>
                    <td className="academic-table-td">
                      <span className="font-extrabold text-gray-900 bg-[#EBF1FA] text-[#5B82C5] px-2.5 py-1 rounded-lg border border-[#5B82C5]/30">
                        {Number(cgpaData || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="academic-table-td font-bold text-emerald-700">{Number(attendanceData || 0).toFixed(2)}%</td>
                    <td className="academic-table-td text-right">
                      <button
                        onClick={() => navigate(`/departments/${dept.department_id}/mentors`)}
                        className="px-3 py-1.5 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors"
                      >
                        Open Portal
                      </button>
                    </td>
                  </tr>
                );
              })}
              {(!dashboardData?.studentDistribution || dashboardData.studentDistribution.length === 0) && (
                <tr>
                  <td colSpan="7" className="academic-table-td text-center text-gray-500 py-8">
                    No department data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {dashboardData?.studentDistribution?.map((dept, idx) => {
            const mentorCount = dashboardData.mentorDistribution?.find(m => m.department_id === dept.department_id)?.total_mentors || 0;
            const cgpaData = dashboardData.cgpaChart?.find(c => c.department_id === dept.department_id)?.avg_cgpa;
            const attendanceData = dashboardData.attendanceChart?.find(a => a.department_id === dept.department_id)?.avg_attendance;
            
            return (
              <div key={dept.department_id} className={`bg-white rounded-xl p-4 border border-gray-200 shadow-xs ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-extrabold text-gray-900 bg-[#EBF1FA] text-[#5B82C5] px-2.5 py-1 rounded-lg border border-[#5B82C5]/30 text-sm">
                    {dept.department_id}
                  </span>
                  <Badge variant="info" size="sm">
                    {Number(attendanceData || 0).toFixed(2)}%
                  </Badge>
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{dept.department_name}</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Students</span>
                    <span className="text-sm font-black text-gray-900">{Number(dept.total_students || 0)}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Mentors</span>
                    <span className="text-sm font-black text-gray-900">{Number(mentorCount)}</span>
                  </div>
                  <div className="bg-[#EBF1FA] p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-[#5B82C5] block uppercase">Avg CGPA</span>
                    <span className="text-sm font-black text-[#5B82C5]">{Number(cgpaData || 0).toFixed(2)}</span>
                  </div>
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase">Attendance</span>
                    <span className="text-sm font-black text-emerald-800">{Number(attendanceData || 0).toFixed(2)}%</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/departments/${dept.department_id}/mentors`)}
                  className="w-full py-2.5 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors min-h-[44px]"
                >
                  Open Department Portal
                </button>
              </div>
            );
          })}
          {(!dashboardData?.studentDistribution || dashboardData.studentDistribution.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              No department data available
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
