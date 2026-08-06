import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
import CertificationCard from '../../components/student/CertificationCard';
import StudentHero from '../../components/student/StudentHero';
import StudentPersonalInfo from '../../components/student/StudentPersonalInfo';
import StudentAcademicCard from '../../components/student/StudentAcademicCard';
import StudentSkills from '../../components/student/StudentSkills';
import StudentPlacementReadiness from '../../components/student/StudentPlacementReadiness';
import StudentTimeline from '../../components/student/StudentTimeline';
import { formatDate } from '../../utils/dateUtils';
import { getPersonalInfo, updatePersonalInfo, getPSProgress, getCertifications, createCertification, deleteCertification } from '../../services/studentPortfolioService';
import { getStudentByRegisterNo, getSkills, getCodingProfiles, getHackathons, getPublications, getCounselingNotes } from '../../services/studentService';
import {
  TrophyIcon,
  BriefcaseIcon,
  ExclamationTriangleIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  BellIcon,
  PlusIcon,
  PencilIcon,
  MapPinIcon,
  LinkIcon,
  GlobeAltIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export const StudentDashboard = () => {
  const { currentUser, addToast } = useDashboard();

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [personalInfo, setPersonalInfo] = useState({});
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfoForm, setPersonalInfoForm] = useState({});
  const [psProgress, setPsProgress] = useState({});
  const [certifications, setCertifications] = useState([]);
  const [skills, setSkills] = useState([]);
  const [codingProfiles, setCodingProfiles] = useState({});
  const [hackathons, setHackathons] = useState([]);
  const [publications, setPublications] = useState([]);
  const [patents, setPatents] = useState([]);
  const [counselingNotes, setCounselingNotes] = useState([]);

  useEffect(() => {
    if (currentUser?.register_no) {
      setLoadingStudent(true);
      getStudentByRegisterNo(currentUser.register_no).then((response) => {
        console.log("Student fetched (frontend):", response);
        if (response.success && response.data) {
          console.log("Student data set:", response.data);
          setStudent(response.data);
        }
        setLoadingStudent(false);
      }).catch(() => {
        setLoadingStudent(false);
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getPersonalInfo(currentUser.register_no).then((info) => {
        console.log("Personal info fetched:", info);
        setPersonalInfo(info || {});
        setPersonalInfoForm(info || {});
      }).catch(() => {
        setPersonalInfo({});
        setPersonalInfoForm({});
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getPSProgress(currentUser.register_no).then((progress) => {
        console.log("PS Progress fetched:", progress);
        setPsProgress(progress || {});
      }).catch(() => {
        setPsProgress({});
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getCertifications(currentUser.register_no).then((certs) => {
        setCertifications(certs || []);
      }).catch(() => {
        setCertifications([]);
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getSkills(currentUser.register_no).then((response) => {
        setSkills(response.data || []);
      }).catch(() => {
        setSkills([]);
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getCodingProfiles(currentUser.register_no).then((response) => {
        setCodingProfiles(response.data || {});
      }).catch(() => {
        setCodingProfiles({});
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getHackathons(currentUser.register_no).then((response) => {
        setHackathons(response.data || []);
      }).catch(() => {
        setHackathons([]);
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getPublications(currentUser.register_no).then((response) => {
        const pubData = response.data || {};
        setPublications(pubData.publications || []);
        setPatents(pubData.patents || []);
      }).catch(() => {
        setPublications([]);
        setPatents([]);
      });
    }
  }, [currentUser?.register_no]);

  useEffect(() => {
    if (currentUser?.register_no) {
      getCounselingNotes(currentUser.register_no).then((response) => {
        setCounselingNotes(response.data || []);
      }).catch(() => {
        setCounselingNotes([]);
      });
    }
  }, [currentUser?.register_no]);

  const handlePersonalInfoSave = async () => {
    try {
      const response = await updatePersonalInfo(currentUser.register_no, personalInfoForm);
      setPersonalInfo(response);
      setPersonalInfoForm(response);
      setIsEditingPersonalInfo(false);
      // Show success toast
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

  const handleAddCertification = async (certData) => {
    try {
      const newCert = await createCertification(currentUser.register_no, certData);
      setCertifications([...certifications, newCert]);
    } catch (error) {
      console.error('Error adding certification:', error);
    }
  };

  const handleDeleteCertification = async (certId) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await deleteCertification(currentUser.register_no, certId);
        setCertifications((certifications || []).filter(c => c.id !== certId));
      } catch (error) {
        console.error('Error deleting certification:', error);
      }
    }
  };

  // Calculate PS Portal Completion % - based on levels > 0
  const psCompletion = React.useMemo(() => {
    const levels = [
      psProgress?.c_level || 0,
      psProgress?.java_level || 0,
      psProgress?.python_level || 0,
      psProgress?.cpp_level || 0,
      psProgress?.database_level || 0,
      psProgress?.aptitude_level || 0,
    ];
    const completed = levels.filter(l => l > 0).length;
    return Math.round((completed / 6) * 100);
  }, [psProgress]);

  // Calculate Placement Readiness Score
  const placementReadiness = React.useMemo(() => {
    const cgpaScore = (Number(student?.cgpa || 0) / 10) * 30;
    const attendanceScore = (Number(student?.attendancePercentage || 0) / 100) * 20;
    const psScore = (psCompletion / 100) * 15;
    const certificationsScore = ((certifications?.length || 0) / 5) * 10;
    const codingProfileScore = (codingProfiles?.github ? 1 : 0) * 5;
    const hackathonsScore = ((hackathons?.length || 0) / 3) * 5;
    const interviewScore = (Number(student?.interviewReadinessScore || 0) / 100) * 5;
    const projectsScore = 0; // No API available
    return Math.round(cgpaScore + attendanceScore + psScore + certificationsScore + codingProfileScore + hackathonsScore + interviewScore + projectsScore);
  }, [student?.cgpa, student?.attendancePercentage, psCompletion, certifications?.length, codingProfiles?.github, hackathons?.length, student?.interviewReadinessScore]);
  // Console verification before rendering
  React.useEffect(() => {
    console.log("=== Student Dashboard State Verification ===");
    console.log("student:", student);
    console.log("personalInfo:", personalInfo);
    console.log("psProgress:", psProgress);
    console.log("certifications:", certifications);
    console.log("skills:", skills);
    console.log("codingProfiles:", codingProfiles);
    console.log("hackathons:", hackathons);
    console.log("publications:", publications);
    console.log("patents:", patents);
    console.log("counselingNotes:", counselingNotes);
    console.log("========================================");
  }, [student, personalInfo, psProgress, certifications, skills, codingProfiles, hackathons, publications, patents, counselingNotes]);

  const cgpaBadge = React.useMemo(() => {
    const cgpa = Number(student?.cgpa || 0);
    if (cgpa >= 8) return { text: 'Excellent', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (cgpa >= 7) return { text: 'Good Standing', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { text: 'Needs Improvement', color: 'bg-amber-100 text-amber-800 border-amber-300' };
  }, [student?.cgpa]);

  if (loadingStudent) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
        <div className="w-10 h-10 border-4 border-[#5B82C5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-700">Loading your profile...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
        <p className="text-sm font-bold text-gray-700">Unable to load student information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Hero Profile Section */}
      <StudentHero student={student} personalInfo={personalInfo} cgpaBadge={cgpaBadge} psCompletion={psCompletion} />

      {/* Warning Banners */}
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

      {/* Personal Information Section */}
      <StudentPersonalInfo
        personalInfo={personalInfo}
        personalInfoForm={personalInfoForm}
        isEditingPersonalInfo={isEditingPersonalInfo}
        setIsEditingPersonalInfo={setIsEditingPersonalInfo}
        setPersonalInfoForm={setPersonalInfoForm}
        handlePersonalInfoSave={handlePersonalInfoSave}
        handlePersonalInfoCancel={handlePersonalInfoCancel}
        canEdit={true}
      />

      {/* Academic Information Section */}
      <StudentAcademicCard student={student} />

      {/* PS Portal Progress Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">PS Portal Progress</h3>
              <p className="text-xs font-semibold text-gray-500">Track your programming skills development</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-[#5B82C5]">{psCompletion}%</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Overall Completion</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'C', level: psProgress?.c_level || 0, completed: psProgress?.c_completed_date, color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200', text: 'text-blue-700' },
            { name: 'Java', level: psProgress?.java_level || 0, completed: psProgress?.java_completed_date, color: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-200', text: 'text-orange-700' },
            { name: 'Python', level: psProgress?.python_level || 0, completed: psProgress?.python_completed_date, color: 'from-green-500/10 to-green-500/5', border: 'border-green-200', text: 'text-green-700' },
            { name: 'C++', level: psProgress?.cpp_level || 0, completed: psProgress?.cpp_completed_date, color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-200', text: 'text-purple-700' },
            { name: 'Database', level: psProgress?.database_level || 0, completed: psProgress?.database_completed_date, color: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-200', text: 'text-cyan-700' },
            { name: 'Aptitude', level: psProgress?.aptitude_level || 0, completed: psProgress?.aptitude_completed_date, color: 'from-pink-500/10 to-pink-500/5', border: 'border-pink-200', text: 'text-pink-700' },
          ].map((item) => (
            <div key={item.name} className={`bg-gradient-to-br ${item.color} p-4 rounded-xl border ${item.border} hover:shadow-md transition-all cursor-pointer`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider">{item.name}</span>
                {item.completed ? (
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <span className={`text-xs font-bold ${item.text}`}>Level {item.level}</span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all ${item.completed ? 'bg-emerald-500' : 'bg-[#5B82C5]'}`}
                  style={{ width: `${(item.level / 5) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-semibold text-gray-500">
                {item.completed ? 'Completed' : `${item.level}/5 Levels`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-[#5B82C5]" />
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
            <TrophyIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
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
                    <button onClick={() => handleDeleteCertification(cert.id)} className="px-3 py-2 bg-red-100 text-red-700 text-xs font-bold rounded-lg hover:bg-red-200 transition-all flex items-center justify-center gap-1">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technical Skills Section */}
      <StudentSkills skills={skills} />

      {/* Coding Profiles Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <CodeBracketIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Coding Profiles</h3>
              <p className="text-xs font-semibold text-gray-500">Your competitive programming profiles</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <PencilIcon className="w-4 h-4" /> Edit Profiles
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: 'LeetCode', icon: '🟡', color: 'from-yellow-500/10 to-yellow-500/5', border: 'border-yellow-200', link: codingProfiles?.leetcode?.url, username: codingProfiles?.leetcode?.username },
            { name: 'HackerRank', icon: '🟢', color: 'from-green-500/10 to-green-500/5', border: 'border-green-200', link: codingProfiles?.hackerrank?.url, username: codingProfiles?.hackerrank?.username },
            { name: 'CodeChef', icon: '🔵', color: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-200', link: codingProfiles?.codechef?.url, username: codingProfiles?.codechef?.username },
            { name: 'GitHub', icon: '⬛', color: 'from-gray-500/10 to-gray-500/5', border: 'border-gray-300', link: codingProfiles?.github?.url, username: codingProfiles?.github?.username },
            { name: 'GeeksForGeeks', icon: '🟠', color: 'from-orange-500/10 to-orange-500/5', border: 'border-orange-200', link: codingProfiles?.geeksforgeeks?.url, username: codingProfiles?.geeksforgeeks?.username },
          ].map((profile) => (
            <div key={profile.name} className={`bg-gradient-to-br ${profile.color} p-4 rounded-xl border ${profile.border} hover:shadow-md transition-all cursor-pointer group`}>
              <div className="text-center">
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">{profile.icon}</span>
                <p className="text-xs font-extrabold text-gray-900">{profile.name}</p>
                {profile.username ? (
                  <p className="text-[10px] font-semibold text-gray-600 mt-1 truncate">@{profile.username}</p>
                ) : profile.link ? (
                  <p className="text-[10px] font-semibold text-gray-600 mt-1 truncate">Connected</p>
                ) : (
                  <button className="mt-3 px-3 py-1.5 bg-[#5B82C5] text-white text-[10px] font-bold rounded-lg hover:bg-[#4A6FA8] transition-all w-full">
                    Connect Profile
                  </button>
                )}
                {profile.link && profile.username ? (
                  <a href={profile.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-[#5B82C5] hover:text-[#4A6FA8]">
                    <GlobeAltIcon className="w-3 h-3" /> View Profile
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Projects</h3>
              <p className="text-xs font-semibold text-gray-500">Your academic and personal projects</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <PlusIcon className="w-4 h-4" /> Add Project
          </button>
        </div>
        
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <BriefcaseIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No projects have been added yet</p>
          <button className="mt-4 px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 mx-auto">
            <PlusIcon className="w-4 h-4" /> Add Project
          </button>
        </div>
      </div>

      {/* Hackathons Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <RocketLaunchIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Hackathons</h3>
              <p className="text-xs font-semibold text-gray-500">Your hackathon participation and achievements</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <PlusIcon className="w-4 h-4" /> Add Hackathon
          </button>
        </div>
        
        {hackathons.length > 0 ? (
          <div className="space-y-4">
            {hackathons.map((hack, index) => (
              <div key={hack.id} className="relative pl-8">
                {/* Timeline Line */}
                {index !== hackathons.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                {/* Timeline Dot */}
                <div className="absolute left-0 top-0 w-6 h-6 bg-[#5B82C5] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                  <TrophyIcon className="w-3 h-3 text-white" />
                </div>
                {/* Hackathon Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-extrabold text-gray-900 mb-1">{hack.name || 'Hackathon Name'}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          {hack.date || 'Not Available'}
                        </span>
                        {hack.organizer && (
                          <span className="flex items-center gap-1">
                            <BuildingLibraryIcon className="w-3 h-3" />
                            {hack.organizer}
                          </span>
                        )}
                      </div>
                    </div>
                    {hack.position && (
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        hack.position.toLowerCase().includes('1') || hack.position.toLowerCase().includes('winner') ? 'bg-amber-100 text-amber-700 border-amber-300' :
                        hack.position.toLowerCase().includes('2') || hack.position.toLowerCase().includes('runner') ? 'bg-gray-100 text-gray-700 border-gray-300' :
                        'bg-emerald-100 text-emerald-700 border-emerald-300'
                      }`}>
                        {hack.position}
                      </span>
                    )}
                  </div>
                  {hack.certificateUrl && (
                    <a href={hack.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-[#5B82C5] hover:text-[#4A6FA8]">
                      <DocumentTextIcon className="w-3 h-3" /> View Certificate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <RocketLaunchIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-semibold text-gray-500">No hackathons participated yet</p>
            <button className="mt-4 px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 mx-auto">
              <PlusIcon className="w-4 h-4" /> Add Your First Hackathon
            </button>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Achievements</h3>
              <p className="text-xs font-semibold text-gray-500">Your awards, competitions, and recognitions</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <PlusIcon className="w-4 h-4" /> Add Achievement
          </button>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <TrophyIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No achievements have been added yet</p>
          <button className="mt-4 px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 mx-auto">
            <PlusIcon className="w-4 h-4" /> Add Achievement
          </button>
        </div>
      </div>

      {/* Publications & Patents Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Publications & Patents</h3>
              <p className="text-xs font-semibold text-gray-500">Your research papers, patents, journals, and conferences</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
            <PlusIcon className="w-4 h-4" /> Add
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Publications Column */}
          <div>
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4" /> Publications
            </h4>
            {publications.length > 0 ? (
              <div className="space-y-3">
                {publications.map((pub) => (
                  <div key={pub.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-extrabold text-gray-900 flex-1">{pub.title || 'Publication Title'}</h5>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                        pub.type === 'Journal' || pub.type === 'journal' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                        pub.type === 'Conference' || pub.type === 'conference' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' :
                        'bg-blue-100 text-blue-700 border-blue-300'
                      }`}>
                        {pub.type || 'Paper'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BuildingLibraryIcon className="w-3 h-3" /> {pub.journal || 'Journal Name'}
                      </span>
                      {pub.year && (
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" /> {pub.year}
                        </span>
                      )}
                    </div>
                    {pub.status && (
                      <span className={`inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        pub.status === 'published' || pub.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                        pub.status === 'accepted' || pub.status === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {pub.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold text-gray-500">No publications</p>
              </div>
            )}
          </div>
          
          {/* Patents Column */}
          <div>
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-4 h-4" /> Patents
            </h4>
            {patents.length > 0 ? (
              <div className="space-y-3">
                {patents.map((patent) => (
                  <div key={patent.id} className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="text-sm font-extrabold text-gray-900 flex-1">{patent.title || 'Patent Title'}</h5>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                        patent.status === 'granted' || patent.status === 'Granted' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        patent.status === 'pending' || patent.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                        'bg-blue-100 text-blue-700 border-blue-300'
                      }`}>
                        {patent.status || 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      {patent.patentNumber && (
                        <span className="flex items-center gap-1">
                          <IdentificationIcon className="w-3 h-3" /> {patent.patentNumber}
                        </span>
                      )}
                      {patent.year && (
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3 h-3" /> {patent.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">
                <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-xs font-semibold text-gray-500">No patents</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

      {/* Recent Notifications Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
              <BellIcon className="w-5 h-5 text-[#5B82C5]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Recent Notifications</h3>
              <p className="text-xs font-semibold text-gray-500">Stay updated with latest announcements</p>
            </div>
          </div>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <BellIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No new notifications</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-[#5B82C5]" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setIsEditingPersonalInfo(true)}
            className="px-4 py-3 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors flex items-center justify-center gap-2"
          >
            <PencilIcon className="w-4 h-4" /> Edit Personal Info
          </button>
          <button className="px-4 py-3 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors flex items-center justify-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Certification
          </button>
          <button className="px-4 py-3 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors flex items-center justify-center gap-2">
            <PlusIcon className="w-4 h-4" /> Add Skill
          </button>
          <button className="px-4 py-3 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-colors flex items-center justify-center gap-2">
            <PencilIcon className="w-4 h-4" /> Update Coding Profiles
          </button>
        </div>
      </div>
    </div>
  );
};
