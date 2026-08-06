import React from 'react';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { formatDate } from '../../utils/dateUtils';

const CertificationCard = ({ 
  certification, 
  userRole,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isOwn = false
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Pending':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'Rejected':
        return <XCircleIcon className="w-4 h-4" />;
      case 'Pending':
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const canEdit = isOwn && certification.status === 'Pending';
  const canDelete = isOwn && certification.status === 'Pending';
  const canApprove = userRole === 'MENTOR' || userRole === 'HOD' || userRole === 'SUPER_ADMIN';
  const canReject = userRole === 'MENTOR' || userRole === 'HOD' || userRole === 'SUPER_ADMIN';

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AcademicCapIcon className="w-5 h-5 text-[#5B82C5]" />
          <h4 className="text-sm font-bold text-gray-900">{certification.certificate_name}</h4>
        </div>
        <span className={`px-2 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 ${getStatusColor(certification.status)}`}>
          {getStatusIcon(certification.status)}
          {certification.status}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-semibold text-gray-500">Issuer:</span>
          <span>{certification.issuer}</span>
        </div>

        {certification.issue_date && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-semibold text-gray-500">Issue Date:</span>
            <span>{formatDate(certification.issue_date)}</span>
          </div>
        )}

        {certification.expiry_date && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-semibold text-gray-500">Expiry:</span>
            <span>{formatDate(certification.expiry_date)}</span>
          </div>
        )}

        {certification.credential_id && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="font-semibold text-gray-500">Credential ID:</span>
            <span className="font-mono">{certification.credential_id}</span>
          </div>
        )}

        {certification.credential_url && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500">Credential:</span>
            <a 
              href={certification.credential_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#5B82C5] hover:underline"
            >
              View Certificate
            </a>
          </div>
        )}

        {certification.description && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-gray-600">{certification.description}</p>
          </div>
        )}

        {certification.status === 'Approved' && certification.approved_by && (
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-green-700">
            <CheckBadgeIcon className="w-4 h-4" />
            <span className="font-semibold">Approved by {certification.approved_by}</span>
            {certification.approved_date && (
              <span className="text-gray-500">
                on {formatDate(certification.approved_date)}
              </span>
            )}
          </div>
        )}

        {certification.status === 'Rejected' && certification.mentor_remark && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <XCircleIcon className="w-4 h-4" />
              <span className="font-semibold">Rejection Reason:</span>
            </div>
            <p className="text-gray-600 italic">{certification.mentor_remark}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(certification)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <PencilIcon className="w-3 h-3" />
            Edit
          </button>
        )}

        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(certification.id)}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <TrashIcon className="w-3 h-3" />
            Delete
          </button>
        )}

        {canApprove && certification.status === 'Pending' && onApprove && (
          <button
            onClick={() => onApprove(certification.id)}
            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ml-auto"
          >
            <CheckCircleIcon className="w-3 h-3" />
            Approve
          </button>
        )}

        {canReject && certification.status === 'Pending' && onReject && (
          <button
            onClick={() => onReject(certification.id)}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <XCircleIcon className="w-3 h-3" />
            Reject
          </button>
        )}
      </div>
    </div>
  );
};

export default CertificationCard;
