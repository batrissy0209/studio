import { Timestamp } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Timestamp;
}

export interface Category {
  value: string;
  label: string;
  icon: LucideIcon;
}
