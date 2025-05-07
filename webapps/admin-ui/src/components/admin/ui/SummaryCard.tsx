
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | null;
  icon: React.ReactNode;
  description?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  description
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div className="text-gray-500">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && change && (
          <div className={`text-xs flex items-center mt-1 ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? 
              <TrendingUp size={14} className="mr-1" /> : 
              <TrendingUp size={14} className="mr-1 rotate-180" />}
            {change} {description && <span className="text-gray-400 ml-1">{description}</span>}
          </div>
        )}
        {!trend && description && (
          <div className="text-xs text-gray-400 mt-1">{description}</div>
        )}
      </CardContent>
    </Card>
  );
};
