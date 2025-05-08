
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  CreditCard, 
  Home, 
  BarChart3, 
  FileText, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    // { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Loan Offers", href: "/offers", icon: CreditCard },
    { name: "Applications", href: "/applications", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile menu toggle */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-finance-primary">QuickCredit</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  location.pathname === item.href
                    ? "bg-finance-primary text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-600 hover:text-finance-primary hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default MainLayout;
