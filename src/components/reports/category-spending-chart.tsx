
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { Transaction } from "@/lib/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { CATEGORY_MAP } from "@/lib/constants";

interface CategorySpendingChartProps {
  transactions: Transaction[];
}

const chartConfig = {
  total: {
    label: "Spending",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

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
        <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
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
            <ChartTooltip
              cursor={{ fill: "hsl(var(--accent) / 0.2)" }}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} name="Spending" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
