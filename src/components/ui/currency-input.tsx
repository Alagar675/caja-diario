
import * as React from "react"
import { Input } from "@/components/ui/input"
import { formatCurrencyValue, parseCurrencyValue } from "@/utils/formatters"
import { useCurrencyLocale } from "@/hooks/useCurrencyLocale"

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  currencySymbol?: string;
  placeholder?: string;
  maxDigits?: number;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currencySymbol, placeholder = "0,00", className, maxDigits = 20, ...props }, ref) => {
    const { decimalSeparator, thousandSeparator, currencySymbol: localeCurrencySymbol } = useCurrencyLocale();
    const symbolToUse = currencySymbol || localeCurrencySymbol;
    
    // Handle amount change with automatic formatting
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (rawValue === '') {
        onChange('');
        return;
      }

      // Allow entering right-to-left starting from decimals
      // Extract all digits and decimal separator
      const cleanValue = rawValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
      
      // Limit to maxDigits total (excluding separators)
      const digitCount = cleanValue.replace(new RegExp(decimalSeparator, 'g'), '').length;
      if (digitCount > maxDigits) {
        return;
      }

      const numericValue = parseCurrencyValue(rawValue);
      onChange(formatCurrencyValue(numericValue));
    };

    // When field gets focus, select all text for easy replacement
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {symbolToUse}
        </span>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className="pl-7 text-right font-mono tracking-wide"
          style={{ fontVariantNumeric: 'tabular-nums' }}
          inputMode="decimal"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
