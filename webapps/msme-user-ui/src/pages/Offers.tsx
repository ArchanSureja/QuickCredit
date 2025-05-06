
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import LoanCard from "@/components/loan/LoanCard";
import LoanDetailModal from "@/components/loan/LoanDetailModal";
import { mockLoanOffers } from "@/services/mockData";
import { LoanOffer } from "@/types/loan";
import { useToast } from "@/components/ui/use-toast";

const Offers = () => {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchOffers = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOffers(mockLoanOffers);
      setIsLoading(false);
    };
    
    fetchOffers();
  }, []);

  const handleViewDetails = (loanId: string) => {
    setSelectedLoanId(loanId);
    setIsDetailsModalOpen(true);
  };

  const handleApplyForLoan = (loanId: string) => {
    // Create a new application
    toast({
      title: "Application Created",
      description: "Your loan application has been successfully created.",
    });
    
    // Navigate to applications page
    navigate("/applications");
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLoanId(null);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Loan Offers</h1>
          <p className="text-muted-foreground">
            Credit offers matched to your financial profile
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-t-transparent border-finance-primary rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Finding the best offers for you...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onViewDetails={handleViewDetails}
                onApply={handleApplyForLoan}
              />
            ))}
          </div>
        )}

        {!isLoading && offers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No loan offers available at the moment.</p>
          </div>
        )}

        <LoanDetailModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          onApply={handleApplyForLoan}
          loanId={selectedLoanId}
          loans={offers}
        />
      </div>
    </MainLayout>
  );
};

export default Offers;
