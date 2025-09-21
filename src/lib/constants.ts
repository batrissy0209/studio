import type { Category } from "@/lib/types";
import {
  Car,
  Utensils,
  Home,
  Heart,
  Shirt,
  Film,
  Gift,
  Briefcase,
  GraduationCap,
  Landmark,
  PiggyBank,
} from "lucide-react";

export const CATEGORIES: Category[] = [
  { value: "food", label: "Food", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "housing", label: "Housing", icon: Home },
  { value: "health", label: "Health", icon: Heart },
  { value: "apparel", label: "Apparel", icon: Shirt },
  { value: "entertainment", label: "Entertainment", icon: Film },
  { value: "gifts", label: "Gifts", icon: Gift },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "investments", label: "Investments", icon: PiggyBank },
  { value: "other", label: "Other", icon: Landmark },
];

export const CATEGORY_MAP = CATEGORIES.reduce((acc, category) => {
  acc[category.value] = category;
  return acc;
}, {} as Record<string, Category>);
