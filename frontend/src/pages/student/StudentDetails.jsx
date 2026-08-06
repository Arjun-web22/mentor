import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Badge } from '../../components/common/Badge';
import { getStudentByRegisterNo, updateStudent } from '../../services/studentService';
import { formatDate } from '../../utils/dateUtils';
import {
  UserIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  ChartBarIcon,
  DocumentTextIcon,
  SparklesIcon,
  BriefcaseIcon,
  ClockIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

export const StudentDetails = () => {
  const { registerNo } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    student_name: '',
    year: '',
    section: '',
    staff_id: '',
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const response = await getStudentByRegisterNo(registerNo);
        if (response.success) {
          setStudent(response.data);
          setFormData({
            student_name: response.data.student_name,
            year: response.data.year,
            section: response.data.section,
            staff_id: response.data.staff_id || '',
          });
        } else {
          setError('Student not found');
        }
      } catch (err) {
        setError('Unable to load student details');
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [registerNo]);

  // Generate avatar from student initials
  const getStudentAvatar = (studentName) => {
    if (!studentName) return null;
    const initials = studentName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    const colors = [
      '#FFE4E6', '#FCE7F3', '#F5D0FE', '#E9D5FF', '#DDD6FE',
      '#C4B5FD', '#A5B4FC', '#93C5FD', '#7DD3FC', '#67E8F9',
      '#5EEAD4', '#6EE7B7', '#86EFAC', '#A7F3D0', '#BBF7D0',
      '#D9F99D', '#FEF08A', '#FDE047', '#FDBA74', '#FB923C'
    ];
    
    const colorIndex = studentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return {
      initials,
      backgroundColor
    };
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (student) {
      setFormData({
        student_name: student.student_name,
        year: student.year,
        section: student.section,
        staff_id: student.staff_id || '',
      });
    }
    setSuccessMessage('');
  };

  const handleSave = async () => {
    // Validation
    if (!formData.student_name.trim()) {
      setError('Student name is required');
      return;
    }
    if (!formData.year) {
      setError('Year is required');
      return;
    }
    if (!formData.section) {
      setError('Section is required');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const response = await updateStudent(registerNo, formData);
      
      if (response.success) {
        setStudent(response.data);
        setIsEditing(false);
        setSuccessMessage('Student updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to update student');
      }
    } catch (err) {
      setError('Unable to update student');
      console.error('Error updating student:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#5B82C5] border-t-transparent"></div>
            <p className="mt-4 text-sm font-semibold text-gray-600">Loading Student Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="space-y-6">
        <Breadcrumbs />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm font-semibold text-red-800 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors min-h-[44px]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const avatar = student ? getStudentAvatar(student.student_name) : null;

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5B82C5] hover:text-[#4A6FA8] mb-2 transition-colors min-h-[36px]"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Directory
          </button>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight">
            Student Details
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            {student?.register_no}
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 min-h-[44px]"
          >
            <PencilIcon className="w-4 h-4" />
            Edit Student
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs sm:text-sm font-semibold text-green-800 text-center">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-xs sm:text-sm font-semibold text-red-800 text-center">{error}</p>
        </div>
      )}

      {/* Student Information Card */}
      {student && (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              {avatar ? (
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-black text-gray-800"
                  style={{ backgroundColor: avatar.backgroundColor }}
                >
                  {avatar.initials}
                </div>
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500" />
                </div>
              )}
              <Badge variant="info" size="sm" className="mt-3">
                {student.register_no}
              </Badge>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Name */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Student Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base font-black text-gray-900">{student.student_name}</p>
                  )}
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Roll Number
                  </label>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{student.roll_no}</p>
                </div>

                {/* Course/Degree */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Course / Degree
                  </label>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{student.course_degree}</p>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Year
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base font-bold text-gray-900">{student.year}</p>
                  )}
                </div>

                {/* Section */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Section
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base font-bold text-gray-900">{student.section}</p>
                  )}
                </div>

                {/* Mentor */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Mentor
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="staff_id"
                      value={formData.staff_id}
                      onChange={handleInputChange}
                      placeholder="Staff ID (optional)"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
                    />
                  ) : (
                    <p className="text-sm sm:text-base font-bold text-[#5B82C5]">{student.staff_name || 'Not Assigned'}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Date of Birth
                  </label>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{formatDate(student.dob)}</p>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Gender
                  </label>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{student.gender || 'Not Available'}</p>
                </div>

                {/* Batch */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Batch
                  </label>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{student.batch || 'Not Available'}</p>
                </div>
              </div>

              {/* Edit Mode Actions */}
              {isEditing && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-4">Additional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Attendance Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                student?.attendance >= 90 
                  ? 'bg-green-100 text-green-600' 
                  : student?.attendance >= 75 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-red-100 text-red-600'
              }`}>
                <ClockIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Attendance</h3>
                <p className="text-[10px] font-bold text-gray-500">Current Attendance</p>
              </div>
            </div>
            <p className={`text-2xl font-black ${
              student?.attendance >= 90 
                ? 'text-green-600' 
                : student?.attendance >= 75 
                  ? 'text-amber-600' 
                  : 'text-red-600'
            }`}>
              {student?.attendance ? `${Number(student.attendance).toFixed(2)}%` : 'N/A'}
            </p>
          </div>

          {/* CGPA Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                student?.cgpa >= 8.5 
                  ? 'bg-green-100 text-green-600' 
                  : student?.cgpa >= 7.0 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-red-100 text-red-600'
              }`}>
                <ChartBarIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">CGPA</h3>
                <p className="text-[10px] font-bold text-gray-500">Overall CGPA</p>
              </div>
            </div>
            <p className={`text-2xl font-black ${
              student?.cgpa >= 8.5 
                ? 'text-green-600' 
                : student?.cgpa >= 7.0 
                  ? 'text-amber-600' 
                  : 'text-red-600'
            }`}>
              {student?.cgpa ? Number(student.cgpa).toFixed(2) : 'N/A'}
            </p>
          </div>

          {/* Pending Arrears Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                student?.pending_arrears === 0 || student?.pending_arrears === '0' 
                  ? 'bg-green-100 text-green-600' 
                  : student?.pending_arrears <= 2 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-red-100 text-red-600'
              }`}>
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900">Pending Arrears</h3>
                <p className="text-[10px] font-bold text-gray-500">
                  {student?.pending_arrears === 0 || student?.pending_arrears === '0' 
                    ? 'No Pending Arrears' 
                    : 'Pending Subjects'}
                </p>
              </div>
            </div>
            <p className={`text-2xl font-black ${
              student?.pending_arrears === 0 || student?.pending_arrears === '0' 
                ? 'text-green-600' 
                : student?.pending_arrears <= 2 
                  ? 'text-amber-600' 
                  : 'text-red-600'
            }`}>
              {student?.pending_arrears !== null && student?.pending_arrears !== undefined 
                ? student.pending_arrears 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
