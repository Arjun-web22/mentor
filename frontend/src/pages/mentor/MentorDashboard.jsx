import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
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

  // Mentee list assigned to Dr. K. Arulraj
  const menteeStudents = students.filter(
    (s) => s.mentorId === 'men-101' || s.departmentId === 'dept-cse'
  );

  const assignedCount = menteeStudents.length;
  const highPerformers = menteeStudents.filter((s) => s.cgpa >= 8.5).length;
  const arrearWatchlist = menteeStudents.filter((s) => s.pendingArrearsCount > 0).length;
  const placementReady = menteeStudents.filter((s) => s.cgpa >= 7.5 && s.pendingArrearsCount === 0).length;
  const avgAttendance = (
    menteeStudents.reduce((acc, s) => acc + s.attendancePercentage, 0) / (assignedCount || 1)
  ).toFixed(1);

  // Filtered mentee list for search
  const filteredMentees = menteeStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chart data
  const cgpaDistData = [
    { range: '9.0 - 10.0', count: menteeStudents.filter((s) => s.cgpa >= 9.0).length || 2, fill: '#4CAF50' },
    { range: '8.0 - 8.9', count: menteeStudents.filter((s) => s.cgpa >= 8.0 && s.cgpa < 9.0).length || 3, fill: '#5B82C5' },
    { range: '7.0 - 7.9', count: menteeStudents.filter((s) => s.cgpa >= 7.0 && s.cgpa < 8.0).length || 1, fill: '#3B82F6' },
    { range: 'Below 7.0', count: menteeStudents.filter((s) => s.cgpa < 7.0).length || 1, fill: '#FF9800' },
  ];

  const arrearPieData = [
    { name: '0 Arrears (Clear)', value: menteeStudents.filter((s) => s.pendingArrearsCount === 0).length || 5, color: '#4CAF50' },
    { name: '1 Pending Arrear', value: menteeStudents.filter((s) => s.pendingArrearsCount === 1).length || 1, color: '#FF9800' },
    { name: '2+ Pending Arrears', value: menteeStudents.filter((s) => s.pendingArrearsCount >= 2).length || 1, color: '#F44336' },
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
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
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#5B82C5]">8.28</span>
            </div>
            <div className="text-center px-2 sm:px-3">
              <span className="text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase block">Success Rate</span>
              <span className="text-sm sm:text-base lg:text-lg font-black text-[#4CAF50]">95.8%</span>
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
              <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs">
                <div className="flex items-center justify-between font-bold text-red-900">
                  <span>R. Vignesh (960721104002)</span>
                  <span className="text-[10px] bg-red-200 px-1.5 py-0.5 rounded">High Alert</span>
                </div>
                <p className="text-red-700 mt-1">2 Pending arrears in CS3451 & CS3591. Attendance: 74%.</p>
                <button
                  onClick={() => {
                    const st = menteeStudents.find((s) => s.id === 'stu-1002');
                    if (st) setSelectedStudentForCounseling(st);
                  }}
                  className="mt-2 text-xs font-bold text-[#F44336] underline hover:text-red-900"
                >
                  Schedule Counseling Session →
                </button>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <span>A. Karthi Krishna (960721104001)</span>
                  <span className="text-[10px] bg-amber-200 px-1.5 py-0.5 rounded">Placed</span>
                </div>
                <p className="text-amber-800 mt-1">Placed at Zoho (8.5 LPA). Final NOC document pending signature.</p>
              </div>
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

        <div className="overflow-x-auto hidden md:block">
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
                <tr key={st.id} className={idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}>
                  <td className="academic-table-td font-black text-gray-900">#{st.departmentRank}</td>
                  <td className="academic-table-td font-mono font-bold text-gray-700">{st.registerNo}</td>
                  <td className="academic-table-td">
                    <div className="flex items-center space-x-2.5">
                      <img src={st.avatar} alt={st.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border max-w-full h-auto" />
                      <span className="font-bold text-gray-900">{st.name}</span>
                    </div>
                  </td>
                  <td className="academic-table-td font-black text-[#5B82C5]">{st.cgpa.toFixed(2)}</td>
                  <td className="academic-table-td">
                    {st.pendingArrearsCount === 0 ? (
                      <Badge variant="success" size="sm">0 Backlogs</Badge>
                    ) : (
                      <Badge variant="danger" size="sm">{st.pendingArrearsCount} Pending</Badge>
                    )}
                  </td>
                  <td className="academic-table-td font-bold">{st.attendancePercentage}%</td>
                  <td className="academic-table-td">
                    {st.placementStatus === 'eligible_placed' ? (
                      <Badge variant="success" size="sm">Placed ({st.companyName})</Badge>
                    ) : st.placementStatus === 'ineligible_arrears' ? (
                      <Badge variant="danger" size="sm">Ineligible</Badge>
                    ) : (
                      <Badge variant="info" size="sm">Eligible</Badge>
                    )}
                  </td>
                  <td className="academic-table-td text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/students/${st.id}`)}
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
        <div className="md:hidden space-y-4 p-4">
          {filteredMentees.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-medium">
              No mentee records matched your search query.
            </div>
          ) : (
            filteredMentees.map((student, idx) => (
              <div key={student.id} className={`bg-white rounded-xl p-4 border border-gray-200 shadow-xs ${idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200 max-w-full h-auto flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{student.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{student.registerNo}</p>
                  </div>
                  <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 text-xs flex-shrink-0">
                    #{student.departmentRank}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">CGPA</span>
                    <span className={`font-black text-sm ${
                      student.cgpa >= 8.5 ? 'text-[#4CAF50]' : student.cgpa >= 7.5 ? 'text-blue-700' : 'text-amber-700'
                    }`}>
                      {student.cgpa.toFixed(2)}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Attendance</span>
                    <span className={`font-black text-sm ${
                      student.attendancePercentage >= 85 ? 'text-[#4CAF50]' : student.attendancePercentage >= 75 ? 'text-blue-700' : 'text-[#F44336]'
                    }`}>
                      {student.attendancePercentage}%
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
                    {student.placementStatus === 'eligible_placed' && (
                      <span className="font-black text-xs text-[#4CAF50]">Placed</span>
                    )}
                    {student.placementStatus === 'eligible_unplaced' && (
                      <span className="font-black text-xs text-blue-700">Eligible</span>
                    )}
                    {student.placementStatus === 'ineligible_arrears' && (
                      <span className="font-black text-xs text-[#F44336]">Ineligible</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/students/${student.id}`)}
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
    </div>
  );
};
