export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface LoanProduct {
  _id: string;
  name: string;
  interest_rate: number;
}

export interface Admin {
  _id: string;
  institute_name: string;
}

export interface MatchedRules {
  credit_score_match: boolean;
  business_age_match: boolean;
}

export interface CallLog {
  date: string;
  notes: string;
}

export type ApplicationStatus =
  | "pending"
  | "review"
  | "approved"
  | "disbursed"
  | "rejected";

export interface LoanApplication {
  _id: string;
  user_id: User;
  loan_product_id: LoanProduct;
  admin_id: Admin;
  limit: number;
  tenure_months: number;
  application_status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  main_matched_rules?: MatchedRules;
  call_tracking_logs?: CallLog[];
}
