import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const transactions: any[] = [];

export const RecentTransactions = () => {
  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className={`w-2 h-8 rounded-full bg-${transaction.color}`}
                  />
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-expense">-${transaction.amount}</p>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {transaction.category}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};