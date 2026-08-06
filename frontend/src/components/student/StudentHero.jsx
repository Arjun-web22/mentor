import React from 'react';
import {
  IdentificationIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const StudentHero = ({ student, personalInfo, cgpaBadge, psCompletion }) => {
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="bg-gradient-to-br from-[#5B82C5] to-[#4A6FA8] rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          {/* Profile Photo */}
          <div className="relative flex-shrink-0">
            {student?.avatar ? (
              <img
                src={student.avatar}
                alt={student?.name || 'Student'}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 border-4 border-white/30 shadow-xl flex items-center justify-center" style={{ display: student?.avatar ? 'none' : 'flex' }}>
              <span className="text-3xl sm:text-4xl font-black text-white">
                {getInitials(student?.name)}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
          </div>

          {/* Student Info */}
          <div className="flex-1 text-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{student?.name || 'Student'}</h1>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${cgpaBadge.color}`}>
                {cgpaBadge.text}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white/90">
              <span className="flex items-center gap-1">
                <IdentificationIcon className="w-4 h-4" /> {student?.registerNo || '—'}
              </span>
              <span className="flex items-center gap-1">
                <AcademicCapIcon className="w-4 h-4" /> {student?.departmentName || '—'}
              </span>
              <span className="flex items-center gap-1">
                <AcademicCapIcon className="w-4 h-4" /> {student?.courseDegree || '—'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-white/80">
              <span className="flex items-center gap-1">
                <EnvelopeIcon className="w-4 h-4" /> {student?.email || '—'}
              </span>
              <span className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4" /> {personalInfo?.phone || '—'}
              </span>
              <span className="flex items-center gap-1">
                <UserGroupIcon className="w-4 h-4" /> {student?.mentorName || '—'}
              </span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 text-center">
              <p className="text-[10px] font-bold text-white/80 uppercase">CGPA</p>
              <p className="text-xl font-black text-white">{Number(student?.cgpa || 0).toFixed(2)}</p>
              <p className={`text-[9px] font-bold ${
                Number(student?.cgpa || 0) >= 8 ? 'text-emerald-300' :
                Number(student?.cgpa || 0) >= 7 ? 'text-blue-300' :
                'text-amber-300'
              }`}>
                {Number(student?.cgpa || 0) >= 8 ? '▲ Excellent' :
                Number(student?.cgpa || 0) >= 7 ? '● Good' :
                '▼ Improve'}
              </p>
            </div>
            <div className={`bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 text-center ${Number(student?.attendancePercentage || 0) < 75 ? 'ring-2 ring-orange-400' : ''}`}>
              <p className="text-[10px] font-bold text-white/80 uppercase">Attendance</p>
              <p className="text-xl font-black text-white">{Number(student?.attendancePercentage || 0)}%</p>
              <p className={`text-[9px] font-bold ${
                Number(student?.attendancePercentage || 0) >= 90 ? 'text-emerald-300' :
                Number(student?.attendancePercentage || 0) >= 75 ? 'text-blue-300' :
                'text-orange-300'
              }`}>
                {Number(student?.attendancePercentage || 0) >= 90 ? '▲ Healthy' :
                Number(student?.attendancePercentage || 0) >= 75 ? '● OK' :
                '▼ Low'}
              </p>
            </div>
            <div className={`bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 text-center ${(student?.pendingArrearsCount || 0) > 0 ? 'ring-2 ring-red-400' : ''}`}>
              <p className="text-[10px] font-bold text-white/80 uppercase">Arrears</p>
              <p className="text-xl font-black text-white">{student?.pendingArrearsCount || 0}</p>
              <p className={`text-[9px] font-bold ${
                (student?.pendingArrearsCount || 0) === 0 ? 'text-emerald-300' :
                'text-red-300'
              }`}>
                {(student?.pendingArrearsCount || 0) === 0 ? '▲ Clear' : '▼ Pending'}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 text-center">
              <p className="text-[10px] font-bold text-white/80 uppercase">PS Portal</p>
              <p className="text-xl font-black text-white">{psCompletion}%</p>
              <p className={`text-[9px] font-bold ${
                psCompletion >= 80 ? 'text-emerald-300' :
                psCompletion >= 50 ? 'text-blue-300' :
                'text-amber-300'
              }`}>
                {psCompletion >= 80 ? '▲ Excellent' :
                psCompletion >= 50 ? '● In Progress' :
                '▼ Start'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHero;
