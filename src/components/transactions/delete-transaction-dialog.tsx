"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteTransactionDialogProps {
  transactionId: string;
  trigger?: "button" | "menuitem";
}

export function DeleteTransactionDialog({
  transactionId,
  trigger = "button",
}: DeleteTransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "transactions", transactionId));
      toast({
        title: "Success",
        description: "Transaction deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const TriggerComponent = trigger === "button" ? Button : DropdownMenuItem;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <TriggerComponent
          variant={trigger === "button" ? "destructive" : undefined}
          className={trigger === "menuitem" ? "text-red-500" : ""}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </TriggerComponent>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            transaction from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-destructive hover:bg-destructive/90">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
