import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, Filter, ArrowUpDown, CalendarIcon, Download, Repeat, Target, TrendingUp } from 'lucide-react';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { RecurringTransactionDialog } from '@/components/RecurringTransactionDialog';
import { ExportData } from '@/components/ExportData';
import { format, isWithinInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIndexedDB } from '@/hooks/useIndexedDB';

export const AdvancedTransactionsTab: React.FC = () => {
  const currencySymbol = '$';
  
  const [transactions, setTransactions] = useIndexedDB('transactions', []);
  const [recurringTransactions, setRecurringTransactions] = useIndexedDB('recurringTransactions', []);
  const [goals, setGoals] = useIndexedDB('financialGoals', []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const addTransaction = (newTransaction: any) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const addRecurringTransaction = (newRecurring: any) => {
    setRecurringTransactions([newRecurring, ...recurringTransactions]);
  };

  // Advanced filtering
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        // Search filter
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Category filter
        const matchesCategory = filterCategory === 'all' || transaction.category.toLowerCase() === filterCategory;
        
        // Type filter
        const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
        
        // Date range filter
        let matchesDate = true;
        if (dateRange.from || dateRange.to) {
          const transactionDate = new Date(transaction.date);
          if (dateRange.from && dateRange.to) {
            matchesDate = isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to });
          } else if (dateRange.from) {
            matchesDate = transactionDate >= dateRange.from;
          } else if (dateRange.to) {
            matchesDate = transactionDate <= dateRange.to;
          }
        }
        
        // Amount range filter
        let matchesAmount = true;
        if (amountRange.min || amountRange.max) {
          const min = parseFloat(amountRange.min) || 0;
          const max = parseFloat(amountRange.max) || Infinity;
          matchesAmount = transaction.amount >= min && transaction.amount <= max;
        }
        
        return matchesSearch && matchesCategory && matchesType && matchesDate && matchesAmount;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime();
        } else if (sortBy === 'amount') {
          return b.amount - a.amount;
        } else if (sortBy === 'category') {
          return a.category.localeCompare(b.category);
        }
        return 0;
      });
  }, [transactions, searchTerm, filterCategory, sortBy, dateRange, amountRange, typeFilter]);

  // Quick date filters
  const setQuickDateRange = (type: string) => {
    const now = new Date();
    switch (type) {
      case 'today':
        setDateRange({ from: now, to: now });
        break;
      case 'week':
        setDateRange({ from: startOfWeek(now), to: endOfWeek(now) });
        break;
      case 'month':
        setDateRange({ from: startOfMonth(now), to: endOfMonth(now) });
        break;
      case 'year':
        setDateRange({ from: startOfYear(now), to: endOfYear(now) });
        break;
      case 'all':
        setDateRange({ from: undefined, to: undefined });
        break;
    }
  };

  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalIncome - totalExpenses;

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-success border-0 shadow-floating pulse-aurora">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success-foreground" />
            <p className="text-sm text-success-foreground/80 mb-1">Income</p>
            <p className="text-xl font-bold text-success-foreground">
              +{currencySymbol}{totalIncome.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-expense border-0 shadow-floating">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-white rotate-180" />
            <p className="text-sm text-white/80 mb-1">Expenses</p>
            <p className="text-xl font-bold text-white">
              -{currencySymbol}{totalExpenses.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-floating ${netAmount >= 0 ? 'bg-gradient-success' : 'bg-gradient-expense'}`}>
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-white" />
            <p className="text-sm text-white/80 mb-1">Net Amount</p>
            <p className="text-xl font-bold text-white">
              {netAmount >= 0 ? '+' : ''}{currencySymbol}{netAmount.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Controls */}
      <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <CardTitle className="text-lg gradient-text">Advanced Transactions</CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setIsRecurringOpen(true)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Repeat className="w-4 h-4 mr-1" />
                Recurring
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setShowExport(!showExport)}
                className="transition-all duration-200 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-gradient-primary hover:opacity-90 button-glow transition-all duration-200 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:scale-105"
            />
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover border border-border shadow-lg">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="transition-all duration-200 hover:scale-105">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover border border-border shadow-lg">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="transition-all duration-200 hover:scale-105">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover border border-border shadow-lg">
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal transition-all duration-200 hover:scale-105",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} -{" "}
                        {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-lg" align="start">
                <div className="p-3 border-b">
                  <div className="flex gap-2 flex-wrap">
                    {['today', 'week', 'month', 'year', 'all'].map((period) => (
                      <Button
                        key={period}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDateRange(period)}
                        className="capitalize transition-all duration-200 hover:scale-105"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Amount Range Filter */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Min Amount</label>
              <Input
                type="number"
                placeholder="0.00"
                value={amountRange.min}
                onChange={(e) => setAmountRange(prev => ({ ...prev, min: e.target.value }))}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Max Amount</label>
              <Input
                type="number"
                placeholder="999999.99"
                value={amountRange.max}
                onChange={(e) => setAmountRange(prev => ({ ...prev, max: e.target.value }))}
                className="transition-all duration-200 focus:scale-105"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || filterCategory !== 'all' || typeFilter !== 'all' || dateRange.from || amountRange.min || amountRange.max) && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="animate-fade-in">
                  Search: {searchTerm}
                </Badge>
              )}
              {filterCategory !== 'all' && (
                <Badge variant="secondary" className="animate-fade-in">
                  Category: {filterCategory}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="animate-fade-in">
                  Type: {typeFilter}
                </Badge>
              )}
              {(dateRange.from || dateRange.to) && (
                <Badge variant="secondary" className="animate-fade-in">
                  Date range active
                </Badge>
              )}
              {(amountRange.min || amountRange.max) && (
                <Badge variant="secondary" className="animate-fade-in">
                  Amount: ${amountRange.min || '0'} - ${amountRange.max || '∞'}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Data Card */}
      {showExport && (
        <ExportData 
          transactions={transactions}
          budgets={[]}
          goals={goals}
        />
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <Card 
            key={transaction.id} 
            className="bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-3 h-10 rounded-full bg-${transaction.color} animate-pulse-glow`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} at {transaction.time}
                      </p>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs h-5 transition-all duration-200 hover:scale-110 ${
                          transaction.type === 'income' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                        }`}
                      >
                        {transaction.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs h-5">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className={`font-bold text-sm transition-all duration-200 ${
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
        <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
          <CardContent className="p-8 text-center">
            <div className="shimmer w-16 h-16 rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">No transactions found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 transition-all duration-200 hover:scale-105"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setTypeFilter('all');
                setDateRange({ from: undefined, to: undefined });
                setAmountRange({ min: '', max: '' });
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      <AddExpenseDialog 
        open={isAddExpenseOpen} 
        onOpenChange={setIsAddExpenseOpen}
        onAddTransaction={addTransaction}
      />

      <RecurringTransactionDialog
        open={isRecurringOpen}
        onOpenChange={setIsRecurringOpen}
        onAddRecurring={addRecurringTransaction}
      />
    </div>
  );
};