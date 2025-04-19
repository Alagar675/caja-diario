
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
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (!rawValue) {
        onChange('');
        return;
      }
      
      // Clear input if it starts with non-numeric characters
      if (rawValue.match(/^[^1-9]/)) {
        onChange('');
        return;
      }
      
      let cleanValue = rawValue.replace(new RegExp(`[^\\d${decimalSeparator}]`, 'g'), '');
      
      const digitsOnly = cleanValue.replace(decimalSeparator, '');
      if (digitsOnly.length > maxDigits) {
        return;
      }
      
      const numericValue = parseCurrencyValue(cleanValue);
      const formattedValue = numericValue === 0 ? '' : formatCurrencyValue(numericValue);
      
      onChange(formattedValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    return (
      <div className="relative w-full">
        <span className="absolute top-1/2 transform -translate-y-1/2 text-gray-500 z-10 left-3">
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
          className={`pl-7 text-right w-full font-mono text-lg tracking-wider ${className}`}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: 'rtl'
          }}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };

