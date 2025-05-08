export interface LenderParamsAndProduct {
    _id: string;
    admin_id: string;
    loan_product_id: string;
    Business_age: number;
    is_GST: boolean;
    min_maintained_balance: number;
    max_outflow_ratio: number;
    min_monthly_inflow: number;
    min_recommended_limit: number;
    max_recommended_limit: number;
    mix_category: 'retail' | 'wholesale' | 'manufacturing' | 'service' | 'mixed';
    min_credit_score: number;
    max_credit_score: number;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
  }