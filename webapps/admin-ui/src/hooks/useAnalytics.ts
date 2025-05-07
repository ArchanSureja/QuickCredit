import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/adminService";
import { AdminAnalytics } from "@/types/admin";
import { BankAnalytics } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [bankAnalytics, setBankAnalytics] = useState<BankAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics data");
      toast({
        title: "Error",
        description: "There was a problem loading analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchBankAnalytics = useCallback(async (applicationId: string) => {
    try {
      setLoading(true);
      const data = await adminService.getBankAnalytics(applicationId);
      setBankAnalytics(data);
      return data;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load bank analytics.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    bankAnalytics,
    loading,
    error,
    fetchAnalytics,
    fetchBankAnalytics
  };
}
