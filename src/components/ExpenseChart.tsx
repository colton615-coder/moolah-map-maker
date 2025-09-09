import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Food", value: 450, color: "hsl(var(--food))" },
  { name: "Transport", value: 200, color: "hsl(var(--transport))" },
  { name: "Entertainment", value: 150, color: "hsl(var(--entertainment))" },
  { name: "Utilities", value: 350, color: "hsl(var(--utilities))" },
  { name: "Shopping", value: 100, color: "hsl(var(--shopping))" },
];

export const ExpenseChart = () => {
  return (
    <Card className="bg-gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value}`, "Amount"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};