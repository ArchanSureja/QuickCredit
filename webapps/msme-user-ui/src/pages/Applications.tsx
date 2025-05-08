
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";
import { mockLoanApplications, mockLoanOffers } from "@/services/mockData";
import { LoanApplication } from "@/types/loan";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const Applications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any| null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchApplications = async () => {
      setIsLoading(true);
      const user_id = localStorage.getItem("user_id")
      const application_res = await fetch(
        `${import.meta.env.VITE_USER_SERVICE}/get-applications/${user_id}`
      )
      const applications = await application_res.json()
      console.log(applications) 

      // Simulate API delay

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(applications);
      setIsLoading(false);
    };
    
    fetchApplications();
  }, []);

  const handleCreateApplication = () => {
    navigate("/offers");
  };

  const openEditModal = (application: LoanApplication) => {
    setSelectedApplication(application);
    setLoanAmount(application.amount);
    setLoanTenure(application.tenure);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (!selectedApplication) return;

    // Update application in state
    const updatedApplications = applications.map(app => 
      app.id === selectedApplication.id 
        ? { 
            ...app, 
            amount: loanAmount, 
            tenure: loanTenure,
            lastUpdated: new Date().toISOString()
          } 
        : app
    );
    
    setApplications(updatedApplications);
    setIsEditModalOpen(false);
    setSelectedApplication(null);
    
    toast({
      title: "Changes Requested",
      description: "Your loan modification request has been submitted.",
    });
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Find the maximum loan amount from the offer that matches the selected application
  const getMaxLoanAmount = () => {
    if (!selectedApplication) return 500000;
    const offer = mockLoanOffers.find(offer => offer.id === selectedApplication.loanId);
    return offer ? offer.maxAmount : 500000;
  };

  // Find the maximum tenure from the offer that matches the selected application
  const getMaxTenure = () => {
    if (!selectedApplication) return 36;
    const offer = mockLoanOffers.find(offer => offer.id === selectedApplication.loanId);
    return offer ? offer.maxTenure : 36;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Loan Applications</h1>
            <p className="text-muted-foreground">
              Track and manage your loan applications
            </p>
          </div>
          <Button onClick={handleCreateApplication} className="self-start">
            Apply for New Loan
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-t-transparent border-finance-primary rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your applications...</p>
            </div>
          </div>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div 
                key={app.name} 
                className="bg-white rounded-lg p-5 shadow-sm border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{app.description}</p>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="font-medium">₹{app.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tenure</p>
                        <p className="font-medium">{app.tenure} Months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Interest Rate</p>
                        <p className="font-medium">{app.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Applied</p>
                        <p className="font-medium">{formatDate(app.applied)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Last Update</p>
                        <p className="font-medium">{formatDate(app.updated)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* <div className="self-start">
                    <Button 
                      variant="outline"
                      onClick={() => openEditModal(app)}
                      disabled={app.status === "disbursed" || app.status === "rejected"}
                    >
                      Request Changes
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You don't have any loan applications yet.</p>
            <Button onClick={handleCreateApplication}>Apply for a Loan</Button>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Request Loan Modifications</DialogTitle>
              <DialogDescription>
                Adjust your loan amount or tenure. Changes are subject to approval.
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider 
                          id="amount"
                          value={[loanAmount]} 
                          min={selectedApplication.amount / 2}
                          max={getMaxLoanAmount()}
                          step={10000}
                          onValueChange={(value) => setLoanAmount(value[0])}
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val)) {
                              setLoanAmount(Math.min(val, getMaxLoanAmount()));
                            }
                          }}
                          className="text-right"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max amount: ₹{getMaxLoanAmount().toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tenure">Loan Tenure ({selectedApplication.tenureUnit})</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider 
                          id="tenure"
                          value={[loanTenure]} 
                          min={Math.max(6, selectedApplication.tenure / 2)}
                          max={getMaxTenure()}
                          step={selectedApplication.tenureUnit === "months" ? 3 : 1}
                          onValueChange={(value) => setLoanTenure(value[0])}
                        />
                      </div>
                      <div className="w-24">
                        <Select 
                          value={loanTenure.toString()}
                          onValueChange={(value) => setLoanTenure(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select tenure" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: (getMaxTenure() - 6) / (selectedApplication.tenureUnit === "months" ? 3 : 1) + 1 }, 
                              (_, i) => 6 + i * (selectedApplication.tenureUnit === "months" ? 3 : 1)
                            ).map((tenure) => (
                              <SelectItem key={tenure} value={tenure.toString()}>
                                {tenure} {selectedApplication.tenureUnit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Max tenure: {getMaxTenure()} {selectedApplication.tenureUnit}
                    </p>
                  </div>

                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Applications;
