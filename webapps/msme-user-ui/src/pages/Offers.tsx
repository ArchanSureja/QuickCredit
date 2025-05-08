
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import LoanCard from "@/components/loan/LoanCard";
import LoanDetailModal from "@/components/loan/LoanDetailModal";
import { mockLoanOffers } from "@/services/mockData";
import { LoanOffer } from "@/types/loan";
import { useToast } from "@/components/ui/use-toast";
import { AnyARecord } from "dns";

const Offers = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoanName, setSelectedLoanName] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API fetch
    const fetchOffers = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      const user_id = localStorage.getItem("user_id")
      const offer_res = await fetch(
        `${import.meta.env.VITE_LOAN_OFFER_SERVICE}/get-matched-offers/${user_id}`
      )
      const offers = await offer_res.json()
      console.log(offers)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOffers(offers);
      setIsLoading(false);
    };
    
    fetchOffers();
  }, []);

  const handleViewDetails = (loanName: string) => {
    setSelectedLoanName(loanName);
    setIsDetailsModalOpen(true);
  };

  const handleApplyForLoan = async (loanName: string) => {
    // Create a new application
    const user_id = localStorage.getItem("user_id")
    const  loan_name = loanName
    const payload = {
        "user_id":user_id,
        "loan_name":loan_name
    }
    const application_res = await fetch(
      `${import.meta.env.VITE_USER_SERVICE}/add-application`,{
        method : "POST",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
      }
      
    )
    const application = await application_res.json()
    console.log(application)
    toast({
      title: "Application Created",
      description: "Your loan application has been successfully created.",
    });
    
    // Navigate to applications page
    navigate("/applications");
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedLoanName(null);
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
                key={loan.name}
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
          loanName={selectedLoanName}
          loans={offers}
        />
      </div>
    </MainLayout>
  );
};

export default Offers;
