import React from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { formatCurrency } from '@/utils/format';
import { LoanApplication, ApplicationStatus } from '@/types/application';

interface ApplicationsTableProps {
  applications: LoanApplication[];
  loading: boolean;
  onViewDetails: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<LoanApplication>;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applications,
  loading,
  onViewDetails,
  onUpdateStatus
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Loading applications...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">ID</th>
            <th className="text-left py-3 px-4">Customer</th>
            <th className="text-left py-3 px-4">Loan Name</th>
            <th className="text-left py-3 px-4">Amount</th>
            <th className="text-left py-3 px-4">Tenure</th>
            <th className="text-left py-3 px-4">Applied Date</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">{app._id.substring(0, 8)}...</td>
              <td className="py-4 px-4">{app.user_id?.name || 'Unknown'}</td>
              <td className="py-4 px-4 font-medium">{app.loan_product_id?.name || 'Unknown'}</td>
              <td className="py-4 px-4">{formatCurrency(app.limit)}</td>
              <td className="py-4 px-4">
                {app.tenure_months} {app.tenure_months === 1 ? 'month' : 'months'}
              </td>
              <td className="py-4 px-4 text-gray-500">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={app.application_status} />
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(app._id)}
                  >
                    View
                  </Button>

                  <StatusActions
                    application={app}
                    onUpdateStatus={onUpdateStatus}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface StatusActionsProps {
  application: LoanApplication;
  onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<LoanApplication>;
}

// Status-specific action buttons component
const StatusActions: React.FC<StatusActionsProps> = ({ application, onUpdateStatus }) => {
  const { _id, application_status } = application;

  switch (application_status) {
    case 'pending':
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
          onClick={() => onUpdateStatus(_id, 'review')}
        >
          Review
        </Button>
      );

    case 'review':
      return (
        <>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
            onClick={() => onUpdateStatus(_id, 'approved')}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onUpdateStatus(_id, 'rejected')}
          >
            Reject
          </Button>
        </>
      );

    case 'approved':
      return (
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 border-green-200 hover:bg-green-50"
          onClick={() => onUpdateStatus(_id, 'disbursed')}
        >
          Disburse
        </Button>
      );

    default:
      return null;
  }
};

export default ApplicationsTable;
