import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { AddExpenseDialog } from '@/components/AddExpenseDialog';

export const TransactionsTab: React.FC = () => {
  const { AdvancedTransactionsTab } = require('@/components/AdvancedTransactionsTab');
  return React.createElement(AdvancedTransactionsTab);
};