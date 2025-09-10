import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const budgetData = [
  { 
    id: 1,
    category: 'Food', 
    spent: 0, 
    budget: 0, 
    color: 'food',
    lastUpdated: 'Never'
  },
  { 
    id: 2,
    category: 'Transport', 
    spent: 0, 
    budget: 0, 
    color: 'transport',
    lastUpdated: 'Never'
  },
  { 
    id: 3,
    category: 'Entertainment', 
    spent: 0, 
    budget: 0, 
    color: 'entertainment',
    lastUpdated: 'Never'
  },
  { 
    id: 4,
    category: 'Utilities', 
    spent: 0, 
    budget: 0, 
    color: 'utilities',
    lastUpdated: 'Never'
  },
  { 
    id: 5,
    category: 'Shopping', 
    spent: 0, 
    budget: 0, 
    color: 'shopping',
    lastUpdated: 'Never'
  },
  { 
    id: 6,
    category: 'Healthcare', 
    spent: 0, 
    budget: 0, 
    color: 'healthcare',
    lastUpdated: 'Never'
  },
];

export const BudgetsTab: React.FC = () => {
  const { settings } = useTheme();
  const currencySymbol = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' }[settings.currency];
  
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const overBudgetItems = budgetData.filter(item => item.spent > item.budget);

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Card */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Monthly Budget Overview</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {currencySymbol}{totalSpent} of {currencySymbol}{totalBudget} used
              </p>
            </div>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-1" />
              Add Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={(totalSpent / totalBudget) * 100} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% used
              </span>
              <span className="text-muted-foreground">
                {currencySymbol}{totalBudget - totalSpent} remaining
              </span>
            </div>
          </div>
          
          {overBudgetItems.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">
                  {overBudgetItems.length} {overBudgetItems.length === 1 ? 'category is' : 'categories are'} over budget
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="space-y-4">
        {budgetData.map((item) => {
          const percentage = (item.spent / item.budget) * 100;
          const isOverBudget = percentage > 100;
          const remainingAmount = item.budget - item.spent;
          
          return (
            <Card key={item.id} className="bg-gradient-card border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${item.color}`} />
                    <div>
                      <h3 className="font-semibold">{item.category}</h3>
                      <p className="text-xs text-muted-foreground">
                        Updated {item.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className={`font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                        {currencySymbol}{item.spent}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {currencySymbol}{item.budget}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2 mb-2"
                />
                
                <div className="flex justify-between items-center text-sm">
                  <span className={isOverBudget ? 'text-destructive' : 'text-muted-foreground'}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span className={isOverBudget ? 'text-destructive' : 'text-success'}>
                    {isOverBudget 
                      ? `Over by ${currencySymbol}${Math.abs(remainingAmount)}`
                      : `${currencySymbol}${remainingAmount} left`
                    }
                  </span>
                </div>
                
                {isOverBudget && (
                  <div className="mt-2 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded">
                    Consider adjusting your spending or increasing this budget
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};