"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { Transaction } from "@/lib/types";
import { ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewChartProps {
  data: Transaction[];
}

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
        <ResponsiveContainer width="100%" height={350}>
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
            <Tooltip
              cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
              content={<ChartTooltipContent />} 
            />
            <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Income" />
            <Bar dataKey="expense" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Expense" />
          </BarChart>
        </ResponsiveContainer>
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
