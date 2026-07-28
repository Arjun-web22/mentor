import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const MentorsDirectory = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { departments, mentors, students } = useDashboard();
  const [search, setSearch] = useState('');

  // Find department
  const department = departments.find((d) => d.id === departmentId) || {
    id: departmentId || 'dept-it',
    name: 'Information Technology',
    code: 'IT',
    hodName: 'Dr. A. Anand',
    studentsCount: 420,
    mentorsCount: 21,
    avgCgpa: 8.15,
    placementPercentage: 89.2,
    pendingArrearsCount: 22,
    iconName: 'CodeBracketIcon',
  };

  // Mentors for this department
  const departmentMentors = mentors.filter(
    (m) => m.departmentId === department.id || !departmentId
  );

  // Filter mentors by search
  const filteredMentors = departmentMentors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-x-0 lg:space-x-2 space-y-2 lg:space-y-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
              {department.name} Department
            </h1>
            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-[#EBF1FA] text-[#5B82C5] border border-[#5B82C5]/30">
              {department.code}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Mentors responsible for student mentoring in this department.
          </p>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Mentor by name, code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredMentors.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-xs">
          <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900">No Mentors Found</h3>
          <p className="text-xs text-gray-500 mt-1">
            No faculty mentors matched your search query in {department.name}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredMentors.map((mentor) => {
            // Compute real-time mentee stats from students data if available
            const mentees = students.filter((s) => s.mentorId === mentor.id);
            const assignedCount = mentees.length > 0 ? mentees.length : mentor.assignedStudentCount;
            const avgCgpa = mentees.length > 0
              ? (mentees.reduce((acc, s) => acc + s.cgpa, 0) / mentees.length)
              : mentor.avgCgpa;
            const avgAttendance = mentees.length > 0
              ? (mentees.reduce((acc, s) => acc + s.attendancePercentage, 0) / mentees.length)
              : mentor.avgAttendance;
            const arrearsCount = mentees.length > 0
              ? mentees.filter((s) => s.pendingArrearsCount > 0).length
              : mentor.studentsWithArrears;
            const placementReady = mentees.length > 0
              ? mentees.filter((s) => s.placementStatus === 'eligible_placed' || s.placementStatus === 'eligible_unplaced').length
              : mentor.placementReadyCount;

            return (
              <div
                key={mentor.id}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md hover:border-[#5B82C5] transition-all duration-150 flex flex-col justify-between cursor-pointer min-h-[44px]"
              >
                <div>
                  {/* Top Row: Photo, Name, Code, Status */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border-2 border-[#5B82C5]/30 shadow-xs max-w-full h-auto"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                            {mentor.name}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded border border-[#5B82C5]/20 inline-block mt-0.5">
                          {mentor.employeeCode}
                        </span>
                        <p className="text-xs font-semibold text-gray-500 mt-1">{mentor.title}</p>
                      </div>
                    </div>

                    <Badge variant="success" size="sm">
                      Active
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs font-semibold text-gray-600 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-[#5B82C5] flex-shrink-0" />
                      <span className="truncate">{mentor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-3.5 h-3.5 text-[#5B82C5] flex-shrink-0" />
                      <span>{mentor.phone}</span>
                    </div>
                  </div>

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2.5 my-4">
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Assigned Mentees</span>
                      <span className="text-sm font-black text-gray-900 flex items-center gap-1 mt-0.5">
                        <UserGroupIcon className="w-4 h-4 text-[#5B82C5]" />
                        {assignedCount} Students
                      </span>
                    </div>

                    <div className="bg-[#EBF1FA] p-2.5 rounded-lg border border-[#5B82C5]/20">
                      <span className="text-[10px] font-bold text-[#5B82C5] block uppercase">Average CGPA</span>
                      <span className="text-sm font-black text-[#5B82C5] block mt-0.5">
                        {avgCgpa.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-700 block uppercase">Avg Attendance</span>
                      <span className="text-sm font-black text-emerald-800 block mt-0.5">
                        {avgAttendance.toFixed(1)}%
                      </span>
                    </div>

                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-700 block uppercase">With Arrears</span>
                      <span className="text-sm font-black text-amber-900 block mt-0.5">
                        {arrearsCount} Students
                      </span>
                    </div>
                  </div>

                  {/* Placement Ready Banner */}
                  <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200 flex items-center justify-between text-xs font-bold text-sky-900 mb-2">
                    <span className="text-[11px]">Placement Ready Mentees</span>
                    <span className="px-2 py-0.5 bg-sky-200 rounded-md font-black text-sky-900">
                      {placementReady} / {assignedCount}
                    </span>
                  </div>
                </div>

                {/* View Mentees Button */}
                <button
                  onClick={() =>
                    navigate(`/departments/${department.id}/mentors/${mentor.id}/students`)
                  }
                  className="w-full py-2.5 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 mt-3 min-h-[44px]"
                >
                  <span>View Mentees</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
