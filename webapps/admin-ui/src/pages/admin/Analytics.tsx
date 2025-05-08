// import React, { useEffect, useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from '@/components/ui/card';
// import {
//   BarChart3,
//   TrendingUp,
//   Clock,
//   DollarSign,
//   Users
// } from 'lucide-react';
// import { SummaryCard } from '@/components/admin/ui/SummaryCard';
// import { formatCurrency } from '@/utils/format';
// import useLoanApplications from '@/hooks/useLoanApplications';

// // Recharts import for visualization
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line
// } from 'recharts';

// const useAnalytics = () => {
//   const [analytics, setAnalytics] = useState<Analytics | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const { applications } = useLoanApplications();

//   useEffect(() => {
//     if (applications.length > 0) {
//       const totalApplications = applications.length;
//       const totalApproved = applications.filter(app => app.application_status === 'approved').length;
//       const totalDisbursed = applications.filter(app => app.application_status === 'disbursed').length;
//       const totalRejected = applications.filter(app => app.application_status === 'rejected').length;
//       const totalPending = applications.filter(app => app.application_status === 'pending').length;
//       const totalInReview = applications.filter(app => app.application_status === 'review').length;

//       // Calculate average loan amount
//       const totalLoanAmount = applications.reduce((sum, app) => sum + app.limit, 0);
//       const averageLoanAmount = totalLoanAmount / totalApplications;

//       // Group by month for trends
//       const monthlyData = {};
//       applications.forEach(app => {
//         const month = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
//         if (!monthlyData[month]) {
//           monthlyData[month] = {
//             applied: 0,
//             approved: 0,
//             rejected: 0,
//             disbursed: 0
//           };
//         }
//         monthlyData[month].applied += 1;
//         if (app.application_status === 'approved') monthlyData[month].approved += 1;
//         if (app.application_status === 'rejected') monthlyData[month].rejected += 1;
//         if (app.application_status === 'disbursed') monthlyData[month].disbursed += 1;
//       });

//       const monthlyApplications = Object.keys(monthlyData).map(month => ({
//         month,
//         ...monthlyData[month]
//       })).sort((a, b) => new Date(a.month) - new Date(b.month));

//       // Group by loan product for performance
//       const loanProducts = {};
//       applications.forEach(app => {
//         const productName = app.loan_product_id?.name || 'Unknown';
//         if (!loanProducts[productName]) {
//           loanProducts[productName] = {
//             applications: 0,
//             approved: 0,
//             rejected: 0,
//             disbursed: 0
//           };
//         }
//         loanProducts[productName].applications += 1;
//         if (app.application_status === 'approved') loanProducts[productName].approved += 1;
//         if (app.application_status === 'rejected') loanProducts[productName].rejected += 1;
//         if (app.application_status === 'disbursed') loanProducts[productName].disbursed += 1;
//       });

//       const loanPerformance = Object.keys(loanProducts).map(loanType => {
//         const productData = loanProducts[loanType];
//         const disbursementRate = Math.round((productData.disbursed / productData.applications) * 100);
//         return {
//           loanType,
//           disbursementRate,
//           ...productData
//         };
//       });

//       setAnalytics({
//         totalApplications,
//         totalApproved,
//         totalDisbursed,
//         totalRejected,
//         totalPending,
//         totalInReview,
//         averageLoanAmount,
//         monthlyApplications,
//         loanPerformance
//       });

//       setLoading(false);
//     }
//   }, [applications]);

//   return { analytics, loading };
// };

// const Analytics = () => {
//   const { analytics, loading } = useAnalytics();

//   // Helper to format currency in lakhs
//   const formatInLakhs = (value: number) => {
//     return `₹${(value / 100000).toFixed(2)}L`;
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

//       {loading ? (
//         <div className="flex justify-center py-12">
//           <div className="animate-pulse">Loading analytics data...</div>
//         </div>
//       ) : !analytics ? (
//         <div className="text-center py-16">
//           <p className="text-gray-500">No analytics data available</p>
//         </div>
//       ) : (
//         <>
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             <SummaryCard
//               title="Total Applications"
//               value={analytics.totalApplications}
//               change="+12.5%"
//               trend="up"
//               icon={<Users size={20} />}
//               description="vs. last month"
//             />
//             <SummaryCard
//               title="Disbursed Loans"
//               value={formatInLakhs(analytics.averageLoanAmount * analytics.totalDisbursed)}
//               change="+8.2%"
//               trend="up"
//               icon={<TrendingUp size={20} />}
//               description="vs. last month"
//             />
//             <SummaryCard
//               title="Avg. Loan Size"
//               value={formatInLakhs(analytics.averageLoanAmount)}
//               change="+5.1%"
//               trend="up"
//               icon={<DollarSign size={20} />}
//               description="vs. last month"
//             />
//             <SummaryCard
//               title="Approval Rate"
//               value={`${Math.round((analytics.totalApproved / analytics.totalApplications) * 100)}%`}
//               change="+3.2%"
//               trend="up"
//               icon={<BarChart3 size={20} />}
//               description="vs. last month"
//             />
//           </div>

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//             <Card className="col-span-1">
//               <CardHeader>
//                 <CardTitle>Monthly Application Trends</CardTitle>
//                 <CardDescription>Applications, approvals and disbursements</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={analytics.monthlyApplications}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="applied" name="Applications" fill="#8884d8" />
//                     <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
//                     <Bar dataKey="disbursed" name="Disbursed" fill="#ffc658" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>

