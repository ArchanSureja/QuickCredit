import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { LenderParamsAndProduct } from '@/types/loan-criteria';
import { CriteriaForm } from './CriteriaForm';
import { CriteriaCard } from './CriteriaCard';
import { fetchLenderParams, createLenderParams, updateLenderParams, deleteLenderParams } from '@/services/lender-params-service';

const LoanCriteria: React.FC = () => {
  const [criteria, setCriteria] = useState<LenderParamsAndProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeCriteria, setActiveCriteria] = useState<LenderParamsAndProduct | null>(null);
  const [loanProducts, setLoanProducts] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch loan criteria and products on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [criteriaData, productsData] = await Promise.all([
          fetchLenderParams(),
          fetchLoanProducts()
        ]);
        setCriteria(criteriaData);
        setLoanProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load loan criteria data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch loan products (should be implemented in a real service)
  const fetchLoanProducts = async () => {
    // In a real implementation, this would fetch from an API
    // For now, returning mock data
    return [
      { id: '1', name: 'Business Loan' },
      { id: '2', name: 'Working Capital Loan' },
      { id: '3', name: 'Term Loan' }
    ];
  };

  const openEditDialog = (criteriaItem: LenderParamsAndProduct) => {
    setActiveCriteria(criteriaItem);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setActiveCriteria(null);
    setIsDialogOpen(true);
  };

  const handleSaveCriteria = async (formData: LenderParamsAndProduct) => {
    try {
      setLoading(true);
      
      if (activeCriteria) {
        // Update existing criteria
        const updatedCriteria = await updateLenderParams(activeCriteria._id, formData);
        setCriteria(prev => prev.map(item => 
          item._id === updatedCriteria._id ? updatedCriteria : item
        ));
        toast({
          title: "Success",
          description: "Loan criteria updated successfully",
        });
      } else {
        // Create new criteria
        const newCriteria = await createLenderParams(formData);
        setCriteria(prev => [...prev, newCriteria]);
        toast({
          title: "Success",
          description: "New loan criteria created successfully",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving criteria:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save loan criteria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCriteria = async (id: string) => {
    try {
      await deleteLenderParams(id);
      setCriteria(prev => prev.filter(item => item._id !== id));
      toast({
        title: "Success",
        description: "Loan criteria deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting criteria:", error);
      toast({
        title: "Error",
        description: "Failed to delete loan criteria",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Loan Criteria Management</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Criteria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Criteria</CardTitle>
          <CardDescription>Manage your loan eligibility criteria</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading criteria...</p>
            </div>
          ) : criteria.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No loan criteria defined yet</p>
              <Button className="mt-4" onClick={openNewDialog}>Create First Criteria</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {criteria.map((item) => (
                <CriteriaCard 
                  key={item._id} 
                  criteria={item} 
                  onEdit={() => openEditDialog(item)}
                  onDelete={() => handleDeleteCriteria(item._id)}
                  getLoanProductName={(id) => {
                    const product = loanProducts.find(p => p.id === id);
                    return product?.name || 'Unknown Product';
                  }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CriteriaForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveCriteria}
        initialData={activeCriteria}
        loanProducts={loanProducts}
      />
    </div>
  );
};

export default LoanCriteria;