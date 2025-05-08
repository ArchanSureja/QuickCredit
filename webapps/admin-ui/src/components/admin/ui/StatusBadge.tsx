import React from 'react';
import { ApplicationStatus } from '@/types/application';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'disbursed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

//  default StatusBadge;