//             <Card className="col-span-1">
//               <CardHeader>
//                 <CardTitle>Loan Product Performance</CardTitle>
//                 <CardDescription>Applications by product type</CardDescription>
//               </CardHeader>
//               <CardContent className="h-80">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={analytics.loanPerformance}
//                     layout="vertical"
//                     margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis dataKey="loanType" type="category" width={100} />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="applications" name="Applications" fill="#8884d8" />
//                     <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
//                     <Bar dataKey="disbursed" name="Disbursed" fill="#ffc658" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Conversion Rate Chart */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Disbursement Rates</CardTitle>
//               <CardDescription>Percentage of applications disbursed by product</CardDescription>
//             </CardHeader>
//             <CardContent className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart
//                   data={analytics.loanPerformance}
//                   margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="loanType" angle={-45} textAnchor="end" height={60} />
//                   <YAxis domain={[0, 100]} />
//                   <Tooltip formatter={(value) => [`${value}%`, 'Disbursement Rate']} />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="disbursementRate"
//                     name="Disbursement Rate"
//                     stroke="#8884d8"
//                     strokeWidth={2}
//                     dot={{ r: 6 }}
//                     activeDot={{ r: 8 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default Analytics;

import React, { useEffect, useState } from 'react';
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
  Users,
  AlertCircle
} from 'lucide-react';
import { SummaryCard } from '@/components/admin/ui/SummaryCard';
import { formatCurrency } from '@/utils/format';
import useLoanApplications from '@/hooks/useLoanApplications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

