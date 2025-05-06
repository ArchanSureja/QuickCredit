
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoanOffer } from "@/types/loan";

interface LoanCardProps {
  loan: LoanOffer;
  onApply: (loanId: string) => void;
  onViewDetails: (loanId: string) => void;
}

const LoanCard = ({ loan, onApply, onViewDetails }: LoanCardProps) => {
  return (
    <div className="loan-card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{loan.name}</h3>
          <p className="text-sm text-gray-500">{loan.provider}</p>
        </div>
        <div className="bg-finance-primary/10 text-finance-primary font-medium px-3 py-1 rounded-full text-xs">
          Up to ₹{loan.maxAmount.toLocaleString()}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Interest Rate</p>
          <p className="font-medium">{loan.interestRate}% p.a.</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Tenure</p>
          <p className="font-medium">Up to {loan.maxTenure} {loan.tenureUnit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Processing Fee</p>
          <p className="font-medium">{loan.processingFee}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Disbursement</p>
          <p className="font-medium">{loan.disbursementTime}</p>
        </div>
      </div>
      
      <div className="mt-4 flex space-x-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onViewDetails(loan.id)}
        >
          Details
        </Button>
        <Button 
          className="flex-1"
          onClick={() => onApply(loan.id)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default LoanCard;
