import { ApplicationStatus, LoanApplication, LoanOffer, BankAnalytics } from "./loan";

// Admin Dashboard summary card
export interface SummaryCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<any>;
  description: string;
}

// Admin Analytics data
export interface AdminAnalytics {
  totalApplications: number;
  totalDisbursed: number;
  averageLoanAmount: number;
  averageProcessingTime: number;
  monthlyApplications: {
    month: string;
    applied: number;
    approved: number;
    rejected: number;
    disbursed: number;
  }[];
  loanPerformance: {
    loanType: string;
    applications: number;
    approved: number;
    rejected: number;
    disbursementRate: number;
  }[];
}

// Admin Loan Criteria interface (extends the LoanOffer with admin-specific fields)
export interface AdminLoanCriteria extends LoanOffer {
  isActive: boolean;
  applicationsCount: number;
  conversionRate: number;
  lastModified: string;
}


