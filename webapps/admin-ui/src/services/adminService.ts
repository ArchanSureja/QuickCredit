import { LoanApplication, ApplicationStatus, LoanOffer, BankAnalytics } from "@/types/loan";
import { AdminLoanCriteria, AdminAnalytics } from "@/types/admin";

// Mock loan applications
const mockLoanApplications: LoanApplication[] = [
  {
    id: "APP-001",
    loanId: "LOAN-001",
    loanName: "Business Growth Loan",
    provider: "HDFC Bank",
    amount: 500000,
    tenure: 24,
    tenureUnit: "months",
    interestRate: 12.5,
    status: "applied",
    appliedDate: "2023-05-10T10:30:00Z",
    lastUpdated: "2023-05-10T10:30:00Z"
  },
  {
    id: "APP-002",
    loanId: "LOAN-002",
    loanName: "Working Capital Loan",
    provider: "ICICI Bank",
    amount: 300000,
    tenure: 12,
    tenureUnit: "months",
    interestRate: 11.0,
    status: "review",
    appliedDate: "2023-05-08T14:15:00Z",
    lastUpdated: "2023-05-09T11:20:00Z"
  },
  {
    id: "APP-003",
    loanId: "LOAN-003",
    loanName: "Equipment Financing",
    provider: "Axis Bank",
    amount: 750000,
    tenure: 36,
    tenureUnit: "months",
    interestRate: 13.5,
    status: "disbursed",
    appliedDate: "2023-04-25T09:45:00Z",
    lastUpdated: "2023-05-05T16:30:00Z"
  },
  {
    id: "APP-004",
    loanId: "LOAN-001",
    loanName: "Business Growth Loan",
    provider: "HDFC Bank",
    amount: 1000000,
    tenure: 48,
    tenureUnit: "months",
    interestRate: 12.5,
    status: "rejected",
    appliedDate: "2023-04-20T11:00:00Z",
    lastUpdated: "2023-04-28T15:45:00Z"
  },
  {
    id: "APP-005",
    loanId: "LOAN-004",
    loanName: "Micro Enterprise Loan",
    provider: "SBI",
    amount: 200000,
    tenure: 18,
    tenureUnit: "months",
    interestRate: 10.5,
    status: "disbursed",
    appliedDate: "2023-04-15T13:20:00Z",
    lastUpdated: "2023-04-30T10:10:00Z"
  },
  {
    id: "APP-006",
    loanId: "LOAN-002",
    loanName: "Working Capital Loan",
    provider: "ICICI Bank",
    amount: 450000,
    tenure: 24,
    tenureUnit: "months",
    interestRate: 11.0,
    status: "review",
    appliedDate: "2023-05-12T09:30:00Z",
    lastUpdated: "2023-05-12T14:30:00Z"
  }
];

