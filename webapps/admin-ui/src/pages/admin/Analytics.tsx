
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign,
  Users
} from 'lucide-react';
import { SummaryCard } from '@/components/admin/ui/SummaryCard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/utils/format';

// Recharts import for visualization
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

const Analytics = () => {
  const { analytics, loading } = useAnalytics();
  
  // Helper to format currency in lakhs
  const formatInLakhs = (value: number) => {
    return `₹${(value / 100000).toFixed(2)}L`;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Loading analytics data...</div>
        </div>
      ) : !analytics ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No analytics data available</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <SummaryCard
              title="Total Applications"
              value={analytics.totalApplications}
              change="+12.5%"
              trend="up"
              icon={<Users size={20} />}
              description="vs. last month"
            />
            <SummaryCard
              title="Average Loan Size"
              value={formatInLakhs(analytics.averageLoanAmount)}
              change="+5.1%"
              trend="up"
              icon={<DollarSign size={20} />}
              description="vs. last month"
            />
            <SummaryCard
              title="Total Disbursed"
              value={analytics.totalDisbursed}
              change="+8.2%"
              trend="up"
              icon={<TrendingUp size={20} />}
              description="vs. last month"
            />
            {/* <SummaryCard
              title="Avg. Processing Time"
              value={`${analytics.averageProcessingTime} days`}
              change="-1.5 days"
              trend="down"
              icon={<Clock size={20} />}
              description="vs. last month"
            /> */}
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Application Trends</CardTitle>
                <CardDescription>Applications, approvals and rejections</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyApplications}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                    <Bar dataKey="applied" name="Applications" fill="#9b87f5" />
                    <Bar dataKey="approved" name="Approved" fill="#6E59A5" />
                    <Bar dataKey="rejected" name="Rejected" fill="#f97171" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Loan Product Performance</CardTitle>
                <CardDescription>Applications and disbursement rates</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={analytics.loanPerformance}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="loanType" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                    <Legend />
                    <Bar dataKey="applications" name="Applications" fill="#9b87f5" />
                    <Bar dataKey="approved" name="Approved" fill="#6E59A5" />
                    <Bar dataKey="rejected" name="Rejected" fill="#f97171" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Conversion Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Disbursement Rates</CardTitle>
              <CardDescription>Percentage of approved loans by product</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={analytics.loanPerformance}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="loanType" angle={-45} textAnchor="end" height={60} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="disbursementRate" 
                    name="Disbursement Rate" 
                    stroke="#6E59A5" 
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Analytics;