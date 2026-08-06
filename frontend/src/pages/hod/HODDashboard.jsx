import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import api from '../../services/api';
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#5B82C5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const HODDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard/hod');
        setDashboardData(response.data.data);
        setError(null);
      } catch (err) {
        setError('Unable to load dashboard data');
        console.error('Error fetching HOD dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
          <p className="mt-4 text-sm font-semibold text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-sm font-semibold text-red-800 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors min-h-[44px]"
        >
          Retry
        </button>
      </div>
    );
  }

  const { summary, cgpa_distribution, attendance_distribution, mentor_performance, top_students, counseling_students } = dashboardData;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <BuildingLibraryIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" />
          HOD Dashboard
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
          Department-level analytics and performance metrics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <UserGroupIcon className="w-5 h-5 text-[#5B82C5]" />
            <span className="text-xs font-bold text-gray-500">Total Students</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{summary.total_students}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <AcademicCapIcon className="w-5 h-5 text-[#5B82C5]" />
            <span className="text-xs font-bold text-gray-500">Total Mentors</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{summary.total_mentors}</p>
        </div>

        <div className="bg-[#EBF1FA] p-4 rounded-xl border border-[#5B82C5]/20 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <ChartBarIcon className="w-5 h-5 text-[#5B82C5]" />
            <span className="text-xs font-bold text-gray-500">Avg CGPA</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{Number(summary.avg_cgpa).toFixed(2)}</p>
        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-gray-500">Avg Attendance</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{Number(summary.avg_attendance).toFixed(2)}%</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-gray-500">With Arrears</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{summary.students_with_arrears}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-gray-500">High Performers</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{summary.high_performers}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl border border-green-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-gray-500">Placement Ready</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{summary.placement_ready}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CGPA Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-4">CGPA Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={cgpa_distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cgpa_range" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#5B82C5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Distribution */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-4">Attendance Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={attendance_distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ attendance_range, count }) => `${attendance_range}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {attendance_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mentor Performance */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <h3 className="text-sm font-black text-gray-900 mb-4">Mentor Performance</h3>
        <div className="overflow-x-auto hidden xl:block">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Mentor</th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Avg CGPA</th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Avg Attendance</th>
                <th className="px-4 py-3 text-left text-[10px] sm:text-xs font-black text-gray-700 uppercase">Arrears</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mentor_performance.map((mentor) => (
                <tr key={mentor.staff_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">
                    {mentor.full_name}
                    <div className="text-[10px] text-gray-500">{mentor.designation}</div>
                  </td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.total_students}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{Number(mentor.avg_cgpa || 0).toFixed(2)}</td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{Number(mentor.avg_attendance || 0).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-xs sm:text-sm font-bold text-gray-900">{mentor.total_arrears || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="xl:hidden space-y-3">
          {mentor_performance.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-xs font-medium">No mentor data available</div>
          ) : (
            mentor_performance.map((mentor) => (
              <div key={mentor.staff_id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm font-bold text-gray-900">{mentor.full_name}</p>
                <p className="text-[10px] text-gray-500 mb-2">{mentor.designation}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Students</span>
                    <span className="text-sm font-black text-gray-900">{mentor.total_students}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Avg CGPA</span>
                    <span className="text-sm font-black text-gray-900">{Number(mentor.avg_cgpa || 0).toFixed(2)}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Avg Attendance</span>
                    <span className="text-sm font-black text-gray-900">{Number(mentor.avg_attendance || 0).toFixed(2)}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-gray-200">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Arrears</span>
                    <span className="text-sm font-black text-gray-900">{mentor.total_arrears || 0}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Students & Counseling Required */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-4 h-4 text-[#5B82C5]" />
            Top Performing Students
          </h3>
          <div className="space-y-3">
            {top_students.map((student, index) => (
              <div key={student.register_no} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5B82C5] text-white rounded-full flex items-center justify-center text-xs font-black">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{student.student_name}</p>
                    <p className="text-[10px] text-gray-500">{student.register_no}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[#5B82C5]">{Number(student.cgpa).toFixed(2)}</p>
                  <p className="text-[10px] text-gray-500">CGPA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Requiring Counseling */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
          <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
            Students Requiring Counseling
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {counseling_students.map((student) => (
              <div key={student.register_no} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">{student.student_name}</p>
                    <p className="text-[10px] text-gray-500">{student.register_no}</p>
                    <p className="text-[10px] text-gray-500">Mentor: {student.mentor_name}</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">
                  {student.reason}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
