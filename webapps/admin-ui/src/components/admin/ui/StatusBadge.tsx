import React from 'react';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types/loan';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  
  const statusClasses = {
    applied: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
    disbursed: "bg-green-100 text-green-800"
  };
  
  const displayText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={cn(baseClasses, statusClasses[status], className)}>
      {displayText}
    </span>
  );
};
