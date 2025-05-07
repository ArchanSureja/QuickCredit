import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Applications from "./pages/admin/Applications";
import LoanCriteria from "./pages/admin/LoanCriteria";
import Analytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

// Auth check component for protected routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  // Initialize auth state from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check login status on mount
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  // Wait until auth state is determined
  if (isLoggedIn === null) {
    return null; // Or a loading spinner
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin" 
              element={
                <RequireAuth>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/applications" 
              element={
                <RequireAuth>
                  <AdminLayout>
                    <Applications />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/loan-criteria" 
              element={
                <RequireAuth>
                  <AdminLayout>
                    <LoanCriteria />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <RequireAuth>
                  <AdminLayout>
                    <Analytics />
                  </AdminLayout>
                </RequireAuth>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
