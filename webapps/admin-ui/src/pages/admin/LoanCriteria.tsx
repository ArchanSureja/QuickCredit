import React, { useState, useEffect } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
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
import { PlusCircle, Edit, Trash2, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useLoaderData } from 'react-router-dom';

// Define the interface for the LenderParams based on the backend schema
interface LenderParams {
  _id: string;
  admin_id: string;
  loan_product_id: string;
  Business_age: number;
  is_GST: boolean;
  min_maintained_balance: number;
  max_outflow_ratio: number;
  min_monthly_inflow: number;
  min_recommended_limit: number;
  max_recommended_limit: number;
  mix_category: 'retail' | 'wholesale' | 'manufacturing' | 'service' | 'mixed';
  min_credit_score: number;
  max_credit_score: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for loan products
interface LoanProduct {
  _id: string;
  name: string;
  description?: string;
}

// Form validation schema based on the backend model
const formSchema = z.object({
  loan_product_id: z.string({ required_error: "Please select a loan product" }),
  Business_age: z.number()
    .int({ message: "Must be a whole number" })
    .min(0, { message: "Business age cannot be negative" }),
  is_GST: z.boolean(),
  min_maintained_balance: z.number()
    .nonnegative({ message: "Balance cannot be negative" }),
  max_outflow_ratio: z.number()
    .min(0, { message: "Ratio cannot be negative" })
    .max(1, { message: "Ratio cannot exceed 1" }),
  min_monthly_inflow: z.number()
    .nonnegative({ message: "Inflow cannot be negative" }),
  min_recommended_limit: z.number()
    .nonnegative({ message: "Limit cannot be negative" }),
  max_recommended_limit: z.number()
    .nonnegative({ message: "Limit cannot be negative" }),
  mix_category: z.enum(['retail', 'wholesale', 'manufacturing', 'service', 'mixed']),
  min_credit_score: z.number()
    .int({ message: "Credit score must be a whole number" })
    .min(300, { message: "Credit score must be at least 300" })
    .max(900, { message: "Credit score cannot exceed 900" }),
  max_credit_score: z.number()
    .int({ message: "Credit score must be a whole number" })
    .min(300, { message: "Credit score must be at least 300" })
    .max(900, { message: "Credit score cannot exceed 900" })
}).refine(data => data.max_recommended_limit >= data.min_recommended_limit, {
  message: "Maximum recommended limit must be greater than or equal to minimum recommended limit",
  path: ["max_recommended_limit"]
}).refine(data => data.max_credit_score >= data.min_credit_score, {
  message: "Maximum credit score must be greater than or equal to minimum credit score",
  path: ["max_credit_score"]
});

type FormSchema = z.infer<typeof formSchema>;

const LenderParamsPage = () => {
  const [lenderParams, setLenderParams] = useState<LenderParams[]>([]);
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeParams, setActiveParams] = useState<LenderParams | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paramsToDelete, setParamsToDelete] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Set up form with validation
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loan_product_id: '',
      Business_age: 12,
      is_GST: false,
      min_maintained_balance: 10000,
      max_outflow_ratio: 0.7,
      min_monthly_inflow: 50000,
      min_recommended_limit: 100000,
      max_recommended_limit: 1000000,
      mix_category: 'retail',
      min_credit_score: 600,
      max_credit_score: 900
    }
  });

  // Fetch lender params and loan products
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lender params
        const paramsResponse = await fetch(`${API_URL}/lender-params`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!paramsResponse.ok) {
          throw new Error('Failed to fetch lender parameters');
        }
        const paramsData = await paramsResponse.json();
        setLenderParams(paramsData);

        // Fetch loan products for dropdown
        const productsResponse = await fetch(`${API_URL}/loan-products`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!productsResponse.ok) {
          throw new Error('Failed to fetch loan products');
        }
        const productsData = await productsResponse.json();
        setLoanProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data. Please try again.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Find loan product name by ID
  const getLoanProductName = (productId: string) => {
    const product = loanProducts.find(p => p._id === productId);
    return product ? product.name : 'Unknown Product';
  };

  const openEditDialog = (params: LenderParams) => {
    setActiveParams(params);
    form.reset({
      loan_product_id: params.loan_product_id,
      Business_age: params.Business_age,
      is_GST: params.is_GST,
      min_maintained_balance: params.min_maintained_balance,
      max_outflow_ratio: params.max_outflow_ratio,
      min_monthly_inflow: params.min_monthly_inflow,
      min_recommended_limit: params.min_recommended_limit,
      max_recommended_limit: params.max_recommended_limit,
      mix_category: params.mix_category,
      min_credit_score: params.min_credit_score,
      max_credit_score: params.max_credit_score
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setActiveParams(null);
    form.reset({
      loan_product_id: loanProducts[0]?._id || '',
      Business_age: 12,
      is_GST: false,
      min_maintained_balance: 10000,
      max_outflow_ratio: 0.7,
      min_monthly_inflow: 50000,
      min_recommended_limit: 100000,
      max_recommended_limit: 1000000,
      mix_category: 'retail',
      min_credit_score: 600,
      max_credit_score: 900
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      let response;

      if (activeParams) {
        // Update existing params
        response = await fetch(`${API_URL}/lender-params/${activeParams._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        });
      } else {
        // Create new params
        response = await fetch(`${API_URL}/lender-params`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(data)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save lender parameters');
      }

      const savedData = await response.json();

      // Update the local state
      if (activeParams) {
        setLenderParams(prev => prev.map(item =>
          item._id === activeParams._id ? savedData : item
        ));
        toast({
          title: 'Success',
          description: 'Lender parameters updated successfully',
        });
      } else {
        setLenderParams(prev => [...prev, savedData]);
        toast({
          title: 'Success',
          description: 'New lender parameters created successfully',
        });
      }

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save data',
        variant: 'destructive'
      });
    }
  };

  const confirmDelete = (id: string) => {
    setParamsToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!paramsToDelete) return;

    try {
      const response = await fetch(`${API_URL}/lender-params/${paramsToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete lender parameters');
      }

      // Update local state
      setLenderParams(prev => prev.filter(item => item._id !== paramsToDelete));

      toast({
        title: 'Success',
        description: 'Lender parameters deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lender parameters',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setParamsToDelete(null);
    }
  };

  // Check eligibility function
  const checkEligibility = async (paramsId: string) => {
    try {
      // Open dialog with form for eligibility check
      // This would be implemented with another dialog component
      console.log(`Check eligibility for params ID: ${paramsId}`);
      toast({
        title: 'Feature Coming Soon',
        description: 'Eligibility check feature will be available soon',
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Loan Criteria & Parameters</h1>
        <Button onClick={openNewDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Parameters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lender Parameters</CardTitle>
          <CardDescription>Manage your loan eligibility criteria and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <p>Loading parameters...</p>
            </div>
          ) : lenderParams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No lender parameters defined yet</p>
              <Button className="mt-4" onClick={openNewDialog}>Create First Parameter Set</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {lenderParams.map((params) => (
                <Card key={params._id} className="border-gray-200 overflow-hidden">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b">
                      <div>
                        <h3 className="text-lg font-medium">
                          {getLoanProductName(params.loan_product_id)}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Last updated: {new Date(params.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={params.is_GST ? "default" : "outline"}>
                        {params.is_GST ? 'GST Required' : 'GST Not Required'}
                      </Badge>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                        <div>
                          <span className="text-sm text-gray-500">Business Age</span>
                          <p className="font-medium">{params.Business_age} months</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Min Balance</span>
                          <p className="font-medium">₹{params.min_maintained_balance.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Min Monthly Inflow</span>
                          <p className="font-medium">₹{params.min_monthly_inflow.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Credit Score Range</span>
                          <p className="font-medium">{params.min_credit_score} - {params.max_credit_score}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Max Outflow Ratio</span>
                          <p className="font-medium">{params.max_outflow_ratio * 100}%</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Business Category</span>
                          <p className="font-medium capitalize">{params.mix_category}</p>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <div>
                        <h4 className="text-sm font-medium mb-2">Recommended Loan Limits</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Minimum</span>
                            <p className="font-medium">₹{params.min_recommended_limit.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Maximum</span>
                            <p className="font-medium">₹{params.max_recommended_limit.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end p-4 bg-gray-50 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => checkEligibility(params._id)}
                      >
                        <Filter className="mr-2 h-4 w-4" />
                        Check Eligibility
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => openEditDialog(params)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => confirmDelete(params._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeParams ? 'Edit Lender Parameters' : 'Add New Lender Parameters'}</DialogTitle>
            <DialogDescription>
              {activeParams
                ? 'Update the lender parameters for this loan product.'
                : 'Fill out the form below to create new lender parameters.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="loan_product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a loan product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loanProducts.map(product => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="Business_age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Age (months)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 0 : Math.max(0, value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>Minimum business age in months</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_GST"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 space-y-0">
                      <div className="space-y-0.5">
                        <FormLabel>GST Registration Required</FormLabel>
                        <FormDescription>
                          Is GST registration mandatory?
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_maintained_balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Maintained Balance (₹)</FormLabel>
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
                      <FormDescription>Minimum bank balance maintained</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="min_monthly_inflow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Monthly Inflow (₹)</FormLabel>
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
                      <FormDescription>Minimum monthly cash inflow</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="max_outflow_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Outflow Ratio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        {...field}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(isNaN(value) ? 0 : Math.max(0, Math.min(1, value)));
                        }}
                      />
                    </FormControl>
                    <FormDescription>Maximum allowed outflow to inflow ratio (0-1)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mix_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a business category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_recommended_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Recommended Limit (₹)</FormLabel>
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
                  name="max_recommended_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Recommended Limit (₹)</FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="min_credit_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Credit Score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="300"
                          max="900"
                          step="1"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 300 : Math.max(300, Math.min(900, value)));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_credit_score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Credit Score</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="300"
                          max="900"
                          step="1"
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            field.onChange(isNaN(value) ? 900 : Math.max(300, Math.min(900, value)));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{activeParams ? 'Update' : 'Create'} Parameters</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete these lender parameters? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LenderParamsPage;