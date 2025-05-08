import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Phone } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { formatCurrency } from '@/utils/format';
import { LoanApplication, ApplicationStatus } from '@/types/application';

interface ApplicationDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    application: LoanApplication | null;
    onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<LoanApplication>;
    onAddCallLog: (id: string, notes: string) => Promise<LoanApplication>;
}

const ApplicationDetailsDialog: React.FC<ApplicationDetailsDialogProps> = ({
    open,
    onOpenChange,
    application,
    onUpdateStatus,
    onAddCallLog
}) => {
    const [callNote, setCallNote] = useState('');
    const [callNotesLoading, setCallNotesLoading] = useState(false);

    if (!application) return null;

    const handleAddCallLog = async () => {
        if (!callNote.trim()) return;

        setCallNotesLoading(true);
        try {
            await onAddCallLog(application._id, callNote);
            setCallNote('');
        } finally {
            setCallNotesLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                    <DialogDescription>
                        Review application {application._id}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ApplicationInfo application={application} />
                        <CustomerInfo application={application} />
                    </div>

                    <EligibilityCriteria application={application} />
                    <CallLogsList logs={application.call_tracking_logs} />

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Add Call Note</h4>
                        <div className="space-y-3">
                            <Textarea
                                placeholder="Enter notes from customer call..."
                                value={callNote}
                                onChange={(e) => setCallNote(e.target.value)}
                            />
                            <Button
                                onClick={handleAddCallLog}
                                disabled={callNotesLoading}
                                className="w-full"
                            >
                                {callNotesLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Phone className="mr-2 h-4 w-4" />
                                        Add Call Log
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    <StatusUpdateActions
                        application={application}
                        onUpdateStatus={onUpdateStatus}
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

interface ApplicationInfoProps {
    application: LoanApplication;
}

const ApplicationInfo: React.FC<ApplicationInfoProps> = ({ application }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Loan Details</h4>
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div>
                <span className="text-sm text-gray-500">Loan Name:</span>
                <p className="font-medium">{application.loan_product_id?.name || 'N/A'}</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Provider:</span>
                <p className="font-medium">{application.admin_id?.institute_name || 'N/A'}</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Amount:</span>
                <p className="font-medium">{formatCurrency(application.limit)}</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Interest Rate:</span>
                <p className="font-medium">{application.loan_product_id?.interest_rate || 'N/A'}%</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Tenure:</span>
                <p className="font-medium">
                    {application.tenure_months} {application.tenure_months === 1 ? 'month' : 'months'}
                </p>
            </div>
        </div>
    </div>
);

interface CustomerInfoProps {
    application: LoanApplication;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ application }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Information</h4>
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div>
                <span className="text-sm text-gray-500">Name:</span>
                <p className="font-medium">{application.user_id?.name || application.name || 'N/A'}</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Email:</span>
                <p className="font-medium">{application.user_id?.email || application.email || 'N/A'}</p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Current Status:</span>
                <p className="mt-1">
                    <StatusBadge status={application.application_status} />
                </p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Applied Date:</span>
                <p className="font-medium">
                    {new Date(application.createdAt).toLocaleDateString()}
                </p>
            </div>
            <div>
                <span className="text-sm text-gray-500">Last Updated:</span>
                <p className="font-medium">
                    {new Date(application.updatedAt).toLocaleDateString()}
                </p>
            </div>
        </div>
    </div>
);

interface EligibilityCriteriaProps {
    application: LoanApplication;
}

const EligibilityCriteria: React.FC<EligibilityCriteriaProps> = ({ application }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Eligibility Criteria Match</h4>
        <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-sm text-gray-500">Credit Score Match:</span>
                    <p className="font-medium">
                        {application.main_matched_rules?.credit_score_match ? 'Yes' : 'No'}
                    </p>
                </div>
                <div>
                    <span className="text-sm text-gray-500">Business Age Match:</span>
                    <p className="font-medium">
                        {application.main_matched_rules?.business_age_match ? 'Yes' : 'No'}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

interface CallLogsListProps {
    logs?: any[];
}

const CallLogsList: React.FC<CallLogsListProps> = ({ logs = [] }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Call Tracking Logs</h4>
        <div className="bg-gray-50 p-4 rounded-md">
            {logs && logs.length > 0 ? (
                <div className="space-y-3">
                    {logs.map((log, index) => (
                        <div key={index} className="border-l-2 border-blue-500 pl-3">
                            <div className="text-sm text-gray-500">
                                {new Date(log.date).toLocaleString()}
                            </div>
                            <p className="mt-1">{log.notes}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No call logs recorded yet</p>
            )}
        </div>
    </div>
);

interface StatusUpdateActionsProps {
    application: LoanApplication;
    onUpdateStatus: (id: string, status: ApplicationStatus) => Promise<LoanApplication>;
    onClose: () => void;
}

const StatusUpdateActions: React.FC<StatusUpdateActionsProps> = ({
    application,
    onUpdateStatus,
    onClose
}) => {
    const handleStatusUpdate = (newStatus: ApplicationStatus) => {
        onUpdateStatus(application._id, newStatus);
        onClose();
    };

    const { application_status } = application;

    return (
        <div className="pt-2 flex justify-end gap-2">
            {application_status === 'pending' && (
                <Button onClick={() => handleStatusUpdate('review')}>
                    Mark for Review
                </Button>
            )}

            {application_status === 'review' && (
                <>
                    <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate('rejected')}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                        Reject
                    </Button>
                    <Button
                        onClick={() => handleStatusUpdate('approved')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Approve
                    </Button>
                </>
            )}

            {application_status === 'approved' && (
                <Button
                    onClick={() => handleStatusUpdate('disbursed')}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Disburse Funds
                </Button>
            )}

            <Button variant="outline" onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

export default ApplicationDetailsDialog;