import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
import { getStudentsByMentor } from '../../services/mentorService';
import {
  EyeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  ClockIcon,
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
} from 'recharts';
export const MentorDashboard = () => {
  const navigate = useNavigate();
  const { students, currentUser } = useDashboard();
  const [selectedStudentForCounseling, setSelectedStudentForCounseling] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("========== MENTOR DASHBOARD COMPONENT RENDER ==========");
  console.log("currentUser:", currentUser);
  console.log("currentUser.staff_id:", currentUser?.staff_id);

  // Fetch student data on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("========== MENTOR DASHBOARD DEBUG ==========");
        console.log("currentUser:", currentUser);
        console.log("currentUser.staff_id:", currentUser?.staff_id);
        
        const response = await getStudentsByMentor(currentUser.staff_id);
        console.log("API Response:", response);
        console.log("API Response is array:", Array.isArray(response));
        console.log("API Response length:", response?.length);
        
        // getStudentsByMentor returns an array directly, not {success, data}
        setStudentsData(response);
        console.log("setStudentsData called with array length:", response.length);
      } catch (err) {
        setError('Unable to connect to server');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.staff_id) {
      fetchStudents();
    }
  }, [currentUser?.staff_id]);

  // Mentee list assigned to mentor
  const menteeStudents = (studentsData && !studentsData.message) ? studentsData : [];

  // Log menteeStudents updates
  useEffect(() => {
    console.log("========== menteeStudents STATE UPDATE ==========");
    console.log("menteeStudents length:", menteeStudents.length);
  }, [menteeStudents]);
  
  console.log("========== MENTOR DASHBOARD STATE ==========");
  console.log("menteeStudents length:", menteeStudents.length);
  console.log("menteeStudents sample:", menteeStudents[0]);

  const assignedCount = menteeStudents.length;
  const highPerformers = menteeStudents.filter((s) => Number(s.cgpa) >= 8.5).length;
  const arrearWatchlist = menteeStudents.filter((s) => Number(s.pendingArrearsCount) > 0).length;
  const placementReady = menteeStudents.filter((s) => 
    Number(s.cgpa) >= 7.5 && 
    Number(s.pendingArrearsCount) === 0 && 
    Number(s.attendancePercentage) >= 75
  ).length;
  const avgAttendance = assignedCount > 0 
    ? (menteeStudents.reduce((acc, s) => acc + Number(s.attendancePercentage || 0), 0) / assignedCount).toFixed(1)
    : '0.0';
  
  // Calculate header metrics dynamically
  const avgCgpa = assignedCount > 0
    ? (menteeStudents.reduce((acc, s) => acc + Number(s.cgpa || 0), 0) / assignedCount).toFixed(2)
    : '0.00';
  const successRate = assignedCount > 0
    ? ((placementReady / assignedCount) * 100).toFixed(1)
    : '0.0';
    
  console.log("========== MENTOR DASHBOARD METRICS ==========");
  console.log("assignedCount:", assignedCount);
  console.log("highPerformers:", highPerformers);
  console.log("arrearWatchlist:", arrearWatchlist);
  console.log("placementReady:", placementReady);
  console.log("avgAttendance:", avgAttendance);
  console.log("avgCgpa:", avgCgpa);
  console.log("successRate:", successRate);

  // Filtered mentee list for search
  const filteredMentees = menteeStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data
  const cgpaDistData = [
    { range: '9.0 - 10.0', count: menteeStudents.filter((s) => Number(s.cgpa) >= 9.0).length || 0, fill: '#4CAF50' },
    { range: '8.0 - 8.9', count: menteeStudents.filter((s) => Number(s.cgpa) >= 8.0 && Number(s.cgpa) < 9.0).length || 0, fill: '#5B82C5' },
    { range: '7.0 - 7.9', count: menteeStudents.filter((s) => Number(s.cgpa) >= 7.0 && Number(s.cgpa) < 8.0).length || 0, fill: '#3B82F6' },
    { range: 'Below 7.0', count: menteeStudents.filter((s) => Number(s.cgpa) < 7.0).length || 0, fill: '#FF9800' },
  ];

  const arrearPieData = [
    { name: '0 Arrears (Clear)', value: menteeStudents.filter((s) => Number(s.pendingArrearsCount) === 0).length || 0, color: '#4CAF50' },
    { name: '1 Pending Arrear', value: menteeStudents.filter((s) => Number(s.pendingArrearsCount) === 1).length || 0, color: '#FF9800' },
    { name: '2+ Pending Arrears', value: menteeStudents.filter((s) => Number(s.pendingArrearsCount) >= 2).length || 0, color: '#F44336' },
  ];

  // Generate priority alerts dynamically
  const priorityAlerts = menteeStudents
    .filter(s => Number(s.attendancePercentage) < 75 || Number(s.pendingArrearsCount) > 0 || Number(s.cgpa) >= 9)
    .map(s => {
      if (Number(s.attendancePercentage) < 75) {
        return {
          ...s,
          alertType: 'high',
          alertLabel: 'High Alert',
          message: `Attendance: ${Number(s.attendancePercentage).toFixed(1)}%. Below 75% threshold.`
        };
      } else if (Number(s.pendingArrearsCount) > 0) {
        return {
          ...s,
          alertType: 'warning',
          alertLabel: 'Warning',
          message: `${Number(s.pendingArrearsCount)} pending arrears. Needs attention.`
        };
      } else if (Number(s.cgpa) >= 9) {
        return {
          ...s,
          alertType: 'success',
          alertLabel: 'High Performer',
          message: `CGPA: ${Number(s.cgpa).toFixed(2)}. Excellent academic performance.`
        };
      }
      return null;
    })
    .filter(Boolean)
    .slice(0, 3); // Show top 3 alerts

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

      {/* Placeholder State */}
      {!loading && !error && studentsData && studentsData.message && (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-xs">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900">No student data available yet.</h3>
          <p className="text-xs text-gray-500 mt-1">
            Student data will be added to the system soon.
          </p>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (!studentsData || !studentsData.message) && (
        <>
          {/* Header Profile Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-4 gap-4 w-full sm:w-auto">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl object-cover border-2 border-[#5B82C5] shadow-xs flex-shrink-0"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">{currentUser.name}</h1>
                <Badge variant="primary">Senior Faculty Mentor</Badge>
              </div>
              <p className="text-[10px] sm:text-xs font-bold text-gray-500 mt-0.5">
                Dept of Computer Science & Engineering • Office: CS-Block 304
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">
                Office Hours: Mon - Fri (03:30 PM - 05:00 PM) | Direct Contact: +91 98421 11204
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-2 sm:p-3 rounded-xl border border-gray-200 w-full sm:w-auto justify-center">
            <div className="text-center px-2 sm:px-3 border-r border-gray-200">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase block">Mentee CGPA</span>
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#5B82C5]">{avgCgpa}</span>
            </div>
            <div className="text-center px-2 sm:px-3">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase block">Success Rate</span>
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#4CAF50]">{successRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Students Assigned"
          value={assignedCount}
          subtitle="Batch 2022 - 2026"
          icon={UserGroupIcon}
          colorScheme="primary"
        />
        <StatCard
          title="High Performers"
          value={highPerformers}
          subtitle="CGPA ≥ 8.50"
          icon={SparklesIcon}
          colorScheme="success"
          trend={{ value: 'Top 15%', isPositive: true }}
        />
        <StatCard
          title="Arrear Watchlist"
          value={arrearWatchlist}
          subtitle="Needs Academic Counseling"
          icon={ExclamationCircleIcon}
          colorScheme="danger"
          trend={{ value: `${arrearWatchlist} Students`, isNegative: true }}
        />
        <StatCard
          title="Placement Ready"
          value={placementReady}
          subtitle="0 Backlogs & CGPA ≥ 7.5"
          icon={CheckCircleIcon}
          colorScheme="info"
        />
        <StatCard
          title="Average Attendance"
          value={`${avgAttendance}%`}
          subtitle="Above 75% Requirement"
          icon={AcademicCapIcon}
          colorScheme="success"
        />
      </div>

      {/* Charts & Urgent Alerts Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CGPA Spectrum Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs">
          <h3 className="text-sm font-extrabold text-gray-900 mb-1">Mentee CGPA Spectrum</h3>
          <p className="text-xs text-gray-500 mb-3">Academic score grouping for assigned mentees</p>

          <div className="h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cgpaDistData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 10, fontWeight: 700 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#5B82C5" radius={[4, 4, 0, 0]} name="Students" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Arrear Breakdown Chart */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-xs">
          <h3 className="text-sm font-extrabold text-gray-900 mb-1">Arrear Risk Breakdown</h3>
          <p className="text-xs text-gray-500 mb-3">Mentee distribution by backlog status</p>

          <div className="h-48 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={arrearPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
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

        {/* Urgent Action Alerts Feed */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 mb-1">
              <ExclamationCircleIcon className="w-5 h-5 text-[#F44336]" /> Mentor Priority Alerts
            </h3>
            <p className="text-xs text-gray-500 mb-3">Immediate student intervention recommendations</p>

            <div className="space-y-2.5">
              {priorityAlerts.length === 0 ? (
                <div className="p-3 bg-green-50 rounded-xl border border-green-200 text-xs text-center">
                  <p className="font-bold text-green-900">No alerts - All students performing well!</p>
                </div>
              ) : (
                priorityAlerts.map((alert) => (
                  <div
                    key={alert.registerNo}
                    className={`p-3 rounded-xl border text-xs ${
                      alert.alertType === 'high'
                        ? 'bg-red-50 border-red-200'
                        : alert.alertType === 'warning'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className={`flex items-center justify-between font-bold ${
                      alert.alertType === 'high'
                        ? 'text-red-900'
                        : alert.alertType === 'warning'
                          ? 'text-amber-900'
                          : 'text-green-900'
                    }`}>
                      <span>{alert.name} ({alert.registerNo})</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        alert.alertType === 'high'
                          ? 'bg-red-200'
                          : alert.alertType === 'warning'
                            ? 'bg-amber-200'
                            : 'bg-green-200'
                      }`}>
                        {alert.alertLabel}
                      </span>
                    </div>
                    <p className={`mt-1 ${
                      alert.alertType === 'high'
                        ? 'text-red-700'
                        : alert.alertType === 'warning'
                          ? 'text-amber-800'
                          : 'text-green-800'
                    }`}>
                      {alert.message}
                    </p>
                    {alert.alertType !== 'success' && (
                      <button
                        onClick={() => setSelectedStudentForCounseling(alert)}
                        className="mt-2 text-xs font-bold underline hover:opacity-80"
                      >
                        Schedule Counseling Session →
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mentee List Table with Quick Search */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900">Assigned Mentee Roster</h3>
            <p className="text-xs text-gray-500 font-medium">Click any student to access academic profile & arrear timeline</p>
          </div>

          <div className="relative w-full sm:max-w-sm">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mentee by name or reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>
        </div>

        <div className="overflow-x-auto hidden xl:block">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="academic-table-th">Rank</th>
                <th className="academic-table-th">Register No</th>
                <th className="academic-table-th">Student Name</th>
                <th className="academic-table-th">CGPA</th>
                <th className="academic-table-th">Pending Arrears</th>
                <th className="academic-table-th">Attendance</th>
                <th className="academic-table-th">Placement Status</th>
                <th className="academic-table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMentees.map((st, idx) => (
                <tr key={st.registerNo} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="academic-table-td font-black text-gray-900">#{idx + 1}</td>
                  <td className="academic-table-td font-mono font-bold text-gray-700">{st.registerNo}</td>
                  <td className="academic-table-td">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#EBF1FA] text-[#5B82C5] flex items-center justify-center font-bold text-xs border">
                        {st.name?.charAt(0) || '?'}
                      </div>
                      <span className="font-bold text-gray-900">{st.name}</span>
                    </div>
                  </td>
                  <td className="academic-table-td font-black text-[#5B82C5]">{st.cgpa?.toFixed(2) || 'N/A'}</td>
                  <td className="academic-table-td">
                    {st.pendingArrearsCount === 0 ? (
                      <Badge variant="success" size="sm">0 Backlogs</Badge>
                    ) : (
                      <Badge variant="danger" size="sm">{st.pendingArrearsCount} Pending</Badge>
                    )}
                  </td>
                  <td className="academic-table-td font-bold">{st.attendancePercentage?.toFixed(1) || 'N/A'}%</td>
                  <td className="academic-table-td">
                    {st.cgpa >= 7.5 && st.pendingArrearsCount === 0 && st.attendancePercentage >= 75 ? (
                      <Badge variant="success" size="sm">Eligible</Badge>
                    ) : st.pendingArrearsCount > 0 ? (
                      <Badge variant="danger" size="sm">Ineligible</Badge>
                    ) : (
                      <Badge variant="info" size="sm">Needs Improvement</Badge>
                    )}
                  </td>
                  <td className="academic-table-td text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/students/profile/${st.registerNo}`)}
                        className="px-3 py-1.5 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => setSelectedStudentForCounseling(st)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" /> Counsel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="xl:hidden space-y-4 p-4">
          {filteredMentees.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-medium">
              No mentee records matched your search query.
            </div>
          ) : (
            filteredMentees.map((student, idx) => (
              <div key={student.registerNo} className={`bg-white rounded-xl p-4 border border-gray-200 shadow-xs ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#EBF1FA] text-[#5B82C5] flex items-center justify-center font-bold text-lg border flex-shrink-0">
                    {student.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{student.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{student.registerNo}</p>
                  </div>
                  <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 text-xs flex-shrink-0">
                    #{idx + 1}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">CGPA</span>
                    <span className={`font-black text-sm ${
                      student.cgpa >= 8.5 ? 'text-[#4CAF50]' : student.cgpa >= 7.5 ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {student.cgpa?.toFixed(2) || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Attendance</span>
                    <span className={`font-black text-sm ${
                      student.attendancePercentage >= 85 ? 'text-[#4CAF50]' : student.attendancePercentage >= 75 ? 'text-blue-700' : 'text-[#F44336]'
                    }`}>
                      {student.attendancePercentage?.toFixed(1) || 'N/A'}%
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Arrears</span>
                    {student.pendingArrearsCount === 0 ? (
                      <span className="font-black text-sm text-[#4CAF50]">0 Backlogs</span>
                    ) : (
                      <span className="font-black text-sm text-[#F44336]">{student.pendingArrearsCount} Pending</span>
                    )}
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Placement</span>
                    {student.cgpa >= 7.5 && student.pendingArrearsCount === 0 && student.attendancePercentage >= 75 ? (
                      <span className="font-black text-xs text-[#4CAF50]">Eligible</span>
                    ) : student.pendingArrearsCount > 0 ? (
                      <span className="font-black text-xs text-[#F44336]">Ineligible</span>
                    ) : (
                      <span className="font-black text-xs text-blue-700">Needs Improvement</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/students/profile/${student.registerNo}`)}
                  className="w-full py-2.5 bg-[#5B82C5] text-white hover:bg-[#4A6FA8] font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs min-h-[44px]"
                >
                  <EyeIcon className="w-3.5 h-3.5" /> View Profile
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Counseling Modal */}
      {selectedStudentForCounseling && (
        <AddCounselingModal
          isOpen={Boolean(selectedStudentForCounseling)}
          onClose={() => setSelectedStudentForCounseling(null)}
          studentId={selectedStudentForCounseling.id}
          studentName={selectedStudentForCounseling.name}
        />
      )}
        </>
      )}
    </div>
  );
};
