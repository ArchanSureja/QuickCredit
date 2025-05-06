
export interface LoanOffer {
  id: string;
  name: string;
  provider: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minTenure: number;
  maxTenure: number;
  tenureUnit: "months" | "years";
  processingFee: string;
  prepaymentPenalty: string;
  disbursementTime: string;
  repaymentFrequency: string;
  repaymentMethod: string;
  requiredDocuments: string[];
  eligibilityCriteria: string[];
}

export type ApplicationStatus = "applied" | "review" | "rejected" | "disbursed";

export interface LoanApplication {
  id: string;
  loanId: string;
  loanName: string;
  provider: string;
  amount: number;
  tenure: number;
  tenureUnit: "months" | "years";
  interestRate: number;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
}

export interface BankAnalytics {
  averageMonthlyInflow: number;
  averageMonthlyOutflow: number;
  cashFlowStability: number;
  minMaintainedBalance: number;
  maxDebitAmount: number;
  maxCreditAmount: number;
  upiTransactionsCount: number;
  loanRepayments: number;
  creditScore: number;
  creditLimit: number;
  monthlyData: {
    month: string;
    inflow: number;
    outflow: number;
    balance: number;
  }[];
}
