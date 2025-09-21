'use server';

/**
 * @fileOverview An AI agent that suggests a transaction category based on the transaction description.
 *
 * - suggestTransactionCategory - A function that suggests a transaction category.
 * - SuggestTransactionCategoryInput - The input type for the suggestTransactionCategory function.
 * - SuggestTransactionCategoryOutput - The return type for the suggestTransactionCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoryInputSchema = z.object({
  transactionDescription: z
    .string()
    .describe('The description of the transaction.'),
});
export type SuggestTransactionCategoryInput = z.infer<
  typeof SuggestTransactionCategoryInputSchema
>;

const SuggestTransactionCategoryOutputSchema = z.object({
  category: z
    .string()
    .describe('The suggested category for the transaction.'),
});
export type SuggestTransactionCategoryOutput = z.infer<
  typeof SuggestTransactionCategoryOutputSchema
>;

export async function suggestTransactionCategory(
  input: SuggestTransactionCategoryInput
): Promise<SuggestTransactionCategoryOutput> {
  return suggestTransactionCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTransactionCategoryPrompt',
  input: {schema: SuggestTransactionCategoryInputSchema},
  output: {schema: SuggestTransactionCategoryOutputSchema},
  prompt: `You are an expert financial advisor.

You will suggest a category for a transaction based on the description.

Description: {{{transactionDescription}}}

Category:`,
});

const suggestTransactionCategoryFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoryFlow',
    inputSchema: SuggestTransactionCategoryInputSchema,
    outputSchema: SuggestTransactionCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
