
import React from "react";
import { CurrencyLabel } from "@/components/ui/currency-label";

interface CurrencyInputLoadingProps {
  label: string;
}

export function CurrencyInputLoading({ label }: CurrencyInputLoadingProps) {
  return (
    <div className="space-y-2">
      <CurrencyLabel label={label} />
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-10 flex-1 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
