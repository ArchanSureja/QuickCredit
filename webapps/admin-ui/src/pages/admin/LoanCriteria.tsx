import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { useLoanCriteria } from '@/hooks/useLoanCriteria';
import { AdminLoanCriteria } from '@/types/admin';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  provider: z.string().min(2, { message: "Provider name is required" }),
  minAmount: z.number().nonnegative({ message: "Amount cannot be negative" }).min(1, { message: "Minimum amount must be at least 1" }),
  maxAmount: z.number().nonnegative({ message: "Amount cannot be negative" }).min(1, { message: "Maximum amount must be at least 1" }),
  interestRate: z.number().nonnegative({ message: "Interest rate cannot be negative" }).max(100, { message: "Interest rate cannot exceed 100%" }),
  minTenure: z.number().int().nonnegative({ message: "Tenure cannot be negative" }).min(1, { message: "Minimum tenure must be at least 1" }),
  maxTenure: z.number().int().nonnegative({ message: "Tenure cannot be negative" }).min(1, { message: "Maximum tenure must be at least 1" }),
  tenureUnit: z.enum(["months", "years"]),
  processingFee: z.string().min(1, { message: "Processing fee information is required" }),
  prepaymentPenalty: z.string().min(1, { message: "Prepayment penalty information is required" }),
  disbursementTime: z.string().min(1, { message: "Disbursement time information is required" }),
  repaymentFrequency: z.string().min(1, { message: "Repayment frequency information is required" }),
  repaymentMethod: z.string().min(1, { message: "Repayment method information is required" }),
  requiredDocuments: z.array(z.string()).min(1, { message: "At least one document is required" }),
  eligibilityCriteria: z.array(z.string()).min(1, { message: "At least one eligibility criterion is required" }),
  isActive: z.boolean(),
  applicationsCount: z.number(),
  conversionRate: z.number(),
  lastModified: z.string()
}).refine(data => data.maxAmount >= data.minAmount, {
  message: "Maximum amount must be greater than or equal to minimum amount",
  path: ["maxAmount"]
}).refine(data => data.maxTenure >= data.minTenure, {
  message: "Maximum tenure must be greater than or equal to minimum tenure",
  path: ["maxTenure"]
});

type FormSchema = z.infer<typeof formSchema>;

const LoanCriteria = () => {
  const { criteria, loading, saveCriteria, toggleStatus } = useLoanCriteria();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCriteria, setActiveCriteria] = useState<AdminLoanCriteria | null>(null);

  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      name: '',
      provider: 'HDFC Bank',
      minAmount: 100000,
      maxAmount: 1000000,
      interestRate: 12,
      minTenure: 12,
      maxTenure: 36,
      tenureUnit: "months",
      processingFee: "1.5% of loan amount",
      prepaymentPenalty: "2% of outstanding amount",
      disbursementTime: "5-7 working days",
      repaymentFrequency: "Monthly",
      repaymentMethod: "Auto debit from bank account",
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Business registration proof'],
      eligibilityCriteria: ['Business age > 2 years', 'Minimum credit score of 700'],
      isActive: true,
      applicationsCount: 0,
      conversionRate: 0,
      lastModified: new Date().toISOString()
    }
  });

  const openEditDialog = (criteriaItem: AdminLoanCriteria) => {
    setActiveCriteria(criteriaItem);
    form.reset(criteriaItem);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setActiveCriteria(null);
    form.reset({
      id: '',
      name: '',
      provider: 'HDFC Bank',
      minAmount: 100000,
      maxAmount: 1000000,
      interestRate: 12,
      minTenure: 12,
      maxTenure: 36,
      tenureUnit: "months",
      processingFee: "1.5% of loan amount",
      prepaymentPenalty: "2% of outstanding amount",
      disbursementTime: "5-7 working days",
      repaymentFrequency: "Monthly",
      repaymentMethod: "Auto debit from bank account",
      requiredDocuments: ['PAN Card', 'Aadhaar Card', 'Business registration proof'],
      eligibilityCriteria: ['Business age > 2 years', 'Minimum credit score of 700'],
      isActive: true,
      applicationsCount: 0,
      conversionRate: 0,
      lastModified: new Date().toISOString()
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      await saveCriteria(data as AdminLoanCriteria);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating criteria:", error);
    }
  };

  const handleToggleActive = async (criteria: AdminLoanCriteria, active: boolean) => {
    try {
      await toggleStatus(criteria.id, active);
    } catch (error) {
      console.error("Error toggling criteria status:", error);
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
                <Card key={item.id} className="border-gray-200 overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <div className="flex items-center mt-2 sm:mt-0">
                          <Switch 
                            checked={item.isActive} 
                            onCheckedChange={(checked) => handleToggleActive(item, checked)}
                            className="mr-2" 
                          />
                          <span className={`text-sm ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                            {item.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 mt-4">
                        <div>
                          <span className="text-sm text-gray-500">Min Credit Score</span>
                          <p className="font-medium">
                            {item.eligibilityCriteria.find(c => c.includes('credit score'))?.match(/\d+/)?.[0] || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Max Loan Amount</span>
                          <p className="font-medium">₹{(item.maxAmount).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Interest Rate</span>
                          <p className="font-medium">{item.interestRate}%</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Max Tenure</span>
                          <p className="font-medium">{item.maxTenure} {item.tenureUnit}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Processing Fee</span>
                          <p className="font-medium">{item.processingFee}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Provider</span>
                          <p className="font-medium text-sm">{item.provider}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex sm:flex-col justify-center p-4 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-200">
                      <Button 
                        variant="ghost" 
                        className="text-sm"
                        onClick={() => openEditDialog(item)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeCriteria ? 'Edit Loan Criteria' : 'Add New Loan Criteria'}</DialogTitle>
            <DialogDescription>
              {activeCriteria 
                ? 'Update the details for this loan criteria.' 
                : 'Fill out the form below to create a new loan criteria.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Business Growth Loan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., HDFC Bank" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Loan Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Loan Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="0" 
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interest Rate (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          min="0"
                          max="100"
                          {...field} 
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            field.onChange(isNaN(value) ? 0 : Math.max(0, Math.min(100, value)));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minTenure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Tenure</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 1 : Math.max(1, value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxTenure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tenure</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          step="1"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 1 : Math.max(1, value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="processingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Processing Fee</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 1.5% of loan amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prepaymentPenalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prepayment Penalty</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 2% of outstanding amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="disbursementTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disbursement Time</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., 5-7 working days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="repaymentFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repayment Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Monthly" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="repaymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repayment Method</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Auto debit from bank account" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="eligibilityCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Eligibility Criteria</FormLabel>
                    <FormDescription>Enter each criterion on a new line</FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Business age > 2 years&#10;Minimum credit score of 700"
                        className="min-h-[100px] whitespace-pre-wrap"
                        value={field.value.join('\n')}
                        onChange={(e) => field.onChange(e.target.value.split('\n').filter(line => line.trim()))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="requiredDocuments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Documents</FormLabel>
                    <FormDescription>Enter each document on a new line</FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="PAN Card&#10;Aadhaar Card&#10;Business registration proof"
                        className="min-h-[100px] whitespace-pre-wrap"
                        value={field.value.join('\n')}
                        onChange={(e) => field.onChange(e.target.value.split('\n').filter(line => line.trim()))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Make this loan criteria available to users
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{activeCriteria ? 'Update' : 'Create'} Criteria</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanCriteria;
