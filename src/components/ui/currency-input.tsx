
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { stripNonNumeric, formatCurrencyInput } from "@/utils/currency/currencyInputUtils"

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
    currencySymbol = "$", 
    placeholder = "0,00", 
    className,
    maxDigits = 25,
    inputDirection = "rtl",
    ...props 
  }, ref) => {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      if (!rawValue) {
        onChange('');
        return;
      }
      
      // Process the input value
      const numericValue = stripNonNumeric(rawValue);
      
      // Check maximum length
      if (numericValue.length > maxDigits) {
        return;
      }
      
      // Format the value
      const formattedValue = formatCurrencyInput(numericValue);
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
          {currencySymbol}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-7 text-right w-full font-mono text-lg tracking-wider",
            className
          )}
          style={{ 
            fontVariantNumeric: 'tabular-nums',
            direction: 'rtl',
            textAlign: 'right'
          }}
          aria-label="Campo de entrada de moneda"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };

