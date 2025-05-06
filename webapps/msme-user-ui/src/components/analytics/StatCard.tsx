
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: ReactNode;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className,
  children 
}: StatCardProps) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="mt-1 text-2xl font-semibold">{value}</h4>
          
          {change && (
            <div className="mt-1 flex items-center">
              <span
                className={cn(
                  "text-xs font-medium",
                  change.isPositive ? "text-finance-success" : "text-finance-danger"
                )}
              >
                {change.isPositive ? "+" : "-"}{Math.abs(change.value)}%
              </span>
              <span className="ml-1.5 text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 bg-finance-primary/10 rounded-md">
            {icon}
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default StatCard;
