
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { Transaction } from "@/lib/types";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewChartProps {
  data: Transaction[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-2))",
  },
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;


export function OverviewChart({ data }: OverviewChartProps) {
  const monthlyData = data.reduce((acc, transaction) => {
    const month = new Date(transaction.date.seconds * 1000).toLocaleString('default', { month: 'short' });
    const year = new Date(transaction.date.seconds * 1000).getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) {
      acc[key] = { name: month, income: 0, expense: 0 };
    }

    if (transaction.type === 'income') {
      acc[key].income += transaction.amount;
    } else {
      acc[key].expense += transaction.amount;
    }

    return acc;
  }, {} as Record<string, { name: string, income: number, expense: number }>);
  
  const chartData = Object.values(monthlyData).reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
              content={<ChartTooltipContent />} 
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function OverviewChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    )
}
