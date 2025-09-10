import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

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
  const currencySymbol = '$'; // Default to USD for now
  
  const totalIncome = 0;
  const totalExpenses = 0;
  const netBalance = totalIncome - totalExpenses;
  const budgetUsed = totalExpenses > 0 ? (totalExpenses / 100) * 100 : 0; // Assuming 100 budget

  return (
    <div className="space-y-8 pb-24">
      {/* Month Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-success opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-full">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              Income
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-success mb-1">{currencySymbol}{totalIncome}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-expense opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 bg-expense/10 rounded-full">
                <TrendingDown className="w-4 h-4 text-expense" />
              </div>
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-expense mb-1">{currencySymbol}{totalExpenses}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className={`text-3xl font-bold mb-1 ${netBalance >= 0 ? 'text-success' : 'text-expense'}`}>
              {currencySymbol}{netBalance}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden relative">
          <div className="absolute inset-0 bg-warning/5 group-hover:bg-warning/10 transition-colors duration-300" />
          <CardHeader className="pb-3 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-full">
                <Target className="w-4 h-4 text-warning" />
              </div>
              Budget Used
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-warning mb-1">{budgetUsed.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Of total budget</p>
          </CardContent>
        </Card>
      </div>

      {/* 30-Day Balance Line Chart */}
      <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-8 bg-gradient-primary rounded-full" />
            30-Day Running Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip 
                  formatter={(value) => [`${currencySymbol}${value}`, 'Balance']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="url(#primaryGradient)" 
                  strokeWidth={4}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: 'hsl(var(--primary))' }}
                  fill="url(#balanceGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Daily Expenses Bar Chart */}
      <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-8 bg-gradient-expense rounded-full" />
            Daily Expenses (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyExpenses}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--expense))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--expense))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis hide />
              <Tooltip 
                formatter={(value) => [`${currencySymbol}${value}`, 'Expenses']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="url(#expenseGradient)" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Donut Chart */}
      <Card className="glass-effect border-0 shadow-card card-hover group overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-2 h-8 bg-gradient-success rounded-full" />
            Monthly Budget Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <defs>
                  <linearGradient id="spentGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--expense))" />
                    <stop offset="100%" stopColor="hsl(var(--warning))" />
                  </linearGradient>
                  <linearGradient id="remainingGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                </defs>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  <Cell fill="url(#spentGradient)" />
                  <Cell fill="url(#remainingGradient)" />
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${currencySymbol}${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-card)'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {budgetUsed.toFixed(0)}%
                </p>
                <p className="text-sm text-muted-foreground">Used</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};