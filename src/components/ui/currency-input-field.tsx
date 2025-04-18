
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CurrencyInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  className?: string;
}

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "0,00",
    currencySymbol = "",
    className,
    ...props 
  }, ref) => {
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Allow empty input
      if (!newValue) {
        onChange("");
        return;
      }
      
      // Remove all non-digit characters
      const digitsOnly = newValue.replace(/\D/g, '');
      
      // Handle the value as cents (last two digits are decimals)
      const valueInCents = parseInt(digitsOnly, 10) || 0;
      const integerPart = Math.floor(valueInCents / 100);
      const decimalPart = (valueInCents % 100).toString().padStart(2, '0');
      
      // Format integer part with thousand separators
      const formattedInteger = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      // Combine integer and decimal parts
      const formattedValue = `${formattedInteger},${decimalPart}`;
      
      onChange(formattedValue);
    };

    // When the field gets focus, select all text
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    return (
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10">
          {currencySymbol}
        </span>
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-3 font-mono text-base",
            className
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";

