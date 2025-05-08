// import React, { useState } from 'react';
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription 
// } from '@/components/ui/card';
// import { 
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { StatusBadge } from '@/components/admin/ui/StatusBadge';
// import { useApplications } from '@/hooks/useApplications';
// import { useAnalytics } from '@/hooks/useAnalytics';
// import { ApplicationStatus, LoanApplication } from '@/types/loan';
// import { Search, Filter } from 'lucide-react';
// import { formatCurrency } from '@/utils/format';

// const Applications = () => {
//   const { applications, loading, updateStatus, statusFilter, setStatusFilter } = useApplications();
//   const { fetchBankAnalytics } = useAnalytics();
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
//   const [showDetails, setShowDetails] = useState(false);
  
//   // Filter applications based on search term
//   const filteredApplications = applications.filter(app => 
//     app.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     app.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     app.loanName.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   const handleStatusChange = async (id: string, status: ApplicationStatus) => {
//     await updateStatus(id, status);
//   };
  
//   const viewDetails = async (app: LoanApplication) => {
//     setSelectedApp(app);
//     await fetchBankAnalytics(app.id);
//     setShowDetails(true);
//   };
  
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Loan Applications</h1>
      
//       <Card>
//         <CardHeader>
//           <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
//             <div>
//               <CardTitle>All Applications</CardTitle>
//               <CardDescription>Manage and review loan applications</CardDescription>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
//               <div className="relative w-full sm:w-64">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
//                 <Input 
//                   placeholder="Search applications..." 
//                   className="pl-8"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
              
//               <div className="flex items-center gap-2 w-full sm:w-auto">
//                 <Filter className="h-4 w-4 text-gray-400" />
//                 <Select 
//                   value={statusFilter ?? "all"} 
//                   onValueChange={(value) => setStatusFilter(value==="all" ? undefined : value as ApplicationStatus)}
//                 >
//                   <SelectTrigger className="w-full sm:w-[180px]">
//                     <SelectValue placeholder="Filter by status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectItem value="all">All Status</SelectItem>
//                       <SelectItem value="applied">Applied</SelectItem>
//                       <SelectItem value="review">In Review</SelectItem>
//                       <SelectItem value="disbursed">Disbursed</SelectItem>
//                       <SelectItem value="rejected">Rejected</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center py-8">
//               <div className="animate-pulse">Loading applications...</div>
//             </div>
//           ) : filteredApplications.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-gray-500">No applications found matching your criteria</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-gray-200">
//                     <th className="text-left py-3 px-4">ID</th>
//                     <th className="text-left py-3 px-4">Loan Name</th>
//                     <th className="text-left py-3 px-4">Provider</th>
//                     <th className="text-left py-3 px-4">Amount</th>
//                     <th className="text-left py-3 px-4">Tenure</th>
//                     <th className="text-left py-3 px-4">Applied Date</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-left py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredApplications.map((app) => (
//                     <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
//                       <td className="py-4 px-4">{app.id}</td>
//                       <td className="py-4 px-4 font-medium">{app.loanName}</td>
//                       <td className="py-4 px-4">{app.provider}</td>
//                       <td className="py-4 px-4">{formatCurrency(app.amount)}</td>
//                       <td className="py-4 px-4">
//                         {app.tenure} {app.tenure === 1 ? app.tenureUnit.slice(0, -1) : app.tenureUnit}
//                       </td>
//                       <td className="py-4 px-4 text-gray-500">
//                         {new Date(app.appliedDate).toLocaleDateString()}
//                       </td>
//                       <td className="py-4 px-4">
//                         <StatusBadge status={app.status} />
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="flex flex-wrap gap-2">
//                           <Button 
//                             variant="outline" 
//                             size="sm" 
//                             onClick={() => viewDetails(app)}
//                           >
//                             View
//                           </Button>
                          
//                           {app.status === 'applied' && (
//                             <Button 
//                               variant="outline" 
//                               size="sm" 
//                               className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
//                               onClick={() => handleStatusChange(app.id, 'review')}
//                             >
//                               Review
//                             </Button>
//                           )}
                          
//                           {app.status === 'review' && (
//                             <>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="text-green-600 border-green-200 hover:bg-green-50"
//                                 onClick={() => handleStatusChange(app.id, 'disbursed')}
//                               >
//                                 Approve
//                               </Button>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm" 
//                                 className="text-red-600 border-red-200 hover:bg-red-50"
//                                 onClick={() => handleStatusChange(app.id, 'rejected')}
//                               >
//                                 Reject
//                               </Button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
      
//       {/* Application Details Dialog */}
//       <Dialog open={showDetails} onOpenChange={setShowDetails}>
//         <DialogContent className="sm:max-w-[600px]">
//           <DialogHeader>
//             <DialogTitle>Application Details</DialogTitle>
//             <DialogDescription>
//               Review application {selectedApp?.id}
//             </DialogDescription>
//           </DialogHeader>
          
//           {selectedApp && (
//             <div className="mt-4 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500 mb-1">Loan Details</h4>
//                   <div className="bg-gray-50 p-4 rounded-md space-y-2">
//                     <div>
//                       <span className="text-sm text-gray-500">Loan Name:</span>
//                       <p className="font-medium">{selectedApp.loanName}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Provider:</span>
//                       <p className="font-medium">{selectedApp.provider}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Amount:</span>
//                       <p className="font-medium">{formatCurrency(selectedApp.amount)}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Interest Rate:</span>
//                       <p className="font-medium">{selectedApp.interestRate}%</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Tenure:</span>
//                       <p className="font-medium">
//                         {selectedApp.tenure} {selectedApp.tenureUnit}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500 mb-1">Application Status</h4>
//                   <div className="bg-gray-50 p-4 rounded-md space-y-2">
//                     <div>
//                       <span className="text-sm text-gray-500">Current Status:</span>
//                       <p className="mt-1">
//                         <StatusBadge status={selectedApp.status} />
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Applied Date:</span>
//                       <p className="font-medium">
//                         {new Date(selectedApp.appliedDate).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Last Updated:</span>
//                       <p className="font-medium">
//                         {new Date(selectedApp.lastUpdated).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="pt-2 flex justify-end gap-2">
//                 {selectedApp.status === 'applied' && (
//                   <Button 
//                     onClick={() => {
//                       handleStatusChange(selectedApp.id, 'review');
//                       setShowDetails(false);
//                     }}
//                   >
//                     Mark for Review
//                   </Button>
//                 )}
//                 {selectedApp.status === 'review' && (
//                   <>
//                     <Button 
//                       variant="outline" 
//                       onClick={() => {
//                         handleStatusChange(selectedApp.id, 'rejected');
//                         setShowDetails(false);
//                       }}
//                       className="text-red-600 border-red-200 hover:bg-red-50"
//                     >
//                       Reject
//                     </Button>
//                     <Button 
//                       onClick={() => {
//                         handleStatusChange(selectedApp.id, 'disbursed');
//                         setShowDetails(false);
//                       }}
//                       className="bg-green-600 hover:bg-green-700"
//                     >
//                       Approve & Disburse
//                     </Button>
//                   </>
//                 )}
                
//                 <Button variant="outline" onClick={() => setShowDetails(false)}>
//                   Close
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Applications;
