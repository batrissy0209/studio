"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { startOfMonth, endOfMonth } from "date-fns";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@/lib/types";
import { SummaryCard, SummaryCardSkeleton } from "@/components/dashboard/summary-card";
import { CategorySpendingChart } from "./category-spending-chart";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../shared/empty-state";

interface MonthlyReportProps {
  month: Date;
}

export function MonthlyReport({ month }: MonthlyReportProps) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("date", ">=", Timestamp.fromDate(startDate)),
      where("date", "<=", Timestamp.fromDate(endDate))
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const monthlyTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(monthlyTransactions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching monthly transactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, month]);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.income += t.amount;
        } else {
          acc.expense += t.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = summary.income - summary.expense;
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No data for this month"
        message="There are no transactions recorded for the selected month."
        className="h-[500px]"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Net Balance" amount={balance} icon={DollarSign} />
        <SummaryCard title="Total Income" amount={summary.income} icon={TrendingUp} className="text-emerald-500" />
        <SummaryCard title="Total Expenses" amount={summary.expense} icon={TrendingDown} className="text-red-500" />
      </div>
      <div>
        <CategorySpendingChart transactions={transactions} />
      </div>
    </div>
  );
}
