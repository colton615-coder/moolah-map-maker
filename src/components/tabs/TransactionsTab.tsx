import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';

const transactions = [
  {
    id: 1,
    description: 'Grocery Shopping at Whole Foods',
    amount: 65.50,
    category: 'Food',
    date: '2024-03-15',
    time: '14:30',
    color: 'food',
    type: 'expense'
  },
  {
    id: 2,
    description: 'Salary Deposit',
    amount: 2000.00,
    category: 'Income',
    date: '2024-03-15',
    time: '09:00',
    color: 'success',
    type: 'income'
  },
  {
    id: 3,
    description: 'Gas Station - Shell',
    amount: 45.00,
    category: 'Transport',
    date: '2024-03-14',
    time: '18:15',
    color: 'transport',
    type: 'expense'
  },
  {
    id: 4,
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2024-03-13',
    time: '12:00',
    color: 'entertainment',
    type: 'expense'
  },
  {
    id: 5,
    description: 'Electricity Bill',
    amount: 120.00,
    category: 'Utilities',
    date: '2024-03-12',
    time: '16:45',
    color: 'utilities',
    type: 'expense'
  },
  {
    id: 6,
    description: 'Coffee Shop - Starbucks',
    amount: 8.50,
    category: 'Food',
    date: '2024-03-12',
    time: '08:30',
    color: 'food',
    type: 'expense'
  },
  {
    id: 7,
    description: 'Online Shopping - Amazon',
    amount: 89.99,
    category: 'Shopping',
    date: '2024-03-11',
    time: '20:15',
    color: 'shopping',
    type: 'expense'
  },
  {
    id: 8,
    description: 'Freelance Payment',
    amount: 500.00,
    category: 'Income',
    date: '2024-03-10',
    time: '11:30',
    color: 'success',
    type: 'income'
  },
];

export const TransactionsTab: React.FC = () => {
  const { settings } = useTheme();
  const currencySymbol = { USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$' }[settings.currency];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || transaction.category.toLowerCase() === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
      } else if (sortBy === 'amount') {
        return b.amount - a.amount;
      }
      return 0;
    });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-success border-0 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-success-foreground/80 mb-1">Total Income</p>
            <p className="text-xl font-bold text-success-foreground">
              +{currencySymbol}{totalIncome.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card border border-destructive/20 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
            <p className="text-xl font-bold text-destructive">
              -{currencySymbol}{totalExpenses.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Transactions</CardTitle>
            <Button 
              size="sm"
              onClick={() => setIsAddExpenseOpen(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-10 rounded-full bg-${transaction.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} at {transaction.time}
                      </p>
                      <Badge variant="secondary" className="text-xs h-5">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className={`font-bold text-sm ${
                    transaction.type === 'income' ? 'text-success' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{currencySymbol}{transaction.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No transactions found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      <AddExpenseDialog 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen}
      />
    </div>
  );
};