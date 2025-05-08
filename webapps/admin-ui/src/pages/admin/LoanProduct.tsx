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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
interface LoanProduct {
    _id: string;
    name: string;
    description?: string;
    loan_type: string;
    target_segment?: string;
    min_tenure_months: number;
    max_tenure_months: number;
    min_amount: number;
    max_amount: number;
    interest_rate: number;
    processing_fee_percent?: number;
    prepayment_penalty?: number;
    late_payment_fee?: number;
    prepayment_frequency?: string;
    grace_period_days?: number;
    required_documents?: string[];
    admin_id: string;
    createdAt: string;
    updatedAt: string;
}

// Form validation schema
const formSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    loan_type: z.string().min(1, "Loan type is required"),
    target_segment: z.string().optional(),
    min_tenure_months: z.number()
        .int("Must be a whole number")
        .min(1, "Minimum tenure must be at least 1 month"),
    max_tenure_months: z.number()
        .int("Must be a whole number")
        .min(1, "Maximum tenure must be at least 1 month"),
    min_amount: z.number() // New field
        .min(1, "Minimum amount must be at least 1"),
    max_amount: z.number() // New field
        .min(1, "Maximum amount must be at least 1"),
    interest_rate: z.number()
        .min(0, "Interest rate cannot be negative")
        .max(100, "Interest rate cannot exceed 100%"),
    processing_fee_percent: z.number()
        .min(0, "Processing fee cannot be negative")
        .max(100, "Processing fee cannot exceed 100%")
        .optional(),
    prepayment_penalty: z.number()
        .min(0, "Prepayment penalty cannot be negative")
        .optional(),
    late_payment_fee: z.number()
        .min(0, "Late payment fee cannot be negative")
        .optional(),
    prepayment_frequency: z.string().optional(),
    grace_period_days: z.number()
        .int("Must be a whole number")
        .min(0, "Grace period cannot be negative")
        .optional(),
    required_documents: z.array(z.string()).optional()
}).refine(data => data.max_tenure_months >= data.min_tenure_months, {
    message: "Maximum tenure must be greater than or equal to minimum tenure",
    path: ["max_tenure_months"]
}).refine(data => data.max_amount >= data.min_amount, {
    message: "Maximum amount must be greater than or equal to minimum amount",
    path: ["max_amount"]
});

type FormSchema = z.infer<typeof formSchema>;

// Constants
const LOAN_TYPES = [
    "Personal Loan",
    "Business Loan",
    "Home Loan",
    "Education Loan",
    "Vehicle Loan",
    "Working Capital Loan"
];

const TARGET_SEGMENTS = [
    "Salaried Individuals",
    "Self-Employed",
    "Small Businesses",
    "MSMEs",
    "Startups",
    "Corporate"
];

const PREPAYMENT_FREQUENCIES = [
    "Monthly",
    "Quarterly",
    "Half-Yearly",
    "Yearly",
    "Any Time"
];

const REQUIRED_DOCUMENTS = [
    "PAN Card",
    "Aadhaar Card",
    "Bank Statements",
    "Income Proof",
    "Business Proof",
    "Property Documents"
];

// Helper components
const RequiredFieldIndicator = () => (
    <span className="text-red-500">*</span>
);

const ProductFormField = ({
    children,
    label,
    required = false
}: {
    children: React.ReactNode,
    label: string,
    required?: boolean
}) => (
    <FormItem>
        <FormLabel>
            {label} {required && <RequiredFieldIndicator />}
        </FormLabel>
        {children}
    </FormItem>
);

