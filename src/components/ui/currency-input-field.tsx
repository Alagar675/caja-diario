
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
      
      // Replace any dot with a comma for decimals
      let cleanValue = newValue.replace(/\./g, ',');
      
      // Remove any character that is not a digit or comma
      cleanValue = cleanValue.replace(/[^\d,]/g, '');
      
      // Handle decimal part (after comma)
      if (cleanValue.includes(',')) {
        const [integerPart, decimalPart] = cleanValue.split(',');
        
        // Limit decimal places to 2
        if (decimalPart && decimalPart.length > 2) {
          cleanValue = `${integerPart},${decimalPart.slice(0, 2)}`;
        }
      }
      
      // Format the integer part with thousand separators
      let formattedValue = cleanValue;
      if (cleanValue.includes(',')) {
        const [integerPart, decimalPart] = cleanValue.split(',');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        formattedValue = `${formattedInteger},${decimalPart || ''}`;
      } else {
        formattedValue = cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      
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
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          className={cn(
            "pl-3 font-normal text-base",
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
