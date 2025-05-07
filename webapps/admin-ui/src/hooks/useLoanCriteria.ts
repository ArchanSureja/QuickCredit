
import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { AdminLoanCriteria } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export function useLoanCriteria() {
  const [criteria, setCriteria] = useState<AdminLoanCriteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<AdminLoanCriteria | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCriteria = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getLoanCriteria();
      setCriteria(data);
    } catch (err) {
      setError("Failed to load loan criteria");
      toast({
        title: "Error",
        description: "There was a problem loading the loan criteria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getCriteriaById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const criteriaData = await adminService.getLoanCriteriaById(id);
      setSelectedCriteria(criteriaData);
      return criteriaData;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load criteria details.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveCriteria = useCallback(async (criteriaData: AdminLoanCriteria) => {
    try {
      setLoading(true);
      const savedCriteria = await adminService.updateLoanCriteria(criteriaData);
      
      setCriteria(prev => {
        const exists = prev.some(c => c.id === savedCriteria.id);
        if (exists) {
          return prev.map(c => c.id === savedCriteria.id ? savedCriteria : c);
        } else {
          return [...prev, savedCriteria];
        }
      });
      
      toast({
        title: "Success",
        description: criteriaData.id 
          ? "Loan criteria updated successfully." 
          : "New loan criteria created successfully."
      });
      
      return savedCriteria;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save loan criteria.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      const updated = await adminService.toggleLoanCriteriaStatus(id, isActive);
      setCriteria(prev => prev.map(c => c.id === id ? updated : c));
      
      if (selectedCriteria?.id === id) {
        setSelectedCriteria(updated);
      }
      
      toast({
        title: "Status Updated",
        description: `Loan criteria is now ${isActive ? 'active' : 'inactive'}.`
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Failed to update criteria status.",
        variant: "destructive",
      });
      return false;
    }
  }, [selectedCriteria, toast]);

  useEffect(() => {
    fetchCriteria();
  }, [fetchCriteria]);

  return {
    criteria,
    selectedCriteria,
    loading,
    error,
    fetchCriteria,
    getCriteriaById,
    saveCriteria,
    toggleStatus
  };
}