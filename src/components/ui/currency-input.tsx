
import * as React from "react"
import { Input } from "@/components/ui/input"
import { formatCurrencyValue, parseCurrencyValue } from "@/utils/formatters"

interface CurrencyInputProps extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string;
  onChange: (value: string) => void;
  currencySymbol?: string;
  placeholder?: string;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, currencySymbol = "$", placeholder = "0,00", className, ...props }, ref) => {
    // Handle amount change with automatic formatting
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (rawValue === '') {
        onChange('');
        return;
      }

      // Limit to 20 digits total (excluding separators)
      const digitCount = rawValue.replace(/[^\d]/g, '').length;
      if (digitCount > 20) {
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
          {currencySymbol}
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
