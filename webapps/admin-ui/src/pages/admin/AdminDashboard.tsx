import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, CreditCard, Clock, BarChart3 } from 'lucide-react';
import { SummaryCard } from '@/components/admin/ui/SummaryCard';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { useApplications } from '@/hooks/useApplications';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/utils/format';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { applications, loading: appLoading } = useApplications();
  const { analytics, loading: analyticsLoading } = useAnalytics();
  
  const recentApplications = applications.slice(0, 5);
  
  // Helper to format currency
  const formatIndianRupees = (value: number) => {
    return `₹${(value / 100000).toFixed(2)}L`;
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          title="Total Applications"
          value={analytics?.totalApplications || 0}
          change="+12.5%"
          trend="up"
          icon={<Users size={20} />}
          description="vs. last month"
        />
        <SummaryCard
          title="Disbursed Loans"
          value={analytics ? formatIndianRupees(analytics.averageLoanAmount * analytics.totalDisbursed) : '₹0'}
          change="+8.2%"
          trend="up"
          icon={<CreditCard size={20} />}
          description="vs. last month"
        />
          {/* <SummaryCard
            title="Avg. Processing Time"
            value={analytics ? `${analytics.averageProcessingTime} days` : 'N/A'}
            change="-1.5 days"
            trend="down"
          icon={<Clock size={20} />}
          description="vs. last month"
        /> */}
        <SummaryCard
          title="Avg. Loan Size"
          value={analytics ? formatIndianRupees(analytics.averageLoanAmount) : '₹0'}
          change="+5.1%"
          trend="up"
          icon={<BarChart3 size={20} />}
          description="vs. last month"
        />
      </div>
      
      {/* Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest loan applications from MSMEs</CardDescription>
          </CardHeader>
          <CardContent>
            {appLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse">Loading applications...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">Provider</th>
                      <th className="text-left py-3 px-2">Amount</th>
                      <th className="text-left py-3 px-2">Applied</th>
                      <th className="text-left py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">{app.id}</td>
                        <td className="py-3 px-2 font-medium">{app.provider}</td>
                        <td className="py-3 px-2">{formatCurrency(app.amount)}</td>
                        <td className="py-3 px-2 text-gray-500">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-2">
                          <StatusBadge status={app.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {applications.length > 5 && (
                  <div className="mt-4 text-right">
                    <Link 
                      to="/admin/applications" 
                      className="text-primary text-sm hover:underline"
                    >
                      View all applications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Performance Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Performance</CardTitle>
            <CardDescription>Conversion rates by product</CardDescription>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-pulse">Loading analytics...</div>
              </div>
            ) : analytics?.loanPerformance ? (
              <div className="space-y-4">
                {analytics.loanPerformance.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.loanType}</span>
                      <span className="text-gray-500">
                        {item.disbursementRate}% conversion
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${item.disbursementRate}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <span className="text-gray-500">No performance data available</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
