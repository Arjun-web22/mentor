import React from 'react';
import { ChatBubbleLeftRightIcon, UserGroupIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const StudentTimeline = ({ counselingNotes }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#5B82C5]/10 rounded-xl flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-[#5B82C5]" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-gray-900">Counselling History</h3>
          <p className="text-xs font-semibold text-gray-500">Mentor counselling sessions and remarks</p>
        </div>
      </div>
      
      {(counselingNotes || []).length > 0 ? (
        <div className="space-y-4">
          {(counselingNotes || []).map((note, index) => (
            <div key={note.id} className="relative pl-8">
              {/* Timeline Line */}
              {index !== (counselingNotes || []).length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 w-6 h-6 bg-[#5B82C5] rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                <UserGroupIcon className="w-3 h-3 text-white" />
              </div>
              {/* Counselling Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-sm font-extrabold text-gray-900">{note.mentorName || 'Mentor'}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        note.category === 'academic' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                        note.category === 'personal' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                        note.category === 'career' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        'bg-gray-100 text-gray-700 border-gray-300'
                      }`}>
                        {note.category || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-3 h-3" /> {note.date || 'Not Available'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Remarks</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{note.remarks || 'No remarks provided'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
          <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-semibold text-gray-500">No counselling sessions recorded</p>
        </div>
      )}
    </div>
  );
};

export default StudentTimeline;
