
import React from "react";
import { CurrencyLabel } from "@/components/ui/currency-label";
import { CurrencyInfoDisplay } from "@/components/ui/currency-info-display";

interface CurrencyInputWrapperProps {
  label: string;
  currencyCode: string;
  error?: string;
  tooltipContent?: string;
  children: React.ReactNode;
  helpText?: string;
}

export function CurrencyInputWrapper({
  label,
  currencyCode,
  error,
  tooltipContent,
  children,
  helpText,
}: CurrencyInputWrapperProps) {
  return (
    <div className="space-y-2 relative">
      <CurrencyLabel 
        label={label} 
        tooltipContent={tooltipContent}
      />
      
      <div className="relative">
        {children}
        {helpText && (
          <p className="text-xs text-gray-500 mt-1">{helpText}</p>
        )}
      </div>
      
      <CurrencyInfoDisplay 
        currencyCode={currencyCode}
        error={error}
      />
    </div>
  );
}
