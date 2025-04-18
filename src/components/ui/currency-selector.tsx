
import * as React from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
}

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currencyCode: string) => void;
  currencyOptions: CurrencyOption[];
  isReadOnly?: boolean;
  className?: string;
}

export function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  currencyOptions,
  isReadOnly = false,
  className
}: CurrencySelectorProps) {
  const currentCurrency = currencyOptions.find(c => c.code === selectedCurrency) || currencyOptions[0];

  if (isReadOnly) {
    return (
      <div className={`flex items-center gap-1 bg-gray-50 border rounded px-3 py-2 w-[120px] text-sm ${className}`}>
        <Globe className="w-4 h-4 text-gray-500" />
        <span className="font-medium">{currentCurrency.symbol} {currentCurrency.code}</span>
      </div>
    );
  }

  return (
    <Select
      value={selectedCurrency}
      onValueChange={onCurrencyChange}
    >
      <SelectTrigger className={`w-[120px] ${className}`}>
        <SelectValue placeholder={currentCurrency.code} />
      </SelectTrigger>
      <SelectContent>
        {currencyOptions.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              <span>{currency.symbol}</span>
              <span>{currency.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
