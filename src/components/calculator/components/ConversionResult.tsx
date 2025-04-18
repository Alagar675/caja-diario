
import React from "react";
import { CurrencyDisplay } from "@/components/ui/currency-display";

interface ConversionResultProps {
  amount: string;
  convertedResult: number | null;
  sourceCurrency: string;
  targetCurrency: string;
  rates: Record<string, number>;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  amount,
  convertedResult,
  sourceCurrency,
  targetCurrency,
  rates
}) => {
  if (convertedResult === null) return null;

  return (
    <div className="mt-4 pt-4 border-t text-center">
      <div className="flex items-center justify-center gap-x-2">
        <CurrencyDisplay 
          value={parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'))} 
          currencyCode={sourceCurrency}
          size="md" 
          showSymbol={true}
        />
        <span className="text-gray-500">=</span>
        <CurrencyDisplay 
          value={convertedResult} 
          currencyCode={targetCurrency}
          size="lg" 
          variant="positive" 
          showSymbol={true}
        />
      </div>
      {rates[targetCurrency] && (
        <p className="text-xs text-gray-500 mt-1">
          Tasa: 1 {sourceCurrency} = {rates[targetCurrency].toFixed(4)} {targetCurrency}
        </p>
      )}
    </div>
  );
};
