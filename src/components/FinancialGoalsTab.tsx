import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Target, Plus, TrendingUp, Calendar, DollarSign, Edit, Trash2 } from 'lucide-react';
import { FinancialGoalsDialog } from '@/components/FinancialGoalsDialog';
import { useIndexedDB } from '@/hooks/useIndexedDB';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays } from 'date-fns';

export const FinancialGoalsTab: React.FC = () => {
  const [goals, setGoals] = useIndexedDB('financialGoals', []);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const { toast } = useToast();

  const addGoal = (newGoal: any) => {
    setGoals([newGoal, ...goals]);
  };

  const updateGoalProgress = (goalId: number, amount: number) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { 
            ...goal, 
            currentAmount: amount,
            progress: goal.targetAmount > 0 ? (amount / goal.targetAmount) * 100 : 0
          }
        : goal
    );
    setGoals(updatedGoals);
  };

  const deleteGoal = (goalId: number) => {
    const filteredGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(filteredGoals);
    toast({
      title: "Goal deleted",
      description: "Financial goal has been removed.",
    });
  };

  const getGoalIcon = (type: string) => {
    const icons: any = {
      savings: "💰",
      debt: "💳", 
      emergency: "🚨",
      vacation: "✈️",
      investment: "📈",
      other: "🎯"
    };
    return icons[type] || "🎯";
  };

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'text-success';
    if (progress >= 75) return 'text-success';
    if (progress >= 50) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getDaysRemaining = (targetDate: string | null) => {
    if (!targetDate) return null;
    const days = differenceInDays(new Date(targetDate), new Date());
    return days > 0 ? days : 0;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 gradient-text">
                <Target className="w-5 h-5" />
                Financial Goals
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your savings targets and financial milestones
              </p>
            </div>
            <Button 
              onClick={() => setIsGoalDialogOpen(true)}
              className="bg-gradient-primary hover:opacity-90 button-glow transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Goals Overview */}
      {goals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-success border-0 shadow-floating">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success-foreground" />
              <p className="text-sm text-success-foreground/80 mb-1">Active Goals</p>
              <p className="text-2xl font-bold text-success-foreground">
                {goals.filter(g => g.progress < 100).length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-primary border-0 shadow-floating">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary-foreground" />
              <p className="text-sm text-primary-foreground/80 mb-1">Completed</p>
              <p className="text-2xl font-bold text-primary-foreground">
                {goals.filter(g => g.progress >= 100).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-floating">
            <CardContent className="p-4 text-center">
              <DollarSign className="w-6 h-6 mx-auto mb-2 text-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Total Target</p>
              <p className="text-2xl font-bold text-foreground">
                ${goals.reduce((sum, g) => sum + g.targetAmount, 0).toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const remaining = goal.targetAmount - goal.currentAmount;
          
          return (
            <Card 
              key={goal.id}
              className="bg-gradient-card border-0 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{getGoalIcon(goal.goalType)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGoal(goal)}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-destructive hover:text-destructive transition-all duration-200 hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className={`text-sm font-medium ${getStatusColor(goal.progress)}`}>
                        {goal.progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(goal.progress, 100)} 
                      className="h-3 animate-fade-in"
                    />
                  </div>

                  {/* Amount Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-medium text-success">
                        ${goal.currentAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target</p>
                      <p className="font-medium">
                        ${goal.targetAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Remaining</p>
                      <p className="font-medium text-warning">
                        ${remaining.toFixed(2)}
                      </p>
                    </div>
                    {goal.targetDate && (
                      <div>
                        <p className="text-muted-foreground">Days Left</p>
                        <p className="font-medium">
                          {daysRemaining !== null ? `${daysRemaining} days` : 'Overdue'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Add Amount */}
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1">
                      <Input
                        type="number"
                        placeholder="Add amount..."
                        className="transition-all duration-200 focus:scale-105"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const amount = parseFloat((e.target as HTMLInputElement).value);
                            if (amount > 0) {
                              const newTotal = goal.currentAmount + amount;
                              updateGoalProgress(goal.id, newTotal);
                              (e.target as HTMLInputElement).value = '';
                              toast({
                                title: "Progress updated!",
                                description: `Added $${amount.toFixed(2)} to ${goal.title}`,
                              });
                            }
                          }
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector(`input[placeholder="Add amount..."]`) as HTMLInputElement;
                        const amount = parseFloat(input?.value || '0');
                        if (amount > 0) {
                          const newTotal = goal.currentAmount + amount;
                          updateGoalProgress(goal.id, newTotal);
                          if (input) input.value = '';
                          toast({
                            title: "Progress updated!",
                            description: `Added $${amount.toFixed(2)} to ${goal.title}`,
                          });
                        }
                      }}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Goal Status Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <Badge 
                      variant={goal.progress >= 100 ? "default" : "secondary"}
                      className={`transition-all duration-200 ${
                        goal.progress >= 100 ? 'bg-success text-success-foreground' : ''
                      }`}
                    >
                      {goal.progress >= 100 ? 'Completed' : 'In Progress'}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {goal.goalType.replace(/([A-Z])/g, ' $1').trim()}
                    </Badge>
                    {goal.targetDate && (
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card className="bg-gradient-card border-0 shadow-lg animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">No Financial Goals Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your financial goals to build better saving habits.
            </p>
            <Button 
              onClick={() => setIsGoalDialogOpen(true)}
              className="bg-gradient-primary hover:opacity-90 button-glow transition-all duration-200 hover:scale-105"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      <FinancialGoalsDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        onAddGoal={addGoal}
      />
    </div>
  );
};