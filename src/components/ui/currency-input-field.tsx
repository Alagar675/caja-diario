
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface CurrencyInputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  currencySymbol?: string;
  symbolPosition?: "prefix" | "suffix";
  className?: string;
  showFeedback?: boolean;
  hideDecimals?: boolean;
}

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputFieldProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "",
    currencySymbol = "",
    symbolPosition = "prefix",
    className,
    showFeedback = false,
    hideDecimals = false,
    ...props 
  }, ref) => {
    const { toast } = useToast();
    const [isFirstInput, setIsFirstInput] = React.useState(true);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Remove any non-numeric characters
      value = value.replace(/[^\d]/g, "");
      
      if (value.length === 0) {
        onChange("");
        return;
      }

      // Format with thousand separators and decimals
      const len = value.length;
      const decimalPart = len > 2 ? value.slice(-2) : value.padStart(2, '0');
      const integerPart = len > 2 ? value.slice(0, -2) : '0';
      
      // Add thousand separators
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      
      const formattedValue = hideDecimals 
        ? formattedInteger 
        : `${formattedInteger},${decimalPart}`;
      
      onChange(formattedValue);

      if (showFeedback && isFirstInput && value.length > 0) {
        toast({
          title: "Formato de moneda",
          description: "Los últimos dos dígitos corresponden a los decimales",
          duration: 3000,
        });
        setIsFirstInput(false);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder=""
          value={value}
          onChange={handleValueChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "font-mono text-base tracking-wider pl-3 pr-3",
            isFocused && "border-primary",
            className
          )}
          style={{ fontVariantNumeric: 'tabular-nums' }}
          maxLength={20}
          aria-label="Campo de entrada de moneda"
          {...props}
        />
      </div>
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";
