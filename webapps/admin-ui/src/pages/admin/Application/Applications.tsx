import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import ApplicationsTable from './ApplicationsTable';
import ApplicationFilters from './ApplicationFilters';
import ApplicationDetailsDialog from "./ApplicationDetailsDialog";
import useLoanApplications from '@/hooks/useLoanApplications';
import { LoanApplication } from '@/types/application';

const Applications: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const {
        applications,
        loading,
        selectedApp,
        showDetails,
        setShowDetails,
        fetchApplicationDetails,
        updateStatus,
        addCallLog,
    } = useLoanApplications();

    // Filter applications based on search term and status
    const filteredApplications = applications.filter((app: LoanApplication) => {
        const matchesSearch =
            (app._id && app._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.user_id?.name && app.user_id.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (app.loan_product_id?.name && app.loan_product_id.name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>

            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        <div>
                            <CardTitle>All Applications</CardTitle>
                            <CardDescription>Manage and review loan applications</CardDescription>
                        </div>

                        <ApplicationFilters
                            searchTerm={searchTerm}
                            statusFilter={statusFilter}
                            onSearchChange={setSearchTerm}
                            onStatusChange={setStatusFilter}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <ApplicationsTable
                        applications={filteredApplications}
                        loading={loading}
                        onViewDetails={fetchApplicationDetails}
                        onUpdateStatus={updateStatus}
                    />
                </CardContent>
            </Card>

            <ApplicationDetailsDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                application={selectedApp}
                onUpdateStatus={updateStatus}
                onAddCallLog={addCallLog}
            />
        </div>
    );
};

export default Applications;