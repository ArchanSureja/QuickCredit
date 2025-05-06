
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/analytics/StatCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CreditCard, TrendingUp, Wallet } from "lucide-react";
import { mockBankAnalytics } from "@/services/mockData";
import { BankAnalytics } from "@/types/loan";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState<BankAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalytics(mockBankAnalytics);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  const handleViewOffers = () => {
    navigate("/offers");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-t-transparent border-finance-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your financial analytics...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!analytics) {
    return (
      <MainLayout>
        <div className="text-center py-10">
          <p className="text-gray-600">No data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Analytics</h1>
            <p className="text-muted-foreground">
              Insights from your banking data to help you access credit
            </p>
          </div>
          <Button onClick={handleViewOffers} className="self-start">
            View Loan Offers <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Average Monthly Inflow" 
            value={`₹${analytics.averageMonthlyInflow.toLocaleString()}`} 
            icon={<TrendingUp className="h-5 w-5 text-finance-primary" />}
            change={{ value: 5.2, isPositive: true }}
          />
          <StatCard 
            title="Average Monthly Outflow" 
            value={`₹${analytics.averageMonthlyOutflow.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5 text-finance-primary" />}
            change={{ value: 3.1, isPositive: false }}
          />
          <StatCard 
            title="Cash Flow Stability" 
            value={`${analytics.cashFlowStability}%`}
            icon={<BarChart3 className="h-5 w-5 text-finance-primary" />}
            change={{ value: 2.5, isPositive: true }}
          />
          <StatCard 
            title="Credit Score" 
            value={analytics.creditScore.toString()}
            icon={<CreditCard className="h-5 w-5 text-finance-primary" />}
            change={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium mb-4">Monthly Cash Flow</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="inflow" 
                    stroke="#0EA5E9" 
                    strokeWidth={2} 
                    name="Inflow"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="outflow" 
                    stroke="#DC2626" 
                    strokeWidth={2} 
                    name="Outflow"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium mb-4">Monthly Balance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Bar 
                    dataKey="balance" 
                    fill="#0369A1" 
                    name="Balance"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Min. Maintained Balance" 
            value={`₹${analytics.minMaintainedBalance.toLocaleString()}`}
          />
          <StatCard 
            title="Max Debit Amount" 
            value={`₹${analytics.maxDebitAmount.toLocaleString()}`}
          />
          <StatCard 
            title="Max Credit Amount" 
            value={`₹${analytics.maxCreditAmount.toLocaleString()}`}
          />
          <StatCard 
            title="UPI Transactions" 
            value={analytics.upiTransactionsCount}
          />
          <StatCard 
            title="Monthly Loan Repayments" 
            value={`₹${analytics.loanRepayments.toLocaleString()}`}
          />
          <StatCard 
            title="Available Credit Limit" 
            value={`₹${analytics.creditLimit.toLocaleString()}`}
            className="border-2 border-finance-primary/20"
          />
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Based on your financial profile, you are eligible for credit offers
          </p>
          <Button onClick={handleViewOffers}>
            View Matched Offers <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
