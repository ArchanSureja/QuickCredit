import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoanApplication, ApplicationStatus } from '@/types/application';

const useLoanApplications = () => {
    const [applications, setApplications] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
    const [showDetails, setShowDetails] = useState<boolean>(false);
    const { toast } = useToast();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Fetch all applications
    const fetchApplications = async (): Promise<void> => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/loan-applications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }

            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast({
                title: 'Error',
                description: 'Failed to load applications',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch single application details
    const fetchApplicationDetails = async (id: string): Promise<void> => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/loan-applications/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch application details');
            }

            const data = await response.json();
            setSelectedApp(data);
            setShowDetails(true);
        } catch (error) {
            console.error('Error fetching application details:', error);
            toast({
                title: 'Error',
                description: 'Failed to load application details',
                variant: 'destructive'
            });
        }
    };

    // Update application status
    const updateStatus = async (id: string, newStatus: ApplicationStatus): Promise<LoanApplication> => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/loan-applications/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedApp = await response.json();

            // Update application in state
            setApplications(applications.map(app =>
                app._id === id ? updatedApp : app
            ));

            if (selectedApp && selectedApp._id === id) {
                setSelectedApp(updatedApp);
            }

            toast({
                title: 'Status Updated',
                description: `Application status updated to ${newStatus}`,
            });

            return updatedApp;
        } catch (error) {
            console.error('Error updating status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update application status',
                variant: 'destructive'
            });
            throw error;
        }
    };

    // Add call log
    const addCallLog = async (id: string, notes: string): Promise<LoanApplication> => {
        if (!notes.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter call notes',
                variant: 'destructive'
            });
            throw new Error('Empty call notes');
        }

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/loan-applications/${id}/call-log`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notes })
            });

            if (!response.ok) {
                throw new Error('Failed to add call log');
            }

            const updatedApp = await response.json();

            // Update application in state
            setApplications(applications.map(app =>
                app._id === id ? updatedApp : app
            ));

            if (selectedApp && selectedApp._id === id) {
                setSelectedApp(updatedApp);
            }

            toast({
                title: 'Call Log Added',
                description: 'Call notes have been saved successfully',
            });

            return updatedApp;
        } catch (error) {
            console.error('Error adding call log:', error);
            toast({
                title: 'Error',
                description: 'Failed to add call notes',
                variant: 'destructive'
            });
            throw error;
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return {
        applications,
        loading,
        selectedApp,
        showDetails,
        setShowDetails,
        fetchApplications,
        fetchApplicationDetails,
        updateStatus,
        addCallLog,
    };
};

export default useLoanApplications;