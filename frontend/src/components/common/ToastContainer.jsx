import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const ToastContainer = () => {
  const { toasts, removeToast } = useDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {toast.type === 'success' && <CheckCircleIcon className="w-6 h-6 text-[#4CAF50] flex-shrink-0" />}
          {toast.type === 'warning' && <ExclamationTriangleIcon className="w-6 h-6 text-[#FF9800] flex-shrink-0" />}
          {toast.type === 'danger' && <ExclamationCircleIcon className="w-6 h-6 text-[#F44336] flex-shrink-0" />}
          {toast.type === 'info' && <InformationCircleIcon className="w-6 h-6 text-[#5B82C5] flex-shrink-0" />}

          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-900 leading-tight">{toast.title}</h4>
            <p className="text-xs text-gray-600 mt-0.5 leading-snug">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};