// Mock loan offers with admin criteria
const mockLoanCriteria: AdminLoanCriteria[] = [
  {
    id: "LOAN-001",
    name: "Business Growth Loan",
    provider: "HDFC Bank",
    minAmount: 200000,
    maxAmount: 2000000,
    interestRate: 12.5,
    minTenure: 12,
    maxTenure: 60,
    tenureUnit: "months",
    processingFee: "1.5% of loan amount",
    prepaymentPenalty: "2% of outstanding amount",
    disbursementTime: "5-7 working days",
    repaymentFrequency: "Monthly",
    repaymentMethod: "Auto debit from bank account",
    requiredDocuments: [
      "PAN Card", 
      "Aadhaar Card", 
      "Business registration proof", 
      "6 months bank statement", 
      "GST returns for last 1 year"
    ],
    eligibilityCriteria: [
      "Business age > 2 years",
      "Annual turnover > ₹25 lakhs",
      "Minimum credit score of 700"
    ],
    isActive: true,
    applicationsCount: 15,
    conversionRate: 72,
    lastModified: "2023-04-10T14:30:00Z"
  },
  {
    id: "LOAN-002",
    name: "Working Capital Loan",
    provider: "ICICI Bank",
    minAmount: 100000,
    maxAmount: 1000000,
    interestRate: 11.0,
    minTenure: 6,
    maxTenure: 36,
    tenureUnit: "months",
    processingFee: "1% of loan amount",
    prepaymentPenalty: "None",
    disbursementTime: "3-5 working days",
    repaymentFrequency: "Monthly",
    repaymentMethod: "Auto debit from bank account",
    requiredDocuments: [
      "PAN Card", 
      "Aadhaar Card", 
      "Business registration proof", 
      "3 months bank statement", 
      "Latest ITR"
    ],
    eligibilityCriteria: [
      "Business age > 1 year",
      "Minimum credit score of 650"
    ],
    isActive: true,
    applicationsCount: 28,
    conversionRate: 68,
    lastModified: "2023-04-15T11:20:00Z"
  },
  {
    id: "LOAN-003",
    name: "Equipment Financing",
    provider: "Axis Bank",
    minAmount: 500000,
    maxAmount: 5000000,
    interestRate: 13.5,
    minTenure: 12,
    maxTenure: 60,
    tenureUnit: "months",
    processingFee: "2% of loan amount",
    prepaymentPenalty: "3% of outstanding amount",
    disbursementTime: "7-10 working days",
    repaymentFrequency: "Monthly",
    repaymentMethod: "Auto debit from bank account",
    requiredDocuments: [
      "PAN Card", 
      "Aadhaar Card", 
      "Business registration proof", 
      "Equipment quotation", 
      "Last 2 years financial statements"
    ],
    eligibilityCriteria: [
      "Business age > 3 years",
      "Annual turnover > ₹50 lakhs",
      "Minimum credit score of 720"
    ],
    isActive: true,
    applicationsCount: 10,
    conversionRate: 60,
    lastModified: "2023-03-20T09:45:00Z"
  },
  {
    id: "LOAN-004",
    name: "Micro Enterprise Loan",
    provider: "SBI",
    minAmount: 50000,
    maxAmount: 500000,
    interestRate: 10.5,
    minTenure: 6,
    maxTenure: 36,
    tenureUnit: "months",
    processingFee: "1% of loan amount",
    prepaymentPenalty: "None",
    disbursementTime: "3-5 working days",
    repaymentFrequency: "Monthly",
    repaymentMethod: "Auto debit from bank account",
    requiredDocuments: [
      "PAN Card", 
      "Aadhaar Card", 
      "Proof of business existence", 
      "3 months bank statement"
    ],
    eligibilityCriteria: [
      "Business age > 6 months",
      "Minimum credit score of 630"
    ],
    isActive: false,
    applicationsCount: 8,
    conversionRate: 75,
    lastModified: "2023-04-05T16:10:00Z"
  }
];

// Mock analytics data
const mockAnalyticsData: AdminAnalytics = {
  totalApplications: 61,
  totalDisbursed: 42,
  averageLoanAmount: 425000,
  averageProcessingTime: 5.2, // days
  monthlyApplications: [
    { month: "Jan", applied: 8, approved: 6, rejected: 1, disbursed: 5 },
    { month: "Feb", applied: 10, approved: 7, rejected: 2, disbursed: 6 },
    { month: "Mar", applied: 12, approved: 9, rejected: 2, disbursed: 8 },
    { month: "Apr", applied: 15, approved: 11, rejected: 3, disbursed: 10 },
    { month: "May", applied: 16, approved: 12, rejected: 2, disbursed: 11 }
  ],
  loanPerformance: [
    {
      loanType: "Business Growth Loan",
      applications: 15,
      approved: 12,
      rejected: 3,
      disbursementRate: 80
    },
    {
      loanType: "Working Capital Loan",
      applications: 28,
      approved: 22,
      rejected: 6,
      disbursementRate: 78
    },
    {
      loanType: "Equipment Financing",
      applications: 10,
      approved: 7,
      rejected: 3,
      disbursementRate: 70
    },
    {
      loanType: "Micro Enterprise Loan",
      applications: 8,
      approved: 6,
      rejected: 2,
      disbursementRate: 75
    }
  ]
};

