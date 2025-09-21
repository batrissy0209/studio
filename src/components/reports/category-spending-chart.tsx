"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { Transaction } from "@/lib/types";
import { ChartTooltipContent } from "@/components/ui/chart";
import { CATEGORY_MAP } from "@/lib/constants";

interface CategorySpendingChartProps {
  transactions: Transaction[];
}

export function CategorySpendingChart({ transactions }: CategorySpendingChartProps) {
  const expenseData = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => {
      const categoryLabel = CATEGORY_MAP[transaction.category]?.label || transaction.category;
      if (!acc[categoryLabel]) {
        acc[categoryLabel] = { name: categoryLabel, total: 0 };
      }
      acc[categoryLabel].total += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; total: number }>);

  const chartData = Object.values(expenseData).sort((a, b) => b.total - a.total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Spending" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
