"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { SummaryCard, SummaryCardSkeleton } from "@/components/dashboard/summary-card";
import { OverviewChart, OverviewChartSkeleton } from "@/components/dashboard/overview-chart";
import { RecentTransactions, RecentTransactionsSkeleton } from "@/components/dashboard/recent-transactions";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userTransactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      setTransactions(userTransactions);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

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
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader title="Dashboard" description="Here's a summary of your financial activity.">
        <AddTransactionDialog />
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : (
          <>
            <SummaryCard
              title="Balance"
              amount={balance}
              icon={DollarSign}
            />
            <SummaryCard
              title="Income"
              amount={summary.income}
              icon={TrendingUp}
              className="text-emerald-500"
            />
            <SummaryCard
              title="Expenses"
              amount={summary.expense}
              icon={TrendingDown}
              className="text-red-500"
            />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="col-span-1 lg:col-span-3">
          {loading ? <OverviewChartSkeleton /> : <OverviewChart data={transactions} />}
        </div>
        <div className="col-span-1 lg:col-span-2">
          {loading ? <RecentTransactionsSkeleton /> : <RecentTransactions data={recentTransactions} />}
        </div>
      </div>
    </div>
  );
}
