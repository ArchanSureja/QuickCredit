
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoanOffer } from "@/types/loan";

interface LoanCardProps {
  loan: any;
  onApply: (loanName: string) => void;
  onViewDetails: (loanName: string) => void;
}

const LoanCard = ({ loan, onApply, onViewDetails }: LoanCardProps) => {
  return (
    <div className="loan-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{loan.name}</h3>
          <p className="text-sm text-gray-500">{loan.description}</p>
        </div>
        <div className="bg-finance-primary/10 text-finance-primary font-medium px-3 py-1 rounded-full text-xs">
          Up to ₹{loan.max_amount.toLocaleString()}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="font-medium">{loan.interest_rate}% p.a.</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tenure</p>
          <p className="font-medium">Up to {loan.max_tenure_months} Months</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Processing Fee</p>
          <p className="font-medium">{loan.processing_fee_percent} %</p>
        </div>
        {/* <div>
          <p className="text-xs text-gray-500">Disbursement</p>
          <p className="font-medium">{loan.disbursementTime}</p>
        </div> */}
      </div>
      
      <div className="mt-4 flex space-x-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(loan.name)}
        >
          Details
        </Button>
        <Button 
          className="flex-1"
          onClick={() => onApply(loan.name)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default LoanCard;
