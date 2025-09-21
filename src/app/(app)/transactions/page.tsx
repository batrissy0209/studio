"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog";
import { DataTable } from "@/components/transactions/data-table";
import { columns } from "@/components/transactions/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Wallet } from "lucide-react";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader title="Transactions" description="Manage your income and expenses.">
        <AddTransactionDialog />
      </PageHeader>
      
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="border rounded-md">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      ) : transactions.length > 0 ? (
        <DataTable columns={columns} data={transactions} />
      ) : (
        <EmptyState
          icon={Wallet}
          title="No transactions yet"
          message="Start tracking your finances by adding your first transaction."
          action={<AddTransactionDialog />}
        />
      )}
    </div>
  );
}
