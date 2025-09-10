import React, { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpendingAlertsProps {
  budgets: any[];
  transactions: any[];
}

export const SpendingAlerts: React.FC<SpendingAlertsProps> = ({ 
  budgets, 
  transactions 
}) => {
  const { toast } = useToast();

  useEffect(() => {
    // Calculate spending for each budget category
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    
    budgets.forEach(budget => {
      const categorySpending = transactions
        .filter(t => 
          t.category === budget.category && 
          t.type === 'expense' &&
          t.date.startsWith(currentMonth)
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const spendingPercentage = (categorySpending / budget.amount) * 100;

      // Show alerts for high spending
      if (spendingPercentage >= 90) {
        toast({
          title: "⚠️ Budget Alert!",
          description: `You've spent ${spendingPercentage.toFixed(0)}% of your ${budget.category} budget this month.`,
          variant: "destructive",
        });
      } else if (spendingPercentage >= 75) {
        toast({
          title: "📊 Budget Warning",
          description: `You've spent ${spendingPercentage.toFixed(0)}% of your ${budget.category} budget this month.`,
        });
      }
    });
  }, [budgets, transactions, toast]);

  // Calculate current alerts
  const currentMonth = new Date().toISOString().slice(0, 7);
  const alerts = budgets.map(budget => {
    const categorySpending = transactions
      .filter(t => 
        t.category === budget.category && 
        t.type === 'expense' &&
        t.date.startsWith(currentMonth)
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const spendingPercentage = (categorySpending / budget.amount) * 100;
    const remaining = budget.amount - categorySpending;

    return {
      ...budget,
      spent: categorySpending,
      percentage: spendingPercentage,
      remaining,
      status: spendingPercentage >= 90 ? 'danger' : 
               spendingPercentage >= 75 ? 'warning' : 'safe'
    };
  }).filter(alert => alert.status !== 'safe');

  if (alerts.length === 0) {
    return (
      <Alert className="border-success/50 bg-success/5 animate-fade-in">
        <CheckCircle className="h-4 w-4 text-success" />
        <AlertDescription className="text-success-foreground">
          Great job! All your spending is within budget limits.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      {alerts.map(alert => (
        <Alert 
          key={alert.category}
          className={`transition-all duration-300 hover:scale-105 ${
            alert.status === 'danger' 
              ? 'border-destructive/50 bg-destructive/5' 
              : 'border-warning/50 bg-warning/5'
          }`}
        >
          {alert.status === 'danger' ? (
            <AlertTriangle className="h-4 w-4 text-destructive" />
          ) : (
            <TrendingUp className="h-4 w-4 text-warning" />
          )}
          <AlertDescription className={
            alert.status === 'danger' ? 'text-destructive' : 'text-warning'
          }>
            <span className="font-medium capitalize">{alert.category}</span>: 
            You've spent ${alert.spent.toFixed(2)} of ${alert.amount.toFixed(2)} 
            ({alert.percentage.toFixed(0)}%). 
            ${alert.remaining.toFixed(2)} remaining.
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};