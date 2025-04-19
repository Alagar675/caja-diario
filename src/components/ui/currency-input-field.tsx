
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { CurrencyInputProps } from "@/types/currency";
import { formatCurrencyInput, stripNonNumeric } from "@/utils/currency/currencyInputUtils";

export const CurrencyInputField = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ 
    value, 
    onChange, 
    placeholder = "",
    className,
    showFeedback = false,
    hideDecimals = false,
    inputDirection = "rtl", // Ensure RTL is set as default
    ...props 
  }, ref) => {
    const { toast } = useToast();
    const [isFirstInput, setIsFirstInput] = React.useState(true);
    const [isFocused, setIsFocused] = React.useState(false);
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Only allow digits (except leading zeros)
      if (rawValue === "" || rawValue === "0") {
        onChange("");
        return;
      }
      
      // Remove any non-numeric characters and format
      const numericValue = stripNonNumeric(rawValue);
      const formattedValue = formatCurrencyInput(numericValue, hideDecimals);
      
      // Check maximum length (considering formatting characters)
      if (stripNonNumeric(formattedValue).length > 25) {
        return;
      }
      
      onChange(formattedValue);

      if (showFeedback && isFirstInput && rawValue.length > 0) {
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
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={handleValueChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "font-mono text-base tracking-wider pl-3 pr-3 text-right",
          isFocused && "border-primary",
          className
        )}
        style={{ 
          fontVariantNumeric: 'tabular-nums',
          direction: 'rtl',
          textAlign: 'right'
        }}
        maxLength={35} // Allow more for formatting characters
        aria-label="Campo de entrada de moneda"
        {...props}
      />
    );
  }
);

CurrencyInputField.displayName = "CurrencyInputField";

