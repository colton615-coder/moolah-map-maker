import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Brain, Lightbulb } from 'lucide-react';
import { categoryConfigs } from './CategoryIcons';

interface InsightsProps {
  transactions: any[];
  budgets: any[];
  goals: any[];
}

interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  amount?: number;
  category?: string;
}

export const SmartInsights: React.FC<InsightsProps> = ({ transactions, budgets, goals }) => {
  const insights = useMemo((): Insight[] => {
    const insights: Insight[] = [];
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const lastMonth = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return transactionDate.getMonth() === lastMonthDate.getMonth() && 
             transactionDate.getFullYear() === lastMonthDate.getFullYear();
    });

    // Spending trend analysis
    const thisMonthSpend = thisMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const lastMonthSpend = lastMonth.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const spendingChange = ((thisMonthSpend - lastMonthSpend) / (lastMonthSpend || 1)) * 100;

    if (spendingChange > 20) {
      insights.push({
        id: 'spending-increase',
        type: 'warning',
        title: 'Spending Alert',
        description: `Your spending increased by ${spendingChange.toFixed(1)}% compared to last month`,
        icon: <TrendingUp className="w-5 h-5" />,
        amount: thisMonthSpend - lastMonthSpend
      });
    } else if (spendingChange < -10) {
      insights.push({
        id: 'spending-decrease',
        type: 'success',
        title: 'Great Progress!',
        description: `You reduced spending by ${Math.abs(spendingChange).toFixed(1)}% this month`,
        icon: <TrendingDown className="w-5 h-5" />,
        amount: Math.abs(thisMonthSpend - lastMonthSpend)
      });
    }

    // Category analysis
    const categorySpending = thisMonth.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => Number(b) - Number(a))[0];

    if (topCategory && Number(topCategory[1]) > thisMonthSpend * 0.4) {
      const categoryConfig = categoryConfigs.find(c => c.value === topCategory[0]);
      insights.push({
        id: 'category-dominant',
        type: 'info',
        title: 'Category Focus',
        description: `${categoryConfig?.label || topCategory[0]} represents ${((Number(topCategory[1]) / thisMonthSpend) * 100).toFixed(1)}% of your spending`,
        icon: <Target className="w-5 h-5" />,
        category: topCategory[0],
        amount: Number(topCategory[1])
      });
    }

    // Budget analysis
    budgets.forEach(budget => {
      const categoryTransactions = thisMonth.filter(t => t.category === budget.category);
      const spent = categoryTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount) || 0), 0);
      const percentage = (spent / budget.amount) * 100;

      if (percentage > 90) {
        insights.push({
          id: `budget-${budget.category}`,
          type: 'warning',
          title: 'Budget Alert',
          description: `You've used ${percentage.toFixed(1)}% of your ${budget.category} budget`,
          icon: <AlertTriangle className="w-5 h-5" />,
          category: budget.category,
          amount: spent
        });
      }
    });

    // Smart recommendations
    const weekdaySpending = thisMonth.reduce((acc, t) => {
      const day = new Date(t.date).getDay();
      acc[day] = (acc[day] || 0) + Math.abs(Number(t.amount) || 0);
      return acc;
    }, {} as Record<number, number>);

    const weekendSpending = (weekdaySpending[0] || 0) + (weekdaySpending[6] || 0);
    const weekdayTotals = Object.entries(weekdaySpending)
      .filter(([day]) => ![0, 6].includes(Number(day)))
      .reduce((sum, [, amount]) => sum + (Number(amount) || 0), 0);
    const weekdayAvg = weekdayTotals / 5;

    if (weekendSpending > weekdayAvg * 3) {
      insights.push({
        id: 'weekend-spending',
        type: 'tip',
        title: 'Weekend Spending Pattern',
        description: 'You tend to spend more on weekends. Consider setting a weekend budget',
        icon: <Lightbulb className="w-5 h-5" />,
        action: 'Set Weekend Budget'
      });
    }

    // Goal progress insights
    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const monthsLeft = Math.ceil((new Date(goal.targetDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
      const requiredMonthly = (goal.targetAmount - (Number(goal.currentAmount) || 0)) / Math.max(monthsLeft, 1);

      if (progress < 50 && monthsLeft <= 6) {
        insights.push({
          id: `goal-${goal.id}`,
          type: 'warning',
          title: 'Goal Behind Schedule',
          description: `You need to save $${requiredMonthly.toFixed(2)}/month to reach your ${goal.title} goal`,
          icon: <Target className="w-5 h-5" />,
          amount: requiredMonthly
        });
      }
    });

    return insights.slice(0, 6); // Limit to 6 insights
  }, [transactions, budgets, goals]);

  const getInsightStyle = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
      case 'tip':
        return 'border-accent/20 bg-accent/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getInsightBadge = (type: Insight['type']) => {
    switch (type) {
      case 'warning':
        return <Badge variant="destructive" className="ml-2">Alert</Badge>;
      case 'success':
        return <Badge className="ml-2 bg-success text-success-foreground">Success</Badge>;
      case 'info':
        return <Badge variant="secondary" className="ml-2">Info</Badge>;
      case 'tip':
        return <Badge variant="outline" className="ml-2">Tip</Badge>;
      default:
        return null;
    }
  };

  if (insights.length === 0) {
    return (
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add more transactions to see AI-powered insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Smart Insights
          <Badge variant="secondary" className="ml-auto">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <Alert key={insight.id} className={`${getInsightStyle(insight.type)} transition-all duration-200 hover:shadow-md`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{insight.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  {getInsightBadge(insight.type)}
                </div>
                <AlertDescription className="text-sm mt-1">
                  {insight.description}
                  {insight.amount && (
                    <span className="font-medium ml-1">
                      (${insight.amount.toFixed(2)})
                    </span>
                  )}
                </AlertDescription>
                {insight.action && (
                  <button className="text-xs text-primary hover:underline mt-2">
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};