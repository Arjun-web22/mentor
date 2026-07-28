import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Badge } from '../../components/common/Badge';
import {
  Cog6ToothIcon,
  AdjustmentsHorizontalIcon,
  AcademicCapIcon,
  BellIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
export const SystemSettings = () => {
  const { fontScale, setFontScale, addToast } = useDashboard();
  const [academicYear, setAcademicYear] = useState('2025 - 2026');
  const [minAttendance, setMinAttendance] = useState(75);
  const [highCgpaThreshold, setHighCgpaThreshold] = useState(8.5);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('success', 'System Settings Saved', 'Institutional ERP parameters updated successfully.');
  };

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Cog6ToothIcon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#5B82C5]" /> Institutional ERP Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1">
            Configure system parameters, academic threshold rules, and user accessibility controls
          </p>
        </div>

        <Badge variant="primary">System Build v2.4.0</Badge>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Senior Staff Accessibility Settings */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B82C5]" /> Display & Font Scale Accessibility (Senior Staff 40+)
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Customize typography scale for maximum visual clarity and comfortable daily reading across desktop monitors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(['normal', 'large', 'xlarge']).map((scale) => (
              <div
                key={scale}
                onClick={() => setFontScale(scale)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  fontScale === scale
                    ? 'bg-[#EBF1FA] border-[#5B82C5] ring-2 ring-[#5B82C5]'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-gray-700">
                    {scale === 'normal' ? 'Standard 100%' : scale === 'large' ? 'Large 115% (Recommended)' : 'Extra Large 125%'}
                  </span>
                  {fontScale === scale && <CheckCircleIcon className="w-5 h-5 text-[#5B82C5]" />}
                </div>
                <p className={`mt-2 font-bold text-gray-900 ${scale === 'large' ? 'text-lg' : scale === 'xlarge' ? 'text-xl' : 'text-base'}`}>
                  Sample Academic Text
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Rules & Thresholds */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
            <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B82C5]" /> Academic Regulation Thresholds
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Active Academic Term
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Minimum Attendance Cutoff (%)
              </label>
              <input
                type="number"
                value={minAttendance}
                onChange={(e) => setMinAttendance(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                High Performer CGPA Cutoff
              </label>
              <input
                type="number"
                step="0.1"
                value={highCgpaThreshold}
                onChange={(e) => setHighCgpaThreshold(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 flex items-center gap-2">
            <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#5B82C5]" /> Automated Email Alerts & Counseling Reminders
          </h3>

          <div className="flex items-start sm:items-center space-x-3">
            <input
              type="checkbox"
              id="email-alerts"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-5 h-5 text-[#5B82C5] rounded border-gray-300 focus:ring-[#5B82C5]"
            />
            <label htmlFor="email-alerts" className="text-xs font-bold text-gray-800">
              Send automatic weekly digest to HODs regarding students with 2+ arrears or low attendance
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-[#5B82C5] hover:bg-[#4A6FA8] text-white font-black text-xs rounded-xl shadow-md transition-colors min-h-[44px]"
          >
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
};
