
import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { LoanApplication, ApplicationStatus } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";

export function useApplications(initialStatus?: ApplicationStatus) {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | undefined>(initialStatus);
  const { toast } = useToast();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getApplications(statusFilter);
      setApplications(data);
    } catch (err) {
      setError("Failed to load applications");
      toast({
        title: "Error",
        description: "There was a problem loading the applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  const getApplicationById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const app = await adminService.getApplicationById(id);
      setSelectedApp(app);
      return app;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load application details.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateStatus = useCallback(async (id: string, status: ApplicationStatus) => {
    try {
      const updated = await adminService.updateApplicationStatus(id, status);
      setApplications(prev => prev.map(app => app.id === id ? updated : app));
      
      if (selectedApp?.id === id) {
        setSelectedApp(updated);
      }
      
      toast({
        title: "Status Updated",
        description: `Application has been marked as ${status}.`
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive",
      });
      return false;
    }
  }, [selectedApp, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    selectedApp,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    fetchApplications,
    getApplicationById,
    updateStatus
  };
}