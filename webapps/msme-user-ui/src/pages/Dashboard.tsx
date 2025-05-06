
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { BarChart3, ChevronRight, CreditCard, PieChart, TrendingUp } from "lucide-react";
import { mockBankAnalytics, mockLoanApplications } from "@/services/mockData";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Get latest application (if any)
  const latestApplication = mockLoanApplications[0];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your financial hub
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credit Limit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{mockBankAnalytics.creditLimit.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on your financial profile
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Credit Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockBankAnalytics.creditScore}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-finance-primary h-1.5 rounded-full"
                  style={{ width: `${(mockBankAnalytics.creditScore / 900) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockBankAnalytics.creditScore >= 750 ? "Excellent" : mockBankAnalytics.creditScore >= 700 ? "Good" : "Average"} credit score
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cash Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{(mockBankAnalytics.averageMonthlyInflow - mockBankAnalytics.averageMonthlyOutflow).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Monthly net cash flow
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Stability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockBankAnalytics.cashFlowStability}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cash flow stability score
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Financial Analytics</CardTitle>
              <CardDescription>
                Insights from your banking transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Avg. Monthly Inflow</p>
                <p className="font-medium">₹{mockBankAnalytics.averageMonthlyInflow.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Avg. Monthly Outflow</p>
                <p className="font-medium">₹{mockBankAnalytics.averageMonthlyOutflow.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Min. Balance Maintained</p>
                <p className="font-medium">₹{mockBankAnalytics.minMaintainedBalance.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">UPI Transactions</p>
                <p className="font-medium">{mockBankAnalytics.upiTransactionsCount}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 size={16} className="mr-2" /> View Detailed Analytics
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Loan Offers</CardTitle>
              <CardDescription>
                Credit options tailored for your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center py-4">
                <div className="flex items-center justify-center w-32 h-32 rounded-full bg-finance-primary/10">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-finance-primary">3</p>
                    <p className="text-sm text-finance-primary">Offers</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mt-4">
                <div className="bg-finance-primary/10 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Up to</p>
                  <p className="font-semibold text-finance-primary">₹10L</p>
                </div>
                <div className="bg-finance-primary/10 rounded-lg p-3">
                  <p className="text-xs text-gray-600">From</p>
                  <p className="font-semibold text-finance-primary">9.75%</p>
                </div>
                <div className="bg-finance-primary/10 rounded-lg p-3">
                  <p className="text-xs text-gray-600">Up to</p>
                  <p className="font-semibold text-finance-primary">48 mo</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate("/offers")}
              >
                <CreditCard size={16} className="mr-2" /> View Loan Offers
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Status of your recent loan applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mockLoanApplications.length > 0 ? (
              <div className="space-y-4">
                {mockLoanApplications.map(app => (
                  <div 
                    key={app.id} 
                    className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{app.loanName}</h4>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-sm text-gray-500">{app.provider}</p>
                    </div>
                    <div className="flex gap-4 md:text-right">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-medium">₹{app.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Interest</p>
                        <p className="font-medium">{app.interestRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500">No applications yet</p>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/applications")}
            >
              View All Applications <ChevronRight size={16} className="ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
