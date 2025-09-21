"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MonthlyReport } from "@/components/reports/monthly-report";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, subMonths, addMonths } from "date-fns";

export default function ReportsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title="Reports"
        description="Analyze your spending and income patterns."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-center w-48">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="outline" size="icon" onClick={goToNextMonth} disabled={new Date() < addMonths(currentMonth, 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <MonthlyReport month={currentMonth} />
        </CardContent>
      </Card>
    </div>
  );
}
