import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getStudentsByMentor } from '../../services/mentorService';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowsUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const MentorStudentsDirectory = () => {
  const { departmentId, mentorId } = useParams();
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setLoading(true);
        const data = await getStudentsByMentor(mentorId);
        setStudentsData(data);
        setError(null);
      } catch (err) {
        setError('Unable to connect to server.');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsData();
  }, [mentorId]);

  // Handle placeholder response
  const isPlaceholder = studentsData && studentsData.message === 'Students not yet added.';

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Students Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Students assigned to this mentor
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Students...</p>
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
      {!loading && !error && isPlaceholder && (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200 shadow-xs">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-gray-900">No student data available yet.</h3>
          <p className="text-xs text-gray-500 mt-1">
            Student data will be added to the system soon.
          </p>
        </div>
      )}
    </div>
  );
};
