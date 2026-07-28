import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { XMarkIcon, ChatBubbleLeftRightIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface AddCounselingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export const AddCounselingModal: React.FC<AddCounselingModalProps> = ({
  isOpen,
  onClose,
  studentId,
  studentName,
}) => {
  const { addCounselingNote } = useDashboard();
  const [category, setCategory] = useState<'Academic' | 'Attendance' | 'Personal' | 'Placement' | 'General'>('Academic');
  const [note, setNote] = useState('');
  const [actionPlan, setActionPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim() || !actionPlan.trim()) return;

    setSubmitting(true);
    try {
      await addCounselingNote(studentId, category, note.trim(), actionPlan.trim(), followUpDate);
      onClose();
      setNote('');
      setActionPlan('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#5B82C5] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg leading-tight">Log Mentor Counseling Session</h3>
              <p className="text-xs text-blue-100 font-medium">Student: {studentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Counseling Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Academic', 'Attendance', 'Placement', 'Personal', 'General'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    category === cat
                      ? 'bg-[#5B82C5] text-white border-[#5B82C5]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Counseling Discussion Remarks
            </label>
            <textarea
              rows={3}
              required
              placeholder="Record key observations, difficulties identified, arrear progress, or personal counseling notes..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Agreed Action Plan & Next Steps
            </label>
            <textarea
              rows={2}
              required
              placeholder="e.g. Complete 5 model papers for OS backlog, maintain 90%+ attendance..."
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Next Review / Follow-Up Date
            </label>
            <div className="relative">
              <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5B82C5]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#5B82C5] hover:bg-[#4A6FA8] rounded-xl transition-colors shadow-md shadow-[#5B82C5]/20 disabled:opacity-50"
            >
              {submitting ? 'Saving Record...' : 'Save Counseling Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
