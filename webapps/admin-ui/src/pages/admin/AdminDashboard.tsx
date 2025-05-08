import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Users,
  CreditCard,
  Clock,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/admin/ui/StatusBadge';
import { formatCurrency } from '@/utils/format';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoanApplication } from '@/types/application';
import useLoanApplications from '@/hooks/useLoanApplications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  description
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <p className={`text-sm mt-1 ${getTrendColor()}`}>
                {change} {description && <span className="text-gray-500">{description}</span>}
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Analytics Types
interface Analytics {
  totalApplications: number;
  totalApproved: number;
  totalDisbursed: number;
  totalRejected: number;
  totalPending: number;
  totalInReview: number;
  averageLoanAmount: number;
  averageProcessingTime: number;
  loanPerformance: {
    loanType: string;
    disbursementRate: number;
  }[];
}

// Analytics Hook
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

      const totalLoanAmount = applications.reduce((sum, app) => sum + (app.limit || 0), 0);
      const averageLoanAmount = totalApplications > 0 ? totalLoanAmount / totalApplications : 0;

      // Group by loan product for performance
      const loanProducts = {};
      applications.forEach(app => {
        const productName = app.loan_product_id?.name || 'Unknown';
        if (!loanProducts[productName]) {
          loanProducts[productName] = { total: 0, disbursed: 0 };
        }
        loanProducts[productName].total += 1;
        if (app.application_status === 'disbursed') {
          loanProducts[productName].disbursed += 1;
        }
      });

      const loanPerformance = Object.keys(loanProducts).map(loanType => {
        const { total, disbursed } = loanProducts[loanType];
        const disbursementRate = total > 0 ? Math.round((disbursed / total) * 100) : 0;
        return { loanType, disbursementRate };
      });

      setAnalytics({
        totalApplications,
        totalApproved,
        totalDisbursed,
        totalRejected,
        totalPending,
        totalInReview,
        averageLoanAmount,
        averageProcessingTime: 3.5, // Simulated value
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

// Recent Applications Table Component
interface RecentApplicationsTableProps {
  applications: LoanApplication[];
  loading: boolean;
}

const RecentApplicationsTable: React.FC<RecentApplicationsTableProps> = ({ applications, loading }) => {
  const recentApplications = applications.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Loading applications...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No applications found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-2">ID</th>
            <th className="text-left py-3 px-2">Customer</th>
            <th className="text-left py-3 px-2">Loan Name</th>
            <th className="text-left py-3 px-2">Amount</th>
            <th className="text-left py-3 px-2">Applied Date</th>
            <th className="text-left py-3 px-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {recentApplications.map((app) => (
            <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-2">{app._id.substring(0, 8)}...</td>
              <td className="py-3 px-2">{app.user_id?.name || 'Unknown'}</td>
              <td className="py-3 px-2 font-medium">{app.loan_product_id?.name || 'Unknown'}</td>
              <td className="py-3 px-2">{formatCurrency(app.limit)}</td>
              <td className="py-3 px-2 text-gray-500">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-2">
                <StatusBadge status={app.application_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {applications.length > 5 && (
        <div className="mt-4 text-right">
          <Link
            to="/applications"
            className="text-primary text-sm hover:underline"
          >
            View all applications
          </Link>
        </div>
      )}
    </div>
  );
};

// Status Distribution Component
interface StatusDistributionProps {
  analytics: Analytics | null;
}

const StatusDistribution: React.FC<StatusDistributionProps> = ({ analytics }) => {
  if (!analytics || analytics.totalApplications === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No status distribution data available</p>
      </div>
    );
  }

  const statusData = [
    { label: 'Pending', value: analytics.totalPending, color: 'bg-yellow-500' },
    { label: 'In Review', value: analytics.totalInReview, color: 'bg-blue-500' },
    { label: 'Approved', value: analytics.totalApproved, color: 'bg-emerald-500' },
    { label: 'Disbursed', value: analytics.totalDisbursed, color: 'bg-green-500' },
    { label: 'Rejected', value: analytics.totalRejected, color: 'bg-red-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-gray-100">
        {statusData.map((item, i) => (
          <div
            key={i}
            className={`${item.color}`}
            style={{ width: `${(item.value / analytics.totalApplications) * 100}%` }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {statusData.map((item, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${item.color} mr-2`} />
            <div className="text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-500 ml-1">({item.value})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Loan Performance Component
interface LoanPerformanceProps {
  loanPerformance: { loanType: string; disbursementRate: number }[] | undefined;
}

const LoanPerformance: React.FC<LoanPerformanceProps> = ({ loanPerformance }) => {
  if (!loanPerformance || loanPerformance.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500">No performance data available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loanPerformance.map((item, index) => (
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
  );
};

// Empty State Component
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-16 space-y-4">
    <AlertCircle className="h-12 w-12 text-gray-400" />
    <p className="text-gray-500 text-lg">{message}</p>
  </div>
);

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  const { applications, loading: appLoading } = useLoanApplications();
  const { analytics, loading: analyticsLoading, error } = useAnalytics();

  // Helper to format currency in lakhs
  const formatInLakhs = (value: number): string => {
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
            : '₹0'}
          change={analytics.totalDisbursed > 0 ? "+8.2%" : "N/A"}
          trend={analytics.totalDisbursed > 0 ? "up" : "neutral"}
          icon={<CreditCard size={20} />}
          description="vs. last month"
        />
        <SummaryCard
          title="Avg. Processing Time"
          value={`${analytics.averageProcessingTime} days`}
          change="-1.5 days"
          trend="down"
          icon={<Clock size={20} />}
          description="vs. last month"
        />
        <SummaryCard
          title="Avg. Loan Size"
          value={analytics.totalApplications > 0
            ? formatInLakhs(analytics.averageLoanAmount)
            : '₹0'}
          change={analytics.totalApplications > 0 ? "+5.1%" : "N/A"}
          trend={analytics.totalApplications > 0 ? "up" : "neutral"}
          icon={<BarChart3 size={20} />}
          description="vs. last month"
        />
      </div>
    );
  };

  const renderStatusDistribution = () => {
    if (!analytics) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Status Distribution</CardTitle>
          <CardDescription>Overview of all applications by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <StatusDistribution analytics={analytics} />
        </CardContent>
      </Card>
    );
  };

  const renderRecentApplications = () => (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest loan applications from customers</CardDescription>
          </div>
          <div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/applications">View All</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RecentApplicationsTable
          applications={applications}
          loading={appLoading}
        />
      </CardContent>
    </Card>
  );

  const renderLoanPerformance = () => {
    if (!analytics) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Performance</CardTitle>
          <CardDescription>Conversion rates by product</CardDescription>
        </CardHeader>
        <CardContent>
          <LoanPerformance loanPerformance={analytics.loanPerformance} />
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {analyticsLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse">Loading dashboard data...</div>
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
          {renderStatusDistribution()}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderRecentApplications()}
            {renderLoanPerformance()}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;