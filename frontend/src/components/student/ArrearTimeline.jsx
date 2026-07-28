import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export const ArrearTimeline = ({ arrears }) => {
  const pendingCount = arrears.filter((a) => a.status === 'pending').length;
  const clearedCount = arrears.filter((a) => a.status === 'passed_arrear' || a.status === 'passed_first_attempt').length;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-[#5B82C5]" /> Academic Arrear History & Backlog Timeline
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">
            Semester-wise record of examination attempts, re-examinations, and backlog statuses
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-emerald-50 text-[#4CAF50] border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
            <CheckCircleIcon className="w-4 h-4" /> Cleared: {clearedCount}
          </span>
          <span className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 border ${
            pendingCount > 0 ? 'bg-red-50 text-[#F44336] border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            <ExclamationCircleIcon className="w-4 h-4" /> Pending Backlogs: {pendingCount}
          </span>
        </div>
      </div>

      {arrears.length === 0 ? (
        <div className="py-8 text-center bg-emerald-50/50 rounded-xl border border-emerald-100 mt-4">
          <CheckCircleIcon className="w-10 h-10 text-[#4CAF50] mx-auto mb-2" />
          <h4 className="text-sm font-extrabold text-emerald-900">Clean Academic Record - Zero Arrears</h4>
          <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto">
            This student has passed all registered course subjects on their first examination attempt.
          </p>
        </div>
      ) : (
        <div className="mt-6 relative pl-6 border-l-2 border-gray-200 space-y-6">
          {arrears.map((item) => {
            const isPending = item.status === 'pending';
            const isPassedArrear = item.status === 'passed_arrear';
            const isFirstAttempt = item.status === 'passed_first_attempt';

            return (
              <div key={item.id} className="relative group">
                {/* Timeline Node Dot */}
                <div
                  className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    isPending
                      ? 'border-[#F44336] bg-red-100'
                      : isPassedArrear
                      ? 'border-[#FF9800] bg-amber-100'
                      : 'border-[#4CAF50] bg-emerald-100'
                  }`}
                />

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#5B82C5] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-[#EBF1FA] text-[#5B82C5] font-extrabold text-xs rounded-lg border border-[#5B82C5]/30">
                        Sem {item.semester}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {item.subjectCode} - {item.subjectName}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">
                          Total Examination Attempts: {item.attemptCount}
                        </p>
                      </div>
                    </div>

                    <div>
                      {isPending && (
                        <span className="px-3 py-1 bg-red-100 text-[#F44336] text-xs font-bold rounded-lg border border-red-200 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#F44336] animate-ping" />
                          Pending Backlog (Grade: U)
                        </span>
                      )}
                      {isPassedArrear && (
                        <span className="px-3 py-1 bg-amber-100 text-[#FF9800] text-xs font-bold rounded-lg border border-amber-200 flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" /> Cleared in Arrear Exam (Sem {item.clearingSemester})
                        </span>
                      )}
                      {isFirstAttempt && (
                        <span className="px-3 py-1 bg-emerald-100 text-[#4CAF50] text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                          <CheckCircleIcon className="w-4 h-4" /> Passed 1st Attempt (Grade: {item.grade || 'A'})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
