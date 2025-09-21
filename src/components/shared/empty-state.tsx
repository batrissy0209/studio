import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-1 items-center justify-center border-dashed shadow-none", className)}>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center p-6">
            <div className="rounded-full border border-dashed p-4 bg-secondary/50">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-1">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{message}</p>
            </div>
            {action}
        </CardContent>
    </Card>
  );
}
