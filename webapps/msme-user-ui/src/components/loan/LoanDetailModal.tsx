
import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoanOffer } from "@/types/loan";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

interface LoanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (loanName: string) => void;
  loanName: string | null;
  loans: LoanOffer[];
}

const LoanDetailModal = ({
  isOpen,
  onClose,
  onApply,
  loanName,
  loans
}: LoanDetailModalProps) => {
  const [loan, setLoan] = useState<any | null>(null);
  
  useEffect(() => {
    if (loanName) {
      const selectedLoan = loans.find(l => l.name === loanName) || null;
      setLoan(selectedLoan);
    } else {
      setLoan(null);
    }
  }, [loanName, loans]);

  if (!loan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{loan.name}</DialogTitle>
          <DialogDescription>{loan.description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Loan Amount</p>
            <p className="font-medium">₹{loan.min_amount.toLocaleString()} - ₹{loan.max_amount.toLocaleString()}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="font-medium">{loan.interest_rate}% p.a.</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Tenure</p>
            <p className="font-medium">{loan.min_tenure_months} - {loan.max_tenure_months} Months</p>
          </div>
          {/* <div className="space-y-1">
            <p className="text-sm text-gray-500">Disbursement Time</p>
            <p className="font-medium">{loan.disbursementTime}</p>
          </div> */}
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Processing Fee</p>
            <p className="font-medium">{loan.processing_fee_percent} %</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Prepayment Penalty</p>
            <p className="font-medium">{loan.prepayment_penalty} %</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Repayment Options</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Frequency</p>
              <p className="font-medium">{loan.prepayment_frequency}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Method</p>
              <p className="font-medium">Auto-Debit From Bank account</p>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Required Documents</h4>
          <ul className="space-y-2">
            {loan.required_documents.map((doc, index) => (
              <li key={index} className="flex items-center">
                <Check size={16} className="text-finance-success mr-2" />
                <span className="text-sm">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        {/* <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Eligibility Criteria</h4>
          <ul className="space-y-2">
            {loan.eligibilityCriteria.map((criteria, index) => (
              <li key={index} className="flex items-start">
                <Check size={16} className="text-finance-success mr-2 mt-0.5" />
                <span className="text-sm">{criteria}</span>
              </li>
            ))}
          </ul>
        </div> */}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onApply(loan.id)}>Apply Now</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoanDetailModal;
