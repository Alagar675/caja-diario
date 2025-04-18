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
    placeholder = "", 
    className,
    maxDigits = 25,
    inputDirection = "ltr",
    ...props 
  }, ref) => {
    const { decimalSeparator, thousandSeparator, currencySymbol: localeCurrencySymbol } = useCurrencyLocale();
    const symbolToUse = currencySymbol || localeCurrencySymbol;
    
    // Handle amount change with automatic formatting
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      // Handle empty input
      if (rawValue === '') {
        onChange('');
        return;
      }
      
      // Clean value: keep only digits and decimal separator
      let cleanValue = rawValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
      
      // Prevent user from entering more than maxDigits (before adding separators)
      const digitsOnly = cleanValue.replace(decimalSeparator, '');
      if (digitsOnly.length > maxDigits) {
        return; // Do not update if exceeding max digits
      }
      
      // Convert to number for formatting
      const numericValue = parseCurrencyValue(cleanValue);
      
      // Format with the proper format pattern (thousands with periods, decimals with comma)
      const formattedValue = cleanValue ? formatCurrencyValue(numericValue) : '';
      
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
          inputMode="decimal"
          pattern="^\d{1,3}(\.?\d{3})*(\,\d{1,2})?$"
          placeholder=""
          value={value || ""}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={`pl-7 w-full ${inputDirection === 'rtl' ? 'text-right' : 'text-left'} font-mono text-lg tracking-wider ${className}`}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: inputDirection,
            textAlign: inputDirection === 'rtl' ? 'right' : 'left',
            letterSpacing: '0.05em'
          }}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
