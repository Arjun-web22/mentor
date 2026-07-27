import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Student } from '../../types/dashboard';
import { Badge } from '../../components/common/Badge';
import { ArrearTimeline } from '../../components/student/ArrearTimeline';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
import {
  UserIcon,
  AcademicCapIcon,
  TrophyIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudent } = useDashboard();

  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoadingStudent(true);
      getStudent(id).then((st) => {
        if (st) {
          setStudent(st);
        }
        setLoadingStudent(false);
      });
    }
  }, [id, getStudent]);

  if (loadingStudent) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
        <div className="w-10 h-10 border-4 border-[#5B82C5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-700">Retrieving Student Academic File...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <ExclamationCircleIcon className="w-12 h-12 text-[#F44336] mx-auto" />
        <h2 className="text-lg font-black text-gray-900">Student Record Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          No student matched register number or ID standard: <code className="bg-gray-100 px-1 py-0.5">{id}</code>
        </p>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl"
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  // Current Semester GPA
  const currentSemGpa = student.gpaHistory[student.gpaHistory.length - 1]?.gpa || student.cgpa;

  return (
    <div className="space-y-6">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 text-[#5B82C5]" /> Back to Roster
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCounselingModalOpen(true)}
            className="px-4 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> Log Mentor Counseling
          </button>
        </div>
      </div>

      {/* 1. TOP HEADER PROFILE CARD */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex flex-wrap items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-[#5B82C5]/20 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">{student.name}</h1>
                <Badge variant={student.pendingArrearsCount === 0 ? 'success' : 'danger'}>
                  {student.pendingArrearsCount === 0 ? 'Regular Passing' : `${student.pendingArrearsCount} Backlogs`}
                </Badge>
              </div>

              <p className="text-xs font-bold text-gray-500 font-mono mt-1">
                REGISTER NO: {student.registerNo} • {student.departmentName}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 mt-3">
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4 text-[#5B82C5]" /> {student.email}
                </div>
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4 text-[#5B82C5]" /> {student.phone}
                </div>
                <div className="flex items-center gap-1">
                  <BuildingLibraryIcon className="w-4 h-4 text-[#5B82C5]" /> Year {student.year} (Sem {student.semester}-{student.section})
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center space-x-2 text-xs font-semibold text-gray-700">
                <span className="text-gray-400">Assigned Faculty Mentor:</span>
                <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                  {student.mentorName}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Highlights Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#EBF1FA] p-3 rounded-xl border border-[#5B82C5]/30 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-[#5B82C5] uppercase block">Overall CGPA</span>
              <span className="text-xl font-black text-[#5B82C5]">{student.cgpa.toFixed(2)}</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Attendance</span>
              <span className="text-xl font-black text-emerald-800">{student.attendancePercentage}%</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Dept Rank</span>
              <span className="text-xl font-black text-amber-900">#{student.departmentRank}</span>
            </div>

            <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-sky-700 uppercase block">College Rank</span>
              <span className="text-xl font-black text-sky-900">#{student.collegeRank}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WARNING NOTIFICATIONS BANNER (IF ANY) */}
      {(student.pendingArrearsCount > 0 || student.attendancePercentage < 75 || student.cgpa < 7.0) && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2">
          <h4 className="text-xs font-black text-red-900 uppercase tracking-wider flex items-center gap-1.5">
            <ExclamationTriangleIcon className="w-4 h-4 text-[#F44336]" /> Academic Intervention Required
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-red-800">
            {student.pendingArrearsCount > 0 && (
              <span className="px-2.5 py-1 bg-red-100 rounded-lg border border-red-300">
                • {student.pendingArrearsCount} Pending Arrears Pending Clearing
              </span>
            )}
            {student.attendancePercentage < 75 && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                • Low Attendance ({student.attendancePercentage}% - Below 75% Cutoff)
              </span>
            )}
            {student.cgpa < 7.0 && (
              <span className="px-2.5 py-1 bg-red-100 rounded-lg border border-red-300">
                • CGPA below 7.00 threshold
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. RANKINGS SECTION (Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>College Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#5B82C5]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student.collegeRank}</p>
          <p className="text-[11px] text-gray-500 font-medium">Out of 2,850 Students</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Dept Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#4CAF50]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student.departmentRank}</p>
          <p className="text-[11px] text-gray-500 font-medium">Out of {student.departmentName.split(' ')[0]} 120 Batch</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Class Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#FF9800]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student.classRank}</p>
          <p className="text-[11px] text-gray-500 font-medium">Section {student.section} (60 Students)</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Batch Rank</span>
            <TrophyIcon className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student.batchRank}</p>
          <p className="text-[11px] text-gray-500 font-medium">2022-2026 Batch</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Percentile</span>
            <CheckBadgeIcon className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{student.percentile}%</p>
          <p className="text-[11px] text-gray-500 font-medium">Academic Standing</p>
        </div>
      </div>

      {/* 4. PERFORMANCE ANALYTICS & GPA GROWTH CHART */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-[#5B82C5]" /> Semester-wise GPA & CGPA Trajectory
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Progressive semester grade point average vs cumulative CGPA
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#5B82C5]" />
              <span>Semester GPA</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-[#4CAF50]" />
              <span>Cumulative CGPA</span>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={student.gpaHistory} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="semester"
                tickFormatter={(sem: number) => `Sem ${sem}`}
                tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }}
              />
              <YAxis domain={[5, 10]} tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  borderColor: '#E2E8F0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#5B82C5"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Semester GPA"
              />
              <Line
                type="monotone"
                dataKey="cgpa"
                stroke="#4CAF50"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Cumulative CGPA"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. ARREAR TIMELINE SECTION */}
      <ArrearTimeline arrears={student.arrearsHistory} />

      {/* 6. PLACEMENT READINESS & INTERVIEW SCORE */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-[#5B82C5]" /> Placement Readiness & Technical Portfolio
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Industry certifications, skill matrix, internships, and campus placement standing
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
            <span className="text-xs font-bold text-gray-600">Interview Readiness Score:</span>
            <span
              className={`text-sm font-black px-3 py-1 rounded-lg border ${
                student.interviewReadinessScore >= 80
                  ? 'bg-emerald-50 text-[#4CAF50] border-emerald-200'
                  : 'bg-amber-50 text-[#FF9800] border-amber-200'
              }`}
            >
              {student.interviewReadinessScore} / 100
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills & Certifications */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Technical Skill Matrix</h4>
              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-[#EBF1FA] text-[#5B82C5] text-xs font-bold rounded-lg border border-[#5B82C5]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                Verified Certifications ({student.certifications.length})
              </h4>
              <div className="space-y-1.5">
                {student.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-[#4CAF50] flex-shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Projects & Internships */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Academic & Capstone Projects</h4>
              <div className="space-y-2">
                {student.projects.map((proj) => (
                  <div key={proj.title} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-extrabold text-gray-900">{proj.title}</h5>
                      <span className="text-[10px] font-bold text-[#5B82C5] bg-[#EBF1FA] px-2 py-0.5 rounded">
                        {proj.tech}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium leading-snug">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {student.internships.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-2">Industry Internships</h4>
                {student.internships.map((intern) => (
                  <div key={intern.company} className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>{intern.company}</span>
                      <span className="text-[11px] text-emerald-700">{intern.duration}</span>
                    </div>
                    <p className="text-emerald-800 mt-0.5 font-medium">{intern.role}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. MENTOR COUNSELING HISTORY & ACTION PLANS */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#5B82C5]" /> Faculty Mentoring Counseling History
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Recorded one-on-one counseling sessions, action plans, and parent correspondence
            </p>
          </div>

          <button
            onClick={() => setIsCounselingModalOpen(true)}
            className="px-3.5 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1"
          >
            + Log New Session
          </button>
        </div>

        {student.counselingNotes.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500 font-medium text-xs">
            No formal counseling sessions logged yet. Click "+ Log New Session" to create the first record.
          </div>
        ) : (
          <div className="space-y-3">
            {student.counselingNotes.map((note) => (
              <div key={note.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-[#EBF1FA] text-[#5B82C5] rounded-lg border border-[#5B82C5]/30">
                      {note.category} Counseling
                    </span>
                    <span className="text-gray-900">Recorded by: {note.mentorName}</span>
                  </div>
                  <span className="text-gray-500 font-mono">Date: {note.date}</span>
                </div>

                <p className="text-xs text-gray-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                  <strong className="text-gray-900">Discussion Notes:</strong> {note.note}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-[#4CAF50] font-bold">
                    Action Plan: {note.actionPlan}
                  </span>
                  <span className="text-gray-500 font-bold flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5" /> Next Follow-up: {note.followUpDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Counseling Modal */}
      <AddCounselingModal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
        studentId={student.id}
        studentName={student.name}
      />
    </div>
  );
};
