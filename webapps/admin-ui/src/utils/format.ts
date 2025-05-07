/**
 * Format a number as Indian currency (INR)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Format a date string to localized format
   */
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  /**
   * Format a number as a percentage
   */
  export const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };
  