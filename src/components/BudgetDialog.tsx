import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget?: {
    id: number;
    category: string;
    budget: number;
    spent: number;
    color: string;
  };
  onSave?: (budget: any) => void;
}

const categories = [
  { value: 'food', label: 'Food', color: 'food' },
  { value: 'transport', label: 'Transport', color: 'transport' },
  { value: 'entertainment', label: 'Entertainment', color: 'entertainment' },
  { value: 'utilities', label: 'Utilities', color: 'utilities' },
  { value: 'shopping', label: 'Shopping', color: 'shopping' },
  { value: 'healthcare', label: 'Healthcare', color: 'healthcare' },
];

export const BudgetDialog = ({ open, onOpenChange, budget, onSave }: BudgetDialogProps) => {
  const [category, setCategory] = useState(budget?.category || '');
  const [amount, setAmount] = useState(budget?.budget?.toString() || '');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const budgetData = {
      id: budget?.id || Date.now(),
      category: categories.find(c => c.value === category)?.label || category,
      budget: parseFloat(amount),
      spent: budget?.spent || 0,
      color: categories.find(c => c.value === category)?.color || 'primary',
      lastUpdated: new Date().toLocaleDateString()
    };

    onSave?.(budgetData);
    
    toast({
      title: "Success",
      description: budget ? "Budget updated successfully" : "Budget created successfully",
    });

    // Reset form
    setCategory('');
    setAmount('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{budget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Budget Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {budget ? 'Update Budget' : 'Add Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};