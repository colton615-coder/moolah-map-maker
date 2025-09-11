import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { EnhancedChart } from '@/components/EnhancedChart';
import { SpendingAlerts } from '@/components/SpendingAlerts';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useToast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const EnhancedOverviewTab: React.FC = () => {
  const currencySymbol = '$';
  const [transactions] = useIndexedDB('transactions', []);
  const [budgets] = useIndexedDB('budgets', []);
  const [goals] = useIndexedDB('financialGoals', []);
  const { toast } = useToast();

  // Calculate current month data
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter(t => 
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const netBalance = totalIncome - totalExpenses;
  
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const budgetUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;


  // Goal progress summary
  const activeGoals = goals.filter(g => g.progress < 100);
  const completedGoals = goals.filter(g => g.progress >= 100);

  return (
    <div className="space-y-8 pb-24">
      {/* Spending Alerts */}
      <SpendingAlerts budgets={budgets} transactions={currentMonthTransactions} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-success border-0 shadow-floating pulse-aurora overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-4 text-center relative z-10">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success-foreground" />
            <p className="text-xs text-success-foreground/80 mb-1">Income</p>
            <p className="text-2xl font-bold text-success-foreground">
              {currencySymbol}{totalIncome.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-expense border-0 shadow-floating overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-4 text-center relative z-10">
            <TrendingDown className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-xs text-white/80 mb-1">Expenses</p>
            <p className="text-2xl font-bold text-white">
              {currencySymbol}{totalExpenses.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-floating overflow-hidden relative ${
          netBalance >= 0 ? 'bg-gradient-success' : 'bg-gradient-expense'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-4 text-center relative z-10">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-white" />
            <p className="text-xs text-white/80 mb-1">Net</p>
            <p className="text-2xl font-bold text-white">
              {netBalance >= 0 ? '+' : ''}{currencySymbol}{netBalance.toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-primary border-0 shadow-floating overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <CardContent className="p-4 text-center relative z-10">
            <Target className="w-8 h-8 mx-auto mb-2 text-primary-foreground" />
            <p className="text-xs text-primary-foreground/80 mb-1">Budget</p>
            <p className="text-2xl font-bold text-primary-foreground">
              {budgetUsed.toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>


      {/* Goals Summary */}
      {goals.length > 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Financial Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Active Goals ({activeGoals.length})</h4>
                {activeGoals.slice(0, 3).map(goal => (
                  <div key={goal.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-background rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(goal.progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {goal.progress.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recent Achievements</h4>
                {completedGoals.slice(0, 3).map(goal => (
                  <div key={goal.id} className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl">🎉</div>
                    <div>
                      <p className="font-medium text-sm">{goal.title}</p>
                      <Badge variant="secondary" className="mt-1 bg-success/20 text-success">
                        Completed
                      </Badge>
                    </div>
                  </div>
                ))}
                {completedGoals.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No completed goals yet. Keep working towards your targets!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Charts */}
      <EnhancedChart transactions={transactions} budgets={budgets} />

      {/* Recent Activity Summary */}
      <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentMonthTransactions.slice(0, 5).map((transaction, index) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-8 rounded-full bg-${transaction.color}`} />
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), 'MMM dd')} • {transaction.category}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${
                  transaction.type === 'income' ? 'text-success' : 'text-destructive'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toFixed(2)}
                </p>
              </div>
            ))}
            
            {currentMonthTransactions.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-muted-foreground">No transactions this month yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};