// Mock bank analytics for a specific application
const mockBankAnalytics: BankAnalytics = {
  averageMonthlyInflow: 580000,
  averageMonthlyOutflow: 490000,
  cashFlowStability: 78, // percentage
  minMaintainedBalance: 120000,
  maxDebitAmount: 450000,
  maxCreditAmount: 750000,
  upiTransactionsCount: 45,
  loanRepayments: 25000,
  creditScore: 720,
  creditLimit: 1200000,
  monthlyData: [
    { month: "Jan", inflow: 550000, outflow: 470000, balance: 140000 },
    { month: "Feb", inflow: 570000, outflow: 480000, balance: 130000 },
    { month: "Mar", inflow: 590000, outflow: 510000, balance: 120000 },
    { month: "Apr", inflow: 600000, outflow: 490000, balance: 145000 },
    { month: "May", inflow: 590000, outflow: 500000, balance: 155000 }
  ]
};

// Admin service
export const adminService = {
  // Applications methods
  getApplications: (status?: ApplicationStatus): Promise<LoanApplication[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...mockLoanApplications];
        if (status) {
          result = result.filter(app => app.status === status);
        }
        resolve(result);
      }, 500);
    });
  },
  
  getApplicationById: (id: string): Promise<LoanApplication | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = mockLoanApplications.find(app => app.id === id) || null;
        resolve(app);
      }, 300);
    });
  },
  
  updateApplicationStatus: (id: string, status: ApplicationStatus): Promise<LoanApplication> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const appIndex = mockLoanApplications.findIndex(app => app.id === id);
        if (appIndex === -1) {
          reject(new Error("Application not found"));
        } else {
          mockLoanApplications[appIndex] = {
            ...mockLoanApplications[appIndex],
            status,
            lastUpdated: new Date().toISOString()
          };
          resolve(mockLoanApplications[appIndex]);
        }
      }, 500);
    });
  },
  
  // Loan criteria methods
  getLoanCriteria: (): Promise<AdminLoanCriteria[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockLoanCriteria]);
      }, 500);
    });
  },
  
  getLoanCriteriaById: (id: string): Promise<AdminLoanCriteria | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const criteria = mockLoanCriteria.find(c => c.id === id) || null;
        resolve(criteria);
      }, 300);
    });
  },
  
  updateLoanCriteria: (criteria: AdminLoanCriteria): Promise<AdminLoanCriteria> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const criteriaIndex = mockLoanCriteria.findIndex(c => c.id === criteria.id);
        
        if (criteriaIndex === -1) {
          // Add new criteria
          const newCriteria: AdminLoanCriteria = {
            ...criteria,
            id: `LOAN-${(mockLoanCriteria.length + 1).toString().padStart(3, '0')}`,
            applicationsCount: 0,
            conversionRate: 0,
            lastModified: new Date().toISOString()
          };
          mockLoanCriteria.push(newCriteria);
          resolve(newCriteria);
        } else {
          // Update existing criteria
          mockLoanCriteria[criteriaIndex] = {
            ...criteria,
            lastModified: new Date().toISOString()
          };
          resolve(mockLoanCriteria[criteriaIndex]);
        }
      }, 500);
    });
  },
  
  toggleLoanCriteriaStatus: (id: string, isActive: boolean): Promise<AdminLoanCriteria> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const criteriaIndex = mockLoanCriteria.findIndex(c => c.id === id);
        if (criteriaIndex === -1) {
          reject(new Error("Loan criteria not found"));
        } else {
          mockLoanCriteria[criteriaIndex] = {
            ...mockLoanCriteria[criteriaIndex],
            isActive,
            lastModified: new Date().toISOString()
          };
          resolve(mockLoanCriteria[criteriaIndex]);
        }
      }, 300);
    });
  },
  
  // Analytics methods
  getAnalytics: (): Promise<AdminAnalytics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({...mockAnalyticsData});
      }, 700);
    });
  },
  
  getBankAnalytics: (applicationId: string): Promise<BankAnalytics> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({...mockBankAnalytics});
      }, 500);
    });
  }
};
