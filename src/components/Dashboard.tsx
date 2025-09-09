import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { ExpenseChart } from "./ExpenseChart";
import { RecentTransactions } from "./RecentTransactions";
import { AddExpenseDialog } from "./AddExpenseDialog";

const budgetData = [
  { category: "Food", spent: 450, budget: 600, color: "food" },
  { category: "Transport", spent: 200, budget: 300, color: "transport" },
  { category: "Entertainment", spent: 150, budget: 200, color: "entertainment" },
  { category: "Utilities", spent: 350, budget: 400, color: "utilities" },
];

export const Dashboard = () => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = React.useState(false);
  
  const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expense Tracker</h1>
            <p className="text-muted-foreground">Track your spending and manage your budget</p>
          </div>
          <Button 
            onClick={() => setIsAddExpenseOpen(true)}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-expense" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-expense">${totalSpent}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${totalBudget}</div>
              <p className="text-xs text-muted-foreground">Monthly budget</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">${remaining}</div>
              <p className="text-xs text-muted-foreground">Available to spend</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <TrendingDown className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{Math.round((remaining / totalBudget) * 100)}%</div>
              <p className="text-xs text-muted-foreground">Of total budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {budgetData.map((item) => {
              const percentage = (item.spent / item.budget) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full bg-${item.color}`}
                      />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="text-sm">
                      <span className={isOverBudget ? "text-expense" : "text-foreground"}>
                        ${item.spent}
                      </span>
                      <span className="text-muted-foreground"> / ${item.budget}</span>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                  />
                  {isOverBudget && (
                    <p className="text-xs text-expense">
                      Over budget by ${item.spent - item.budget}
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Charts and Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart />
          <RecentTransactions />
        </div>

        <AddExpenseDialog 
          open={isAddExpenseOpen} 
          onOpenChange={setIsAddExpenseOpen}
        />
      </div>
    </div>
  );
};