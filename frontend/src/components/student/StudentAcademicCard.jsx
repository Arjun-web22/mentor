import React from 'react';
import { AcademicCapIcon, ChartBarIcon, ArrowTrendingUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const StudentAcademicCard = ({ student }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
          <AcademicCapIcon className="w-5 h-5 text-[#5B82C5]" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Academic Information</h3>
          <p className="text-xs font-semibold text-gray-500">Your academic details and performance</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Register Number</p>
          <p className="text-sm font-bold text-gray-900">{student?.registerNo || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Roll Number</p>
          <p className="text-sm font-bold text-gray-900">{student?.rollNo || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Degree</p>
          <p className="text-sm font-bold text-gray-900">{student?.courseDegree || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</p>
          <p className="text-sm font-bold text-gray-900">{student?.departmentName || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Batch</p>
          <p className="text-sm font-bold text-gray-900">{student?.batch || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Year</p>
          <p className="text-sm font-bold text-gray-900">{student?.year || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Semester</p>
          <p className="text-sm font-bold text-gray-900">{student?.semester || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Section</p>
          <p className="text-sm font-bold text-gray-900">{student?.section || '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mentor</p>
          <p className="text-sm font-bold text-gray-900">{student?.mentorName || '—'}</p>
        </div>
        <div className="space-y-1 col-span-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">College</p>
          <p className="text-sm font-bold text-gray-900">Francis Xavier Engineering College</p>
        </div>
      </div>

      {/* Academic Performance Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4">Academic Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#5B82C5]/10 to-[#5B82C5]/5 p-4 rounded-xl border border-[#5B82C5]/20">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="w-4 h-4 text-[#5B82C5]" />
              <span className="text-xs font-bold text-[#5B82C5] uppercase">CGPA</span>
            </div>
            <p className="text-2xl font-black text-[#5B82C5]">{Number(student?.cgpa || 0).toFixed(2)}</p>
          </div>
          <div className={`bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 p-4 rounded-xl border ${Number(student?.attendancePercentage || 0) < 75 ? 'border-orange-300' : 'border-emerald-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <ArrowTrendingUpIcon className={`w-4 h-4 ${Number(student?.attendancePercentage || 0) < 75 ? 'text-orange-500' : 'text-emerald-600'}`} />
              <span className={`text-xs font-bold uppercase ${Number(student?.attendancePercentage || 0) < 75 ? 'text-orange-600' : 'text-emerald-700'}`}>Attendance</span>
            </div>
            <p className={`text-2xl font-black ${Number(student?.attendancePercentage || 0) < 75 ? 'text-orange-600' : 'text-emerald-700'}`}>{Number(student?.attendancePercentage || 0)}%</p>
          </div>
          <div className={`bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 rounded-xl border ${(student?.pendingArrearsCount || 0) > 0 ? 'border-red-300' : 'border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <ExclamationCircleIcon className={`w-4 h-4 ${(student?.pendingArrearsCount || 0) > 0 ? 'text-red-500' : 'text-amber-600'}`} />
              <span className={`text-xs font-bold uppercase ${(student?.pendingArrearsCount || 0) > 0 ? 'text-red-600' : 'text-amber-700'}`}>Arrears</span>
            </div>
            <p className={`text-2xl font-black ${(student?.pendingArrearsCount || 0) > 0 ? 'text-red-600' : 'text-amber-700'}`}>{student?.pendingArrearsCount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAcademicCard;
