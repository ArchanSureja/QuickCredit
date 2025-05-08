import React from 'react';
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { LenderParamsAndProduct } from '@/types/loan-criteria';

// Form validation schema based on LenderParamsAndProductSchema
const formSchema = z.object({
  loan_product_id: z.string().min(1, { message: "Loan product ID is required" }),
  Business_age: z.coerce.number().int().min(0, { message: "Business age cannot be negative" }),
  is_GST: z.boolean(),
  min_maintained_balance: z.coerce.number().nonnegative({ message: "Minimum balance cannot be negative" }),
  max_outflow_ratio: z.coerce.number().nonnegative({ message: "Outflow ratio cannot be negative" }).max(1, { message: "Outflow ratio must be between 0 and 1" }),
  min_monthly_inflow: z.coerce.number().nonnegative({ message: "Monthly inflow cannot be negative" }),
  min_recommended_limit: z.coerce.number().nonnegative({ message: "Minimum limit cannot be negative" }),
  max_recommended_limit: z.coerce.number().nonnegative({ message: "Maximum limit cannot be negative" }),
  mix_category: z.enum(["retail", "wholesale", "manufacturing", "service", "mixed"]),
  min_credit_score: z.coerce.number().int().min(300, { message: "Credit score must be at least 300" }).max(900, { message: "Credit score cannot exceed 900" }),
  max_credit_score: z.coerce.number().int().min(300, { message: "Credit score must be at least 300" }).max(900, { message: "Credit score cannot exceed 900" }),
  isActive: z.boolean().optional().default(true)
}).refine(data => data.max_recommended_limit >= data.min_recommended_limit, {
  message: "Maximum recommended limit must be greater than or equal to minimum recommended limit",
  path: ["max_recommended_limit"]
}).refine(data => data.max_credit_score >= data.min_credit_score, {
  message: "Maximum credit score must be greater than or equal to minimum credit score",
  path: ["max_credit_score"]
});

type FormSchema = z.infer<typeof formSchema>;

interface CriteriaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormSchema) => Promise<void>;
  initialData: LenderParamsAndProduct | null;
  loanProducts: Array<{ id: string; name: string }>;
}

export const CriteriaForm: React.FC<CriteriaFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loanProducts
}) => {
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
      mix_category: "retail",
      min_credit_score: 650,
      max_credit_score: 900,
      isActive: true
    }
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          loan_product_id: initialData.loan_product_id,
          Business_age: initialData.Business_age,
          is_GST: initialData.is_GST,
          min_maintained_balance: initialData.min_maintained_balance,
          max_outflow_ratio: initialData.max_outflow_ratio,
          min_monthly_inflow: initialData.min_monthly_inflow,
          min_recommended_limit: initialData.min_recommended_limit,
          max_recommended_limit: initialData.max_recommended_limit,
          mix_category: initialData.mix_category,
          min_credit_score: initialData.min_credit_score,
          max_credit_score: initialData.max_credit_score,
          isActive: initialData.isActive || false
        });
      } else {
        form.reset({
          loan_product_id: '',
          Business_age: 12,
          is_GST: false,
          min_maintained_balance: 10000,
          max_outflow_ratio: 0.7,
          min_monthly_inflow: 50000,
          min_recommended_limit: 100000,
          max_recommended_limit: 1000000,
          mix_category: "retail",
          min_credit_score: 650,
          max_credit_score: 900,
          isActive: true
        });
      }
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (data: FormSchema) => {
    try {
      await onSave(data);
      form.reset();
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Loan Criteria' : 'Add New Loan Criteria'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the details for this loan criteria.'
              : 'Fill out the form below to create a new loan criteria.'}
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
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a loan product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loanProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
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
                    <FormLabel>Minimum Business Age (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_GST"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div>
                      <FormLabel>GST Registration Required</FormLabel>
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
                    <FormLabel>Minimum Maintained Balance (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_monthly_inflow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Monthly Inflow (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
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
                  <FormLabel>Maximum Outflow/Inflow Ratio (0-1)</FormLabel>
                  <FormDescription>
                    The maximum allowed ratio between monthly outflows and inflows
                  </FormDescription>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
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
                    <FormLabel>Minimum Recommended Limit (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
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
                    <FormLabel>Maximum Recommended Limit (₹)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mix_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a business category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["retail", "wholesale", "manufacturing", "service", "mixed"].map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
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
                name="min_credit_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Credit Score (300-900)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="300"
                        max="900"
                        {...field}
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
                    <FormLabel>Maximum Credit Score (300-900)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="300"
                        max="900"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{initialData ? 'Update' : 'Create'} Criteria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};