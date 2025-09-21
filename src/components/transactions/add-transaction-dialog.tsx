"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  addDoc,
  updateDoc,
  doc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, PlusCircle, Edit } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";
import { CategorySuggestion } from "./category-suggestion";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date(),
});

type TransactionFormValue = z.infer<typeof formSchema>;

interface AddTransactionDialogProps {
  transaction?: Transaction;
  trigger?: "button" | "menuitem";
}

export function AddTransactionDialog({ transaction, trigger = "button" }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditMode = !!transaction;

  const defaultValues = isEditMode
    ? {
        ...transaction,
        date: new Date(transaction.date.seconds * 1000),
      }
    : {
        description: "",
        amount: 0,
        type: "expense" as "income" | "expense",
        category: "",
        date: new Date(),
      };

  const form = useForm<TransactionFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: TransactionFormValue) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const transactionData = {
        ...data,
        userId: user.uid,
        date: Timestamp.fromDate(data.date),
      };

      if (isEditMode) {
        const transRef = doc(db, "transactions", transaction.id);
        await updateDoc(transRef, transactionData);
        toast({ title: "Success", description: "Transaction updated." });
      } else {
        await addDoc(collection(db, "transactions"), transactionData);
        toast({ title: "Success", description: "Transaction added." });
      }
      form.reset(defaultValues);
      setOpen(false);
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const TriggerComponent = trigger === "button" ? Button : DropdownMenuItem;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerComponent
          variant={trigger === "button" ? "default" : undefined}
          className={cn(trigger === "button" && "gap-1")}
        >
          {isEditMode ? <Edit className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
          <span>{isEditMode ? "Edit Transaction" : "Add Transaction"}</span>
        </TriggerComponent>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit" : "Add"} Transaction</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details of your transaction." : "Track a new income or expense."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Coffee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <div className="flex items-center gap-2">
                       <Select
                          onValueChange={field.onChange}
                          value={field.value}
                       >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <CategorySuggestion 
                          description={form.watch('description')}
                          onSuggestion={(category) => form.setValue('category', category, { shouldValidate: true })}
                        />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button disabled={isLoading} type="submit">
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
