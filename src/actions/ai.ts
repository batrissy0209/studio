"use server";

import { suggestTransactionCategory } from "@/ai/flows/suggest-transaction-category";
import { z } from "zod";

const SuggestionSchema = z.object({
  description: z.string().min(3, "Description is too short."),
});

export async function suggestCategoryAction(formData: FormData) {
  const rawData = {
    description: formData.get("description"),
  };

  const validatedFields = SuggestionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Invalid input.",
    };
  }

  try {
    const result = await suggestTransactionCategory({
      transactionDescription: validatedFields.data.description,
    });
    return { category: result.category };
  } catch (error) {
    console.error(error);
    return {
      error: "AI suggestion failed. Please try again.",
    };
  }
}
