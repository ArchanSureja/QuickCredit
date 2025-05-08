
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

export type ApplicationStatus = "applied" | "review" | "rejected" | "disbursed" | "pending";

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

export interface bank_analytics {
   total_credit : number;
   total_debit : number;
   debit_to_credit_ratio : number;
   average_tx_amount : number;
   monthly_data : {
    month_name : string;
    monthly_inflow : number;
    monthly_outflow : number;
    monthly_balance : number;
   }[];
   average_monthly_inflow : number;
   average_monthly_outflow : number;
   average_monthly_cashflow : number;
   cash_flow_stability : number;
   minmum_maintained_balance : number;
   average_maintained_balance : number;
   balance_voltality : number;
   cash_tx_ratio : number;

}

export interface risk_data {
  credit_score : number;
  credit_limit : number;
  risk_category : string;
}

export interface Profile {
  address: string;
  ckycCompliance: string;
  dob: string;
  email: string;
  mobile: string;
  name: string;
  nominee: string;
  pan: string;
}