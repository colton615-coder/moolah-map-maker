import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction?: (transaction: any) => void;
  editTransaction?: any;
  onCreateRecurring?: (transaction: any) => void;
}

const categories = [
  { value: "food", label: "Food", color: "food" },
  { value: "transport", label: "Transport", color: "transport" },
  { value: "entertainment", label: "Entertainment", color: "entertainment" },
  { value: "utilities", label: "Utilities", color: "utilities" },
  { value: "shopping", label: "Shopping", color: "shopping" },
  { value: "healthcare", label: "Healthcare", color: "healthcare" },
];

export const AddExpenseDialog = ({ open, onOpenChange, onAddTransaction, editTransaction, onCreateRecurring }: AddExpenseDialogProps) => {
  const [amount, setAmount] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date());
  const [type, setType] = React.useState("expense");
  const [makeRecurring, setMakeRecurring] = React.useState(false);
  const { toast } = useToast();

  // Populate form when editing
  React.useEffect(() => {
    if (editTransaction) {
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setCategory(editTransaction.category);
      setDate(new Date(editTransaction.date));
      setType(editTransaction.type || "expense");
      setMakeRecurring(false);
    } else {
      // Reset form for new transaction
      setAmount("");
      setDescription("");
      setCategory("");
      setDate(new Date());
      setType("expense");
      setMakeRecurring(false);
    }
  }, [editTransaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const transactionData = {
      id: editTransaction?.id || Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: format(date, 'yyyy-MM-dd'),
      time: editTransaction?.time || format(new Date(), 'HH:mm'),
      color: categories.find(c => c.value === category)?.color || 'primary',
      type
    };

    if (onAddTransaction) {
      onAddTransaction(transactionData);
    }

    // Create recurring transaction if checkbox is checked
    if (makeRecurring && onCreateRecurring) {
      const recurringData = {
        id: Date.now() + 1,
        description,
        amount: parseFloat(amount),
        category,
        type,
        frequency: 'monthly',
        nextDate: format(date, 'yyyy-MM-dd'),
        isActive: true
      };
      onCreateRecurring(recurringData);
    }

    toast({
      title: editTransaction ? "Transaction updated!" : `${type === 'expense' ? 'Expense' : 'Income'} added!`,
      description: `$${amount} ${type} for ${description} has been ${editTransaction ? 'updated' : 'recorded'}.${makeRecurring ? ' Created as recurring.' : ''}`,
    });

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(new Date());
    setType("expense");
    setMakeRecurring(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editTransaction ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${cat.color}`} />
                      <span>{cat.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recurring"
              checked={makeRecurring}
              onCheckedChange={(checked) => setMakeRecurring(checked === true)}
            />
            <Label htmlFor="recurring" className="text-sm">
              Make this a recurring monthly {type}
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90"
            >
              {editTransaction ? 'Update Transaction' : `Add ${type === 'expense' ? 'Expense' : 'Income'}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};