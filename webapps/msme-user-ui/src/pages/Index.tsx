
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, Lock, Smartphone } from "lucide-react";

const Index = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobileNumber || mobileNumber.length !== 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call for authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate to analytics page (skipping actual AA consent flow as per requirements)
      toast({
        title: "Account linked successfully",
        description: "Account aggregator consent obtained",
      });
      
      navigate("/analytics");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-finance-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-finance-primary">QuickCredit</h1>
          <p className="text-gray-600 mt-2">Fast & seamless credit for your business</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Link Your Account</h2>
            <p className="text-gray-600 mt-1 text-sm">
              Enter your mobile number associated with your bank account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="mobile" className="text-sm font-medium text-gray-700 block">
                Mobile Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  className="pl-10"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  Verifying <span className="ml-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                </span>
              ) : (
                <span className="flex items-center">
                  Continue <ChevronRight size={18} className="ml-1" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-center text-gray-500">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Lock size={12} />
              <span>Your data is secure and encrypted</span>
            </div>
            <p>
              By continuing, you agree to our Terms of Service & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
