import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Target, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface FinancialGoalsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGoal?: (goal: any) => void;
}

const goalTypes = [
  { value: "savings", label: "Savings Goal", icon: "💰" },
  { value: "debt", label: "Debt Payoff", icon: "💳" },
  { value: "emergency", label: "Emergency Fund", icon: "🚨" },
  { value: "vacation", label: "Vacation Fund", icon: "✈️" },
  { value: "investment", label: "Investment Goal", icon: "📈" },
  { value: "other", label: "Other Goal", icon: "🎯" },
];

export const FinancialGoalsDialog = ({ 
  open, 
  onOpenChange, 
  onAddGoal 
}: FinancialGoalsDialogProps) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [goalType, setGoalType] = useState("");
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount || !goalType) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount) || 0;

    const newGoal = {
      id: Date.now(),
      title,
      description,
      targetAmount: target,
      currentAmount: current,
      goalType,
      targetDate: targetDate ? format(targetDate, 'yyyy-MM-dd') : null,
      created: new Date().toISOString(),
      progress: target > 0 ? (current / target) * 100 : 0,
    };

    if (onAddGoal) {
      onAddGoal(newGoal);
    }

    toast({
      title: "Financial goal added!",
      description: `${title} goal of $${targetAmount} has been created.`,
    });

    // Reset form
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setGoalType("");
    setTargetDate(undefined);
    setDescription("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Add Financial Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Emergency Fund, Vacation to Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="transition-all duration-200 focus:scale-105"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Goal Type *</Label>
            <Select value={goalType} onValueChange={setGoalType} required>
              <SelectTrigger className="transition-all duration-200 hover:scale-105">
                <SelectValue placeholder="Select goal type" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover border border-border shadow-lg">
                {goalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center space-x-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="5000.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="pl-7 transition-all duration-200 focus:scale-105"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="pl-7 transition-all duration-200 focus:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal transition-all duration-200 hover:scale-105",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : <span>Pick a target date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-popover border border-border shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add notes about this goal..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transition-all duration-200 focus:scale-105"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90 transition-all duration-200 hover:scale-105"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};