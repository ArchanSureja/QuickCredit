import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from 'lucide-react';
import { LenderParamsAndProduct } from '@/types/loan-criteria';
import { updateLenderParams } from '@/services/lender-params-service';
import { toast } from '@/components/ui/use-toast';

interface CriteriaCardProps {
  criteria: LenderParamsAndProduct;
  onEdit: () => void;
  onDelete: () => void;
  getLoanProductName: (id: string) => string;
}

export const CriteriaCard: React.FC<CriteriaCardProps> = ({ 
  criteria, 
  onEdit, 
  onDelete,
  getLoanProductName
}) => {
  const [isActive, setIsActive] = useState<boolean>(criteria.isActive || false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleStatusToggle = async (checked: boolean) => {
    try {
      setIsUpdating(true);
      await updateLenderParams(criteria._id, { ...criteria, isActive: checked });
      setIsActive(checked);
      toast({
        title: "Status Updated",
        description: `Criteria is now ${checked ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
      setIsActive(!checked); // Revert UI state on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="text-lg font-medium">{getLoanProductName(criteria.loan_product_id)}</h3>
              <div className="flex items-center mt-2 sm:mt-0">
                <Switch 
                  checked={isActive} 
                  onCheckedChange={handleStatusToggle}
                  disabled={isUpdating}
                  className="mr-2" 
                />
                <span className={`text-sm ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-4">
              <div>
                <span className="text-sm text-gray-500">Business Age</span>
                <p className="font-medium">{criteria.Business_age} months</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">GST Required</span>
                <p className="font-medium">{criteria.is_GST ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Min Account Balance</span>
                <p className="font-medium">₹{criteria.min_maintained_balance.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Min Monthly Inflow</span>
                <p className="font-medium">₹{criteria.min_monthly_inflow.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Recommended Limit</span>
                <p className="font-medium">₹{criteria.min_recommended_limit.toLocaleString()} - ₹{criteria.max_recommended_limit.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Credit Score Range</span>
                <p className="font-medium">{criteria.min_credit_score} - {criteria.max_credit_score}</p>
              </div>
            </div>

            <div className="mt-3">
              <span className="text-sm text-gray-500">Business Category</span>
              <p className="font-medium capitalize">{criteria.mix_category}</p>
            </div>
          </div>
          
          <div className="flex sm:flex-col justify-center p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-200 gap-2">
            <Button 
              variant="ghost" 
              className="text-sm flex items-center"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              className="text-sm text-red-500 flex items-center"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this criteria?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this loan criteria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};