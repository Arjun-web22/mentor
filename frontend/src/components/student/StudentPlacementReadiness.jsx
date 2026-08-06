import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const StudentPlacementReadiness = ({ student, psCompletion, hackathons, certifications, codingProfiles, placementReadiness }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
          <ChartBarIcon className="w-5 h-5 text-[#5B82C5]" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Placement Readiness</h3>
          <p className="text-xs font-semibold text-gray-500">Your overall placement preparation status</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#5B82C5]/10 to-[#5B82C5]/5 p-4 rounded-xl border border-[#5B82C5]/20 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-[#5B82C5]" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * (Number(student?.cgpa || 0) / 10))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-[#5B82C5]">{Number(student?.cgpa || 0).toFixed(1)}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">CGPA</p>
        </div>
        <div className={`bg-gradient-to-br ${Number(student?.attendancePercentage || 0) < 75 ? 'from-orange-500/10 to-orange-500/5' : 'from-emerald-500/10 to-emerald-500/5'} p-4 rounded-xl border ${Number(student?.attendancePercentage || 0) < 75 ? 'border-orange-200' : 'border-emerald-200'} text-center`}>
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className={Number(student?.attendancePercentage || 0) < 75 ? 'text-orange-500' : 'text-emerald-500'} strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * (Number(student?.attendancePercentage || 0) / 100))} strokeLinecap="round" />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${Number(student?.attendancePercentage || 0) < 75 ? 'text-orange-600' : 'text-emerald-600'}`}>{Number(student?.attendancePercentage || 0)}%</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Attendance</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-xl border border-purple-200 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-purple-500" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * (psCompletion / 100))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-purple-600">{psCompletion}%</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">PS Levels</p>
        </div>
        <div className={`bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-4 rounded-xl border ${(student?.pendingArrearsCount || 0) > 0 ? 'border-red-200' : 'border-amber-200'} text-center`}>
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className={(student?.pendingArrearsCount || 0) > 0 ? 'text-red-500' : 'text-amber-500'} strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * ((student?.pendingArrearsCount || 0) > 0 ? 0 : 1))} strokeLinecap="round" />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xs font-black ${(student?.pendingArrearsCount || 0) > 0 ? 'text-red-600' : 'text-amber-600'}`}>{student?.pendingArrearsCount || 0}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Arrears</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 p-4 rounded-xl border border-pink-200 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-pink-500" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * (hackathons.length / 3))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-pink-600">{hackathons.length}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Hackathons</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-4 rounded-xl border border-cyan-200 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-cyan-500" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * ((certifications?.length || 0) / 5))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-cyan-600">{certifications?.length || 0}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Certifications</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 p-4 rounded-xl border border-indigo-200 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-indigo-500" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * ((codingProfiles?.github ? 1 : 0) / 1))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-indigo-600">{codingProfiles?.github ? 'Yes' : 'No'}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Coding Profile</p>
        </div>
        <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-4 rounded-xl border border-rose-200 text-center">
          <div className="w-16 h-16 mx-auto mb-2 relative">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200" />
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-rose-500" strokeDasharray={175.93} strokeDashoffset={175.93 - (175.93 * (Number(student?.interviewReadinessScore || 0) / 100))} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-rose-600">{Number(student?.interviewReadinessScore || 0)}</span>
          </div>
          <p className="text-xs font-bold text-gray-600 uppercase">Interview Score</p>
        </div>
      </div>
      
      {/* Overall Readiness Score */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Overall Placement Readiness</h4>
            <p className="text-xs text-gray-500">Based on your academic performance, skills, and achievements</p>
          </div>
          <div className="text-right">
            <p className={`text-4xl font-black ${
              placementReadiness >= 80 ? 'text-emerald-600' :
              placementReadiness >= 60 ? 'text-blue-600' :
              placementReadiness >= 40 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {placementReadiness}%
            </p>
            <p className={`text-xs font-bold ${
              placementReadiness >= 80 ? 'text-emerald-600' :
              placementReadiness >= 60 ? 'text-blue-600' :
              placementReadiness >= 40 ? 'text-amber-600' :
              'text-red-600'
            }`}>
              {placementReadiness >= 80 ? 'Excellent' :
              placementReadiness >= 60 ? 'Good' :
              placementReadiness >= 40 ? 'Moderate' :
              'Needs Improvement'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPlacementReadiness;
