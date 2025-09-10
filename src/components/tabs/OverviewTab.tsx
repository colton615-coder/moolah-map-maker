import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

// Mock data - in real app this would come from your data store
const monthlyData = [
  { day: '1', income: 0, expenses: 0, balance: 0 },
  { day: '2', income: 0, expenses: 0, balance: 0 },
  { day: '3', income: 0, expenses: 0, balance: 0 },
  { day: '4', income: 0, expenses: 0, balance: 0 },
  { day: '5', income: 0, expenses: 0, balance: 0 },
  { day: '6', income: 0, expenses: 0, balance: 0 },
  { day: '7', income: 0, expenses: 0, balance: 0 },
];

const dailyExpenses = [
  { day: 'Mon', amount: 0 },
  { day: 'Tue', amount: 0 },
  { day: 'Wed', amount: 0 },
  { day: 'Thu', amount: 0 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 0 },
  { day: 'Sun', amount: 0 },
];

const budgetData = [
  { name: 'Spent', value: 0, color: 'hsl(var(--expense))' },
  { name: 'Remaining', value: 0, color: 'hsl(var(--success))' },
];

export const OverviewTab: React.FC = () => {
  const { settings } = useTheme();
  const currencySymbol = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' }[settings.currency];
  
  const totalIncome = 0;
  const totalExpenses = 0;
  const netBalance = totalIncome - totalExpenses;
  const budgetUsed = totalExpenses > 0 ? (totalExpenses / 100) * 100 : 0; // Assuming 100 budget

  return (
    <div className="space-y-6 pb-20">
      {/* Month Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-success" />
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{currencySymbol}{totalIncome}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-expense" />
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-expense">{currencySymbol}{totalExpenses}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" />
              Net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-success' : 'text-expense'}`}>
              {currencySymbol}{netBalance}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-warning" />
              Budget Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{budgetUsed.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Of total budget</p>
          </CardContent>
        </Card>
      </div>

      {/* 30-Day Balance Line Chart */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>30-Day Running Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`${currencySymbol}${value}`, 'Balance']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Expenses Bar Chart */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Daily Expenses (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyExpenses}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`${currencySymbol}${value}`, 'Expenses']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="amount" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Donut Chart */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${currencySymbol}${value}`, 'Amount']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-primary">{budgetUsed.toFixed(0)}%</p>
            <p className="text-sm text-muted-foreground">Budget Used</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};