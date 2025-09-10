import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportDataProps {
  transactions: any[];
  budgets: any[];
  goals: any[];
}

export const ExportData: React.FC<ExportDataProps> = ({ 
  transactions, 
  budgets, 
  goals 
}) => {
  const { toast } = useToast();

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No data to export",
        description: `No ${filename.toLowerCase()} data available.`,
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful!",
      description: `${filename} exported as CSV file.`,
    });
  };

  const generateReport = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
    
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: any, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    const report = {
      generatedOn: new Date().toISOString(),
      period: currentMonth,
      summary: {
        totalIncome,
        totalExpenses,
        netAmount: totalIncome - totalExpenses,
        transactionCount: monthlyTransactions.length,
      },
      categoryBreakdown,
      budgetComparison: budgets.map(budget => {
        const spent = monthlyTransactions
          .filter(t => t.category === budget.category && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          category: budget.category,
          budgeted: budget.amount,
          spent,
          remaining: budget.amount - spent,
          percentageUsed: (spent / budget.amount) * 100,
        };
      }),
      goalProgress: goals.map(goal => ({
        title: goal.title,
        target: goal.targetAmount,
        current: goal.currentAmount,
        progress: goal.progress,
        remaining: goal.targetAmount - goal.currentAmount,
      })),
    };

    const reportContent = JSON.stringify(report, null, 2);
    const blob = new Blob([reportContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report generated!",
      description: "Comprehensive financial report downloaded.",
    });
  };

  return (
    <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => exportToCSV(transactions, 'Transactions')}
            className="w-full justify-start transition-all duration-200 hover:scale-105"
          >
            <Table className="w-4 h-4 mr-2" />
            Export Transactions (CSV)
          </Button>

          <Button
            variant="outline"
            onClick={() => exportToCSV(budgets, 'Budgets')}
            className="w-full justify-start transition-all duration-200 hover:scale-105"
          >
            <Table className="w-4 h-4 mr-2" />
            Export Budgets (CSV)
          </Button>

          <Button
            variant="outline"
            onClick={() => exportToCSV(goals, 'Goals')}
            className="w-full justify-start transition-all duration-200 hover:scale-105"
          >
            <Table className="w-4 h-4 mr-2" />
            Export Goals (CSV)
          </Button>

          <Button
            onClick={generateReport}
            className="w-full justify-start bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report (JSON)
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          <p>• CSV files can be opened in Excel or Google Sheets</p>
          <p>• JSON reports contain comprehensive financial analysis</p>
          <p>• All exports include data up to the current date</p>
        </div>
      </CardContent>
    </Card>
  );
};