
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
    currencySymbol = "$",
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
      
      // Only allow digits, decimal separators, and thousand separators
      const cleanValue = newValue.replace(/[^\d.,]/g, '');
      onChange(cleanValue);
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
            "pl-7 font-mono text-lg tracking-wider",
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
