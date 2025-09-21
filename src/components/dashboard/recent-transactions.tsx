import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Transaction } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CATEGORY_MAP } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentTransactionsProps {
  data: Transaction[];
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>You made {data.length} transactions recently.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((transaction) => {
            const category = CATEGORY_MAP[transaction.category];
            const Icon = category?.icon;

            return (
              <div className="flex items-center" key={transaction.id}>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-secondary">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{category?.label || transaction.category}</p>
                </div>
                <div className={`ml-auto font-medium ${transaction.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(transaction.amount)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}


export function RecentTransactionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription><Skeleton className="h-4 w-32" /></CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div className="flex items-center" key={i}>
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
