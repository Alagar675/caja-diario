
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
    maxDigits = 25, // Changed to 25 characters max
    inputDirection = "ltr",
    ...props 
  }, ref) => {
    const { decimalSeparator, thousandSeparator, currencySymbol: localeCurrencySymbol } = useCurrencyLocale();
    const symbolToUse = currencySymbol || localeCurrencySymbol;
    
    // Handle amount change with automatic formatting
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (rawValue === '') {
        onChange('0,00');
        return;
      }
      
      // Clean value: keep only digits and decimal separator
      let cleanValue = rawValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
      
      // Handle the case where the user enters the decimal separator first
      if (cleanValue === decimalSeparator) {
        cleanValue = `0${decimalSeparator}`;
      }
      
      // Check if value exceeds maxDigits (including separators)
      if (cleanValue.replace(decimalSeparator, '').length > maxDigits) {
        return; // Do not update if exceeding max digits
      }
      
      // Check if we need to apply the thousand separators
      const numericValue = parseCurrencyValue(cleanValue);
      
      // Format with the Colombian format pattern 000.000.000.000,00
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
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
          {symbolToUse}
        </span>
        <Input
          ref={ref}
          type="text"
          placeholder="0,00"
          value={value || "0,00"}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={`pl-7 w-full ${inputDirection === 'rtl' ? 'text-right' : 'text-left'} font-mono text-lg tracking-wider ${className}`}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: inputDirection,
            textAlign: inputDirection === 'rtl' ? 'right' : 'left',
            letterSpacing: '0.05em'
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
