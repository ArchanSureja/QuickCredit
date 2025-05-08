
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/analytics/StatCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CreditCard, TrendingUp, Wallet } from "lucide-react";
import { mockBankAnalytics } from "@/services/mockData";
import { bank_analytics, BankAnalytics, risk_data } from "@/types/loan";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [analytics, setAnalytics] = useState<bank_analytics| null>(null);
  const [risk_data, setRiskData] = useState<risk_data|null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setIsLoading(true);
      


      // step-1 fetch data from the mongodb 
      const bank_analytics_id = localStorage.getItem("bank_analytics_id")
      const bank_analytics_res = await fetch(
        `${import.meta.env.VITE_USER_SERVICE}/get-analytics/${bank_analytics_id}`
      )
      const bankAnalytics = await bank_analytics_res.json()
      // solution 
      console.log(bankAnalytics)
      await new Promise(resolve => setTimeout(resolve, 1000));
// Step 1: Get the current month number (0-indexed)
const currentDate = new Date();
const currentMonthNumber = currentDate.getMonth();

// Step 2: Define an array of month names in chronological order
const allMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Step 3: Sort the monthly_data array
const sortedMonthlyData = [...bankAnalytics.monthly_data].sort((a, b) => {
  const monthAIndex = allMonths.indexOf(a.month_name);
  const monthBIndex = allMonths.indexOf(b.month_name);

  // If month A is the current month, it should come last (return 1)
  if (monthAIndex === currentMonthNumber) {
    return 1;
  }
  // If month B is the current month, it should come last (return -1)
  if (monthBIndex === currentMonthNumber) {
    return -1;
  }
  // Otherwise, sort in chronological order
  return monthAIndex - monthBIndex;
});

// Step 4: Update the bankAnalytics object with the sorted data
const updatedBankAnalytics = { ...bankAnalytics, monthly_data: sortedMonthlyData };
console.log(updatedBankAnalytics);
      // step-2 fetch credit risk data from the mongodb 
      const user_id = localStorage.getItem("user_id")
      const risk_res = await fetch(
        `${import.meta.env.VITE_CREDIT_SERVICE}/get-risk-data/${user_id}`
      )
      const risk_data = await risk_res.json()
      console.log(risk_data)
      setRiskData(risk_data)
      setAnalytics(bankAnalytics);
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
            value={`₹${analytics.average_monthly_inflow.toLocaleString()}`} 
            icon={<TrendingUp className="h-5 w-5 text-finance-primary" />}
            // change={{ value: 5.2, isPositive: true }}
          />
          <StatCard 
            title="Average Monthly Outflow" 
            value={`₹${analytics.average_monthly_outflow.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5 text-finance-primary" />}
            // change={{ value: 3.1, isPositive: false }}
          />
          <StatCard 
            title="Cash Flow Stability" 
            value={`${analytics.cash_flow_stability.toLocaleString()}%`}
            icon={<BarChart3 className="h-5 w-5 text-finance-primary" />}
            // change={{ value: 2.5, isPositive: true }}
          />
          <StatCard 
            title="Credit Score" 
            value={risk_data.credit_score.toString()}
            // value={10}
            icon={<CreditCard className="h-5 w-5 text-finance-primary" />}
            // change={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="font-medium mb-4">Monthly Cash Flow</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="monthly_inflow" 
                    stroke="#0EA5E9" 
                    strokeWidth={2} 
                    name="Inflow"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="monthly_outflow" 
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
                <BarChart data={analytics.monthly_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Bar 
                    dataKey="monthly_balance" 
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
            title="Average Maintained Balance" 
            value={`₹${analytics.average_maintained_balance.toLocaleString()}`}
          />
          <StatCard 
            title="Total Debited Amount" 
            value={`₹${analytics.total_debit.toLocaleString()}`}
          />
          <StatCard 
            title="Total Credit Amount" 
            value={`₹${analytics.total_credit.toLocaleString()}`}
          />
          <StatCard 
            title="Balance Voltality" 
            value={`${(analytics.balance_voltality * 100).toLocaleString()} %`}
          />
          <StatCard 
            title="Cash transaction ratio" 
            value={`${(analytics.cash_tx_ratio * 100).toLocaleString()} %`}
          />
          <StatCard 
            title="Available Credit Limit" 
            value={`₹${risk_data.credit_limit.toLocaleString()}`}
            // value={`100000`}
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
