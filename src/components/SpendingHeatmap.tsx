import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';

interface HeatmapProps {
  transactions: any[];
  className?: string;
}

export const SpendingHeatmap: React.FC<HeatmapProps> = ({ transactions, className = '' }) => {
  const heatmapData = useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 90); // 3 months
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group transactions by date
    const spendingByDate = transactions.reduce((acc, transaction) => {
      const date = startOfDay(new Date(transaction.date));
      const dateKey = format(date, 'yyyy-MM-dd');
      acc[dateKey] = (acc[dateKey] || 0) + Math.abs(Number(transaction.amount) || 0);
      return acc;
    }, {} as Record<string, number>);

    // Find max spending for normalization
    const maxSpending = Math.max(...Object.values(spendingByDate).map(Number), 1);

    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const amount = spendingByDate[dateKey] || 0;
      const intensity = amount / maxSpending;
      
      return {
        date: day,
        amount,
        intensity,
        weekday: day.getDay()
      };
    });
  }, [transactions]);

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted/30';
    if (intensity < 0.2) return 'bg-primary/20';
    if (intensity < 0.4) return 'bg-primary/40';
    if (intensity < 0.6) return 'bg-primary/60';
    if (intensity < 0.8) return 'bg-primary/80';
    return 'bg-primary';
  };

  const weeks = [];
  let currentWeek = [];
  
  heatmapData.forEach((day, index) => {
    if (day.weekday === 0 && currentWeek.length > 0) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
    currentWeek.push(day);
    
    if (index === heatmapData.length - 1) {
      weeks.push(currentWeek);
    }
  });

  return (
    <Card className={`bg-gradient-card border-0 shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Spending Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Last 90 days</p>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-2">
            {/* Week labels */}
            <div className="flex text-xs text-muted-foreground mb-2">
              <div className="w-8"></div>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="w-3 h-3 flex items-center justify-center mr-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex items-center">
                  <div className="w-8 text-xs text-muted-foreground text-right mr-2">
                    {weekIndex % 4 === 0 && format(week[0].date, 'MMM')}
                  </div>
                  <div className="flex space-x-1">
                    {week.map((day) => (
                      <Tooltip key={format(day.date, 'yyyy-MM-dd')}>
                        <TooltipTrigger asChild>
                          <div
                            className={`
                              w-3 h-3 rounded-sm cursor-pointer transition-all duration-200
                              hover:scale-110 hover:ring-2 hover:ring-primary/50
                              ${getIntensityColor(day.intensity)}
                            `}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{format(day.date, 'MMM d, yyyy')}</p>
                            <p className="text-sm">${day.amount.toFixed(2)} spent</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${getIntensityColor(intensity)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
};