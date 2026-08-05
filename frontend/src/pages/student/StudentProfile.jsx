import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { ArrearTimeline } from '../../components/student/ArrearTimeline';
import { AddCounselingModal } from '../../components/student/AddCounselingModal';
import StudentHero from '../../components/student/StudentHero';
import StudentPersonalInfo from '../../components/student/StudentPersonalInfo';
import StudentAcademicCard from '../../components/student/StudentAcademicCard';
import StudentSkills from '../../components/student/StudentSkills';
import StudentPlacementReadiness from '../../components/student/StudentPlacementReadiness';
import StudentTimeline from '../../components/student/StudentTimeline';
import { getPersonalInfo, updatePersonalInfo, getPSProgress, getCertifications, createCertification, deleteCertification } from '../../services/studentPortfolioService';
import { getStudentByRegisterNo, getSkills, getCodingProfiles, getHackathons, getCounselingNotes } from '../../services/studentService';
import { formatDate } from '../../utils/dateUtils';
import {
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  CheckBadgeIcon,
  XMarkIcon,
  AcademicCapIcon,
  PlusIcon,
  CalendarDaysIcon,
  LinkIcon,
  ChartBarIcon,
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

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, addToast } = useDashboard();

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({});
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfoForm, setPersonalInfoForm] = useState({});
  const [psProgress, setPsProgress] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState({});
  const [hackathons, setHackathons] = useState([]);
  const [counselingNotes, setCounselingNotes] = useState([]);

  useEffect(() => {
    if (id) {
      setLoadingStudent(true);
      getStudentByRegisterNo(id).then((response) => {
        if (response.success && response.data) {
          setStudent(response.data);
        }
        setLoadingStudent(false);
      }).catch(() => {
        setLoadingStudent(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getPersonalInfo(id).then((info) => {
        setPersonalInfo(info || {});
        setPersonalInfoForm(info || {});
      }).catch(() => {
        // Personal info might not exist yet, that's okay
        setPersonalInfo({});
        setPersonalInfoForm({});
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getPSProgress(id).then((progress) => {
        setPsProgress(progress || {});
      }).catch(() => {
        // PS progress might not exist yet, that's okay
        setPsProgress({});
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getCertifications(id).then((certs) => {
        setCertifications(certs || []);
      }).catch(() => {
        // Certifications might not exist yet, that's okay
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getSkills(id).then((response) => {
        setSkills(response.data || []);
      }).catch(() => {
        setSkills([]);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getCodingProfiles(id).then((response) => {
        setCodingProfiles(response.data || {});
      }).catch(() => {
        setCodingProfiles({});
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getHackathons(id).then((response) => {
        setHackathons(response.data || []);
      }).catch(() => {
        setHackathons([]);
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getCounselingNotes(id).then((response) => {
        setCounselingNotes(response.data || []);
      }).catch(() => {
        setCounselingNotes([]);
      });
    }
  }, [id]);

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
          className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl min-h-[44px]"
        >
          Return to Student Directory
        </button>
      </div>
    );
  }

  const handlePersonalInfoSave = async () => {
    try {
      const response = await updatePersonalInfo(id, personalInfoForm);
      setPersonalInfo(response);
      setPersonalInfoForm(response);
      setIsEditingPersonalInfo(false);
      addToast('success', 'Profile Updated', 'Personal information updated successfully');
    } catch (error) {
      console.error('Error updating personal info:', error);
      addToast('error', 'Update Failed', error.response?.data?.message || 'Failed to update personal information');
    }
  };

  const handlePersonalInfoCancel = () => {
    setPersonalInfoForm(personalInfo || {});
    setIsEditingPersonalInfo(false);
  };

  const currentSemGpa = (student?.gpaHistory && student?.gpaHistory.length > 0) ? student?.gpaHistory[student?.gpaHistory.length - 1]?.gpa : Number(student?.cgpa || 0);

  // Calculate CGPA badge
  const cgpaBadge = {
    color: Number(student?.cgpa || 0) >= 8 ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
           Number(student?.cgpa || 0) >= 7 ? 'bg-blue-100 text-blue-700 border-blue-300' :
           Number(student?.cgpa || 0) >= 6 ? 'bg-amber-100 text-amber-700 border-amber-300' :
           'bg-red-100 text-red-700 border-red-300',
    text: Number(student?.cgpa || 0) >= 8 ? 'Excellent' :
          Number(student?.cgpa || 0) >= 7 ? 'Good' :
          Number(student?.cgpa || 0) >= 6 ? 'Average' :
          'Needs Improvement'
  };

  // Calculate PS completion percentage
  const psCompletion = psProgress ? Math.round(
    ((psProgress.c_level || 0) + (psProgress.java_level || 0) + (psProgress.python_level || 0) + 
     (psProgress.cpp_level || 0) + (psProgress.database_level || 0) + (psProgress.aptitude_level || 0)) / 6 * 100
  ) : 0;

  // Calculate placement readiness score
  const placementReadiness = Math.round(
    (Number(student?.cgpa || 0) / 10 * 30) +
    (Number(student?.attendancePercentage || 0) / 100 * 20) +
    (psCompletion / 100 * 20) +
    ((student?.pendingArrearsCount || 0) === 0 ? 10 : 0) +
    (hackathons.length >= 3 ? 10 : hackathons.length * 3) +
    (certifications.length >= 3 ? 10 : certifications.length * 3) +
    (codingProfiles?.github ? 10 : 0)
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs />

      {/* Back Button Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
        >
          <ArrowLeftIcon className="w-4 h-4 text-[#5B82C5]" /> Back to Roster
        </button>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setIsCounselingModalOpen(true)}
            className="px-4 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> Log Mentor Counseling
          </button>
        </div>
      </div>

      {/* 1. TOP HEADER PROFILE CARD */}
      <StudentHero student={student} personalInfo={personalInfo} cgpaBadge={cgpaBadge} psCompletion={psCompletion} />

      {/* 2. WARNING NOTIFICATIONS BANNER (IF ANY) */}
      {(student?.pendingArrearsCount > 0 || Number(student?.attendancePercentage || 0) < 75 || Number(student?.cgpa || 0) < 7.0) && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-2">
          <h4 className="text-xs font-black text-red-900 uppercase tracking-wider flex items-center gap-1.5">
            <ExclamationTriangleIcon className="w-4 h-4 text-[#F44336]" /> Academic Intervention Required
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-red-800">
            {student?.pendingArrearsCount > 0 && (
              <span className="px-2.5 py-1 bg-red-100 rounded-lg border border-red-300">
                • {student?.pendingArrearsCount} Pending Arrears Pending Clearing
              </span>
            )}
            {Number(student?.attendancePercentage || 0) < 75 && (
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg border border-amber-300">
                • Low Attendance ({Number(student?.attendancePercentage || 0)}% - Below 75% Cutoff)
              </span>
            )}
            {Number(student?.cgpa || 0) < 7.0 && (
              <span className="px-2.5 py-1 bg-red-100 rounded-lg border border-red-300">
                • CGPA below 7.00 threshold
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. PERSONAL INFORMATION */}
      <StudentPersonalInfo
        personalInfo={personalInfo}
        personalInfoForm={personalInfoForm}
        isEditingPersonalInfo={isEditingPersonalInfo}
        setIsEditingPersonalInfo={setIsEditingPersonalInfo}
        setPersonalInfoForm={setPersonalInfoForm}
        handlePersonalInfoSave={handlePersonalInfoSave}
        handlePersonalInfoCancel={handlePersonalInfoCancel}
        canEdit={currentUser?.role === 'STUDENT' && currentUser?.register_no === id}
      />

      {/* Academic Information Section */}
      <StudentAcademicCard student={student} />

      {/* Technical Skills Section */}
      <StudentSkills skills={skills} />

      {/* 4. PS PORTAL PROGRESS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-4">
          <AcademicCapIcon className="w-5 h-5 text-[#5B82C5]" /> PS Portal Progress
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'C', level: psProgress?.c_level || 0, completed: psProgress?.c_completed_date, verifiedBy: psProgress?.c_verified_by },
            { name: 'Java', level: psProgress?.java_level || 0, completed: psProgress?.java_completed_date, verifiedBy: psProgress?.java_verified_by },
            { name: 'Python', level: psProgress?.python_level || 0, completed: psProgress?.python_completed_date, verifiedBy: psProgress?.python_verified_by },
            { name: 'C++', level: psProgress?.cpp_level || 0, completed: psProgress?.cpp_completed_date, verifiedBy: psProgress?.cpp_verified_by },
            { name: 'Database', level: psProgress?.database_level || 0, completed: psProgress?.database_completed_date, verifiedBy: psProgress?.database_verified_by },
            { name: 'Aptitude', level: psProgress?.aptitude_level || 0, completed: psProgress?.aptitude_completed_date, verifiedBy: psProgress?.aptitude_verified_by },
          ].map((item) => (
            <div key={item.name} className="bg-[#EBF1FA] p-3 rounded-xl border border-[#5B82C5]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-[#5B82C5] uppercase">{item.name}</span>
                <span className="text-lg font-black text-[#5B82C5]">Level {item.level}</span>
              </div>
              {item.completed && (
                <div className="mt-2 pt-2 border-t border-[#5B82C5]/20">
                  <div className="flex items-center gap-1 text-[10px] text-gray-600">
                    <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    <span className="font-semibold">Completed: {formatDate(item.completed)}</span>
                  </div>
                  {item.verifiedBy && (
                    <div className="text-[10px] text-gray-500 mt-1">
                      <span className="font-medium">Verified by:</span> {item.verifiedBy}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. CERTIFICATIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Certifications</h3>
              <p className="text-xs font-semibold text-gray-500">Your professional certifications</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-300">
              {(certifications || []).filter(c => c.status === 'Approved').length} Approved
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full border border-amber-300">
              {(certifications || []).filter(c => c.status === 'Pending').length} Pending
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-300">
              {(certifications || []).filter(c => c.status === 'Rejected').length} Rejected
            </span>
          </div>
        </div>
        
        {(certifications || []).length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <AcademicCapIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No certifications added yet</p>
            <button className="mt-4 px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 mx-auto">
              <PlusIcon className="w-4 h-4" /> Add Certification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(certifications || []).map((cert) => (
              <div key={cert.id} className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-extrabold text-gray-900 mb-1">{cert.certificate_name || cert.name || 'Certification'}</h4>
                    <p className="text-xs font-semibold text-gray-500">{cert.issuer || 'Unknown Issuer'}</p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full border ${
                    cert.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                    cert.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                    cert.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-300' :
                    'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                    {cert.status?.toUpperCase() || 'UNKNOWN'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <CalendarDaysIcon className="w-3 h-3" />
                  <span>{formatDate(cert.issue_date || cert.issueDate)}</span>
                </div>
                <div className="flex gap-2">
                  {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="flex-1 px-3 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-lg hover:bg-[#4A6FA8] transition-all flex items-center justify-center gap-1">
                      <LinkIcon className="w-3 h-3" /> View
                    </a>
                  )}
                  {cert.status === 'Pending' && (
                    <button onClick={() => {
                      if (window.confirm('Are you sure you want to delete this certification?')) {
                        deleteCertification(id, cert.id).then(() => {
                          setCertifications((certifications || []).filter(c => c.id !== cert.id));
                        }).catch(console.error);
                      }
                    }} className="px-3 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-1">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. RANKINGS SECTION (Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>College Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#5B82C5]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student?.collegeRank || '—'}</p>
          <p className="text-[11px] text-gray-500 font-medium">Out of 2,850 Students</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Dept Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#4CAF50]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student?.departmentRank || '—'}</p>
          <p className="text-[11px] text-gray-500 font-medium">Out of {(student?.departmentName || '').split(' ')[0]} 120 Batch</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Class Rank</span>
            <TrophyIcon className="w-4 h-4 text-[#FF9800]" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student?.classRank || '—'}</p>
          <p className="text-[11px] text-gray-500 font-medium">Section {student?.section || '—'} (60 Students)</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Batch Rank</span>
            <TrophyIcon className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">#{student?.batchRank || '—'}</p>
          <p className="text-[11px] text-gray-500 font-medium">2022-2026 Batch</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase">
            <span>Percentile</span>
            <CheckBadgeIcon className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">{student?.percentile || '—'}%</p>
          <p className="text-[11px] text-gray-500 font-medium">Academic Standing</p>
        </div>
      </div>

      {/* 5. PERFORMANCE ANALYTICS & GPA GROWTH CHART */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B82C5]" /> Semester-wise GPA & CGPA Trajectory
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Progressive semester grade point average vs cumulative CGPA
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4 text-xs font-bold">
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

        <div className="h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={student?.gpaHistory || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis
                dataKey="semester"
                tickFormatter={(sem) => `Sem ${sem}`}
                tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }}
              />
              <YAxis domain={[5, 10]} tick={{ fontSize: 10, fontWeight: 700, fill: '#374151' }} />
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
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Semester GPA"
              />
              <Line
                type="monotone"
                dataKey="cgpa"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Cumulative CGPA"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. ARREAR TIMELINE SECTION */}
      <ArrearTimeline arrears={student?.arrearsHistory || []} />

      {/* Placement Readiness Section */}
      <StudentPlacementReadiness 
        student={student} 
        psCompletion={psCompletion} 
        hackathons={hackathons} 
        certifications={certifications} 
        codingProfiles={codingProfiles} 
        placementReadiness={placementReadiness} 
      />

      {/* Counselling History */}
      <StudentTimeline counselingNotes={counselingNotes} />

      {/* Counseling Modal */}
      <AddCounselingModal
        isOpen={isCounselingModalOpen}
        onClose={() => setIsCounselingModalOpen(false)}
        studentId={student?.id}
        studentName={student?.name}
      />
    </div>
  );
};
