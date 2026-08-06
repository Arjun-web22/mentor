import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import {
  UserIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingLibraryIcon,
  ArrowLeftIcon,
  MapPinIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

export const MentorProfile = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useDashboard();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/mentors/${mentorId}`);
        if (response.data.success) {
          setMentor(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load mentor data');
        }
      } catch (err) {
        setError('Unable to load mentor profile');
        console.error('Error fetching mentor:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchMentorData();
    }
  }, [mentorId]);

  if (loading) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
        <div className="w-10 h-10 border-4 border-[#5B82C5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-gray-700">Loading Mentor Profile...</p>
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="py-16 text-center bg-white rounded-xl border border-gray-200 shadow-xs space-y-4">
        <UserIcon className="w-12 h-12 text-[#F44336] mx-auto" />
        <h2 className="text-lg font-black text-gray-900">Mentor Profile Not Found</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          {error || 'No mentor found with the provided ID.'}
        </p>
        <button
          onClick={() => navigate('/mentors')}
          className="px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl min-h-[44px]"
        >
          Return to Mentor Directory
        </button>
      </div>
    );
  }

  const isOwnProfile = currentUser?.staff_id === mentor.staff_id;
  const canEdit = isOwnProfile || currentUser?.role === 'SUPER_ADMIN';

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
          <ArrowLeftIcon className="w-4 h-4 text-[#5B82C5]" /> Back to Directory
        </button>

        {canEdit && (
          <button
            onClick={() => {/* TODO: Implement edit functionality */}}
            className="px-4 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors min-h-[44px]"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-4 lg:gap-6">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-5 w-full sm:w-auto">
            {mentor.profile_photo ? (
              <img
                src={mentor.profile_photo}
                alt={mentor.full_name}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-[#5B82C5]/20 shadow-xs flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl bg-[#EBF1FA] flex items-center justify-center border-4 border-[#5B82C5]/20 shadow-xs flex-shrink-0">
                <UserIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#5B82C5]" />
              </div>
            )}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row items-center lg:items-start space-x-0 lg:space-x-3 space-y-2 lg:space-y-0">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{mentor.full_name}</h1>
                <Badge variant={mentor.is_active ? 'success' : 'danger'}>
                  {mentor.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <p className="text-xs font-bold text-gray-500 font-mono mt-1">
                STAFF ID: {mentor.staff_id}
              </p>

              <p className="text-sm font-semibold text-gray-700 mt-1">
                {mentor.designation}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs font-semibold text-gray-600 mt-2">
                <div className="flex items-center gap-1">
                  <EnvelopeIcon className="w-4 h-4 text-[#5B82C5]" /> {mentor.email}
                </div>
                {mentor.phone && (
                  <div className="flex items-center gap-1">
                    <PhoneIcon className="w-4 h-4 text-[#5B82C5]" /> {mentor.phone}
                  </div>
                )}
              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex items-center justify-center sm:justify-start space-x-2 text-xs font-semibold text-gray-700">
                <span className="text-gray-400">Role:</span>
                <span className="font-extrabold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                  {mentor.role}
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#EBF1FA] p-3 rounded-xl border border-[#5B82C5]/30 text-center flex-1">
              <UserGroupIcon className="w-5 h-5 text-[#5B82C5] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-[#5B82C5] uppercase block">Total Students</span>
              <span className="text-xl font-black text-[#5B82C5]">{mentor.total_students || 0}</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center flex-1">
              <ChartBarIcon className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Avg CGPA</span>
              <span className="text-xl font-black text-emerald-800">{Number(mentor.avg_cgpa || 0).toFixed(2)}</span>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center flex-1">
              <AcademicCapIcon className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Avg Attendance</span>
              <span className="text-xl font-black text-amber-900">{Number(mentor.avg_attendance || 0).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Information */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-4">
          <BuildingLibraryIcon className="w-5 h-5 text-[#5B82C5]" /> Department Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Department</span>
            <span className="text-sm font-bold text-gray-900">{mentor.department_name || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">College</span>
            <span className="text-sm font-bold text-gray-900">{mentor.college_name || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs">
        <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-[#5B82C5]" /> Professional Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Employee Code</span>
            <span className="text-sm font-bold text-gray-900">{mentor.employee_code || mentor.staff_id || 'N/A'}</span>
          </div>
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Joining Date</span>
            <span className="text-sm font-bold text-gray-900">{mentor.joining_date || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