// Main component
const LoanProduct = () => {
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<LoanProduct | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Form setup
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            loan_type: '',
            min_tenure_months: 6,
            max_tenure_months: 36,
            interest_rate: 12,
            processing_fee_percent: 1,
            prepayment_penalty: 2,
            late_payment_fee: 1,
            grace_period_days: 7
        }
    });

    // Fetch loan products
    useEffect(() => {
        const fetchLoanProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/loan-products`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch loan products');
                const data = await response.json();
                setLoanProducts(data);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Failed to load loan products',
                    variant: 'destructive'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchLoanProducts();
    }, []);

    // Dialog handlers
    const openEditDialog = (product: LoanProduct) => {
        setActiveProduct(product);
        form.reset({
            ...product,
            required_documents: product.required_documents || []
        });
        setIsDialogOpen(true);
    };

    const openNewDialog = () => {
        setActiveProduct(null);
        form.reset({
            name: '',
            description: '',
            loan_type: '',
            min_tenure_months: 6,
            max_tenure_months: 36,
            interest_rate: 12,
            processing_fee_percent: 1,
            prepayment_penalty: 2,
            late_payment_fee: 1,
            grace_period_days: 7,
            required_documents: []
        });
        setIsDialogOpen(true);
    };

    // Form submission
    const onSubmit = async (data: FormSchema) => {
        try {
            const url = activeProduct
                ? `${API_URL}/loan-products/${activeProduct._id}`
                : `${API_URL}/loan-products/create`;
            const method = activeProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to save loan product');

            const savedData = await response.json();
            setLoanProducts(prev =>
                activeProduct
                    ? prev.map(p => p._id === activeProduct._id ? savedData : p)
                    : [...prev, savedData]
            );

            toast({
                title: 'Success',
                description: `Product ${activeProduct ? 'updated' : 'created'} successfully`,
            });
            setIsDialogOpen(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save data',
                variant: 'destructive'
            });
        }
    };

    // Delete handler
    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`${API_URL}/loan-products/${productToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete loan product');

            setLoanProducts(prev => prev.filter(p => p._id !== productToDelete));
            toast({
                title: 'Success',
                description: 'Product deleted successfully',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to delete product',
                variant: 'destructive'
            });
        } finally {
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    // Helper functions
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Render
    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Loan Products</h1>
                <Button onClick={openNewDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Loan Products</CardTitle>
                    <CardDescription>Create and manage different loan products</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <p>Loading loan products...</p>
                        </div>
                    ) : loanProducts.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No loan products defined yet</p>
                            <Button className="mt-4" onClick={openNewDialog}>
                                Create First Product
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {loanProducts.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={() => openEditDialog(product)}
                                    onDelete={() => {
                                        setProductToDelete(product._id);
                                        setDeleteDialogOpen(true);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <ProductDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                form={form}
                onSubmit={onSubmit}
                isEdit={!!activeProduct}
            />

            <DeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDelete}
            />
        </div>
    );
};

// Sub-components
const ProductCard = ({
    product,
    onEdit,
    onDelete
}: {
    product: LoanProduct,
    onEdit: () => void,
    onDelete: () => void
}) => (
    <Card className="border-gray-200 overflow-hidden">
        <div className="flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <div>
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                        {product.loan_type} • Last updated: {new Date(product.updatedAt).toLocaleDateString()}
                    </p>
                </div>
                <Badge variant="outline">
                    {product.interest_rate}% Interest
                </Badge>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                    <div>
                        <span className="text-sm text-gray-500">Tenure Range</span>
                        <p className="font-medium">
                            {product.min_tenure_months} - {product.max_tenure_months} months
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Processing Fee</span>
                        <p className="font-medium">
                            {product.processing_fee_percent || 0}%
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Prepayment Penalty</span>
                        <p className="font-medium">
                            {product.prepayment_penalty || 0}%
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Loan Amount Range</span>
                        <p className="font-medium">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(product.min_amount)} - {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0
                            }).format(product.max_amount)}
                        </p>
                    </div>
                </div>

                {product.description && (
                    <>
                        <Separator className="my-4" />
                        <div>
                            <h4 className="text-sm font-medium mb-2">Description</h4>
                            <p className="text-gray-600">{product.description}</p>
                        </div>
                    </>
                )}

                {product.required_documents?.length > 0 && (
                    <>
                        <Separator className="my-4" />
                        <div>
                            <h4 className="text-sm font-medium mb-2">Required Documents</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.required_documents.map(doc => (
                                    <Badge key={doc} variant="secondary">
                                        {doc}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end p-4 bg-gray-50 border-t">
                <Button variant="outline" size="sm" className="mr-2" onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </Button>
                <Button variant="outline" size="sm" onClick={onDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </div>
        </div>
    </Card>
);

const ProductDialog = ({
    open,
    onOpenChange,
    form,
    onSubmit,
    isEdit
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    form: any,
    onSubmit: (data: any) => void,
    isEdit: boolean
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{isEdit ? 'Edit Loan Product' : 'Add New Loan Product'}</DialogTitle>
                <DialogDescription>
                    {isEdit ? 'Update the product details' : 'Fill out the form to create a new loan product'}
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <ProductFormField label="Product Name" required>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="loan_type"
                            render={({ field }) => (
                                <ProductFormField label="Loan Type" required>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select loan type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {LOAN_TYPES.map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="min_amount"
                            render={({ field }) => (
                                <ProductFormField label="Minimum Amount (₹)" required>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="max_amount"
                            render={({ field }) => (
                                <ProductFormField label="Maximum Amount (₹)" required>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <ProductFormField label="Description">
                                <FormControl>
                                    <Input placeholder="Enter product description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </ProductFormField>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="min_tenure_months"
                            render={({ field }) => (
                                <ProductFormField label="Minimum Tenure (months)" required>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="max_tenure_months"
                            render={({ field }) => (
                                <ProductFormField label="Maximum Tenure (months)" required>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="interest_rate"
                            render={({ field }) => (
                                <ProductFormField label="Interest Rate (%)" required>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max="100"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="processing_fee_percent"
                            render={({ field }) => (
                                <ProductFormField label="Processing Fee (%)">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prepayment_penalty"
                            render={({ field }) => (
                                <ProductFormField label="Prepayment Penalty (%)">
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...field}
                                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="target_segment"
                            render={({ field }) => (
                                <ProductFormField label="Target Segment">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select target segment" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {TARGET_SEGMENTS.map(segment => (
                                                <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="prepayment_frequency"
                            render={({ field }) => (
                                <ProductFormField label="Prepayment Frequency">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select prepayment frequency" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {PREPAYMENT_FREQUENCIES.map(freq => (
                                                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </ProductFormField>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="required_documents"
                        render={({ field }) => (
                            <ProductFormField label="Required Documents">
                                <Select
                                    value={[]}
                                    onValueChange={(value) => {
                                        const newValues = field.value ? [...field.value] : [];
                                        if (!newValues.includes(value)) {
                                            newValues.push(value);
                                            field.onChange(newValues);
                                        }
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Add required documents" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {REQUIRED_DOCUMENTS.map(doc => (
                                            <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value?.map(doc => (
                                        <Badge
                                            key={doc}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-red-100"
                                            onClick={() => {
                                                field.onChange(field.value?.filter(d => d !== doc));
                                            }}
                                        >
                                            {doc} ×
                                        </Badge>
                                    ))}
                                </div>
                                <FormMessage />
                            </ProductFormField>
                        )}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            {isEdit ? 'Update' : 'Create'} Product
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
);

const DeleteDialog = ({
    open,
    onOpenChange,
    onConfirm
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onConfirm: () => void
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this loan product? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export default LoanProduct;