interface Analytics {
  totalApplications: number;
  totalApproved: number;
  totalDisbursed: number;
  totalRejected: number;
  totalPending: number;
  totalInReview: number;
  averageLoanAmount: number;
  monthlyApplications: {
    month: string;
    applied: number;
    approved: number;
    rejected: number;
    disbursed: number;
  }[];
  loanPerformance: {
    loanType: string;
    disbursementRate: number;
    applications: number;
    approved: number;
    rejected: number;
    disbursed: number;
  }[];
}

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { applications, loading: appsLoading } = useLoanApplications();

  useEffect(() => {
    if (appsLoading) return;

    try {
      if (applications.length === 0) {
        setAnalytics(null);
        setError('No loan applications found');
        setLoading(false);
        return;
      }

      const totalApplications = applications.length;
      const totalApproved = applications.filter(app => app.application_status === 'approved').length;
      const totalDisbursed = applications.filter(app => app.application_status === 'disbursed').length;
      const totalRejected = applications.filter(app => app.application_status === 'rejected').length;
      const totalPending = applications.filter(app => app.application_status === 'pending').length;
      const totalInReview = applications.filter(app => app.application_status === 'review').length;

      // Calculate average loan amount
      const totalLoanAmount = applications.reduce((sum, app) => sum + (app.limit || 0), 0);
      const averageLoanAmount = totalApplications > 0 ? totalLoanAmount / totalApplications : 0;

      // Group by month for trends
      const monthlyData: Record<string, {
        applied: number;
        approved: number;
        rejected: number;
        disbursed: number;
      }> = {};

      applications.forEach(app => {
        const month = new Date(app.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) {
          monthlyData[month] = {
            applied: 0,
            approved: 0,
            rejected: 0,
            disbursed: 0
          };
        }
        monthlyData[month].applied += 1;
        if (app.application_status === 'approved') monthlyData[month].approved += 1;
        if (app.application_status === 'rejected') monthlyData[month].rejected += 1;
        if (app.application_status === 'disbursed') monthlyData[month].disbursed += 1;
      });

      const monthlyApplications = Object.keys(monthlyData)
        .map(month => ({
          month,
          ...monthlyData[month]
        }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Group by loan product for performance
      const loanProducts: Record<string, {
        applications: number;
        approved: number;
        rejected: number;
        disbursed: number;
      }> = {};

      applications.forEach(app => {
        const productName = app.loan_product_id?.name || 'Unknown';
        if (!loanProducts[productName]) {
          loanProducts[productName] = {
            applications: 0,
            approved: 0,
            rejected: 0,
            disbursed: 0
          };
        }
        loanProducts[productName].applications += 1;
        if (app.application_status === 'approved') loanProducts[productName].approved += 1;
        if (app.application_status === 'rejected') loanProducts[productName].rejected += 1;
        if (app.application_status === 'disbursed') loanProducts[productName].disbursed += 1;
      });

      const loanPerformance = Object.keys(loanProducts).map(loanType => {
        const productData = loanProducts[loanType];
        const disbursementRate = productData.applications > 0
          ? Math.round((productData.disbursed / productData.applications) * 100)
          : 0;
        return {
          loanType,
          disbursementRate,
          ...productData
        };
      });

      setAnalytics({
        totalApplications,
        totalApproved,
        totalDisbursed,
        totalRejected,
        totalPending,
        totalInReview,
        averageLoanAmount,
        monthlyApplications,
        loanPerformance
      });
      setError(null);
    } catch (err) {
      console.error('Error calculating analytics:', err);
      setError('Failed to generate analytics data');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [applications, appsLoading]);

  return { analytics, loading, error };
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <AlertCircle className="h-12 w-12 text-gray-400" />
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

const Analytics = () => {
  const { analytics, loading, error } = useAnalytics();

  // Helper to format currency in lakhs
  const formatInLakhs = (value: number) => {
    return `₹${(value / 100000).toFixed(2)}L`;
  };

  const renderSummaryCards = () => {
    if (!analytics) return null;

    return (
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
          title="Disbursed Loans"
          value={analytics.totalDisbursed > 0
            ? formatInLakhs(analytics.averageLoanAmount * analytics.totalDisbursed)
            : '₹0L'}
          change={analytics.totalDisbursed > 0 ? "+8.2%" : "N/A"}
          trend={analytics.totalDisbursed > 0 ? "up" : "neutral"}
          icon={<TrendingUp size={20} />}
          description="vs. last month"
        />
        <SummaryCard
          title="Avg. Loan Size"
          value={analytics.totalApplications > 0
            ? formatInLakhs(analytics.averageLoanAmount)
            : '₹0L'}
          change={analytics.totalApplications > 0 ? "+5.1%" : "N/A"}
          trend={analytics.totalApplications > 0 ? "up" : "neutral"}
          icon={<DollarSign size={20} />}
          description="vs. last month"
        />
        <SummaryCard
          title="Approval Rate"
          value={analytics.totalApplications > 0
            ? `${Math.round((analytics.totalApproved / analytics.totalApplications) * 100)}%`
            : '0%'}
          change={analytics.totalApplications > 0 ? "+3.2%" : "N/A"}
          trend={analytics.totalApplications > 0 ? "up" : "neutral"}
          icon={<BarChart3 size={20} />}
          description="vs. last month"
        />
      </div>
    );
  };

  const renderMonthlyTrendsChart = () => {
    if (!analytics || analytics.monthlyApplications.length === 0) {
      return (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Application Trends</CardTitle>
            <CardDescription>Applications, approvals and disbursements</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <EmptyState message="No monthly trends data available" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Monthly Application Trends</CardTitle>
          <CardDescription>Applications, approvals and disbursements</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.monthlyApplications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applied" name="Applications" fill="#8884d8" />
              <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
              <Bar dataKey="disbursed" name="Disbursed" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderProductPerformanceChart = () => {
    if (!analytics || analytics.loanPerformance.length === 0) {
      return (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Loan Product Performance</CardTitle>
            <CardDescription>Applications by product type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <EmptyState message="No product performance data available" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Loan Product Performance</CardTitle>
          <CardDescription>Applications by product type</CardDescription>
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
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" name="Applications" fill="#8884d8" />
              <Bar dataKey="approved" name="Approved" fill="#82ca9d" />
              <Bar dataKey="disbursed" name="Disbursed" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderDisbursementRatesChart = () => {
    if (!analytics || analytics.loanPerformance.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Disbursement Rates</CardTitle>
            <CardDescription>Percentage of applications disbursed by product</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <EmptyState message="No disbursement rate data available" />
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Disbursement Rates</CardTitle>
          <CardDescription>Percentage of applications disbursed by product</CardDescription>
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
              <Tooltip formatter={(value) => [`${value}%`, 'Disbursement Rate']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="disbursementRate"
                name="Disbursement Rate"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Loading analytics data...</div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !analytics ? (
        <EmptyState message="No analytics data available" />
      ) : (
        <>
          {renderSummaryCards()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {renderMonthlyTrendsChart()}
            {renderProductPerformanceChart()}
          </div>

          {renderDisbursementRatesChart()}
        </>
      )}
    </div>
  );
};

export default Analytics;