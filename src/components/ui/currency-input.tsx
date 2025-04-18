
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
  inputDirection?: "ltr" | "rtl";
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    currencySymbol, 
    placeholder = "0,00", 
    className, 
    maxDigits = 30, // Set a very high maximum by default
    inputDirection = "ltr", // Default to left-to-right input
    ...props 
  }, ref) => {
    const { decimalSeparator, thousandSeparator, currencySymbol: localeCurrencySymbol } = useCurrencyLocale();
    const symbolToUse = currencySymbol || localeCurrencySymbol;
    
    // Handle amount change with automatic formatting
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (rawValue === '') {
        onChange('');
        return;
      }
      
      // Clean value: keep only digits and decimal separator
      let cleanValue = rawValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
      
      // Handle the case where the user enters the decimal separator first
      if (cleanValue === decimalSeparator) {
        cleanValue = `0${decimalSeparator}`;
      }
      
      // No longer limiting the number of digits
      
      // Check if we need to apply the thousand separators
      const numericValue = parseCurrencyValue(cleanValue);
      
      // Format with the exact 000.000.000.000,00 pattern for millions
      const formattedValue = formatCurrencyValue(numericValue);
      
      onChange(formattedValue);
    };

    // When field gets focus, select all text for easy replacement
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (props.onFocus) {
        props.onFocus(e);
      }
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
          className={`pl-7 ${inputDirection === 'rtl' ? 'text-right' : 'text-left'} font-mono text-lg tracking-wider ${className}`}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: inputDirection,
            textAlign: inputDirection === 'rtl' ? 'right' : 'left'
          }}
          inputMode="decimal"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
