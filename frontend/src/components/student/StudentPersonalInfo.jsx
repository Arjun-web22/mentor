import React from 'react';
import { UserIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/dateUtils';

const StudentPersonalInfo = ({ 
  personalInfo, 
  personalInfoForm, 
  isEditingPersonalInfo, 
  setIsEditingPersonalInfo, 
  setPersonalInfoForm, 
  handlePersonalInfoSave, 
  handlePersonalInfoCancel,
  canEdit = true 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-5 h-5 text-[#5B82C5]" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">Personal Information</h3>
            <p className="text-xs font-semibold text-gray-500">Update your personal details</p>
          </div>
        </div>
        {canEdit && !isEditingPersonalInfo && (
          <button
            onClick={() => setIsEditingPersonalInfo(true)}
            className="w-full sm:w-auto px-4 py-2 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <PencilIcon className="w-4 h-4" /> Edit
          </button>
        )}
      </div>

      {isEditingPersonalInfo ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date of Birth</label>
            <input
              type="date"
              value={personalInfoForm.date_of_birth || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, date_of_birth: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</label>
            <select
              value={personalInfoForm.gender || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, gender: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Group</label>
            <input
              type="text"
              value={personalInfoForm.blood_group || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, blood_group: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
              placeholder="e.g., O+"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
            <input
              type="tel"
              value={personalInfoForm.phone || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Personal Email</label>
            <input
              type="email"
              value={personalInfoForm.personal_email || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, personal_email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Alternate Email</label>
            <input
              type="email"
              value={personalInfoForm.alternate_email || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, alternate_email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">College Email</label>
            <input
              type="email"
              value={personalInfoForm.college_email || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, college_email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
            <input
              type="text"
              value={personalInfoForm.address || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, address: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City</label>
            <input
              type="text"
              value={personalInfoForm.city || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, city: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
            <input
              type="text"
              value={personalInfoForm.state || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, state: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Country</label>
            <input
              type="text"
              value={personalInfoForm.country || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, country: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
            <input
              type="text"
              value={personalInfoForm.pincode || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, pincode: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Emergency Contact</label>
            <input
              type="tel"
              value={personalInfoForm.alternate_phone || ''}
              onChange={(e) => setPersonalInfoForm({...personalInfoForm, alternate_phone: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#5B82C5] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
            <button
              onClick={handlePersonalInfoSave}
              className="flex-1 px-6 py-3 bg-[#5B82C5] text-white text-xs font-bold rounded-xl hover:bg-[#4A6FA8] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <CheckCircleIcon className="w-4 h-4" /> Save Changes
            </button>
            <button
              onClick={handlePersonalInfoCancel}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</p>
            <p className="text-sm font-bold text-gray-900">{formatDate(personalInfo?.date_of_birth)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gender</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.gender || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.blood_group || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.phone || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personal Email</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.personal_email || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alternate Email</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.alternate_email || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">College Email</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.college_email || '—'}</p>
          </div>
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.address || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.city || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">State</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.state || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.country || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pincode</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.pincode || '—'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emergency Contact</p>
            <p className="text-sm font-bold text-gray-900">{personalInfo?.alternate_phone || '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPersonalInfo;
