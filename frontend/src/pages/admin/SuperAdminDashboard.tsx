import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
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

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { colleges, departments, mentors, students } = useDashboard();

  // Compute aggregate metrics
  const totalColleges = colleges.length;
  const totalDepartments = departments.length;
  const totalMentors = mentors.reduce((acc, m) => acc + m.assignedStudentCount, 142);
  const totalStudents = 2850;

  // Data for Department CGPA Bar Chart
  const deptCgpaData = departments.map((d) => ({
    name: d.code,
    cgpa: d.avgCgpa,
    placement: d.placementPercentage,
  }));

  // Data for Arrear Distribution Pie Chart
  const arrearPieData = [
    { name: 'Zero Arrears', value: 2180, color: '#4CAF50' },
    { name: '1 Pending Arrear', value: 420, color: '#FF9800' },
    { name: '2+ Pending Arrears', value: 250, color: '#F44336' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Super Admin Executive Dashboard</h1>
            <Badge variant="primary" size="sm">AY 2025 - 2026</Badge>
          </div>
          <p className="text-sm font-semibold text-gray-500 mt-1">
            Francis Xavier Group of Institutions • Central Academic ERP Portal
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/colleges')}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <BuildingLibraryIcon className="w-4 h-4 text-[#5B82C5]" /> Manage Colleges
          </button>
          <button
            onClick={() => alert('Opening NAAC Academic Audit Export Tool...')}
            className="px-4 py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#5B82C5]/20 flex items-center gap-1.5"
          >
            <DocumentChartBarIcon className="w-4 h-4" /> Export NAAC Audit Data
          </button>
        </div>
      </div>

      {/* Top 4 Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department CGPA Comparison Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Department Average CGPA Benchmark</h3>
              <p className="text-xs text-gray-500 font-medium">Comparison of mean academic score by department</p>
            </div>
            <Badge variant="info">Scale: 0.00 - 10.00</Badge>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptCgpaData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }} />
                <YAxis domain={[5, 10]} tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    borderColor: '#E2E8F0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="cgpa" fill="#5B82C5" radius={[6, 6, 0, 0]} name="Average CGPA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Arrear Breakdown Donut Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Institutional Arrear Spectrum</h3>
            <p className="text-xs text-gray-500 font-medium">Distribution of student backlog standing</p>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={arrearPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
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
                <span className="text-gray-900">{item.value} ({((item.value / 2850) * 100).toFixed(1)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Performance Leaderboard Table */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Department Performance Leaderboard</h3>
            <p className="text-xs text-gray-500 font-medium">Comprehensive academic metrics across all 8 FXEC departments</p>
          </div>
          <button
            onClick={() => navigate('/departments')}
            className="text-xs font-bold text-[#5B82C5] hover:underline"
          >
            View Department Cards →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="academic-table-th">Dept Code</th>
                <th className="academic-table-th">Department Name</th>
                <th className="academic-table-th">Head of Dept (HOD)</th>
                <th className="academic-table-th">Students</th>
                <th className="academic-table-th">Mentors</th>
                <th className="academic-table-th">Avg CGPA</th>
                <th className="academic-table-th">Placement %</th>
                <th className="academic-table-th">Pending Arrears</th>
                <th className="academic-table-th text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departments.map((dept, idx) => (
                <tr key={dept.id} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="academic-table-td font-extrabold text-gray-900">{dept.code}</td>
                  <td className="academic-table-td font-bold text-gray-800">{dept.name}</td>
                  <td className="academic-table-td text-gray-700">{dept.hodName}</td>
                  <td className="academic-table-td font-bold">{dept.studentsCount}</td>
                  <td className="academic-table-td font-semibold">{dept.mentorsCount}</td>
                  <td className="academic-table-td">
                    <span className="font-extrabold text-gray-900 bg-[#EBF1FA] text-[#5B82C5] px-2.5 py-1 rounded-lg border border-[#5B82C5]/30">
                      {dept.avgCgpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="academic-table-td font-bold text-emerald-700">{dept.placementPercentage}%</td>
                  <td className="academic-table-td">
                    <Badge variant={dept.pendingArrearsCount > 30 ? 'danger' : 'warning'} size="sm">
                      {dept.pendingArrearsCount} Arrears
                    </Badge>
                  </td>
                  <td className="academic-table-td text-right">
                    <button
                      onClick={() => navigate('/departments')}
                      className="px-3 py-1.5 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors"
                    >
                      Open Portal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
