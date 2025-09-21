"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { suggestCategoryAction } from "@/actions/ai";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES } from "@/lib/constants";

interface CategorySuggestionProps {
  description: string;
  onSuggestion: (category: string) => void;
}

export function CategorySuggestion({
  description,
  onSuggestion,
}: CategorySuggestionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    if (description.length < 3) {
      toast({
        title: "Description too short",
        description: "Please provide a longer description for a suggestion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("description", description);

    const result = await suggestCategoryAction(formData);

    if (result.error) {
      toast({
        title: "Suggestion Failed",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.category) {
        const categoryMatch = CATEGORIES.find(c => c.label.toLowerCase() === result.category?.toLowerCase());
        if (categoryMatch) {
            onSuggestion(categoryMatch.value);
            toast({
                title: "Suggestion Applied!",
                description: `Category set to "${categoryMatch.label}".`,
            });
        } else {
             onSuggestion("other");
             toast({
                title: "Suggestion Found",
                description: `Suggested "${result.category}", but set to "Other" as no direct match was found.`,
            });
        }
    }
    setIsLoading(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleSuggest}
      disabled={isLoading || !description}
      aria-label="Suggest Category"
    >
      <Sparkles
        className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
      />
    </Button>
  );
}
