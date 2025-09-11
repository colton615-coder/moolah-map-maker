import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Search, Filter, ArrowUpDown, CalendarIcon, Download, Repeat, Target, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';
import { RecurringTransactionDialog } from '@/components/RecurringTransactionDialog';
import { ExportData } from '@/components/ExportData';
import { format, isWithinInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns';
import { cn } from '@/lib/utils';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useToast } from '@/hooks/use-toast';
import { SwipeableTransaction } from '@/components/SwipeableTransaction';

export const AdvancedTransactionsTab: React.FC = () => {
  const currencySymbol = '$';
  const { toast } = useToast();
  
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
  const [typeFilter, setTypeFilter] = useState('all');
  
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const addTransaction = (newTransaction: any) => {
    setTransactions([newTransaction, ...transactions]);
  };

  const addRecurringTransaction = (newRecurring: any) => {
    setRecurringTransactions([newRecurring, ...recurringTransactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({
      title: "Transaction deleted",
      description: "Transaction has been removed successfully.",
    });
  };

  const editTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsAddExpenseOpen(true);
  };

  // Simplified filtering
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
        
        return matchesSearch && matchesCategory && matchesType && matchesDate;
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
  }, [transactions, searchTerm, filterCategory, sortBy, dateRange, typeFilter]);

  // Quick date filters
  const setQuickDateRange = (type: string) => {
    const now = new Date();
    switch (type) {
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
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-success border-0 shadow-floating">
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

      {/* Controls */}
      <Card className="bg-gradient-card border-0 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <CardTitle className="text-lg gradient-text">Transactions</CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setIsRecurringOpen(true)}
              >
                <Repeat className="w-4 h-4 mr-1" />
                Recurring
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setShowExport(!showExport)}
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsAddExpenseOpen(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
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
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-3 border-b">
                  <div className="flex gap-2 flex-wrap">
                    {['week', 'month', 'year', 'all'].map((period) => (
                      <Button
                        key={period}
                        variant="outline"
                        size="sm"
                        onClick={() => setQuickDateRange(period)}
                        className="capitalize"
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
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex gap-2">
              {[
                { value: 'date', label: 'Date' },
                { value: 'amount', label: 'Amount' },
                { value: 'category', label: 'Category' }
              ].map((sort) => (
                <Button
                  key={sort.value}
                  variant={sortBy === sort.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(sort.value)}
                >
                  {sort.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterCategory !== 'all' || typeFilter !== 'all' || dateRange.from) && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary">Search: {searchTerm}</Badge>
              )}
              {filterCategory !== 'all' && (
                <Badge variant="secondary">Category: {filterCategory}</Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary">Type: {typeFilter}</Badge>
              )}
              {dateRange.from && (
                <Badge variant="secondary">Date filtered</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Data */}
      {showExport && (
        <ExportData 
          transactions={transactions}
          budgets={[]}
          goals={goals}
        />
      )}

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-muted-foreground">No transactions found.</p>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm || filterCategory !== 'all' || typeFilter !== 'all' || dateRange.from
                  ? 'Try adjusting your filters.'
                  : 'Add your first transaction to get started.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <SwipeableTransaction
              key={transaction.id}
              transaction={transaction}
              onEdit={() => editTransaction(transaction)}
              onDelete={() => deleteTransaction(transaction.id)}
              className="animate-fade-in"
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={(open) => {
          setIsAddExpenseOpen(open);
          if (!open) setEditingTransaction(null);
        }}
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